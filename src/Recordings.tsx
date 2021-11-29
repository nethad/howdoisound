import React, { useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import AudioAnalyser from "./AudioAnalyser";

interface RecordingsProps {
  listDevices: () => Promise<unknown>;
  devices: MediaDeviceInfo[];
}

const Recordings: React.FC<RecordingsProps> = ({ listDevices, devices }) => {
  const queryParams = new URLSearchParams(window.location.search);
  const isDebugMode = queryParams.has("debug");
  const [blobUrls, setBlobUrls] = useState<
    { url: string; blob: Blob; label: string }[]
  >([]);
  const audioConstraint = useRef<{ deviceId: { exact: string } | undefined }>({
    deviceId: undefined,
  });
  const audioSource = useRef<HTMLSelectElement>(null);

  const onStop = (blobUrl: string, blob: Blob) => {
    setBlobUrls((prev) => {
      if (blobUrl) {
        return [
          ...prev,
          {
            url: blobUrl,
            blob,
            label:
              audioSource.current?.options[
                audioSource.current?.options.selectedIndex
              ].label || "<unknown>",
          },
        ];
      } else {
        return prev;
      }
    });
    listDevices();
  };

  const { status, startRecording, stopRecording, previewAudioStream, error } =
    useReactMediaRecorder({
      video: false,
      audio: audioConstraint.current,
      onStop,
    });

  const onNewRecording = () => {
    startRecording();
    listDevices();
  };

  if (isDebugMode) {
    console.log("render", audioConstraint.current);
  }

  return (
    <>
      <div className={isDebugMode ? "" : "is-hidden"}>
        <div>Status: {status}</div>
        <div>Error: {error || "-"}</div>
      </div>
      {previewAudioStream && <AudioAnalyser audio={previewAudioStream} />}
      <div className="field">
        <label className="label">Devices</label>
        <select
          id="audioSource"
          ref={audioSource}
          className="select"
          onChange={(ev) => {
            audioConstraint.current = { deviceId: { exact: ev.target.value } };
            listDevices();
          }}
        >
          {devices.map((device, index) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label ? device.label : `Microphone ${index}`}
            </option>
          ))}
        </select>
        <button className="button ml-3" type="button" onClick={listDevices}>
          List devices
        </button>
      </div>
      <div>
        {status !== "recording" && (
          <button className="button" type="button" onClick={onNewRecording}>
            Start New Recording
          </button>
        )}
        {status === "recording" && (
          <button className="button" type="button" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>
      <div>
        {blobUrls.map((blob, index) => (
          <div key={index}>
            {blob.label}
            <audio src={blob.url} controls />
          </div>
        ))}
      </div>
    </>
  );
};

export default Recordings;

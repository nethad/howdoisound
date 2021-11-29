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

  const deleteBlob = (deletedBlob: { url: string }) => {
    setBlobUrls(blobUrls.filter((blob) => blob.url !== deletedBlob.url));
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
      {previewAudioStream?.active ? (
        <AudioAnalyser audio={previewAudioStream} />
      ) : (
        <div
          style={{ height: 106, width: 300, border: "1px lightGrey solid" }}
        ></div>
      )}
      <div className="field mt-3">
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
      <div className="mt-5">
        {blobUrls.map((blob, index) => (
          <div className="columns" key={index}>
            <div className="column my-auto is-narrow">
              <span className="button" onClick={() => deleteBlob(blob)}>
                Delete
              </span>
            </div>
            <div className="column is-narrow my-auto">
              <audio src={blob.url} controls />
            </div>
            <div
              className="column my-auto"
              contentEditable
              suppressContentEditableWarning
            >
              {blob.label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Recordings;

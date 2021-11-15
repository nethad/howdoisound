import React, { useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const Recordings: React.FC = () => {
  const [blobUrls, setBlobUrls] = useState<
    { url: string; blob: Blob; label: string }[]
  >([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  // const [currentDevice, setCurrentDevice] = useState<string | null>(null);
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

  const listDevices = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    setDevices(devices.filter((device) => device.kind === "audioinput"));
    stream.getTracks().forEach((track) => track.stop());
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

  console.log("render", audioConstraint.current);

  return (
    <>
      <h1>Recordings!</h1>
      <div>Status: {status}</div>
      <div>Error: {error}</div>
      <div>
        Devices:
        <select
          id="audioSource"
          ref={audioSource}
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
        <button type="button" onClick={listDevices}>
          List devices
        </button>
      </div>
      <div>
        {status !== "recording" && (
          <button type="button" onClick={onNewRecording}>
            New Recording
          </button>
        )}
        {status === "recording" && (
          <button type="button" onClick={stopRecording}>
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

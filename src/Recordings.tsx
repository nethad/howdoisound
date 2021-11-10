import React, { useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const Recordings: React.FC = () => {
  const [blobUrls, setBlobUrls] = useState<[string, Blob][]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  // const [currentDevice, setCurrentDevice] = useState<string | null>(null);
  const audioConstraint = useRef<{ deviceId: { exact: string } } | true>(true);

  const onStop = (blobUrl: string, blob: Blob) => {
    setBlobUrls((prev) => {
      if (blobUrl) {
        return [...prev, [blobUrl, blob]];
      } else {
        return prev;
      }
    });
  };

  const listDevices = async () => {
    // await window.navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: false,
    // });
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    setDevices(devices.filter((device) => device.kind === "audioinput"));
  };

  const { status, startRecording, stopRecording, previewAudioStream, error } =
    useReactMediaRecorder({
      video: false,
      audio: audioConstraint.current,
      onStop,
      askPermissionOnMount: true,
    });

  const onNewRecording = () => {
    startRecording();
    // listDevices();
  };

  console.log("render", audioConstraint.current);

  return (
    <div>
      <h1>Recordings!</h1>
      <div>Status: {status}</div>
      <div>Error: {error}</div>
      <div>
        Devices:
        <select
          id="audioSource"
          onChange={(ev) => {
            audioConstraint.current = { deviceId: { exact: ev.target.value } };
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
        <button type="button" onClick={onNewRecording}>
          New Recording
        </button>
        <button type="button" onClick={stopRecording}>
          Stop Recording
        </button>
      </div>
      <div>
        {blobUrls.map(([url, blob], index) => (
          <div key={index}>
            <audio src={url} controls />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recordings;

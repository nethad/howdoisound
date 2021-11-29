import React, { useState } from "react";
import Recordings from "./Recordings";
import Welcome from "./Welcome";

const Wizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  const listDevices = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    const devices = await window.navigator.mediaDevices.enumerateDevices();
    setDevices(devices.filter((device) => device.kind === "audioinput"));
    stream.getTracks().forEach((track) => track.stop());
  };

  return (
    <>
      {
        {
          0: <Welcome listDevices={listDevices} onSuccess={() => setStep(1)} />,
          1: <Recordings listDevices={listDevices} devices={devices} />,
        }[step]
      }
    </>
  );
};

export default Wizard;

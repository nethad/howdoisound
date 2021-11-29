import React, { useRef, useState } from "react";

interface WelcomeProps {
  listDevices: () => Promise<unknown>;
  onSuccess: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ listDevices, onSuccess }) => {
  const onStartComparing = () => {
    listDevices().then(onSuccess);
  };

  return (
    <>
      <h2>Welcome</h2>

      <p>
        This app helps you record <b>different microphone sources</b> from your
        computer. You can <b>compare</b> and decide which microphone sounds best
        or if you should use your laptop audio or bluetooth headsets instead.
      </p>
      <p>
        If you hit <b>Start comparing</b>, your browser will ask you for
        microphone permission. For this app to work,{" "}
        <b>
          please select the checkbox that remembers the microphone permission,
          otherwise it cannot read the proper microphone system information.
        </b>
      </p>
      <p className="mt-5">
        <button type="button" className="button" onClick={onStartComparing}>
          Start comparing
        </button>
      </p>
    </>
  );
};

export default Welcome;

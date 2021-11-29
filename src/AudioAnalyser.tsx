import React, { Component } from "react";
import AudioVisualiser from "./AudioVisualiser";

interface AudioAnalyserProps {
  audio: MediaStream;
}

interface AudioAnalyserState {
  audioData: Uint8Array;
}

class AudioAnalyser extends Component<AudioAnalyserProps, AudioAnalyserState> {
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  dataArray: Uint8Array | null = null;
  source: MediaStreamAudioSourceNode | null = null;
  rafId: number | null = null;

  constructor(props: AudioAnalyserProps) {
    super(props);
    this.state = { audioData: new Uint8Array(0) };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new window.AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick() {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteTimeDomainData(this.dataArray);
      this.setState({ audioData: this.dataArray });
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  componentWillUnmount() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.analyser?.disconnect();
    this.source?.disconnect();
  }

  render() {
    return <AudioVisualiser audioData={this.state.audioData} />;
  }
}

export default AudioAnalyser;

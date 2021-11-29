import React, { Component, RefObject } from "react";

interface AudioVisualiserProps {
  audioData: Uint8Array;
}

class AudioVisualiser extends Component<AudioVisualiserProps> {
  canvas: RefObject<HTMLCanvasElement>;

  constructor(props: AudioVisualiserProps) {
    super(props);
    this.canvas = React.createRef();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw() {
    const { audioData } = this.props;
    const canvas = this.canvas.current;
    if (canvas) {
      const height = canvas.height;
      const width = canvas.width;
      const context = canvas.getContext("2d");
      let x = 0;
      const sliceWidth = (width * 1.0) / audioData.length;

      if (context) {
        context.lineWidth = 2;
        context.strokeStyle = "#000000";
        context.clearRect(0, 0, width, height);

        context.beginPath();
        context.moveTo(0, height / 2);
        for (const item of audioData) {
          const y = (item / 255.0) * height;
          context.lineTo(x, y);
          x += sliceWidth;
        }
        context.lineTo(x, height / 2);
        context.stroke();
      }
    }
  }

  render() {
    return (
      <canvas
        style={{ border: "1px lightGrey solid", height: 100, width: 300 }}
        ref={this.canvas}
      />
    );
  }
}

export default AudioVisualiser;

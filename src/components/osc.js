import React, { Component } from 'react';



class Osc extends Component {
  _audioCtx = this.props.audioCtx;

  play = () => {
    let osc = this._audioCtx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 500;
    osc.connect(this._audioCtx.destination);
    osc.start(this._audioCtx.currentTime);
    osc.stop(this._audioCtx.currentTime + 1);
  }

  render() {
    return (
      <div className="osc" onClick={this.play}>
      XXX
      </div>

    );
  }
}

export default Osc;

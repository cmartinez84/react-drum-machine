import React, { Component } from 'react';



class Osc extends Component {
  _audioCtx = this.props.audioCtx;
  track = [2, 4, 5, 7, 8, 11, 12, 13, 14, 15];

  componentWillReceiveProps=(nextProps)=>{
    var nextBeat = nextProps.current16thNote;
    this.track.includes(nextBeat) && this.play(nextProps.futureTickTime);
  }

  play = (timeVal) => {
    let osc = this._audioCtx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 500;
    osc.connect(this._audioCtx.destination);
    osc.start(timeVal);
    osc.stop(timeVal + .1);
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

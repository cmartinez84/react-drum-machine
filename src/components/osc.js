import React, { Component } from 'react';
import Pad from './pad.js';



class Osc extends Component {
  _audioCtx = this.props.audioCtx;
  isPlaying = false;
  track = [];

  componentWillReceiveProps=(nextProps)=>{
    var nextBeat = nextProps.current16thNote;
    this.track.includes(nextBeat) && this.play(nextProps.futureTickTime);
  }

  schedulePlay = (timeVal) => {
    let osc = this._audioCtx.createOscillator();
    this.isPlaying = true;
    osc.type = "triangle";
    osc.frequency.value = 500;
    osc.connect(this._audioCtx.destination);
    osc.start(timeVal);
    osc.stop(timeVal + .1);
    osc.onended= ()=>{
      this.isPlaying = false;
    }
  }

  render() {
    return (
      <div>
      </div>

    );
  }
}

export default Osc;

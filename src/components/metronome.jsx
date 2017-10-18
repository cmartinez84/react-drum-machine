import React, { Component } from 'react';



class Metronome extends Component {
  _audioCtx = this.props.audioCtx;
  track = [];
  isMetronomeOn: false;

  componentWillReceiveProps=(nextProps)=>{
    if(this.isMetronomeOn){
      var nextBeat = nextProps.current16thNote;
      if(nextBeat === 16){
        this.oscLoader(300, nextProps.futureTickTime);

      }
      else if(nextBeat % 4 === 0) {
        this.oscLoader(200, nextProps.futureTickTime);
      }
    }    
  }

  oscLoader = (frequency, timeVal) => {
    // console.log(timeVal);
    let oscObj = this._audioCtx.createOscillator();
    oscObj.type = "triangle";
    oscObj.frequency.value = frequency;
    oscObj.connect(this._audioCtx.destination);
    oscObj.start(timeVal);
    oscObj.stop(timeVal +  .06);
  }
  toggleMetronome = () => {
    this.isMetronomeOn = !this.isMetronomeOn;
  }

  render() {
    return (
      <div>
        <button onClick={this.toggleMetronome}>Metronome</button>

      </div>

    );
  }
}

export default Metronome;

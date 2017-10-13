import React, { Component } from 'react';
import kick from '../sounds/kick.mp3';
import Pad from './pad.js';

class Sound extends Component {
  _audioCtx = this.props.audioCtx;
  track = [1, 3, 9];
  track2 = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  isPlaying = false;
  futureTickTime;
  prevBeat;
  beatToPlay;
  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.current16thNote != this.prevBeat){
      var nextBeat = nextProps.current16thNote;
      if(this.track.includes(nextBeat)){
        this.track2[nextBeat-1] = true;
        this.sound.schedulePlay(nextProps.futureTickTime);
        this.beatToPlay = nextBeat;
      }
      this.prevBeat = nextProps.current16thNote;
    }

  }

  audioFileLoader = (fileDirectory) =>{
      var soundObj = {};
      soundObj.fileDirectory = fileDirectory;

      var getSound = new XMLHttpRequest();
      getSound.open("GET", soundObj.fileDirectory, true);
      getSound.responseType = "arraybuffer";
      getSound.onload = () => {
          this._audioCtx.decodeAudioData(getSound.response, function(buffer) {
              soundObj.soundToPlay = buffer;
          });
      }

      getSound.send();

      soundObj.schedulePlay = (timeVal) => {
          this.isPLaying = true;
          var playSound = this._audioCtx.createBufferSource();
          playSound.buffer = soundObj.soundToPlay;
          playSound.connect(this._audioCtx.destination);
          playSound.start(timeVal);
          var blinkSchedule = this.props.futureTickTime - this._audioCtx;
      }
      return soundObj;
  }
  //add or remove beat to track
  onPadClick = (key) =>{
    // const beat = this.props.current16thNote;
    if(this.track.includes(key)){
      const index = this.track.indexOf(key);
      this.track.splice(index, 1);
    }
    else{
      this.track.push(key);

    }
  }
  sound = this.audioFileLoader(this.props.path);

  render() {
    return (
      <div>
      {Array.apply(null, Array(16)).map((i, index)=>
        <Pad name="kick"isPlaying={this.isPlaying} current16thNote={this.props.current16thNote} beatToPlay={this.beatToPlay} futureTickTime={this.futureTickTime} audioCtx={this._audioCtx} key={index} _key={index +1} onPadClick={()=>{this.onPadClick(index + 1)}} isPressed={this.track.includes(index + 1)}/>
      )}
      </div>
    );
  }
}

export default Sound;

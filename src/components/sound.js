import React, { Component } from 'react';
// import kick from './kick.mp3';
import kick from '../sounds/kick.mp3';

class Sound extends Component {
  _audioCtx = this.props.audioCtx;
  track = [1,3,4, 5, 6, 7, 9, 10];

  componentWillReceiveProps=(nextProps)=>{
    var nextBeat = nextProps.current16thNote;
    this.track.includes(nextBeat) && this.sound.play(nextProps.futureTickTime);
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

      soundObj.play = (timeVal) => {
          var playSound = this._audioCtx.createBufferSource();
          playSound.buffer = soundObj.soundToPlay;
          playSound.connect(this._audioCtx.destination)
          playSound.start(timeVal)
      }
      return soundObj;
  }
  sound = this.audioFileLoader(kick);


  render() {
    return (
      <div className="osc" onClick={this.sound.play}>
      XXX     {this.props.current16thNote}
      </div>

    );
  }
}

export default Sound;

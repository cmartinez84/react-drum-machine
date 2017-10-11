import React, { Component } from 'react';
// import kick from './kick.mp3';
import kick from '../sounds/kick.mp3';

class Sound extends Component {
  _audioCtx = this.props.audioCtx;

  audioFileLoader = (fileDirectory) =>{
    console.log(this._audioCtx);
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

      soundObj.play = () => {
          var playSound = this._audioCtx.createBufferSource();
          playSound.buffer = soundObj.soundToPlay;
          playSound.connect(this._audioCtx.destination)
          playSound.start()
      }
      return soundObj;
  }
  sound = this.audioFileLoader(kick);


  render() {
    return (
      <div className="osc" onClick={this.sound.play}>
      XXX
      </div>

    );
  }
}

export default Sound;

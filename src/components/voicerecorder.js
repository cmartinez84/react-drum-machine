import React, { Component } from 'react';
import Recorder from 'recorderjs';


// var rec = new Recorder(source [, config])

try {
      // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;

      // audio_context = new AudioContext;
      // __log('Audio context set up.');
      // __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
} catch (e) {
  alert('No web audio support in this browser!');
}

// navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
//   __log('No live audio input: ' + e);
// });





class VoiceRecorder extends Component {

  recorderCtx = new AudioContext;
  recorder;
  input;
  streamTracker;

  constructor(props){
    super(props);
    this.state = {
      newSoundPath: null,
    }
  }

   startUserMedia=(stream)=>{
     this.streamTracker = stream.getTracks()[0];
      var ctx = this.recorderCtx;
      this.input = ctx.createMediaStreamSource(stream);
      // this.input.connect(ctx.destination);
      this.recorder = new Recorder(this.input);
      this.recorder.record();

  }

  loadUp = ()=> {
    navigator.getUserMedia({audio: true}, this.startUserMedia, (e) =>{
      console.log('No live audio input: ' + e);
    });
  }
  startRecording = () =>{
    this.loadUp();
  }
  stopRecording = () =>{
    this.streamTracker.stop();
    this.recorder.stop()
    this.createDownloadLink();

  }
  createDownloadLink = () => {
      this.recorder && this.recorder.exportWAV((blob) =>{
        var destination = document.getElementById('recordings');
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        destination.appendChild(li);
        this.setState({newSoundPath: au.src});
      });
    }
  clearRecording=()=>{
    this.recorder.clear();
  }
addToLocalLibrary=()=>{
  var path = this.state.newSoundPath;
  var newInstrumentName = document.getElementById('newInstrumentName').value;
  this.props.addToLocalLibrary(newInstrumentName, path);

}
  render() {

    return (
      <div>
        <button onClick={this.startRecording}> Start</button>
        <button onClick={this.stopRecording}> Stop</button>
        <button onClick={this.clearRecording}>Clear</button>
        <div id="recordings"></div>
        <button onClick={this.addToLocalLibrary}>Add</button>
        <input type="text" placeholder="give your sound a name" id="newInstrumentName"/>
      </div>


    );
  }
}

export default VoiceRecorder;

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



var boom =   document.createElement('li');
boom.innerHTML = "HEEEE";


class VoiceRecorder extends Component {

  recorderCtx = new AudioContext;
  recorder;
  input;
  streamTracker;

  constructor(props){
    super(props);
    this.state = {
      newSoundPath: null,
      newSoundLi: boom
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
    this.streamTracker && this.streamTracker.stop();
    this.recorder && this.recorder.stop()
    this.createDownloadLink();
    this.recorder && this.clearRecording();
  }
  clearRecording=()=>{
    this.recorder.clear();
  }
  createDownloadLink = () => {
      this.recorder && this.recorder.exportWAV((blob) =>{
        var destination = document.getElementById('recordings');
        destination.innerHTML = '';
        var url = URL.createObjectURL(blob);
        var span = document.createElement('span');
        var au = document.createElement('audio');
        // var hf = document.createElement('a');
        au.controls = true;
        au.className = "newSound"
        au.src = url;
        span.appendChild(au);
        destination.appendChild(span);
        this.setState({newSoundPath: au.src});
        // this.setState({newSoundLi: li});
      });
    }
  addToLocalLibrary=()=>{
    var destination = document.getElementById('recordings');
    destination.innerHTML = '';
    var path = this.state.newSoundPath;
    var newInstrumentName = document.getElementById('newInstrumentName').value;
    this.props.addToLocalLibrary(newInstrumentName, path);

  }
  render() {

    return (
      <div>
        <button onClick={this.startRecording}> Start</button>
        <button onClick={this.stopRecording}> Stop</button>
        <div id="recordings"></div>
        <button onClick={this.addToLocalLibrary}>Add</button>
        <input type="text" placeholder="give your sound a name" id="newInstrumentName"/>
      </div>


    );
  }
}

export default VoiceRecorder;

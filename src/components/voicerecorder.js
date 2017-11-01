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
  stream;

   startUserMedia=(stream)=>{
     this.stream = stream.getTracks()[0];
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
    this.stream.stop();
    this.recorder.stop()
    this.createDownloadLink();

  }
  createDownloadLink = () => {
      this.recorder && this.recorder.exportWAV(function(blob) {
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
      });
    }
  clearRecording=()=>{
    this.recorder.clear();
  }
  queen=()=>{
    console.log(navigator.getUserMedia[0]);
  }


  render() {

    return (
      <div>
      <button onClick={this.queen}> Queen </button>
      <button onClick={this.startRecording}> Start</button>

        <button onClick={this.stopRecording}> Stop</button>
        <button onClick={this.clearRecording}>Clear</button>
        <div id="recordings"></div>
      </div>


    );
  }
}

export default VoiceRecorder;

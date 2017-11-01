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

   startUserMedia=(stream)=>{
      var ctx = this.recorderCtx;
      this.input = ctx.createMediaStreamSource(stream);
      this.input.connect(ctx.destination);

      this.recorder = new Recorder(this.input);
  }

  loadUp = ()=> {
    navigator.getUserMedia({audio: true}, this.startUserMedia, (e) =>{
      console.log('No live audio input: ' + e);
    });
  }
  startRecording = () =>{
    this.recorder.record();
  }
  stopRecording = () =>{
    this.recorder.stop()
    this.input.disconnect();
    this.createDownloadLink()

  }
  createDownloadLink = () => {
      this.recorder && this.recorder.exportWAV(function(blob) {
        var destination = document.getElementById('recordings');
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        au.setAttribute('loop', true);
        au.setAttribute('autoplay', true);
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



  render() {

    return (
      <div>
        <button onClick={this.loadUp}> Load Up</button>
        <button onClick={this.startRecording}> Load Up</button>
        <button onClick={this.stopRecording}> Load Up</button>
        <div id="recordings"></div>
      </div>


    );
  }
}

export default VoiceRecorder;

import React, { Component } from 'react';
import Osc from './osc';
import Sound from './sound';
import Knob from './knob.js';

import * as soundLib from '../sounds/soundSources.js';

//react does not like undefined....even in conditionals...
try{
  const AudioContext = window.AudioContext || window.webkitAudioContext || window.webkitAudioContext;
  console.log((soundLib.sources[1].path))
}
catch(err){
  console.log("Looks like you're using outdated technology");
}

class Sequencer extends Component {
  //variables
  audioCtx = new AudioContext();
  isPlaying = false;
  tempo = 120;

  futureTickTime = 0.0;
  timerID = 0;//_______________________________________________________________
  interval;

  constructor(props){
    super();
    this.state = {
      current16thNote: 1,
      tempo: 120,
    }
  }

  futureTick =() =>{
    var secondsPerBeat = 60 / this.state.tempo;
    var _current16thNote = this.state.current16thNote > 15
      ? 1: this.state.current16thNote +1;
    this.futureTickTime += 0.25 * secondsPerBeat;
    this.setState({ current16thNote: _current16thNote});
  }

  scheduler = ()=>{
    while(this.futureTickTime < this.audioCtx.currentTime + 0.1){
      this.futureTick();
    }
    this.interval = window.setTimeout(this.scheduler, 50);
  }

  beginScheduler = () => {
    this.futureTickTime = this.audioCtx.currentTime;
    this.scheduler();
  }
  onTempoChange =(newTempo)=>{
    console.log(newTempo);
    this.setState({tempo: newTempo});
  }



  render() {
    return (
      <div>
        <h1>{this.state.tempo} BPM</h1>
        <Knob onTempoChange={this.onTempoChange}/>

        {soundLib.sources.map((source, i)=>
          <Sound  audioCtx={this.audioCtx} current16thNote={this.state.current16thNote} futureTickTime={this.futureTickTime} path={source.path} key={i}/>
          )
        }
        <button onClick={this.beginScheduler}>Start</button>
        <Osc  audioCtx={this.audioCtx} current16thNote={this.state.current16thNote} futureTickTime={this.futureTickTime}/>
      </div>

    );
  }
}

export default Sequencer;



//
// //_______________________________________________________________
// function futureTick(){
//   var secondsPerBeat = 60/ tempo;
//   futureTickTime += 0.25 * secondsPerBeat;
//   current16thNote ++;
//   current16thNote  > 16  ? current16thNote = 1: '';
// }
//
// //_______________________________________________________________
// function scheduleNote(beatDivisionNumber, time){
//   track.includes(beatDivisionNumber) ? kick.play(): '';
// }
//
// function scheduler(){
//   while(futureTickTime < audioContext.currentTime + 0.1){
//     scheduleNote(current16thNote, futureTickTime);
//     futureTick();
//   }
//   timerID = window.setTimeout(scheduler, 50);
// }
//
// function play(){
//   isPlaying = !isPlaying;
//
//   if(isPlaying){
//     current16thNote = 1;
//     futureTickTime = audioContext.currentTime;
//     scheduler();
//     return "stop";
//   }
//   else{
//     window.clearTimeout(timerID);
//     return   "play";
//   }
// }

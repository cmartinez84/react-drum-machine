import React, { Component } from 'react';
import Osc from './osc';
import Sound from './sound';
//react does not like undefined....even in conditionals...
try{
  const AudioContext = window.AudioContext || window.webkitAudioContext || window.webkitAudioContext;
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
  track =[1, 3, 9];
  interval;

  constructor(props){
    super();
    this.state = {
      current16thNote: 1
    }
  }

  futureTick =() =>{
    var secondsPerBeat = 60 / this.tempo;
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

  render() {
    return (
      <div>{this.state.current16thNote}
        <button onClick={this.scheduler}></button>
        <Osc audioCtx={this.audioCtx} current16thNote={this.state.current16thNote} futureTickTime={this.futureTickTime}/>
        <Sound audioCtx={this.audioCtx} current16thNote={this.state.current16thNote} futureTickTime={this.futureTickTime}/>
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

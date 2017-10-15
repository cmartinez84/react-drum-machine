import React, { Component } from 'react';
import Tuna from 'tunajs';
import Osc from './osc';
import Sound from './sound';
// import Bar from './bar.jsx';
import Knob from './knob.js';
import BeatCounter from './beatCounter';
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
  track = {
    tempo: 120,
    bars: [
      // each bar an array of objects????
      [
        {instrument: "kick", sequence: [1, 15, 14]},
        // {instrument: snare, sequence: [1, 15, 14]},
        // {instrument: hihat, sequence: [1, 15, 14]},

      ]
    ]
  }
// this.track.bars[0].instrument = kick;
// this.track.bars[0].sequence


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
  changeSequence=(key, instKey)=>{
    if(this.track.bars[0][instKey].sequence.includes(key)){
      const index = this.track.bars[0][instKey].sequence.indexOf(key);
      this.track.bars[0][instKey].sequence.splice(index, 1);
    }
    else{
      this.track.bars[0][instKey].sequence.push(key);
    }
  }



  //
  // {Array.apply(null, Array(7)).map((i)=>
  //   <Bar/>
  // )}
  //
  // his.track.bars[0].instrument = kick;
  // this.track.bars[0].sequence

  render() {
    return (
      <div>

        <h1>{this.state.tempo} BPM</h1>
        <Knob onTempoChange={this.onTempoChange}/>

        {this.track.bars[0] .map((instrument, i)=>
        <Sound
          instrument={instrument}
          instrumentKey={i}
          audioCtx={this.audioCtx}
          current16thNote={this.state.current16thNote}
          futureTickTime={this.futureTickTime}
          path={soundLib.sources[instrument.instrument]}
          sequence={instrument.sequence}
          key={i}
          name={instrument.instrument}
          changeSequence={this.changeSequence}
          />
          )//end map
        }
        <button onClick={this.beginScheduler}>Start</button>
        <Osc  audioCtx={this.audioCtx} current16thNote={this.state.current16thNote} futureTickTime={this.futureTickTime}/>
        <BeatCounter current16thNote={this.state.current16thNote}/>
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

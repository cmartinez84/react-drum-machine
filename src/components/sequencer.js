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
  barsIndexCount = 1;

  track = {
    tempo: 120,
    instruments: [
      {
        isActive: true,
        name: "kick",
        sequence: [[1, 2, 3, 4, 5, 6], [4, 5, 6]],
      },
      {
        isActive: true,
        name: "snare",
        sequence: [[1, 2, 3, 4, 5, 6], [4, 5, 6]],
      }
    ],

  }
  constructor(props){
    super();
    this.state = {
      current16thNote: 1,
      currentBar: 0,
      tempo: 120,
    }
  }

  futureTick =() =>{
    var secondsPerBeat = 60 / this.state.tempo;
    var _current16thNote = this.state.current16thNote > 15
      ? 1: this.state.current16thNote +1;
    this.futureTickTime += 0.25 * secondsPerBeat;
    this.setState({ current16thNote: _current16thNote});

    if(_current16thNote == 1){
      if(this.state.currentBar === this.barsIndexCount){
        this.setState({currentBar: 0})
      }
      else{
        const nextBar = this.state.currentBar +1;
        this.setState({currentBar: nextBar});
      }
    }
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
  changeSequence=(padKey, instKey)=>{
    var barKey = this.state.currentBar;
    console.log(`${barKey} ${padKey} ${instKey}`);
    if(this.track.instruments[instKey].sequence[barKey].includes(padKey)){
      const index = this.track.instruments[instKey].sequence[barKey].indexOf(padKey);
      this.track.instruments[instKey].sequence[barKey].splice(index, 1);
    }
    else{
      this.track.instruments[instKey].sequence[barKey].push(padKey);
    }
  }



  //
  // {Array.apply(null, Array(7)).map((i)=>
  //   <Bar/>
  // )}

  render() {
    return (
      <div>

        <h1>{this.state.tempo} BPM</h1>
        <Knob onTempoChange={this.onTempoChange}/>

        {this.track.instruments.map((instrument, i)=>
        <Sound
          instrument={instrument}
          instrumentKey={i}
          audioCtx={this.audioCtx}
          current16thNote={this.state.current16thNote}
          currentBar={this.state.currentBar}
          futureTickTime={this.futureTickTime}
          path={soundLib.sources[instrument.name]}
          sequence={instrument.sequence}
          key={i}
          name={instrument.name}
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

import React, { Component } from 'react';
import Tuna from 'tunajs';
import Osc from './osc';
import Sound from './sound';
// import Bar from './bar.jsx';
import Knob from './knob.js';
import Volume from './volume.js';
import BarCounter from './barCounter.jsx';
import BeatCounter from './beatCounter';
import * as soundLib from '../sounds/soundSources.js';

//react does not like undefined....even in conditionals...
try{
  const AudioContext = window.AudioContext || window.webkitAudioContext || window.webkitAudioContext;
  // console.log((soundLib.sources[1].path))
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
  isBarChangeScheduled = false;
  nextScheduledBar;
  isolatedInstrument = null;
  trackHasStarted = false;
// track.instruments[index].sequence[barIndex]
  track = {
    tempo: 120,
    instruments: [
      {
        isActive: true,
        name: "kick",
        sequence: [[1, 3, 5, 7, 9, 11, 13, 15], []]
      },
      {
        isActive: true,
        name: "kick",
        sequence: [[1, 3, 5, 7, 9, 11, 13, 15], []]
      },
      {
        isActive: true,
        name: "kick",
        sequence: [[1, 3, 5, 7, 9, 11, 13, 15], []]
      },
      {
        isActive: true,
        name: "kick",
        sequence: [[1, 3, 5, 7, 9, 11, 13, 15], []]
      },
      // {
      //   isActive: true,
      //   name: "kick",
      //   sequence: [[1, 3, 15], []]
      // }
      // ,{
      //   isActive: true,
      //   name: "kick",
      //   sequence: [[1, 3,, 9, 11, 13, 15], []]
      // }
      // {
      //   isActive: true,
      //   name: "kick",
      //   sequence: [[1, 2, 3, 4, 5, 6], [4, 5, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "snare",
      //   sequence: [[1,10], [4, 5, ,8, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "hihat",
      //   sequence: [[1,5, 6], [4, 5, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "shaker",
      //   sequence: [[1, 2, 3, 9], [4, 5, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "crackle",
      //   sequence: [[1, 2, 3, 4, 5, 6], [4, 5, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "snare",
      //   sequence: [[1, 2,8, 12, 6], [4, 5, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "meow",
      //   sequence: [[], [],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "shaker",
      //   sequence: [[1, 2,7, 9, 6], [4, 5, 6],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "thump",
      //   sequence: [[1, 13, 6], [2, 15, 16],[],[],[],[],[],[]],
      // },
      // {
      //   isActive: true,
      //   name: "heyyo",
      //   sequence: [[4, 5, 6], [4, 5, 6],[],[],[],[],[],[]],
      // },
    ],

  }

  soundObjReferences = [];

  constructor(props){
    super(props);
    this.state = {
      current16thNote:0,
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
    if(_current16thNote === 16){
      if(this.isBarChangeScheduled === false){
        if(this.state.currentBar === this.barsIndexCount){
          this.setState({currentBar: 0})
        }
        else{
          const nextBar = this.state.currentBar +1;
          this.setState({currentBar: nextBar});
        }
      }
      else{
        this.changeBarView();
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
    this.trackHasStarted = true;
  }
  onTempoChange =(newTempo)=>{
    this.setState({tempo: newTempo});
  }
  changeSequence=(padKey, instKey)=>{
    var barKey = this.state.currentBar;
    if(this.track.instruments[instKey].sequence[barKey].includes(padKey)){
      const index = this.track.instruments[instKey].sequence[barKey].indexOf(padKey);
      this.track.instruments[instKey].sequence[barKey].splice(index, 1);
    }
    else{
      this.track.instruments[instKey].sequence[barKey].push(padKey);
    }
  }

  handleGainChange = (newGain, instIndex) => {
    this.soundObjReferences[instIndex].gainNode.gain.value = newGain;
  }
  changeTrackObj = (instrumentName, instrumentIndex) =>{
    this.track.instruments[instrumentIndex].name = instrumentName;

  }
  changeBarView = () => {
    const nextBar = this.nextScheduledBar;
    this.setState({
      currentBar: nextBar,
      current16thNote: 1
    });
    this.isBarChangeScheduled = false;

  }
  scheduleBarChange = (barIndex) =>{
    this.isBarChangeScheduled = true;
    this.nextScheduledBar = barIndex;
  }
  isolateInstrument = (instrumentIndex) =>{
    if(this.isolatedInstrument === instrumentIndex){
      this.isolatedInstrument = null;
    }
    else {
      this.isolatedInstrument = instrumentIndex;
    }

    if(this.isolatedInstrument === null){
      this.soundObjReferences.forEach((soundObj)=>{
        soundObj.gainNode.gain.value = 1;
      })
    }
    else{
      this.soundObjReferences.forEach((soundOb, index) =>{
        if(index !== this.isolatedInstrument){
          soundOb.gainNode.gain.value = 0;
        }
        else{
          soundOb.gainNode.gain.value = 1;

        }
      })
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
        <div>

        <Sound
          trackHasStarted={this.trackHasStarted}
          soundObjReferences={this.soundObjReferences}
          instrument={instrument}
          instrumentKey={i}
          audioCtx={this.audioCtx}
          current16thNote={this.state.current16thNote}
          currentBar={this.state.currentBar}
          futureTickTime={[this.futureTickTime]}
          path={soundLib.sources[instrument.name]}
          sequence={instrument.sequence}
          key={i}
          name={instrument.name}
          changeSequence={this.changeSequence}
          changeTrackObj={this.changeTrackObj}
          isolatedInstrument={this.isolatedInstrument}
          isolateInstrument={this.isolateInstrument}
          />
      </div>
          )//end map
        }
        <BeatCounter current16thNote={this.state.current16thNote}/>
        //controllers
        {this.track.instruments.map((instrument, index)=>
          <div className="instrument-controls">
            <p>{instrument.name}</p>
            <Volume handleGainChange={this.handleGainChange}
                    instIndex={index}/>
          </div>
          )
        }
        <button onClick={this.beginScheduler}>Start</button>
        <Osc
          audioCtx={this.audioCtx}
          current16thNote={this.state.current16thNote}
          futureTickTime={this.futureTickTime}/>
        <BarCounter
          barsIndexCount={this.barsIndexCount}
          currentBar={this.state.currentBar}
          scheduleBarChange={this.scheduleBarChange}/>
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

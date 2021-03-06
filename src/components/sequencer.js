import React, { Component } from 'react';
import Tuna from 'tunajs';

import Sound from './sound';
import Knob from './knob.js';
import Volume from './volume.js';
import TapButton from './tapButton.jsx';
import BarCounter from './barCounter.jsx';
import BeatCounter from './beatCounter';
import BarViewControl from './barViewControl';
import Metronome from './metronome';
import VoiceRecorder from './voicerecorder';
///test
// import * as BOOM from './encoderWorker.js';


import * as soundLib from '../sounds/soundSources.js';
import {generateTuna} from './generateTuna.js';
import {track} from './track.js';

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
  isBarChangeScheduled = false;
  nextScheduledBar;
  isolatedInstrument = null;
  trackHasStarted = false;
  allTuna =  generateTuna();
  barsIndexCount = 7;
  soundObjReferences = [];



  constructor(props){
    super(props);
    this.state = {
      current16thNote:0,
      currentBar: 0,
      tempo: 120,
      barSequence: [true, false, false, false, false, false, false, false],
      indexOfLockedBar: 0,
      isBarViewLocked: false,
      isMouseDown: false,
    }
  }
  componentDidMount = () =>{
  }

  futureTick =() =>{
    var secondsPerBeat = 60 / this.state.tempo;
    var _current16thNote = this.state.current16thNote > 15
      ? 1: this.state.current16thNote +1;
    this.futureTickTime += 0.25 * secondsPerBeat;
    this.setState({ current16thNote: _current16thNote});
    if(_current16thNote === 16){
      this.rotateBar();
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
  changeSequence=(padKey, instKey, sequenceIndex)=>{
    var barKey =  this.state.isBarViewLocked ? this.state.indexOfLockedBar : this.state.currentBar;
    if(track.instruments[instKey].sequence[barKey].includes(padKey)){
      const index = track.instruments[instKey].sequence[barKey].indexOf(padKey);
      track.instruments[instKey].sequence[barKey].splice(index, 1);
    }
    else{
      track.instruments[instKey].sequence[barKey].push(padKey);
    }
  }
  tapIntoSequence=(instKey)=>{
    const padKey = this.state.current16thNote;
    const sequenceIndex = this.state.isBarViewLocked ? this.state.indexOfLockedBar: this.state.currentBar;
    this.changeSequence(padKey, instKey, sequenceIndex);
  }

  handleGainChange = (newGain, instIndex) => {
    this.soundObjReferences[instIndex].gainNode.gain.value = newGain;
  }
  changeTrackObj = (instrumentName, instrumentIndex) =>{
    track.instruments[instrumentIndex].name = instrumentName;

  }
  changeBarView=(n)=>{
    // var oldIndex = this.state.indexOfLockedBar;
    var newIndex = this.state.indexOfLockedBar += n;
    if(newIndex >7){
      newIndex = 7
    }
    else if(newIndex < 0){
      newIndex = 0;
    }
    this.setState({indexOfLockedBar: newIndex})
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
  changeTuna = (e) => {
    var newTuna = e.target.value;
    var instIndex = e.target.dataset['instindex'];
    var instrument = this.soundObjReferences[instIndex];
    instrument.tunaFilter.disconnect();
    instrument.tunaFilter = instrument.allTuna[newTuna];
  }
  rotateBar = () => {
    var testNextBar = this.state.barSequence.indexOf(true, this.state.currentBar + 1);
    if(testNextBar === -1){
      var nextBar = this.state.barSequence.indexOf(true);
    }
    else {
      var nextBar =testNextBar;
    }
    this.setState({currentBar: nextBar});
  }
  toggleBarSequence = (index) =>{
    var newBarSequence = this.state.barSequence.slice();
    newBarSequence[index] = !newBarSequence[index];
    this.setState({barSequence: newBarSequence});
  }
  lockBarView = (index) =>{
    this.setState({isBarViewLocked: !this.state.isBarViewLocked});
    this.setState({indexOfLockedBar: index });
  }
  toggleMouseDown= ()=>{
    this.setState({isMouseDown: !this.state.isMouseDown});
  }
  mouseOut=()=>{
    this.setState({isMouseDown: false});
    alert("out");
  }

  addToLocalLibrary=(newInstrumentName, path)=>{
    soundLib.sources[newInstrumentName]=path;
  }
  render() {
    return (
      <div class="container"
          onMouseDown={this.toggleMouseDown}
          onMouseUp={this.toggleMouseDown}>
        <div className="top-row">
          <div className="sequencer">
            {track.instruments.map((instrument, i)=>
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
              indexOfLockedBar={this.state.indexOfLockedBar}
              isBarViewLocked={this.state.isBarViewLocked}
              isMouseDown={this.state.isMouseDown}
              />
          </div>

            )//end map
          }
        </div>

        <div className="main-controls" >
          <div>
            <h1> Main Controls</h1>
            <p> Tempo: {this.state.tempo}</p>
            <Knob onTempoChange={this.onTempoChange}/>
              <Metronome
                audioCtx={this.audioCtx}
                current16thNote={this.state.current16thNote}
                futureTickTime={this.futureTickTime}/>
              <BarCounter
                barSequence={this.state.barSequence}
                currentBar={this.state.currentBar}
                scheduleBarChange={this.scheduleBarChange}
                toggleBarSequence={this.toggleBarSequence}/>
          </div>
          <div>
            <h1>Voice Recorder</h1>
            <VoiceRecorder addToLocalLibrary={this.addToLocalLibrary}/>
          </div>

        </div>

        </div>
        <div className="bottom-row">
          <div className="col">
            <BarViewControl
              currentBar={this.state.currentBar}
              lockBarView={this.lockBarView}
              barSequence={this.state.barSequence}
              changeBarView={this.changeBarView}
              indexOfLockedBar={this.state.indexOfLockedBar}
              />
          </div>
          <div className="col">
            <BeatCounter
              isBarViewLocked={this.isBarViewLocked}
              current16thNote={this.state.current16thNote}
              />
          </div>

        </div>

        {track.instruments.map((instrument, index)=>
          <div className="instrument-controls">
            <div>
              <TapButton
                instIndex={index}
                onTap={this.tapIntoSequence}>
              </TapButton>
            </div>
            <p>{instrument.name}</p>
            <Volume handleGainChange={this.handleGainChange}
                    instIndex={index}/>
            <p>Filter</p>
            <select onChange={this.changeTuna} data-instindex={index}>
              {Object.keys(this.allTuna).map((tunaKey)=>
                <option key={tunaKey} value={tunaKey}>{tunaKey}</option>
                )}            </select>
          </div>
          )
        }
        <button onClick={this.beginScheduler} >Start</button>
      </div>

    );
  }
}

export default Sequencer;

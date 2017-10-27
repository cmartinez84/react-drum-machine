import React, { Component } from 'react';
import Tuna from 'tunajs';

import kick from '../sounds/kick.mp3';
import snare from '../sounds/snare.mp3';
import Pad from './pad.js';
import Volume from './volume.js';
import Filter from './filter.jsx';
import conlverPath from '../sounds/Space4ArtGallery.wav';
import concertHall from '../sounds/ConcertHall.wav';
import * as soundLib from '../sounds/soundSources.js';
import {generateTuna} from './generateTuna.js';
import {track} from './track.js';


class Sound extends Component {
  _audioCtx = this.props.audioCtx;
  tuna = new Tuna(this._audioCtx);
  allSequences = this.props.sequence;
  name = this.props.name;
  isPlaying = false;
  prevBeat;
  beatToPlay;
  gainNode;
  filter = this._audioCtx.createBiquadFilter();
  convolver = this._audioCtx.createConvolver();
  sequenceToDisplay = this.allSequences[this.props.currentBar];


  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.isBarViewLocked){
      this.sequenceToDisplay = this.allSequences[nextProps.indexOfLockedBar];
    }
    else {
      this.sequenceToDisplay = this.allSequences[nextProps.currentBar];
    }

    if(nextProps.trackHasStarted){
      if(nextProps.current16thNote != this.prevBeat){
        var nextBeat = nextProps.current16thNote;
        // prevents isPlaying from lingering
        this.beatToPlay = null;
        if(this.allSequences[this.props.currentBar].includes(nextBeat)){
          this.sound.schedulePlay(nextProps.futureTickTime[0]);
          this.beatToPlay = nextBeat;
        }
        this.prevBeat = nextProps.current16thNote;
      }
    }
  }

  componentDidMount=()=>{
    this.props.soundObjReferences.push(this.sound);
  }

loadImpulse = function (path)
  {
  var request = new XMLHttpRequest();
  request.open( "GET", path, true );
  request.responseType = "arraybuffer";
  request.onload = ()=>
  {
    this._audioCtx.decodeAudioData( request.response,  ( buffer ) => {
      this.convolver.buffer = buffer;
    }, function ( e ) { console.log( e ); } );
  };request.onerror = function ( e )
  {
  };
  request.send();
};

  audioFileLoader = (fileDirectory) =>{
      var soundObj = {};
      soundObj.allTuna = generateTuna(this._audioCtx);

      this.loadImpulse(concertHall);
      soundObj.fileDirectory = fileDirectory;

      // soundObj.tunaNode;
      var getSound = new XMLHttpRequest();
      getSound.open("GET", soundObj.fileDirectory, true);
      getSound.responseType = "arraybuffer";
      getSound.onload = () => {
          this._audioCtx.decodeAudioData(getSound.response, function(buffer) {
              soundObj.soundToPlay = buffer;
          });
      }
      ////distortion!!!
      // this.distortion.curve = this.makeDistortionCurve(33);
      // this.distortion.oversample = '4x';
      ///end

      getSound.send();
      soundObj.gainNode = this._audioCtx.createGain();
      soundObj.gainNode.gain.value = 1;
      soundObj.tunaFilter = soundObj.allTuna["convolver"];

      soundObj.schedulePlay = (timeVal) => {
          this.isPLaying = true;
          var playSound = this._audioCtx.createBufferSource();
          playSound.buffer = soundObj.soundToPlay;
          // playSound.connect(this.filter);
          // // this.convolver.connect(this.filter);
          // playSoundconnect(this.gainNode);
          // this.gainNode.connect(this._audioCtx.destination);
          playSound.connect(soundObj.gainNode);
          // soundObj.gainNode.connect(this._audioCtx.destination);
          // this.filter.connect(soundObj.gainNode);
          soundObj.gainNode.connect(soundObj.tunaFilter);
          soundObj.tunaFilter.connect(this._audioCtx.destination)
          // playSound.connect(this._audioCtx.destination);
          // this.tremolo.connect(this.chorus);
          // this.chorus.connect(this._audioCtx.destination);
          // this.tremolo.connect(this._audioCtx.destination);
          playSound.start(timeVal);
      }
      return soundObj;
  }
  //add or remove beat to track
  onPadClick = (padKey, sequenceIndex) =>{
    var instKey = this.props.instrumentKey;
    this.props.changeSequence(padKey, instKey, sequenceIndex);
  }

  handleGainChange = (newGain) =>{
    this.gainNode.gain.value = newGain;
  }
  handleFilterChange = (params) =>{
    this.filter.type = params.type;
  }
  sound = this.audioFileLoader(this.props.path);
//
// <Filter handleFilterChange={this.handleFilterChange}/>
//
changeSound = (e) => {
  const instrumentKey = this.props.instrumentKey;
  const newValue = e.target.value;
  const fileDirectory = soundLib.sources[newValue];
  this.sound.fileDirectory = fileDirectory;

  var getSound = new XMLHttpRequest();
  getSound.open("GET", this.sound.fileDirectory, true);
  getSound.responseType = "arraybuffer";
  getSound.onload = () => {
      this._audioCtx.decodeAudioData(getSound.response, (buffer) =>{
          this.sound.soundToPlay = buffer;
      });
  }
  getSound.send();
  this.props.changeTrackObj(newValue, instrumentKey);
}

isolateInstrument=()=>{
  this.props.isolateInstrument(this.props.instrumentKey);
}
  render() {
    return (
      <div className="instrument-container" >
        <span className="instrument-pad-name"><p>{this.props.name}</p></span>
          <button onClick={this.isolateInstrument}
                  className="isolator">i</button>

        <div className="pad-container">
          <select onChange={this.changeSound}>
          {Object.keys(soundLib.sources).map((key)=>
              <option  key={key}
                      value={key}
                      selected={this.props.name === key}>{key}
              </option>
            )
          }

          </select>
        {Array.apply(null, Array(16)).map((_, index)=>
          <Pad
            beatToPlay={this.beatToPlay}
            key={index}
            _key={index +1}
            onPadClick={this.onPadClick}
            currentSequence={this.allSequences[this.props.currentBar]}
            currentBar={this.props.currentBar}
            allSequences = {this.allSequences}
            indexOfLockedBar={this.props.indexOfLockedBar}
            isBarViewLocked={this.props.isBarViewLocked}
            sequenceToDisplay={this.sequenceToDisplay}
            />
        )}
      </div>

      </div>
    );
  }
}
export default Sound;

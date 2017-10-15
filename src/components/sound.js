import React, { Component } from 'react';
import Tuna from 'tunajs';

import kick from '../sounds/kick.mp3';
import Pad from './pad.js';
import Volume from './volume.js';
import Filter from './filter.jsx';
import conlverPath from '../sounds/Space4ArtGallery.wav';
import concertHall from '../sounds/ConcertHall.wav';




class Sound extends Component {
  _audioCtx = this.props.audioCtx;
  tuna = new Tuna(this._audioCtx);
  sequence = this.props.sequence;
  name = this.props.name;
  track2 = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  isPlaying = false;
  futureTickTime;
  prevBeat;
  beatToPlay;
  gainNode;
  filter = this._audioCtx.createBiquadFilter();
  convolver = this._audioCtx.createConvolver();
  // track = {
  //   tempo: 120,
  //   bars = [
  //     // each bar an array of objects????
  //     [
  //       {instrument: kick, sequence: [1, 15, 14]},
  //       // {instrument: snare, sequence: [1, 15, 14]},
  //       // {instrument: hihat, sequence: [1, 15, 14]},
  //
  //     ]
  //   ],
  // }





  chorus = new this.tuna.Chorus({
    rate: 1.5,
    feedback: 0.2,
    delay: 0.0045,
    bypass: 0
  });


  tremolo = new this.tuna.Tremolo({
    intensity: 0.3,    //0 to 1
    rate: 4,         //0.001 to 8
    stereoPhase: 0,    //0 to 180
    bypass: 0
  });



  //experimental shit...warning
  // distortion = this._audioCtx.createWaveShaper();
  // makeDistortionCurve = (amount)=> {
  //   var k = typeof amount === 'number' ? amount : 50,
  //     n_samples = 44100,
  //     curve = new Float32Array(n_samples),
  //     deg = Math.PI / 180,
  //     i = 1,
  //     x;
  //   for ( ; i < n_samples; ++i ) {
  //     x = i * 2 / n_samples - 1;
  //     curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  //   }
  //   return curve;
  // };


  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.current16thNote != this.prevBeat){
      var nextBeat = nextProps.current16thNote;
      if(this.sequence[this.props.currentBar].includes(nextBeat)){
        this.track2[nextBeat-1] = true;
        this.sound.schedulePlay(nextProps.futureTickTime);
        this.beatToPlay = nextBeat;
      }
      this.prevBeat = nextProps.current16thNote;
    }
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
    console.log( e + "convolve!");
  };
  request.send();
};

  audioFileLoader = (fileDirectory) =>{
      var soundObj = {};
      this.loadImpulse(concertHall);
      console.log(this.convolver);
      soundObj.fileDirectory = fileDirectory;

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
      this.gainNode = this._audioCtx.createGain();
      this.gainNode.gain.value = 1;
      this.filter.type="allpass";

      soundObj.schedulePlay = (timeVal) => {
          this.isPLaying = true;
          var playSound = this._audioCtx.createBufferSource();
          playSound.buffer = soundObj.soundToPlay;
          // playSound.connect(this.filter);
          // // this.convolver.connect(this.filter);
          // this.filter.connect(this.gainNode);
          // this.gainNode.connect(this._audioCtx.destination);
          playSound.connect(this.tremolo);
          this.tremolo.connect(this.chorus);
          this.chorus.connect(this._audioCtx.destination);
          // this.tremolo.connect(this._audioCtx.destination);
          playSound.start(timeVal);
          var blinkSchedule = this.props.futureTickTime - this._audioCtx;
      }
      return soundObj;
  }
  //add or remove beat to track
  onPadClick = (padKey) =>{
    var instKey = this.props.instrumentKey;
    this.props.changeSequence(padKey, instKey);
  }

  handleGainChange = (newGain) =>{
    this.gainNode.gain.value = newGain;
    console.log(newGain);
  }
  handleFilterChange = (params) =>{
    this.filter.type = params.type;
    console.log(this.filter);
  }
  sound = this.audioFileLoader(this.props.path);
//
  render() {
    return (
      <div className="instrument-container">
        <h1>Name: {this.props.name}</h1>
        {Array.apply(null, Array(16)).map((i, index)=>
        <Pad
          name={this.props.name}
          isPlaying={this.isPlaying}
          current16thNote={this.props.current16thNote}
          beatToPlay={this.beatToPlay}
          futureTickTime={this.futureTickTime}
          audioCtx={this._audioCtx}
          key={index}
          _key={index +1}
          onPadClick={()=>{this.onPadClick(index + 1)}}
          isPressed={this.sequence[this.props.currentBar].includes(index + 1)}/>
      )}
      <Filter handleFilterChange={this.handleFilterChange}/>
      <Volume handleGainChange={this.handleGainChange}/>
      </div>
    );
  }
}

export default Sound;

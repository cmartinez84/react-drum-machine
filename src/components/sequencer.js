import React, { Component } from 'react';
import Osc from './osc';
import Sound from './sound';


//variables
let audioCtx = new AudioContext();
let isPlaying = false;
var tempo = 120;
let current16thNote = 1;
let futureTickTime = 0.0;
let timerID = 0;//_______________________________________________________________
let track =[1, 3, 9];
let interval;

function futureTick(){
  var secondsPerBeat = 60/tempo;
  futureTickTime += 0.25 * secondsPerBeat;
}

function scheulder(){
  while(futureTickTime < audioCtx.currentTime + 0.1){
    futureTick();
    futureTickTime += 1;
    // console.log(audioCtx.currentTime);
    // console.log(futureTickTime);
  }
   interval = window.setTimeout(scheulder, 50);
}
scheulder();
//react does not like undefined....even in conditionals...
try{
  const AudioContext = window.AudioContext || window.webkitAudioContext || window.webkitAudioContext;
}
catch(err){
  console.log("Looks like you're using outdated technology");
}

class Sequencer extends Component {
  render() {
    return (
      <div>CHRIS
        <Osc audioCtx={audioCtx}/>
        <Sound audioCtx={audioCtx}/>
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

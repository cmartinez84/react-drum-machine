import React, { Component } from 'react';
import Tuna from 'tunajs';


export function generateTuna(audioCtx) {
  var tuna = new Tuna(audioCtx);
    var chorus = new tuna.Chorus({
       rate: 1.5,
       feedback: 0.2,
       delay: 0.0045,
       bypass: 0
     });
    var delay = new tuna.Delay({
      feedback: .4,    //0 to 1+
      delayTime: 2000,    //1 to 10000 milliseconds
      wetLevel: 0.25,    //0 to 1+
      dryLevel: 1,       //0 to 1+
      cutoff: 1000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
      bypass: 0
    });
    var bitcrusher = new tuna.Bitcrusher({
        bits: 16,          //1 to 16
        normfreq: 0.1,    //0 to 1
        bufferSize: 4096  //256 to 16384
    });
    var wahwah =  new tuna.WahWah({
        automode: true,                //true/false
        baseFrequency: 0.5,            //0 to 1
        excursionOctaves: 2,           //1 to 6
        sweep: 0.2,                    //0 to 1
        resonance: 10,                 //1 to 100
        sensitivity: 0.5,              //-1 to 1
        bypass: 0
    });
    var norm = new tuna.Gain({
      gain: 1 // 0 and up
    });

  //
  var pingPongDelay = new tuna.PingPongDelay({
      wetLevel: 0.5, //0 to 1
      feedback: 0.3, //0 to 1
      delayTimeLeft: 150, //1 to 10000 (milliseconds)
      delayTimeRight: 200 //1 to 10000 (milliseconds)
  });

  var overdrive = new tuna.Overdrive({
        outputGain: 0.4,         //0 to 1+
        drive: 0.3,              //0 to 1
        curveAmount: .1,          //0 to 1
        algorithmIndex: 4,       //0 to 5, selects one of our drive algorithms
        bypass: 0
    });
  var phaser = new tuna.Phaser({
      rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
      depth: 0.3,                    //0 to 1
      feedback: 0.2,                 //0 to 1+
      stereoPhase: 30,               //0 to 180
      baseModulationFrequency: 700,  //500 to 1500
      bypass: 0
  });

  var compressor = new tuna.Compressor({
      threshold: -1,    //-100 to 0
      makeupGain: 1,     //0 and up (in decibels)
      attack: 1,         //0 to 1000
      release: 0,        //0 to 3000
      ratio: 4,          //1 to 20
      knee: 5,           //0 to 40
      automakeup: true,  //true/false
      bypass: 0
  });
  var convolver = new tuna.Convolver({
      highCut: 22050,                         //20 to 22050
      lowCut: 20,                             //20 to 22050
      dryLevel: 1,                            //0 to 1+
      wetLevel: 1,                            //0 to 1+
      level: 1,                               //0 to 1+, adjusts total output of both wet and dry
      impulse: "impulses/impulse_rev.wav",    //the path to your impulse response
      bypass: 0
  });

  var tunaPackage ={norm, chorus, delay, bitcrusher, wahwah, convolver, compressor, phaser, overdrive, pingPongDelay}

  return tunaPackage;
}

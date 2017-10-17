import React, { Component } from 'react';

class Pad extends Component {
  audioCtx = this.props.audioCtx;
  isPlaying = false;
  isPressed = this.props.isPressed;


  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.beatToPlay == this.props._key){
      this.isPlaying = true;
    }
    else{
      this.isPlaying = false;
    }
  }
  //currently tiles onl reveal themselves once the next beat is measured out. this makes a change instantly
  changePressedStatusBeforeNextBeat = () =>{

  }
  // <button className={"pad" + (this.isPlaying ?' lit' : '') } onClick={this.props.onPadClick}>

  render() {

    return (
      <button className={`pad ${this.isPlaying ? 'lit':''} ${this.props.isPressed ? 'pressed': ''}`} onClick={this.props.onPadClick}>
      </button>

    );
  }
}

export default Pad;

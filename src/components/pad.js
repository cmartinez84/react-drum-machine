import React, { Component } from 'react';

class Pad extends Component {
  audioCtx = this.props.audioCtx;
  isPlaying = true;
  isPressed = false;
  isPoop = "poop";
  // isPressed={this.sequence[this.props.currentBar].includes(index + 1)


  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.beatToPlay == this.props._key ){
      this.isPlaying = true;

    }
    else{
      this.isPlaying = false;
    }
    if(nextProps.currentSequence.includes(this.props._key)){
      this.isPressed = true;
    }
    else{
      this.isPressed = false;
    }
  }
  //currently tiles onl reveal themselves once the next beat is measured out. this makes a change instantly
  onPadClick = () =>{
    this.isPressed = !this.isPressed;
    this.props.onPadClick();
    console.log("ouch");
  }
  // <button className={"pad" + (this.isPlaying ?' lit' : '') } onClick={this.props.onPadClick}>

  render() {

    return (
      <button className={`pad ${this.isPlaying ? 'lit':''} ${this.isPressed ? 'pressed': ''}`} onClick={this.onPadClick}>
      </button>


    );
  }
}

export default Pad;

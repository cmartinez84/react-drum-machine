import React, { Component } from 'react';

class Pad extends Component {
  audioCtx = this.props.audioCtx;
  isPlaying = false;

  componentWillReceiveProps=(nextProps)=>{
    if(nextProps.beatToPlay == this.props._key){
      this.isPlaying = true;
    }
    else{
      this.isPlaying = false;
    }
  }
  // <button className={"pad" + (this.isPlaying ?' lit' : '') } onClick={this.props.onPadClick}>

  render() {

    return (
      <button className={`pad ${this.isPlaying && 'lit'} ${this.props.isPressed && 'pressed'}`} onClick={this.props.onPadClick}>
        <p>{this.props.name} {this.props._key}</p>
        <p>{this.props.isPlaying.toString()}</p>
        <p>{this.props.path}</p>
      </button>

    );
  }
}

export default Pad;

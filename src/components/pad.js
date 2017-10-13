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

  render() {

    return (
      <button className={"pad" + (this.isPlaying ?' lit' : '')} onClick={this.props.onPadClick}>
        <p>{this.props.name} {this.props._key}</p>
        <p>{this.props.current16thNote}</p>
      </button>

    );
  }
}

export default Pad;

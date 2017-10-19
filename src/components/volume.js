import React, { Component } from 'react';

class Volume extends Component {



handleGainChange = (e) =>{
  var newGain = e.target.value;
  var instIndex = this.props.instIndex;
  this.props.handleGainChange(newGain, instIndex);
}

  render() {
    return (
      <div className="instrument-volume">
        <p className="instrument-volume">Volume</p>
        <input name="instrument-volume" className="volume-slider" type="range" min="0" max="1" step=".01" onChange={this.handleGainChange} />
      </div>
    );
  }
}

export default Volume;
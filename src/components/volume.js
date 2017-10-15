import React, { Component } from 'react';

class Volume extends Component {



handleGainChange = (e) =>{
  var newGain = e.target.value;
  this.props.handleGainChange(newGain);
}

  render() {
    return (
      <div>
        <label for="instrument-volume">Instrument Volume</label>
        <input name="instrument-volume" className="volume-slider" type="range" min="0" max="1" step=".01" onChange={this.handleGainChange} />
      </div>
    );
  }
}

export default Volume;

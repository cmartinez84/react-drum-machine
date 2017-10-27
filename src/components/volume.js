import React, { Component } from 'react';
import Knob from 'svg-knob';



// console.log(chris);
class Volume extends Component {
componentDidMount= ()=>{
  new Knob(`#knob${this.props.instIndex}`, {
    label: true,
    bg: true,
    bg_color: 'transparent',
    bg_radius: 30,
    bg_border_width: 1,
    bg_border_color: 'white',
    track: true,
    // track_bg: 'black',
    track_color: "#FB1F7D",
    track_width: 7,
    track_color_init: '#FB1F7D',
    cursor: true,
    cursor_radius: 50,
    cursor_width: 10,
    cursor_length: 0,
    cursor_color_init: '#FB1F7D',
    cursor_color: '#FB1F7D',
    linecap: 'round',
    markers: 30,
    markers_radius: 39,
    markers_length: 3,
    markers_width: 1,
    markers_color: 'white',
    initial_value: 100,
    palette: 'dark',
    // class_cursor : 'knob-cursor',
    cursor_radius: 1,          // same unit as radius
    cursor_length: 15,
    cursor_width: 8,
    class_cursor : 'knob-cursor',
    value_position: 96,
    font_size: 15,
    // font_color: 'green'
    font_family: 'sans-serif',
    onchange: this.handleGainChange

  });
}
handleGainChange = (e) =>{
  var newGain = e/100;
  var instIndex = this.props.instIndex;
  this.props.handleGainChange(newGain, instIndex);
}
// <input name="instrument-volume"
//   className="volume-slider"
//   type="range"
//   min="0"
//   max="1"
//   step=".01"
//   onChange={this.handleGainChange} />

  render() {
    return (
      <div className="instrument-volume">
        <svg id={`knob${this.props.instIndex}`}
        >
        </svg>

      </div>
    );
  }
}

export default Volume;

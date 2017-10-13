import React, { Component } from 'react';

class Knob extends Component {

handleTempoChange= (e)=>{
  this.props.onTempoChange(e.target.value);
}
setTempo = () =>{
  const tempoRange = document.getElementById('tempoRange');
}

  render() {
    return (
      <div>
        <input id="tempoRange" type="range" min="10" max="200"   className="slider-width" onChange={ this.handleTempoChange}/>
        {this.setTempo()}
      </div>
    );
  }
}

export default Knob;

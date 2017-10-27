import React, { Component } from 'react';


class TapButton extends Component {

onTap= ( )=>{
  const instKey = this.props.instIndex;
  this.props.onTap(instKey);
}
  render() {
    return (
      <div className="tap-button">
        <button onClick={this.onTap}>TAP</button>
      </div>
    );
  }
}

export default TapButton;

import React, { Component } from 'react';

class Pad extends Component {
  isMouseDown: false;

  constructor(props){
    super(props);
    this.state = {
      isPressed: false,
      isPlaying: false,
    }
  }
  componentDidMount(){

  }

  componentWillReceiveProps=(nextProps)=>{
    var sequenceToDisplay = nextProps.sequenceToDisplay;
    var isLockedBarPlaying = !nextProps.isBarViewLocked || this.props.currentBar === this.props.indexOfLockedBar;
      if(nextProps.beatToPlay == this.props._key  && isLockedBarPlaying){
        this.setState({isPlaying: true});
      }
      else{
        this.setState({isPlaying: false});
      }
      if(sequenceToDisplay.includes(this.props._key)){
        this.setState({isPressed: true});
      }
      else{
        this.setState({isPressed: false});
      }
    }
  //currently tiles onl reveal themselves once the next beat is measured out. this makes a change instantly
  onPadClick = () =>{
    //prevents needing to wiat for next beat to update pad pressed
    if(this.props.isBarViewLocked){
      var sequenceIndex = this.props.indexOfLockedBar;
    }
    else{
      var sequenceIndex = this.props.currentBar;
    }
    this.setState({isPressed: !this.state.isPlaying});
    this.props.onPadClick(this.props._key, sequenceIndex);
  }
  onMouseOver = (e) => {
    if(this.props.isMouseDown){
      this.onPadClick();
    }
  }
  flagMouseDown= () =>{
    this.isMouseDown = !this.isMouseDown;
  }

  render() {

    return (
      <button
        className={`pad ${this.state.isPlaying === true ? 'lit':''}
                        ${this.state.isPressed ? 'pressed': ''}
                        ${this.props._key % 4 === 0 && 'bar-end'}`
                  }
        onClick={this.onPadClick}
        onMouseOver={this.onMouseOver}
        >
      </button>


    );
  }
}

export default Pad;

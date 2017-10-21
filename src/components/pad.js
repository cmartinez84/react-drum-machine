import React, { Component } from 'react';

class Pad extends Component {

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
    if(nextProps.beatToPlay == this.props._key ){
      this.setState({isPlaying: true});
    }
    else{
      this.setState({isPlaying: false});
    }
    if(nextProps.currentSequence.includes(this.props._key)){
      this.setState({isPressed: true});
    }
    else{
      this.setState({isPressed: false});
    }
  }

  //currently tiles onl reveal themselves once the next beat is measured out. this makes a change instantly
  onPadClick = () =>{
    //prevents needing to wiat for next beat to update pad pressed
    this.setState({isPressed: !this.state.isPlaying});
    this.props.onPadClick();
  }


  render() {

    return (
      <button
        className={`pad ${this.state.isPlaying === true ? 'lit':''} ${this.state.isPressed ? 'pressed': ''} ${this.props._key % 4 === 0 && 'bar-end'}`}
        onClick={this.onPadClick}>
      </button>


    );
  }
}

export default Pad;

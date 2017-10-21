import React, { Component } from 'react';

class BarCounter extends Component {


  constructor(props){
    super(props);
    this.state = {
      isPressed: [],
    }
  }

  onBarNumberClick = (barIndex) => {
    // this.props.scheduleBarChange(barIndex);
    this.props.toggleBarSequence(barIndex);
    this.togglePressed(barIndex);

  }
  ///use immmutable JS in future
  togglePressed =(index) =>{
    var stateIsPressed = this.state.isPressed;
    if(stateIsPressed.includes(index)){
      var foundIndex = stateIsPressed.indexOf(index);
      stateIsPressed.splice(foundIndex, 1);
    }
    else{
      stateIsPressed.push(index);
    }
    this.setState({isPressed: stateIsPressed});
  }

  render() {
    const chris = "chris";
    return (
      <div>
        <div className="bar-counter-row"></div>
        {this.props.barSequence.map((i, index)=>
          <button
            className={`bar-counter  ${this.props.currentBar === index && "bar-counter-lit"} ${this.state.isPressed.includes(index) && 'bar-counter-pressed'}`}
            key={index}
            onClick={()=>{this.onBarNumberClick(index)}}>{index + 1} </button>

          )
        }
      </div>

    );
  }
}

export default BarCounter;

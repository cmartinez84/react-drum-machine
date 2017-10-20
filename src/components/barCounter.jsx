import React, { Component } from 'react';

class BarCounter extends Component {

  dummyArray = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6];
  spaceArray = [3, 7, 11];
  numberOfbarsInTrack = this.props.barsIndexCount +1;

  constructor(props){
    super(props);
    this.state = {
      isPressed: [],
    }
  }

  onBarNumberClick = (barIndex) => {
    this.props.scheduleBarChange(barIndex);
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
      <div>{chris}
        <div className="bar-counter-row"></div>
        {Array.apply(null, Array(this.numberOfbarsInTrack)).map((i, index)=>
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

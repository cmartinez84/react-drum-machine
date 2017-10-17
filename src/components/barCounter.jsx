import React, { Component } from 'react';

class BarCounter extends Component {

  dummyArray = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6];
  spaceArray = [3, 7, 11];
  numberOfbarsInTrack = this.props.barsIndexCount +1;

  onBarNumberClick = (barIndex) => {
    this.props.scheduleBarChange(barIndex);
  }
  render() {
    return (
      <div>
        Bar Counter
        {Array.apply(null, Array(this.numberOfbarsInTrack)).map((i, index)=>
          <span
            className={`bar-counter + ${this.props.currentBar === index && "bar-counter-lit"}`}
            key={index}
            onClick={()=>{this.onBarNumberClick(index)}}>{index + 1} </span>
          )
        }
      </div>

    );
  }
}

export default BarCounter;

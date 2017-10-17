import React, { Component } from 'react';

class BeatCounter extends Component {

  dummyArray = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6];
  spaceArray = [3, 7, 11];

  render() {
    return (
      <div>
        <div className="beat-counter-filler inline"> </div>
          <div className="beat-dots-container inline">
            {this.dummyArray.map((beep, index)=>
              <span className={`beatTracker ${this.props.current16thNote == index + 1 && "beatLit"}` }>. {this.spaceArray.includes(index) && ""}</span>
              )
            }
          </div>
      </div>
    );
  }
}

export default BeatCounter;

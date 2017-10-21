import React, { Component } from 'react';

class BarViewControl extends Component {


  constructor(props){
    super(props);
    this.state = {
      isActive: false,
      indexOfLockedBar: 2,
    }
  }
  componentWillReceiveProps=(nextProps)=>{
    var newBar = nextProps.currentBar;
  }
  toggleViewLock = () =>{
    this.setState({isActive: !this.state.isActive});
    this.props.lockBarView(this.state.indexOfLockedBar);
    console.log(this.props);
  }
  render() {
    return (
      <div>
        <button className={` ${this.state.isActive && "bar-lock-active"}`}onClick={this.toggleViewLock}>View Bar</button>
        <p>
          <span>&larr;</span>
            <button>
              {this.state.indexOfLockedBar}
              </button>
              <span>&rarr;</span>
        </p>
      </div>
    );
  }
}

export default BarViewControl;

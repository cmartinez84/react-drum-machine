import React, { Component } from 'react';

class BarViewControl extends Component {


  constructor(props){
    super(props);
    this.state = {
      isActive: false,
      indexOfLockedBar: 0,
    }
  }
  // componentWillReceiveProps=(nextProps)=>{
  //   var newBar = nextProps.currentBar;
  // }
  toggleViewLock = () =>{
    this.setState({isActive: !this.state.isActive});
    this.props.lockBarView(this.state.indexOfLockedBar);
  }
  changeBarView =(e)=>{
    var direction = parseInt(e.target.dataset.direction);
    this.props.changeBarView(direction);
  }
  //dadadads
  render() {
    return (
      <div>
        <button className={` ${this.state.isActive && "bar-lock-active"}`}
                onClick={this.toggleViewLock}>View Bar</button>
        <p>
          <span data-direction="-1"
                onClick={this.changeBarView}>&larr;</span>
            <button>
              {this.props.indexOfLockedBar}
            </button>
              <span data-direction="1" onClick={this.changeBarView}>&rarr;</span>
        </p>
      </div>
    );
  }
}

export default BarViewControl;

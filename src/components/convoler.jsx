import React, { Component } from 'react';

class Convolver extends Component {

filterParams = {type:''};

handleConvolverChange = (e) =>{
    this.filterParams.type = e.target.value;
    console.log(this.filterParams);
    this.props.handleConvolverChange(this.filterParams);
}

  render() {
    return (
      <div>
      <label>Convolver Type</label>
      <select type="filter-type" onChange={this.handleConvolverTypeChange}>
        <option value="lowpass">Lowpass</option>
        <option value="highPass">Highpass</option>
        <option value="bandPass">Bandass</option>
        <option value="lowshelf">Lowshelf</option>
        <option value="highshelf">Highshelf</option>
        <option value="peaking">Peaking</option>
        <option value="notch">Notch</option>
      </select>
      </div>
    );
  }
}

export default Convolver;

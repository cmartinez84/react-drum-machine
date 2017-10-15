import React, { Component } from 'react';

class Filter extends Component {

filterParams = {type:''};

handleFilterTypeChange = (e) =>{
    // this.filterParams.type = e.target.value;
    console.log(this.filterParams);
    // this.props.handleFilterChange(this.filterParams);
}

  render() {
    return (
      <div>
      <label>Filter Type</label>
      <select type="filter-type" onChange={this.handleFilterTypeChange}>
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

export default Filter;

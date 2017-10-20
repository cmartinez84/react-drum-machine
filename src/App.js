import React, { Component } from 'react';
import Sequencer from './components/sequencer';
import logo from './logo.svg';

import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">

        <header className="App-header" >
          <h1 className="App-title">JS-BEAT 1000</h1>
        </header>
            <Sequencer/>
      </div>
    );
  }
}

export default App;

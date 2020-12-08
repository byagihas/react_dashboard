import React, { Component } from 'react';
import './App.css';

import Dashutils from './Dashutils/Dashutils.js';
import Markets from './Markets/Markets.js';
import Weather from './Weather/Weather.js';
import News from './News/News.js';

const { DateTime } = require('luxon');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  };
   // On component mount/view load
   componentDidMount(){
      // Set spinner at 2 seconds to allow for loading.
      window.setTimeout(() => {
          document.getElementById('root').style.display = 'block';
          document.getElementById('spinner').style.display = 'none';
      }, 2000);
  };
  render() {
        return (
          <div className="App">
              <header className="App-header">
                  <Dashutils />
                  <Weather/>
                  <News />
                  <Markets />
              </header>
          </div>
        );
  };
};

export default App;
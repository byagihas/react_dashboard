
'use strict';

import React, { Component } from 'react';
import Markets from './Markets.js';
import logo from './logo.svg';
import './App.css';

const { DateTime } = require('luxon');
class App extends Component {
  // Constructor
  constructor(props) {
    const time = new Date(Date.now()).toISOString();
    const localetime = new Date(Date.now()).toUTCString();
    const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const converted = DateTime.fromISO(time, { zone: browsertime });

    let year = converted.c.year;
    let month = String(converted.c.month).length > 1 ? converted.c.month : '0' + converted.c.month;
    let day = String(converted.c.day).length > 1 ? converted.c.day : '0' + converted.c.day;
    let hour = String(converted.c.hour).length > 1 ? converted.c.hour : '0' + converted.c.hour;
    let minute = String(converted.c.minute).length > 1 ? converted.c.minute : '0' + converted.c.minute;
    let second = String(converted.c.second).length > 1 ? converted.c.second : '0' + converted.c.second;
    let timeFormat = year  + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second;

    super(props);
    this.state = {
      currentBrowserTime: "Loading...",
      currentDate: timeFormat,
      currentDateLocale: localetime,
      urlTraced: null,
      weather: null
    }
  }
  // compentDidMount
  // initialize time
   componentDidMount(){
      const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let location = browsertime.substring(browsertime.indexOf("/"), browsertime.length + 1);
      // Using weather API's free service to get token
      let WEATHERKEY = '';
      let weatherAPI = `https://api.weatherapi.com/v1/current.json?key=${WEATHERKEY}&q=${location}`;
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      
      fetch(weatherAPI, requestOptions)
      .then(response => response.json())
      .then(json => {
        this.setState({ weather: json.current.temp_f});
      });

    window.setInterval(function() {
      const time = new Date(Date.now()).toISOString();
      const localetime = new Date(Date.now()).toUTCString();
      const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const converted = DateTime.fromISO(time, { zone: browsertime });

      let year = converted.c.year
      let month = String(converted.c.month).length > 1 ? converted.c.month : '0' + converted.c.month;
      let day = String(converted.c.day).length > 1 ? converted.c.day : '0' + converted.c.day;
      let hour = String(converted.c.hour).length > 1 ? converted.c.hour : '0' + converted.c.hour;
      let minute = String(converted.c.minute).length > 1 ? converted.c.minute : '0' + converted.c.minute;
      let second = String(converted.c.second).length > 1 ? converted.c.second : '0' + converted.c.second;

      let timeFormat = year  + '/' + month + '/' + day + ' ' + hour + ':' + minute + ':' + second
    
      this.setState({
        currentBrowserTime: browsertime,
        currentDate: timeFormat,
        currentDateLocale: localetime
      });
    }.bind(this), 1000);
  }

  render() {
    const { currentDate } = this.state;
    const { currentDateLocale } = this.state;
    const { currentBrowserTime } = this.state;
    const { weather } = this.state;
    return (
      
      <div className="App">
        <header className="App-header">
          <table classname="App-table">
            <tr><strong>Time/Weather: </strong></tr>
            <tr>
              <td>
               Current locale time({currentBrowserTime}): {currentDate}
              </td>
            </tr>
            <tr>
              <td>
               Current UTC time: {currentDateLocale}
              </td>
            </tr>
            <tr>
              <td>
                Current temperature: {weather} F
              </td>
            </tr>
          </table>
        </header>
      </div>
    );
  } 
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const { DateTime } = require('luxon')

class App extends Component {

  constructor(props) {
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

    super(props);
    this.state = {
      currentBrowserTime: 'America/Chicago',
      currentDate: timeFormat,
      currentDateLocale: localetime,
      urlTraced: null
    }
  }

  componentDidMount(){
    window.setInterval(function() {
      /*
      fetch("http://localhost:8080/")
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this.setState({
          currentDate: json.year  + '/' + json.month + '/' + json.day + ' ' + json.hour + ':' + json.minute + ':' + json.second
        });
      });*/
      
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
      
    }.bind(this), 1000)
  }

  render() {
    const { currentDate } = this.state;
    const { currentDateLocale } = this.state;
    const { currentBrowserTime } = this.state;
    return (
      
      <div className="App">
        <header className="App-header">
        <h2>Current time</h2>
          <table classname="App-table">
            <tr>
              <td>
               Current locale time({currentBrowserTime}): {currentDate}
              </td>
              <br/>
            </tr>
            <br/>
            <tr>
              <td>
               Current UTC time: {currentDateLocale}
              </td>
            </tr>
          </table>
        </header>
      </div>
    );
  } 
}

export default App;

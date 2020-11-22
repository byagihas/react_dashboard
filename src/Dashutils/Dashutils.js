import React, { Component } from 'react';
import './Dashutils.css';

const { DateTime } = require('luxon');

class Dashutils extends Component {
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
      currentBrowserTime: "Loading..",
      currentDate: timeFormat,
      currentDateLocale: localetime,
    };
  };
   // On component mount/view load
   componentDidMount(){
      // Set spinner at 2 seconds to allow for loading.
      window.setTimeout(() => {
          document.getElementById('root').style.display = 'block';
          document.getElementById('spinner').style.display = 'none';
      }, 2000);
      // Run datetime every second
      window.setInterval(function() {
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
          this.setState({
              currentBrowserTime: browsertime,
              currentDate: timeFormat,
              currentDateLocale: localetime
          });
      }.bind(this), 1000);
  };
  render() {
        const { currentDate } = this.state;
        const { currentDateLocale } = this.state;
        const { currentBrowserTime } = this.state;
        return (
          <div className="Dashutils">
              <header className="Dashutils-header">
                  <table className="Dashutils-table">
                      <tbody>
                        <tr>
                          <td>
                            Locale time: ({currentBrowserTime}): {currentDate}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            UTC time: {currentDateLocale}
                          </td>
                        </tr>
                      </tbody>
                  </table>
              </header>
          </div>
        );
  };
};

export default Dashutils;
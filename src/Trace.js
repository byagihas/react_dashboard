import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const request = require('request');

class Trace extends Component {

  // Constructor
  constructor(props) {
    let urlToVisit = props.urlToVisit;
    
    super(props);
    this.state = {
      urlToVisit: null,
      urlTraced: null
    }
  }
  // compentDidMount
  // initialize time
  componentDidMount(){
    
  }

  onSubmit(props){
    this.state = {
      urlToVisit: props.url,
      urlTraced: urlData()
    }
    let urlData = request({
      url: visitUrl,
      method: 'GET',
      followAllRedirects: true
    }, (error, response, body) => {
        if (error) {
            console.log(error);
            return null;
        } else {
            response.setEncoding('binary');
            data = JSON.stringify(response.request._redirect.redirects);
            console.log(body)
            return data;
        }
    });
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
               Trace URL
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

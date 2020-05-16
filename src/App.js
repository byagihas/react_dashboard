import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const { DateTime } = require('luxon');
const encoding_f = require('encoding');
const cheerio = require('cheerio');

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
      currentBrowserTime: "Loading..",
      currentDate: timeFormat,
      currentDateLocale: localetime,
      urlTraced: '',
      weather_current: "...",
      weather_h : '...',
      weather_l : '...',
      markets_dji_m: '...',
      markets_dji_p: '...',
      markets_nasdaq_m: '...',
      markets_nasdaq_p: '...',
      news_general: null,
      news_timestamp: null
    };
  };
  // compentDidMount
  // initialize time
   componentDidMount(){
      const browsertime = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let location = browsertime.substring(browsertime.indexOf("/"), browsertime.length + 1);
      let weathercode = '2379574';

      let encoding = 'UTF-8';
      const headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language' : 'en-US, en;q=0.5',
        'DNT' : '1',
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'X-Requested-With' : Math.random() // Sending random value for required CORS reroute
      };

      // getWeather
      // Fetch and parse data for weather
      const getWeather = function(code){
          let weatherURL = `https://cors-anywhere.herokuapp.com/https://www.yahoo.com/news/weather/united-states/new-york/new-york-${code}`;
          fetch(weatherURL, headers)
          .then((response) => { 
              return response.text();
          }).then(html => {
              const $ = cheerio.load(encoding_f.convert(html, encoding).toString('utf8'), encoding);
              let string_t = JSON.stringify($('.now > span').first().contents().text()).replace('"','').replace('"','') + '°';
              let string_h = JSON.stringify($('.high-low > span').first().contents().text()).replace('"','').replace('"','');
              let string_l = JSON.stringify($('.high-low > span').last().contents().text()).replace('"','').replace('"','');

              this.setState({ 
                weather_current: string_t,
                weather_h : string_h,
                weather_l : string_l
              });
          }).catch((err) => console.error(err));
      }.bind(this);

      // getMarkets
      // Fetch and parse data for markets
      const getMarkets = function(){
        fetch('https://cors-anywhere.herokuapp.com/https://www.marketwatch.com/?=&=', headers)
        .then((response) => { 
            return response.text();
        }).then(html => {
            const $ = cheerio.load(encoding_f.convert(html, encoding).toString('utf8'), encoding);
            let string_full_m = JSON.stringify($('.price').contents().map(function(){
              let formatted = $(this).text().replace('\n', ' ').replace('\\s','').replace(' ','').trim();
              if(formatted != ''){
                return formatted + '|';
              };
            }).get().join('').split(' ').join(''));
            let string_full_p = JSON.stringify($('.percent').contents().map(function(){
              let formatted = $(this).text().replace('\n', ' ').replace('\\s','').replace(' ','').trim();
              if(formatted != ''){
                return formatted + '|';
              }
            }).get().join('').split(' ').join(''));

            let string_formatted_m = string_full_m.split("|");
            let string_formatted_p = string_full_p.split("|");

            this.setState({ 
              markets_dji_m: '$' + string_formatted_m[0], 
              markets_dji_p: string_formatted_p[0],
              markets_nasdaq_m: '$' + string_formatted_m[2],
              markets_nasdaq_p: string_formatted_p[2],
            });
        }).catch((err) => console.error(err));
      }.bind(this);

      // getNews
      //  Fetch and parse data for news
      const getNews = function(){
        fetch('https://cors-anywhere.herokuapp.com/https://www.reuters.com/theWire?=&=', headers)
          .then((response) => { 
            return response.text();
          }).then(body => {
            const $ = cheerio.load(encoding_f.convert(body, encoding).toString('utf8'), encoding);
            let news_string = JSON.stringify($('.FeedItemHeadline_headline  > a').contents().map(function(){
                return $(this).text();
            }).get().join('|'));
            let time_string = JSON.stringify($('.FeedItemMeta_date-updated').contents().map(function(){
              return $(this).text();
            }).get().join('|'));
            let news_formatted = news_string.split('\"').join('').split('|');
            let time_formatted = time_string.split('\"').join('').split('|');
            const news = (arr1, arr2) => {
              let limit = 20;
              return (
                arr1.map((item, index) => (
                  index < limit ? <li key={index}>{item} - {arr2[index]}</li> : ''
                ))
              )
            }
            this.setState({ news_general: news(news_formatted, time_formatted)});
          }).catch((err) => console.error(err));
      }.bind(this);

      // Run data functions once
      getMarkets();
      getWeather(weathercode);
      getNews();

      // Set spinner at 2 seconds to allow for loading.
      window.setTimeout(() => {
        document.getElementById('root').style.display = 'block';
        document.getElementById('spinner').style.display = 'none';
      }, 2000);

      // Run data streams at intervals
      window.setInterval(function() {
        getWeather(weathercode);
      }.bind(this), 60000);

      window.setInterval(function() {
        getNews();
      }.bind(this), 60000);

      window.setInterval(function() {
        getMarkets();
      }.bind(this), 60000);

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
  }

  render() {
    const { currentDate } = this.state;
    const { currentDateLocale } = this.state;
    const { currentBrowserTime } = this.state;
    const { weather_current } = this.state;
    const { weather_h } = this.state;
    const { weather_l } = this.state;
    const { markets_dji_m } = this.state;
    const { markets_dji_p } = this.state;
    const { markets_nasdaq_m } = this.state;
    const { markets_nasdaq_p } = this.state;
    const { headers } = this.state;
    const { news_general } = this.state;
    const { news_timestamp } = this.state;

    let dji_percentage = 'neutral';
    let nasdaq_percentage = 'neutral';
    parseInt(markets_dji_p) < 0 ? dji_percentage = 'red' : dji_percentage = 'green';
    parseInt(markets_nasdaq_p) < 0 ? nasdaq_percentage = 'red' : nasdaq_percentage = 'green';

   return (
      <div className="App">
        <header className="App-header">
          <table class="App-table">
              <th>
                  <strong>QuBoard</strong>
              </th>
              <tbody>
                <td>
                  Locale time: ({currentBrowserTime}): {currentDate}
                </td>
                <td>
                  UTC time: {currentDateLocale}
                </td>
                <td>
                Current temperature: {weather_current.replace('"','').replace('"','')} F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </td>
                <td>H: {weather_h.replace('"','').replace('"','')} F &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>L: {weather_l.replace('"','').replace('"','')} F</td>
              </tbody>
            </table>
          <br/>
          <table classname="App-table">
            <th><strong>Markets</strong></th>
              <tbody>
                <tr>
                  <td>Dow Jones: {markets_dji_m.replace('"','').replace('"','')}&nbsp;&nbsp;
                  <span style={{color: dji_percentage }}>{markets_dji_p.replace('"','').replace('"','')}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>NASDAQ: {markets_nasdaq_m.replace('"','').replace('"','')}&nbsp;&nbsp;
                  <span style={{color: nasdaq_percentage }}>{markets_nasdaq_p.replace('"','').replace('"','')}</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </td>
                  <td>S&P 500: </td>
                </tr>
              </tbody>
          </table>
          <br/>
          <table classname="App-table">
            <th><strong>News</strong></th>
            <tbody>
              <tr>
                <ul>
                 { news_general }
                </ul>
              </tr>
            </tbody>
          </table>
      </header>
      </div>
    );
  } 
}

export default App;
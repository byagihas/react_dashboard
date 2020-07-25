import React, { Component } from 'react';
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
      zipcode: null,
      currentBrowserTime: "Loading..",
      currentDate: timeFormat,
      currentDateLocale: localetime,
      weather_current: "...",
      short_forecast: '...',
      detailed_forecast: '...',
      markets_dji_m: '...',
      markets_dji_p: '...',
      markets_nasdaq_m: '...',
      markets_nasdaq_p: '...',
      news_general: null,
      crypto_name: null,
      crypto_price: null,
      lat_long: null
    };
  };
  // compentDidMount
  // initialize time
   componentDidMount(){

      let encoding = 'UTF-8';
      let headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language' : 'en-US, en;q=0.5',
        'DNT' : '1',
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'X-Requested-With' : Math.random(),// Sending random value for required CORS reroute
        'Access-Control-Allow-Origin' : '*'
      };

      // get Lat Long from User and Run weather function
      const getLatLong = function(){ 
        navigator.geolocation.getCurrentPosition(
            function(position){
              this.setState({ 
                lat_long: position.coords.latitude + "," + position.coords.longitude
              });
              getWeatherNWS(this.state.lat_long);
            }.bind(this)
        );
      }.bind(this);

      // getWeather using lat long
      // Weather API
      const getWeatherNWS = function(latlong){
          let weatherAPI = `https://api.weather.gov/points/${latlong}`;
          fetch(weatherAPI, headers)
          .then((response) => { 
              return response.json();
          }).then(json => {
                let forecast = json.properties.forecast;
                fetch(forecast, headers)
                .then((response) => { 
                    return response.json();
                }).then(json => {
                    let temp = json.properties.periods[0].temperature;
                    let short_forecast = json.properties.periods[0].shortForecast;
                    let detailed_forecast = json.properties.periods[0].detailedForecast;
                    this.setState({ 
                      weather_current: temp,
                      short_forecast: short_forecast,
                      detailed_forecast: detailed_forecast
                    });
                }).catch((err) => console.error(err));
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
              return formatted !== '' ? formatted + '|' : '';
            }).get().join('').split(' ').join(''));
            let string_full_p = JSON.stringify($('.percent').contents().map(function(){
              let formatted = $(this).text().replace('\n', ' ').replace('\\s','').replace(' ','').trim();
              return formatted !== '' ? formatted + '|' : '';
            }).get().join('').split(' ').join(''));
            let string_full_name = JSON.stringify($('.symbol').contents().map(function(){
              let formatted = $(this).text().replace('\n', ' ').replace('\\s','').replace(' ','').trim();
              return formatted !== '' ? formatted + '|' : '';
            }).get().join('').split('"').join('').split(' ').join(''));

            let string_formatted_m = string_full_m.replace('"','').split("|");
            let string_formatted_p = string_full_p.replace('"','').split("|");
            let string_formatted_name = string_full_name.replace('"','').split("|");

            const markets = (arr1, arr2, arr3) => {
              let limit = 6;
              return (
                arr1.map((item, index) => (
                  index < limit ? <li key={index}>{arr3[index]}: {item} - {arr2[index]}</li> : ''
                ))
              );
            };
            this.setState({ markets_dji_m: markets(string_formatted_m, string_formatted_p, string_formatted_name) });
        }).catch((err) => console.error(err));
      }.bind(this);
      // Crypto
      const getCrypto = function(){
        fetch('https://cors-anywhere.herokuapp.com/https://www.coinmarketcap.com/?=&=', headers)
        .then((response) => { 
            return response.text();
        }).then(html => {
            const $ = cheerio.load(encoding_f.convert(html, encoding).toString('utf8'), encoding);
            let string_full_price = JSON.stringify($('.cmc-table__cell--sort-by__price > a').contents().map(function(){
              let formatted = $(this).text().replace('\n', ' ').replace('\\s','').replace(' ','').trim();
              return formatted !== '' ? formatted + '|' : '';
            }).get().join('').split('"').join('').split(' ').join(''));
            let string_full_name = JSON.stringify($('.cmc-table__cell--sort-by__name > div > a').contents().map(function(){
              let formatted = $(this).text().replace('\n', ' ').replace('\\s','').replace(' ','').trim();
              return formatted !== '' ? formatted + '|' : '';
            }).get().join('').split('"').join('').split(' ').join(''));

            let string_f_name = string_full_name.split('"').join('').split('|');
            let string_f_price = string_full_price.split('"').join('').split('|');
            const crypto = (arr1, arr2) => {
              let limit = 6;
              return (
                arr1.map((item, index) => (
                  index < limit ? <li key={index}>{index + 1}. {item} - {arr2[index]}</li> : ''
                ))
              )
            };
            this.setState({
              crypto_name: crypto(string_f_name,string_f_price)
            });
        }).catch((err) => console.error(err));
      }.bind(this);

      //  NEWS Function
      //  Fetch and parse data for news
      const getNews = function(news_length, latlong){
        // https://newsapi.org/docs/get-started
        let country = 'us';
        let newsApiKey = 'a62a3c4e840a4b5091463ed1ecc5e0e6';
        var newsURL = `http://newsapi.org/v2/top-headlines?country=${country}&apiKey=${newsApiKey}`;
        fetch(newsURL, headers)
          .then((response) => { 
            return response.json();
          }).then(json => {
            let headlines = [];
            for(let i=0;i<news_length;i++){
              headlines.push(<tr key={i}><td><a href={json.articles[i].url}><img src={json.articles[i].urlToImage} width='100' height='60' alt=''/><span>{json.articles[i].title}</span></a></td></tr>);
            };
            this.setState({ news_general: headlines });
          }).catch((err) => console.error(err));
      }.bind(this);

      // Run data functions once
      getLatLong();
      getMarkets();
      getCrypto();
      getNews(10);

      // Set spinner at 2 seconds to allow for loading.
      window.setTimeout(() => {
        document.getElementById('root').style.display = 'block';
        document.getElementById('spinner').style.display = 'none';
      }, 2000);

      // Run data streams at intervals
      window.setInterval(function() {
        getNews();
      }, 60000);

      window.setInterval(function() {
        getWeatherNWS(this.state.lat_long);
        getMarkets();
      }.bind(this), 120000);

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
    const { lat_long } = this.state;
    const { currentDate } = this.state;
    const { currentDateLocale } = this.state;
    const { currentBrowserTime } = this.state;
    const { weather_current } = this.state;
    //const { short_forecast } = this.state;
    const { markets_dji_m } = this.state;
    //const { markets_dji_p } = this.state;
    //const { markets_nasdaq_m } = this.state;
    //const { markets_nasdaq_p } = this.state;
    const { news_general } = this.state;
    //const { news_timestamp } = this.state;
    const { crypto_name } = this.state;
    //const { crypto_price } = this.state;
    const { detailed_forecast } = this.state;

   return (
      <div className="App">
        <header className="App-header">
          <table className="App-table">
              <tbody>
                <tr>
                  <th>
                      <h1><strong>QuBoard</strong></h1>
                  </th>
                </tr>
                <tr>
                  <td>
                    Lat/long: {lat_long}
                  </td>
                </tr>
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
          <table className="App-table">
            <tbody>
              <tr>
                  <td>
                    Current temperature: {weather_current} F
                  </td>
              </tr>
              <tr>
                  <td>
                    Current forecast: {detailed_forecast}
                  </td>
              </tr>
            </tbody>
          </table>
        </header>
        <div className="body">
          <table className="App-table">
            <tbody>
              <tr>
                <th>
                  <h2><strong>Markets</strong></h2>
                </th>
              </tr>
              <tr>
                <td>General: <ul>{markets_dji_m}</ul></td>
                <td>Crypto: <ul>{crypto_name}</ul></td>
              </tr>
            </tbody>
          </table>
          <table className="App-table">
              <tbody>
                <tr>
                  <th>
                    <h2><strong>News</strong></h2>
                  </th>
                </tr>
                { news_general }
              </tbody>
          </table>
        </div>
      </div>
    );
  };
};

export default App;
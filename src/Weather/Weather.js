import React, { Component } from 'react';
import './App.css';

const { DateTime } = require('luxon');
const encoding_f = require('encoding');
const cheerio = require('cheerio');

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
          zipcode: null,
          weather_current: "...",
          short_forecast: '...',
          detailed_forecast: '...'
        };
    };

    componentDidMount(){
        const encoding = 'UTF-8';
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
                    const forecast = json.properties.forecast;
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
    };
    getLatLong();
    //window.setInterval(function() {}, 60000);
    render(){
        const { lat_long } = this.state;
        const { weather_current } = this.state;
        return (
            <div className="Weather">
                <table className="App-table">
                    <tbody>
                        <tr>
                        <th>
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
            </div>
        );
    };
};
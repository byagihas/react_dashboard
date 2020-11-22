import React, { Component } from 'react';
import './Weather.css';

class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
          lat_long: null,
          zipcode: null,
          weather_current: "...",
          short_forecast: '...',
          detailed_forecast: '...'
        }
    };

    componentDidMount(){
        let headers = {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language' : 'en-US, en;q=0.5',
          'DNT' : '1',
          'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
          'X-Requested-With' : Math.random(),// Sending random value for required CORS reroute
          'Access-Control-Allow-Origin' : '*'
        };
        // get Lat Long from User and Run weather function
        const getLatLong = function () {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    this.setState({
                        lat_long: position.coords.latitude + "," + position.coords.longitude
                    });
                    getWeatherNWS(this.state.lat_long);
                }.bind(this)
            );
        }.bind(this);

        // Run data functions once
        getLatLong();
        // getWeather using lat long
        // Weather API
        const getWeatherNWS = function(latlong) {
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
                    }).catch((err) => console.error(err))
                }).catch((err) => console.error(err))
        }.bind(this);

        getWeatherNWS(this.state.lat_long);
    };

    render() {
        const { weather_current } = this.state;
        const { detailed_forecast } = this.state;
        const { short_forecast } = this.state;
        return (
            <div className="Weather">
                <header className="Weather-heder">
                    <table className="Weather-table">
                        <tbody>
                            <th>
                                <td>Weather</td>
                            </th>
                            <tr>
                                <td>
                                    Current temperature: { weather_current } F
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Current forecast: {detailed_forecast }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </header>
            </div> )
    };
}

export default Weather;
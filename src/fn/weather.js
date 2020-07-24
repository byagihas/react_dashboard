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
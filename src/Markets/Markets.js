import React, { Component } from 'react';
import './Markets.css';

const { DateTime } = require('luxon');
const encoding_f = require('encoding');
const cheerio = require('cheerio');

class Markets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: null
      markets_dji_m: '...',
      markets_dji_p: '...',
      markets_nasdaq_m: '...',
      markets_nasdaq_p: '...',
      crypto_name: null,
      crypto_price: null,
      lat_long: null
    };
  };
   // On component mount/view load
   componentDidMount(){
      let encoding = 'UTF-8';
      let headers = {
        'Accept': 'text/html,Marketslication/xhtml+xml,Marketslication/xml;q=0.9,image/webp,*/*;q=0.8',
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
      // getMarkets
      // Fetch and parse data for markets
      const getMarkets = function(){
        fetch('https://cors-anywhere.herokuMarkets.com/https://www.marketwatch.com/?=&=', headers)
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
        fetch('https://cors-anywhere.herokuMarkets.com/https://www.coinmarketcap.com/?=&=', headers)
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

      // Run data functions once
      getLatLong();
      getMarkets();
      getCrypto();
  };
  render() {
    const { lat_long } = this.state;
    const { markets_dji_m } = this.state;
    const { crypto_name } = this.state;
   return (
      <div className="Markets">
        <header className="Markets-header">
            <div className="body">
            <table className="Markets-table">
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
            </div>
        </header>
      </div>
    );
  };
};

export default Markets;
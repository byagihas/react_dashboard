import React, { Component } from 'react';
import './News.css';

class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: null,
      news_general: null,
      lat_long: null,
      items: null
    };
  };
   // On component mount/view load
   componentDidMount(){
      let headers = {
        'Accept': 'text/html,Newslication/xhtml+xml,Newslication/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language' : 'en-US, en;q=0.5',
        'DNT' : '1',
        'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
        'X-Requested-With' : Math.random(),// Sending random value for required CORS reroute
        'Access-Control-Allow-Origin' : '*'
      };

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
            return this.setState({ news_general: headlines });
          }).catch((err) => console.error(err));
      }.bind(this);
      getNews(10);
  };
  render() {
    const { news_general } = this.state;
    return (
        <div className="News">
            <header className="News-header">
                <table className="News-table">
                    <tbody>
                    <tr>
                        <th>
                        <h2><strong>News</strong></h2>
                        </th>
                    </tr>
                    { news_general }
                    </tbody>
                </table>
            </header>
        </div>
    );
  };
};

export default News;
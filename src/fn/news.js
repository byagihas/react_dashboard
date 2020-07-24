const getNews = function(news_length){
    // https://newsapi.org/docs/get-started
    var newsURL = 'http://newsapi.org/v2/top-headlines?country=us&apiKey=a62a3c4e840a4b5091463ed1ecc5e0e6';
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
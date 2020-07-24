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
          )
        }
        this.setState({ markets_dji_m: markets(string_formatted_m, string_formatted_p, string_formatted_name) });
    }).catch((err) => console.error(err));
  }.bind(this);
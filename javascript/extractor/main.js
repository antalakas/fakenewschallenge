var extractor 	= require('unfluff');
var cheerio 	= require('cheerio');
var request 	= require('request');
var express 	= require("express");
var cors       	= require('cors');
var bodyParser  = require("body-parser");

var app = express();

// Using cors
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

var getArticleInfo = function(url, callback) {
	request({uri: url, jar: true}, function(e, r, b) {
			callback(extractor(b))
	});
}

app.post('/getArticleInfo', cors(), function(req, res){
  getArticleInfo(req.body.url, function(article) {
    res.end(JSON.stringify(article, null, 3));
  });
});

app.listen(5005, "0.0.0.0", function(){
  console.log("Started on PORT 5005");
})

// ------------------------------------------------------------------------------------------------
// var my_html_data = "https://www.reuters.com/article/us-usa-immigration-ruling/second-u-s-judge-blocks-trump-administration-from-ending-daca-program-idUSKCN1FX2TJ";
//data = extractor(my_html_data);
//console.log(data);

// request({uri: 'https://www.nytimes.com/2017/06/01/climate/trump-paris-climate-agreement.html', jar: true}, function(e, r, b) {
//   //console.log(extractor(b));
//   const $ = cheerio.load(b);
//   const textTags = $('.story-body-text');
//   const storyText = textTags.text();
//   console.log(storyText);
// });

//request({uri: 'http://news.in.gr/economy/article/?aid=1500198671', jar: true}, function(e, r, b) {
//  console.log(extractor(b));
//});

// https://github.com/ageitgey/node-unfluff/issues/76
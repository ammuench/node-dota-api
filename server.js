var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authentication, AdminAccess');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});



app.get('/playerinfo/:id', function(req, res){
	var profileId = req.params.id;

	var profileUrl = 'https://yasp.co/players/' + req.params.id;

	var userInfoJson = { soloMMR : "", partyMMR : "", estMMR: "", name: "", profileURL: profileUrl};

	request(profileUrl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var soloMMR, teamMMR, estMMR, name;


			$('#estimate').filter(function(){

				estMMR = $(this).children('span').children('abbr').text();

				userInfoJson.estMMR = estMMR;

			});

			$('abbr[title="Solo MMR"]').filter(function(){

				soloMMR = $(this).parent().next().text();

				userInfoJson.soloMMR = soloMMR;

			});

			$('abbr[title="Party MMR"]').filter(function(){

				partyMMR = $(this).parent().next().text();

				userInfoJson.partyMMR = partyMMR;

			});

			$('title').filter(function(){

				console.log($(this));
				name = $(this).text().split(' - YASP')[0];

				userInfoJson.name = name;

			});

			res.send(userInfoJson);
		}else{
			console.log('Error parsing userInfo URL');
		}
		
	});
});


var port = process.env.PORT || 8081;

app.listen(port);
console.log('Extra-Life API running on port ' + port);
exports = module.exports = app;
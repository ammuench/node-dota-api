/**
 * node-dota-api
 * A node-based API to get Dota stats for players, heroes, matches, and more!
 * @version 0.2.4
 * @author Alex Muench
 */

var moment = require('moment');
moment().format();

//define requirements
var request = require('request');
var cheerio = require('cheerio');

module.exports = {

	/**
	 * [playerStats description]
	 * @param  {string|integer}	playerID							Player's Dota ID Number
	 * @param  {Function}		callback							Provides playerInfoJson object after running request call and logic
	 * @property {object}		playerInfoJson						JSON object containing player stats and info
	 * @property {string}		playerInfoJson.status				Status of request call.  See status reports section in README.md
	 * @property {float}		playerInfoJson.daysSinceLastMatch	Number of days since last match was played && parsed
	 * @property {string}		playerInfoJson.soloMMR				Solo MMR Value
	 * @property {string}		playerInfoJson.partyMMR				Party MMR Value
	 * @property {string}		playerInfoJson.estMMR				OpenDota Estimated MMR Value
	 * @property {string}		playerInfoJson.name					User's current Profile Name
	 * @property {object}		playerInfoJson.winLoss				Object of Win-Loss values
	 * @property {string}		playerInfoJson.winLoss.wins			Number of wins (returned as string)
	 * @property {string}		playerInfoJson.winLoss.losses		Number of losses (returned as string)
	 * @property {string}		playerInfoJson.winLoss.winrate		Winrate percentage
	 * @property {string}		playerInfoJson.winLoss.totalGames	Number of total games played & parsed
	 * @property {array}		playerInfoJson.mostPlayed			Array of User's 5 most played heroes, with games played and winrate
	 * @property {array}		playerInfoJson.recentGames			Array of User's 20 most recent games, with matchID, hero, result, time played, and skill level
	 * @property {string}		playerInfoJson.profileUrl			URL to user's proflie on OpenDota.com
	 */
	playerStats: function(playerID, callback) {

		var profileUrl = 'https://opendota.com/players/' + playerID;


		var playerInfoJson = {
			status: '',
			daysSinceLastMatch: '',
			soloMMR: '',
			partyMMR: '',
			estMMR: '',
			name: '',
			winLoss: {
				wins: '',
				losses: '',
				winrate: '',
				totalGames: ''
			},
			mostPlayed: [],
			recentGames: [],
			profileURL: profileUrl
		};

		request(profileUrl, function(error, response, html) {
			if (!error) {

				var $ = cheerio.load(html);

				playerInfoJson.status = 'Success';

				//Finds User's Profile Name
				$('title').filter(function() {
					playerInfoJson.name = $(this).text();
				});

				//If invalid values are passed in, the username will equal the invalid value, or NaN
				if (playerInfoJson.name == playerID || playerInfoJson.name == 'NaN') {

					playerInfoJson.status = 'Invalid User';

				} else {

					//Finds Player Image
					$('.img-thumbnail').filter(function() {
						playerInfoJson.profileImage = $(this).attr('src');
					});

					//Finds Estimated MMR
					$('#estimate').filter(function() {
						playerInfoJson.estMMR = $(this).children('span').children('abbr').text();
					});

					//Finds Solo MMR
					$('abbr[title="Solo MMR"]').filter(function() {
						playerInfoJson.soloMMR = $(this).parent().next().text();
					});

					//Finds Party MMR
					$('abbr[title="Party MMR"]').filter(function() {
						playerInfoJson.partyMMR = $(this).parent().next().text();
					});

					//Finds User's Win/Loss Info
					$('.text-primary').filter(function() {

						//Create array for each-loop to output to
						var sourceInfoArray = [];

						/**
						 * Since the win-loss container is made up of mulitple spans
						 * we iterate through all of them to get their text contents 
						 * and put them in a local array
						 */
						sources = $(this).children('small').children('span').each(function(i, elem) {
							sourceInfoArray[i] = $(this).text();
						});

						//Assign array values to their correct properties
						playerInfoJson.winLoss.wins = sourceInfoArray[0];
						playerInfoJson.winLoss.losses = sourceInfoArray[2];
						playerInfoJson.winLoss.totalGames = parseInt(sourceInfoArray[0]) + parseInt(sourceInfoArray[2]);
						playerInfoJson.winLoss.winrate = sourceInfoArray[3].split('(')[1].split(')')[0];

					});

					$('#heroes').filter(function() {

						//gets all hero rows in the hero table
						var heroes = $(this).children('tbody').children('tr');
						//create array for, for loop output
						var heroesArray = [];

						/**
						 * Iterates through heros from table and adds them to heroesArray
						 * @param  	{Number}	limit	Defines how many heroes to add in array.  Max is 20			
						 */
						for (var i = 0, limit = 20; i < limit; i++) {

							//Set individual hero row
							var hero = heroes.eq(i).children('td');

							/**
							 * Object generated with player's hero stats
							 * @type		{Object}
							 * @property	{string}	hero	Dota hero name	
							 * @property	{string}	games	Number of games player has had on the hero
							 * @property	{string}	winrate	Player's winrate with the hero
							 */
							var heroObj = {
								hero: hero.eq(0).text(),
								games: hero.eq(1).text(),
								winrate: hero.eq(2).text()
							}

							//Push object to heroesArray
							heroesArray.push(heroObj);
						}

						//Set array in userInfoObject
						playerInfoJson.mostPlayed = heroesArray;

					});

					$('#matches').filter(function() {

						//gets all hero rows in the hero table
						var matches = $(this).children('tbody').children('tr');
						//create array for, for loop output
						var matchesArray = [];

						/**
						 * Iterates through heros from table and adds them to matchesArray
						 * @param  	{Number}	limit	Defines how many matches to add in array.  Max is 20			
						 */
						for (var i = 0, limit = 20; i < limit; i++) {

							//Set individual hero row
							var match = matches.eq(i).children('td');

							/**
							 * Parses gametime in seconds and returns formatted value
							 * @param  {string} source 	Gametime in total seconds
							 * @return {string} 		Game length in format HH:MM
							 */
							var parseGameTime = function(source){
						 		var secondsTotal = source;
						 		var min = parseInt(secondsTotal)/60;
						 		var sec = '0.' + min.toString().split('.')[1];
						 		sec = parseFloat(sec);
						 		sec = Math.floor(sec * 60);

						 		//add a leading '0' to single digit second values
						 		if(sec < 10){
						 			sec = '0' + sec;
						 			
						 		}

						 		min = min.toString().split('.')[0]

						 		return min + ':' + sec
						 	}

							/**
							 * Object generated with match stats
							 * @type		{Object}
							 * @property	{string}	matchID		ID for match
							 * @property	{string}	hero		Hero played in match
							 * @property	{string}	outcome		Win/Loss results (returns W for win, L for loss)
							 * @property	{string}	whenPlayed	String that states how recently game was played	
							 * @property	{string}	skillLevel	Skill bracket for game played (returns blank if not available)
							 * @property	{string}	kda			Kills/Deaths/Assists
							 */
							var matchObj = {
								matchID: match.eq(0).text(),
								hero: match.eq(1).children('.img-text').children('.img-sm').attr('title'),
								outcome: match.eq(2).text(),
								gameMode: match.eq(3).text(),
								whenPlayed: moment.unix(match.eq(4).text()).format('MMM Do, YYYY @ hh:mma'),
								gameLength: parseGameTime(match.eq(5).html()),
								skillLevel: match.eq(6).text(),
								kda: match.eq(7).text() + '/' + match.eq(8).text() + '/' + match.eq(9).text()
							}

							//Push object to matchesArray
							matchesArray.push(matchObj);
						}

						//Set array in userInfoObject
						playerInfoJson.recentGames = matchesArray;

						if(matchesArray.length < 20){
							playerInfoJson.status = 'Partial Match History';
						}

						var now = moment(new Date());
						var lastGame = moment(matchesArray[0].whenPlayed, 'MMM Do, YYYY @ hh:mma');
						var duration = moment.duration(now.diff(lastGame)).asDays();
						playerInfoJson.daysSinceLastMatch = duration;
						if(duration > 14){
							playerInfoJson.status = 'Outdated Match History'
						}

					});

				}

				//pass JSON Object via callback when done
				callback(playerInfoJson);

			} else {

				//Set status as error
				playerInfoJson.status = "Error";

				//pass JSON Object via callback when done
				callback(playerInfoJson);
			}

		});

	}

};

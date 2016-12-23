/**
 * node-dota-api
 * A node-based API to get Dota stats for players, heroes, matches, and more!
 * @version 0.2.4
 * @author Alex Muench
 */

var moment = require('moment');

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
	playerStats: function (playerID, callback) {
		var apiBase = 'https://api.opendota.com/api/players/' + playerID;

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
			profileURL: 'https://opendota.com/players/' + playerID,
			profileImage: ''
		};

		request(apiBase, function (err, res) {
			if (err) {
				playerInfoJson.status = 'Error';
				callback(playerInfoJson);
			} else {
				const data = JSON.parse(res.body);
				if (data.error) {
					playerInfoJson.status = 'Invalid';
					callback(playerInfoJson);
				} else {
					playerInfoJson.status = 'Valid Account';
					playerInfoJson.soloMMR = data.solo_competitive_rank;
					playerInfoJson.partyMMR = data.competitive_rank;
					playerInfoJson.estMMR = data.mmr_estimate.estimate;
					playerInfoJson.name = data.profile.personaname;
					playerInfoJson.profileImage = data.profile.avatarfull;

					request(apiBase + '/wl', function (err, res) {
						console.log('request 2 works')
						const data = JSON.parse(res.body);
						playerInfoJson.winLoss.losses = data.lose;
						playerInfoJson.winLoss.wins = data.win;
						playerInfoJson.winLoss.totalGames = data.lose + data.win;
						playerInfoJson.winLoss.winrate = (data.win / (data.lose + data.win));

						request(apiBase + '/matches?limit=1', function (err, res) {
							const data = JSON.parse(res.body)[0];
							var now = moment(new Date());
							//temp fix while the data returned is off by one month
							var lastGame = moment.unix(data.start_time)
							var duration = moment.duration(now.diff(lastGame)).asDays();
							playerInfoJson.daysSinceLastMatch = duration;
							if (duration > 14) {
								playerInfoJson.status = 'Outdated Match History'
							}

							callback(playerInfoJson);
						})
						
					})
				}
			}
		});
	}

};

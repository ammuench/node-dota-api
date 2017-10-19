/**
 * node-dota-api
 * A node-based API to get Dota stats for players, heroes, matches, and more!
 * @version 5.0.0
 * @author Alex Muench, Arthur Lunn, Michael Magnoli
 */

const moment = require('moment');

//define requirements
const request = require('request');

module.exports = playerStats;

/**
 * [playerStats description]
 * @param  {string|integer}  playerID              Player's Dota ID Number
 * @property {object}    playerInfoJson            JSON object containing player stats and info
 * @property {string}    playerInfoJson.status        Status of request call.  See status reports section in README.md
 * @property {float}    playerInfoJson.daysSinceLastMatch  Number of days since last match was played && parsed
 * @property {string}    playerInfoJson.soloMMR        Solo MMR Value
 * @property {string}    playerInfoJson.partyMMR        Party MMR Value
 * @property {string}    playerInfoJson.estMMR        OpenDota Estimated MMR Value
 * @property {string}    playerInfoJson.name          User's current Profile Name
 * @property {object}    playerInfoJson.winLoss        Object of Win-Loss values
 * @property {string}    playerInfoJson.winLoss.wins      Number of wins (returned as string)
 * @property {string}    playerInfoJson.winLoss.losses    Number of losses (returned as string)
 * @property {string}    playerInfoJson.winLoss.winrate    Winrate percentage
 * @property {string}    playerInfoJson.winLoss.totalGames  Number of total games played & parsed
 * @property {array}    playerInfoJson.mostPlayed      Array of User's 5 most played heroes, with games played and winrate
 * @property {array}    playerInfoJson.recentGames      Array of User's 20 most recent games, with matchID, hero, result, time played, and skill level
 * @property {string}    playerInfoJson.profileUrl      URL to user's proflie on OpenDota.com
 */
function playerStats(playerID) {
	const apiBase = 'https://api.opendota.com/api/players/' + playerID;

	const playerInfoJson = {
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
		profileImage: '',
		isPrime: ''
	};
	return new Promise(function (resolve, reject) {
		request(apiBase, function (err, res) {
			if (err) {
				playerInfoJson.status = 'Error';
				reject("error with initial request");
			} else {
				const data = JSON.parse(res.body);
				if (data.error) {
					playerInfoJson.status = 'Invalid';
					resolve(playerInfoJson);
				} else {
					playerInfoJson.status = 'Valid Account';
					playerInfoJson.soloMMR = data.solo_competitive_rank;
					playerInfoJson.partyMMR = data.competitive_rank;
					playerInfoJson.estMMR = data.mmr_estimate.estimate;
					playerInfoJson.name = data.profile.personaname;
					playerInfoJson.profileImage = data.profile.avatarfull;

					request(apiBase + '/wl', function (err, res) {
						if (err) {
							playerInfoJson.status = 'Error';
							reject("error with wl request");
						}
						const data = JSON.parse(res.body);
						if (data.lose === null || data.win === null) {
							reject("error fetching win loss data");
						}
						playerInfoJson.winLoss.losses = data.lose;
						playerInfoJson.winLoss.wins = data.win;
						playerInfoJson.winLoss.totalGames = data.lose + data.win;
						playerInfoJson.winLoss.winrate = (data.win / (data.lose + data.win));

						request(apiBase + '/matches?limit=1', function (err, res) {
							if (err) {
								playerInfoJson.status = 'Error';
								reject("error with wl request");
							}
							const match = JSON.parse(res.body)[0];
							if (match.start_time === null) {
								reject("Error fetching start time of last ranked match");
							}
							const now = moment(new Date());
							const lastGame = moment.unix(data.start_time)
							const duration = moment.duration(now.diff(lastGame)).asDays();
							playerInfoJson.daysSinceLastMatch = duration;
							if (duration > 14) {
								playerInfoJson.status = 'Outdated Match History'
							}

							request(apiBase + '/matches?lobby_type=7&limit=1', function (err, res) {
								if (err) {
									playerInfoJson.status = 'Error';
									reject("error with matches request");
								}
								const data = JSON.parse(res.body)[0];
								if (data.start_time === null) {
									reject("Error fetching start time of last ranked match");
								}
								// Approximate date of prime matchmaking
								playerInfoJson.isPrime = data.start_time > 1493948227;
								resolve(playerInfoJson);
							});
						})
					})
				}
			}
		});
	});
}
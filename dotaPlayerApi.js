/**
 * node-dota-api
 * A node-based API to get Dota stats for players, heroes, matches, and more!
 * @version 0.2.0
 * @author Alex Muench
 */


//define requirements
var request = require('request');
var cheerio = require('cheerio');

module.exports = {

    /**
     * [playerStats description]
     * @param  {string|integer}	playerID 						Player's Dota ID Number
     * @param  {Function} 		callback						Provides playerInfoJson object after running request call and logic
     * @property {object} 		playerInfoJson 					JSON object containing player stats and info
     * @property {string} 		playerInfoJson.status 			Status of request call.  Returns either 'Success' or 'Error'
     * @property {string} 		playerInfoJson.soloMMR 			Solo MMR Value
     * @property {string} 		playerInfoJson.partyMMR 		Party MMR Value
     * @property {string} 		playerInfoJson.estMMR 			Yasp Estimated MMR Value
     * @property {string} 		playerInfoJson.name				User's current Profile Name
     * @property {object} 		playerInfoJson.winLoss			Object of Win-Loss values
     * @property {string} 		playerInfoJson.winLoss.wins		Number of wins (returned as string)
     * @property {string} 		playerInfoJson.winLoss.losses	Number of losses (returned as string)
     * @property {string} 		playerInfoJson.winLoss.winrate	Winrate percentage
     * @property {array} 		playerInfoJson.mostPlayed 		Array of User's 5 most played heroes, with games played and winrate
     * @property {string} 		playerInfoJson.profileUrl 		URL to user's proflie on Yasp.co
     */
    playerStats: function(playerID, callback) {

        var profileUrl = 'https://yasp.co/players/' + playerID;

        var playerInfoJson = {
            status: "",
            soloMMR: "",
            partyMMR: "",
            estMMR: "",
            name: "",
            winLoss: {
            	wins: "",
            	losses: "",
            	winrate: ""
            },
            mostPlayed: [],
            profileURL: profileUrl
        };

        request(profileUrl, function(error, response, html) {
            if (!error) {

                var $ = cheerio.load(html);

                playerInfoJson.status = "Success";


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

                //Finds User's Profile Name
                $('title').filter(function() {
                    playerInfoJson.name = $(this).text().split(' - YASP')[0];
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
                    sources = $(this).children('small').children('span').each(function(i, elem){
                    	sourceInfoArray[i] = $(this).text();
                    });

                    //Assign array values to their correct properties
                    playerInfoJson.winLoss.wins = sourceInfoArray[0];
                    playerInfoJson.winLoss.losses = sourceInfoArray[2];
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
                	for(var i=0, limit=5; i<limit; i++){

                		//Set individual hero row
                		var hero = heroes.eq(i).children('td');

                		//Create object with hero values
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

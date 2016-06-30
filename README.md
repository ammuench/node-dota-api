# node-dota-api
API to fetch Dota stats for players, heroes, matches, and more!

## What's New? ##
    v0.2.4
    -Added 'profileImage' to playerStats object

    v0.2.3
    -Quick hotfix for a 0.2.2 issue

	v 0.2.2
	-Added check for invalid user
	-whenPlayed now returns a formatted date string
	-kda added to recent match objects

	v 0.2.1
	-Added match history to playerStats object

    v 0.2
    -Stripped out all the express jargon from 0.1
    -Flushed out full playerStats service

## Installation ##
------
You can manually install this by cloning this github repo
```bash
https://github.com/ammuench/node-dota-api.git
```
then running 
```bash
npm install
```
from within the project folder.

You can install through NPM by running
```bash
npm install node-dota-api
```

## API ##
------
##### nodeDotaApi.playerStats(*playerID*, *callback*)
Takes a PlayerID value as a string or integer, passes back a playerInfo JSON object through the callback with the following format:
```json
{
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
    mostPlayed: [
		{
            hero: "",
            games: "",
            winrate: ""
        }
    ],
    recentGames: [
		{
		    matchID: "",
		    hero: "",
		    outcome: "",
		    whenPlayed: "",
		    skillLevel: "",
		    kda: ""
		}
    ],
    profileURL: "",
    profileImage: ""
};
```

If there an invalid user is passed in, status will return as "Invalid User".  If it is a server error, status will return as "Error".


## What's Planned ##
-----
Right now the api is being built out as we use it for some other projects, but some current future features include:

* Looking up additional Player Info, like player trends or activity
* Looking up hero and item info
* Looking up Dota Team info


## License ##
-----
(The MIT License)

Copyright (c) 2016 Alex Muench <ammuench@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Special Thanks ##

Shoutout to the guys at [Yasp.co](http://yasp.co), they do great work, and they're the reason this API works.  Go donate some cheese to help keep their systems running!

Many thanks to Carney for answer myriads of questions when I'm having issues

Much love to Elizabeth for wanting me to win at my code <3


# node-dota-api
A tool to fetch Dota stats for players, heroes, matches, and more!

Based off of [OpenDota's new API](https://docs.opendota.com/) & Dota 2's Web API

## What's New? ##

## v5.0.0

- Switch to opendota instead of steam web api for Prime Account Check (thanks [Mags](https://github.com/ammuench/node-dota-api/pull/5))

### v4.0.1

- Minor bugfix for mistyped conditoinal check (thanks [Quazia](https://github.com/ammuench/node-dota-api/pull/4))

### v4.0.0

- Update all callbacks to now be promises (thanks [Quazia](https://github.com/ammuench/node-dota-api/pull/3))

### v3.0.1

- Add new prime account check status

[See previous changelogs here](https://github.com/ammuench/node-dota-api/blob/master/CHANGELOG.md)


## Installation ##
------

You can install through NPM by running
```bash
npm install node-dota-api
```

or by cloning from git into your project
```bash
git clone https://github.com/ammuench/node-dota-api.git
```

## API ##
------
##### nodeDotaApi.playerStats(*playerID*)
Takes a PlayerID value as a string or integer. Returns a promise that passes back a playerInfo JSON object with the following format:
```json
{
    "status": "",
    "daysSinceLastMatch": "",
    "soloMMR": "",
    "partyMMR": "",
    "estMMR": "",
    "name": "",
    "winLoss": {
        "wins": "",
        "losses": "",
        "winrate": "",
        "totalGames": ""
    },
    "profileURL": "",
    "profileImage": "",
    "isPrime" : BOOLEAN or "No apiKey provided"
};
```
###### Status Reports

If the user is valid, but their profile shows less than 20 games, the status will return as "**Partial Match History**".  This is likely due to match history not being shown, or an extremely new account.

If the user is valid, but their profile's last parsed game is over 14 days ago, the status will return as "**Outdated Match History**".

If the user has NO match history at all, the status will return as "**No Match History/Invalid Account**", as either are possible (invalid ID number, or no exposed data).

If there an invalid value passed in, status will return as "**Invalid**". 

If it is a server error, status will return as "**Error**".

Prime Check sees if a ranked game was played after timestamp "1493948227" (roughly around when the prime update went live).

## License ##
-----
(The MIT License)

Copyright (c) 2016 Alex Muench <ammuench@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

Users of this software will give the developer at least one ('1') high-five upon meeting him in person as a sign of gratitude.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Special Thanks ##

Shoutout to the guys at [OpenDota](http://opendota.com), they do great work, and they're the reason this API works.  Go [donate and help carry](https://www.opendota.com/carry) them to keep their systems running!

Thanks to [Arthur](https://github.com/quazia) & [Mags](https://github.com/MichaelMagnoli) for their contributions to the project

Many thanks to Carney for answer myriads of questions when I'm having issues

Much love to Elizabeth for wanting me to win at my code <3


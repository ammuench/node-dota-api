# v4.0.0

- Update all callbacks to promises

## v3.0.1

- Add new prime account check status

## v2.0.1

- Quick fix to make the `daysSinceLastMatch` value more accurate after talking with the API dev

## v2.0.0

- Moving to becoming a wrapper for OpenDota's new API
- `mostPlayed` and `recentGame` values currently not accessible (will be re-added soon!)

-----

## v1.0.0

- Major stable release!
- Ported to use opendota instead of yasp
- Added in game length and game type
- Expanded status codes to be more descriptive
- Added 'daysSinceLastMatch' value
- Added total games played to 'winLoss' object
- Locked dependency versions for stability

-----

## v0.2.4

- Added 'profileImage' to playerStats object

## v0.2.3

- Quick hotfix for a 0.2.2 issue

## v0.2.2

- Added check for invalid user
- whenPlayed now returns a formatted date string
- kda added to recent match objects

## v0.2.1

- Added match history to playerStats object

## v0.2

- Stripped out all the express jargon from 0.1
- Flushed out full playerStats service
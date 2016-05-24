# node-dota-api
API to fetch Dota stats for players, heroes, matches, and more!

Installation
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

Once downloaded, move to the base module folder and simply run:

```bash
npm start
```
And you're good to go!  The app should default to port 8081.  If you wish to run on a different port, you can specify it while starting the service

```bash
PORT=1234 npm start
```

Configuration
------
By default the service will accept all incoming requests.  If you wish to restrict this, you can go to line 7 of server.js and edit the following:

```javascript
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authentication, AdminAccess');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});
```
to change your server restrictions
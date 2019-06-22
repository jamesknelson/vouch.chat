const functions = require('firebase-functions');
const renderer = require('./renderer');

exports.renderer = functions.https.onRequest(renderer);

exports.api = {
  echo: functions.https.onRequest((req, res) => {
    res.send(req.query);
  })
}

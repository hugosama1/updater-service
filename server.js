var express = require('express');
const path = require('path');

var app = express();

app.get('/version', function (req, res) {
  res.sendFile(path.join(__dirname, '/version.json'));
});

app.get('/samalinne.apk', function (req, res) {
	res.sendFile(path.join(__dirname, '/samalinne.apk'));
});

app.listen(8080, function () {
  console.log('Example app listening on port 3000!');
});
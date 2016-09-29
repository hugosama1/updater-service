var express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const PORT = 8080;
var fs = require('fs');

var app = express();
app.use(bodyParser.json());

app.get('/version', function (req, res) {
  res.sendFile(path.join(__dirname, '/version.json'));
});

app.get('/samalinne.apk', function (req, res) {
	res.sendFile(path.join(__dirname, '/samalinne.apk'));
});

app.post('/messages', function (req, res) {
	var messages = getMessages();
	var message = req.body.message;
	if(message) {
		var lastMessage = messages[messages.length-1];
		var date = lastMessage.date + (1000 * 60 * 60 * 24);
		var _id = lastMessage._id + 1;
		messages.push({
			_id: _id,
			date :  date,
			message : message
		});
	}
	res.json({ insertado : true });
});

app.get('/messages', function (req, res) {
	var messages = getMessages();
	var date = req.query.date ? req.query.date : 0;
	res.json(messages.filter( x =>  x.date > date));
});

function getMessages() {
	return JSON.parse(fs.readFileSync('messages.json', 'utf8'));
}


app.get('/')


app.listen(PORT, function () {
  console.log('Listening on port '+PORT+'!');
});

var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
const path = require("path");
const PORT = 8080;
var fs = require("fs");

var app = express();
app.use(bodyParser.json());

app.get("/version", function(req, res) {
  res.sendFile(path.join(__dirname, "/version.json"));
});

app.get("/samalinne.apk", function(req, res) {
  res.sendFile(path.join(__dirname, "/samalinne.apk"));
});

app.post("/messages", function(req, res) {
  var dayInMillis = 1000 * 60 * 60 * 24;
  var messages = getMessages();
  var message = req.body.message;
  if (message) {
    var lastMessage = messages[messages.length - 1];
    var days = Math.round((+new Date() - lastMessage.date) / dayInMillis);
    var dayDifference = days <= 0 ? dayInMillis : dayInMillis * days;
    var date = lastMessage.date + dayDifference;
    var _id = lastMessage._id + 1;
    messages.push({
      _id: _id,
      date: date,
      message: message
    });
    fs.writeFileSync("messages.json", JSON.stringify(messages));
    //message arrive in :
    days = days <= 0 ? Math.abs(days) : days;
    sendNotification(days);
  }
  res.json({ insertado: true });
});

function sendNotification(days) {
  // Set the headers
  var headers = {
    Authorization:
      "key=AAAAFIXhKDw:APA91bHgNJi0vzN_N0Wo_CedC-DJuR64sNin2zt2u9lKHPTD5lZP-AtO7n0s3yYhIWtsF65M7b3H5_7EsuZZWCs_tHyn0N4u7FugBaq8FuB6jRZimU6CQ8csWKRlJZnwlSy19PbJA8W5"
  };

  // Configure the request
  var options = {
    url: "https://fcm.googleapis.com/fcm/send",
    method: "POST",
    json: true,
    headers: headers,
    body: {
      notification: {
        title: "SAMALINNE",
        body: "Nuevo mensaje en : " + days + " dia(s)!"
      },
      to: "/topics/samalinne"
    }
  };

  // Start the request
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // Print out the response body
      console.log(body);
    } else {
      console.log(error);
      console.log(response);
    }
  });
}

app.get("/messages", function(req, res) {
  var messages = getMessages();
  var date = req.query.date ? req.query.date : 0;
  res.json(messages.filter(x => x.date > date));
});

function getMessages() {
  return JSON.parse(fs.readFileSync("messages.json", "utf8"));
}

app.get("/");

app.listen(PORT, function() {
  console.log("Listening on port " + PORT + "!");
});

//RESUME
app.use(express.static("resume"));
app.get("/resume", function(req, res) {
  res.sendFile(path.join(__dirname, "/resume/resume.html"));
});

//CREATE-MESSAGE
app.use(express.static("create-message"));
app.get("/create-message", function(req, res) {
  res.sendFile(path.join(__dirname, "/create-message/index.html"));
});

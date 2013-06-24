var httpexpress = require("express");
var httpapp = httpexpress();
httpapp.listen(8000);

httpapp.get('/dev.html', function(req, res) {
  res.sendfile(__dirname + '/dev.html');
	console.log("serving dev.html");
});
httpapp.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
	console.log("serving webrtc.io.js");
});

console.log("HTTP Server Running on Port 8000");


var webRTC = require('webrtc.io').listen(8001);
console.log("WebRTC Server Running on Port 8001");

webRTC.rtc.on('connect', function(rtc) {
  //Client connected
	console.log("Client Connected " + rtc);
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
	console.log("Send Answer");
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
	console.log("Client Disconnect");
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});

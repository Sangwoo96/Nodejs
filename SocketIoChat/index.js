var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

let sockets = {};
app.get("/", function(req, res) {
  //sendFile을 통해 index 화면을 호출 합니다.
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("a user connected : ");
  socket.on("chat message", function(msg) {
    //socket으로 부터 메세지를 받았습니다.
    let roomName = socket.roomName;
    console.log("roomName : ", roomName);
    // console.log('sockets : ',sockets)

    if (sockets[roomName]) {
      io.to(roomName).emit("chat message", msg);
    }
    //접속 된 socket에게 메세지를 보냅니다.
  });

  socket.on("room", function(room) {
    if (!sockets[room]) {
      sockets[room] = [];
      console.log(sockets);
      socket.roomName = room; //socket 객체에 roomName생성
      sockets[room].push(socket);
      console.log(sockets);
      socket.join(room);
    } else {
      if (sockets[room].length < 2) {
        //1대1 채팅
        socket.roomName = room;
        sockets[room].push(socket);
        socket.join(room);
        console.log("sockets : ", sockets);
      } else {
        socket.emit("result", "failed");
      }
    }
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});

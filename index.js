const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Handle Cors Error
app.use(cors());
// Server
const server = http.createServer(app);
// Instance Socket IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

 io.on("connection", (socket) => {

  // Checking for Ids
  console.log("user_id:", socket.id);

  socket.on("send_room_detail", (data) => {
    // console.log(data);
    let room_details = {
      username: data.username,
      transaction: data.transaction
    }
    socket.broadcast.emit("room_detail", room_details);
  })

  // Join Room
  socket.on("join_room", async (room) => {
    // console.log(room)
    let room_name = room.useranme + room.transaction;
    await socket.join(room_name);
    // console.log(`User ID ${socket.id} joined the room : ${room}`);
  })

  //Send Data
  socket.on("send_data", (send_data) => {
    // console.log(data);
      let room_name = send_data.useranme + send_data.transaction;
      socket.to(room_name).emit("receive_data", send_data);
    // console.log(data);
  });

  //Send Data
  socket.on("send_success_message", (success_data) => {
      //console.log(success_data);
      let room_name = success_data.useranme + success_data.transaction;
      socket.to(room_name).emit("success_messsage", success_data);
  });

  // Get ID Disconnected Client
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id)
  })

});

// Server Running
server.listen(3001, () => {
  console.log('Server Running');
});
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173"
      }
})



const rooms = {};
const users = {};

// const users = {
//     user1: {
//       roomId: "room1"
//     },
//     user2: {
//       roomId: "room2"
//     }
//   };

//   const rooms = {
//     room1: {
//       roomId: "room1",
//       users: ["user1"]
//     },
//     room2: {
//       roomId: "room2",
//       users: ["user2"]
//     }
//   };

io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  socket.on("disconnect", (params) => {
    Object.keys(rooms).map((roomId) => {
      rooms[roomId].users.filter((x) => x !== socket.id);
    });
    delete users[socket.id];
  });

  socket.on("join", (params) => {
    const roomId = params.roomId;
    users[socket.id] = {
      roomId: roomId,
    };

    if (!rooms[roomId]) {
      // This creates the new room object with the roomId and an empty users array
      rooms[roomId] = {
        roomId,
        users: [],
      };
    }
    rooms[roomId].users.push(socket.id);
    console.log("user added to the room" + roomId);
  });

  socket.on("localDescription", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.foreach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("localDescription", {
          description: params.description,
        });
      }
    });
  });

  socket.on("remoteDescription", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.foreach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("remoteDescription", {
          remoteDescription: params.remoteDescription,
        });
      }
    });
  });

  socket.on("iceCandidate", (params) => {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.foreach((otherUser) => {
      if (otherUser !== socket.id) {
        io.to(otherUser).emit("iceCandidate", {
          iceCandidate: params.iceCandidate,
        });
      }
    });
  });

  socket.on("iceCandidateReplay", (params)=> {
    let roomId = users[socket.id].roomId;
    let otherUsers = rooms[roomId].users;

    otherUsers.foreach(otherUser=> {
        if(otherUser !== socket.id){
            io.to(otherUser).emit("iceCandidateReplay",{
                iceCandidateReplay: params.iceCandidateReplay,
            })
        }
    })
  });

});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

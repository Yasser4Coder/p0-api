const { Server } = require("socket.io");

let io; // Define io globally

module.exports = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on("sendMessage", (data) => {
      console.log(`Message: ${data.message}`);
      io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  return io; // Export io instance
};

// Export io separately to use it in routes
module.exports.getIO = () => io;

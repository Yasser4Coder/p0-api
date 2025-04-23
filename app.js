// index.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");
require("dotenv").config();

// Import Socket.IO Server
const { Server } = require("socket.io");
const setupSocket = require("./config/socket");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const authRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRouter");
const videoRoutes = require("./routes/videosRoutes");

// App and HTTP server setup
const app = express();
const server = http.createServer(app);

// CORS whitelist
const allowedOrigins = [
  "http://localhost:5173",
  "https://elec-frontend.vercel.app",
  "https://p0-v2-frontend.onrender.com",
  "https://087a-105-235-134-186.ngrok-free.app"
];

// Reusable CORS options\const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
};

// Apply CORS to Express
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middlewares
app.use(express.json({ limit: "200mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

// Error handler (should be after other middleware & routes)
app.use(errorHandler);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    credentials: true
  }
});
// Setup socket handlers
setupSocket(io);

// Mount API routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/videos", videoRoutes);

// Connect to DB and start server
const PORT = process.env.PORT || 6010;
connectDB();
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));


// config/socket.js
/**
 * config/socket.js
 * Sets up Socket.IO event handlers on the provided io instance.
 */

module.exports = function setupSocket(io) {
  io.on("connection", socket => {
    console.log("New socket connected:", socket.id);

    // Example join event
    socket.on("joinRoom", room => {
      socket.join(room);
      io.to(room).emit("message", `User ${socket.id} joined ${room}`);
    });

    // Example chat message event
    socket.on("chatMessage", ({ room, message }) => {
      io.to(room).emit("chatMessage", { sender: socket.id, text: message });
    });

    // Handle disconnect
    socket.on("disconnect", reason => {
      console.log(`Socket ${socket.id} disconnected:`, reason);
    });
  });
};

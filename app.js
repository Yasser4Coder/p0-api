const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorMiddleware");

require("dotenv").config();
// test//

const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
/* const competitionRoutes = require("./routes/competitionRoutes"); */
const challengeRoutes = require("./routes/challengeRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const notificationRoutes = require("./routes/notificationsRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const authRoutes = require("./routes/authRoutes");
const mentorRoutes = require("./routes/mentorRouter");
const videoRoutes = require("./routes/videosRoutes");

const setupSocket = require("./config/socket");

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://elec-frontend.vercel.app", "https://p0-v2-frontend.onrender.com"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: "200mb" })); // default is ~100kb
app.use(morgan("dev"));
app.use(cookieParser());

// Error middleware
app.use(errorHandler);

// Socket.io
setupSocket(server);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
/* app.use("/api/competitions", competitionRoutes); */
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 6010;
connectDB();

server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

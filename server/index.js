import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import notificationRoutes from "./routes/notifications.js";
import messageRoutes from "./routes/messages.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { upload } from "./config/cloudinary.js";


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
// Keep static assets route for backward compatibility (optional)
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/notifications", notificationRoutes);
app.use("/messages", messageRoutes);

//route for registration and upload the registration image to multer
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection handling
const onlineUsers = new Map(); // Track online users

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their ID
  socket.on("join", (userId) => {
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined`);
    
    // Broadcast online status to friends
    socket.broadcast.emit("user_online", userId);
  });

  // Send message
  socket.on("send_message", async (messageData) => {
    // Emit to recipient if online
    const recipientSocketId = onlineUsers.get(messageData.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", messageData);
    }
    
    // Also emit back to sender for confirmation
    socket.emit("message_sent", messageData);
  });

  // Typing indicator
  socket.on("typing", (data) => {
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user_typing", {
        userId: data.userId,
        isTyping: data.isTyping,
      });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit("user_offline", socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});

export const connect = () =>
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      httpServer.listen(PORT, () => {
        console.log(`Server Port: ${PORT}`);
        console.log(`Socket.IO server running`);
      });
    })
    .catch((error) => console.log(`${error} did not connect`));

// testing 
console.log('PORT from env:', process.env.PORT);

//call db connection and start server
connect();

//a test route
app.get('/', (req, res) => {
  res.send('Hello World! Server is running.');
});

// Test auth endpoint
app.get('/auth/test', (req, res) => {
  res.json({ message: 'Auth routes are working', timestamp: new Date().toISOString() });
});
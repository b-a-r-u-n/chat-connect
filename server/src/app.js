import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json({limit: "15kb"}))
app.use(express.urlencoded({extended: true,limit: "15kb"}))
app.use(cookieParser());

// Routes
import authRoutes from './Routes/auth.route.js';
import userRoutes from './Routes/user.route.js';
import postRoutes from './Routes/post.route.js';
import chatRoutes from './Routes/chat.route.js';
import messageRoutes from './Routes/message.route.js';

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

export {app}
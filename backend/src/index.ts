import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user-routes.js";
import chatRoutes from "./routes/chat-routes.js";

import { config } from "dotenv";

config();

const app = express();

// Middlewares

const allowedOrigins = [
	process.env.FRONTEND_URL,
	"https://zentron-chi.vercel.app",
	"http://localhost:5175",
	"http://localhost:5173",
];

app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin (mobile apps, curl, etc.)
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
}))
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(morgan("dev")); // for development

// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Connections and Listeners
mongoose
	.connect(process.env.MONGODB_URI!)
	.then(() => {
		app.listen(process.env.PORT || 5000);
		console.log(
			`Server started on port ${
				process.env.PORT || 5000
			} and Mongo DB is connected`
		);
	})
	.catch((err) => {
		console.log(err);
	});

export default app;

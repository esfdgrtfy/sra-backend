import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authenticateToken from "./middlewares/tokenAuthentication";
import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";

const app = express();

app.use(express.json());
app.use(cookieParser()); 
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);
``;

// Public routes
app.use("/api/auth", authRoute);

// Middlewares
app.use(authenticateToken);

// Private routes
app.use("/api/users", userRoute);

// Connections
const startConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    app.listen(parseInt(process.env.PORT!), () => {
      console.log(`Successful connection by port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`Connection error ${error}`);
  }
};

startConnection();

import express from "express";

import {
  login,
  logout,
  register,
  refreshToken,
} from "../controllers/authController";

const authRoutes = express.Router();

authRoutes.post("/login", login);
authRoutes.post("/register", register);
authRoutes.post("/logout", logout);
authRoutes.get("/refresh", refreshToken);

export default authRoutes;

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import UserModel, { type User } from "../models/user.model";
import {
  comparePassword,
  generateRefreshToken,
  generateToken,
  hashPassword,
} from "../libs/utils";
import { JWTPayload } from "../libs/types";

// @desc signup user
// @route POST /auth/register
// @access Public

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(401).json({ message: "Passwords don't match" });
      return;
    }

    const user: User | null = await UserModel.findOne({ email });

    if (user) {
      res.status(401).json({ message: "Email already exists." });
    } else {
      const encryptedPassword = await hashPassword(password);

      await UserModel.create({ email, password: encryptedPassword });

      res.status(201).json({ message: "Registration successful!" });
    }
  } catch (error) {
    console.log(`Registration failed : ${error}`);

    res.status(500).json({ message: "Please try again later." });
  }
};

// @desc Login a user
// @route POST /auth/login
// @access Public

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: User | null = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });

      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Incorrect password" });

      return;
    }

    // generating an acessToken using JWT
    const payload = {
      _id: user._id.toString(),
    };

    const jwtToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      sameSite: false,
      maxAge: 1000 * 60 * 60 * 24* 7,
      httpOnly: true,
      secure: false,
    });

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    console.error(`Login error: ${error}`);
    res.status(500).json({ message: "Please try again later." });
  }
};

// @desc Logout a user
// @route POST /auth/logout
// @access Public

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", { httpOnly: true });

  res.json({
    message: "Logged out successfully",
  });
};

// @desc Refresh accessToken on expiration
// @route GET /auth/refresh
// @access Public - because token has expired

export const refreshToken = async (req: Request, res: Response) => {
  const cookie: string = req.cookies.refreshToken;

  if (cookie) {
    // verifying the encoded refreshToken
    const decoded = jwt.verify(
      cookie,
      process.env.REFRESH_SECRET_KEY!
    ) as JWTPayload;

    const payload = {
      _id: decoded._id,
    };

    const newToken = generateToken(payload);
    res.status(200).json({
      token: newToken,
    });
  } else {
    res.status(401).json({ error: "Refresh token not found" });
  }
};

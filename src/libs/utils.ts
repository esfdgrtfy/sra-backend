import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JWTPayload } from "../libs/types";

export const comparePassword = async (
  password: string,
  userPassword: string
): Promise<boolean> => {
  try {
    const result = await bcrypt.compare(password, userPassword);
    return result;
  } catch (error) {
    return false;
  }
};

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    return `Error while hashing the password ${error}`;
  }
};

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_SECRET_KEY!, {
    expiresIn: "7d",
  });
};

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send("Authorization failed. No access token.");
    return;
  }

  // Verifying if the token is valid.
  jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, user) => {
    if (err) {
      res.status(403).json({ message: `Authorization failed. ${err}` });
      return;
    } else {
      next();
    }
  });
};

export default authenticateToken;

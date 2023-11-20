import { JwtPayload } from "jsonwebtoken";

export type JWTPayload = {
  _id: string;
};

export type DecodedToken = JwtPayload & {
  _id: number;
};

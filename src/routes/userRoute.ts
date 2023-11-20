import express from "express";

import { getUser } from "../controllers/userController";

const userRoute = express.Router();

userRoute.get("/:id", getUser);

export default userRoute;

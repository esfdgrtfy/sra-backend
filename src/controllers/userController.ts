import { Request, Response } from "express";

import userModel, { type User } from "../models/user.model";

// @desc Get a single user with id
// @route GET /users/:id
// @access Private

export const getUser = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const singleUser: User | null = await userModel.findById(id);

    if (!singleUser) {
      res.status(404).json({ message: "Cannot find a user" });
      return;
    }

    const { _id, email } = singleUser;

    res.status(200).json({
      _id,
      email,
    });
  } catch (error) {
    console.log("Error while fetching a user", error);
    res
      .status(500)
      .json({ message: "Something went wrong! Please try again later." });
  }
};

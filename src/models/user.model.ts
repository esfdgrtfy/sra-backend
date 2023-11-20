import { Schema, model, InferSchemaType } from "mongoose";
import { ObjectId } from "mongodb";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export interface User extends InferSchemaType<typeof userSchema> {
  _id: ObjectId;
}

export default model<User>("User", userSchema);

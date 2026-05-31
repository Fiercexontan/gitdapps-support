import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  address: string;
  createdAt: Date;
  lastLogin: Date;
  loginCount: number;
}

const UserSchema = new Schema<IUser>({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  loginCount: {
    type: Number,
    default: 1,
  },
});

const User = models.User || model<IUser>("User", UserSchema);

export default User;
import {Document, model, models, Schema} from "mongoose";

export type UserType = {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
};

export type UserDoc = UserType & Document;

const UserSchema = new Schema<UserType>(
  {
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    bio: {type: String},
    image: {type: String},
    location: {type: String},
    portfolio: {type: String},
    reputation: {type: Number, default: 0},
  },
  {timestamps: true}
);

const User = models?.User || model<UserType>("User", UserSchema);

export default User;

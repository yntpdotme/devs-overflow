import {Document, model, models, Schema, Types} from "mongoose";

export type VoteType = {
  author: Types.ObjectId;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
  voteType: "upvote" | "downvote";
};

export type VoteDoc = VoteType & Document;

const VoteSchema = new Schema<VoteType>(
  {
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    actionId: {type: Schema.Types.ObjectId, required: true},
    actionType: {type: String, enum: ["question", "answer"], required: true},
    voteType: {type: String, enum: ["upvote", "downvote"], required: true},
  },
  {timestamps: true}
);

const Vote = models?.Vote || model<VoteType>("Vote", VoteSchema);

export default Vote;

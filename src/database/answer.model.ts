import {Document, model, models, Schema, Types} from "mongoose";

export type AnswerType = {
  author: Types.ObjectId;
  question: Types.ObjectId;
  content: string;
  upvotes: number;
  downvotes: number;
};

export type AnswerDoc = AnswerType & Document;

const AnswerSchema = new Schema<AnswerType>(
  {
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    question: {type: Schema.Types.ObjectId, ref: "Question", required: true},
    content: {type: String, required: true},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
  },
  {timestamps: true}
);

const Answer = models?.Answer || model<AnswerType>("Answer", AnswerSchema);

export default Answer;

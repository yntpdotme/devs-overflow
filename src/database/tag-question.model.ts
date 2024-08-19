import {Document, model, models, Schema, Types} from "mongoose";

export type TagQuestionType = {
  tag: Types.ObjectId;
  question: Types.ObjectId;
};

export type TagQuestionDoc = TagQuestionType & Document;

const TagQuestionSchema = new Schema<TagQuestionType>(
  {
    tag: {type: Schema.Types.ObjectId, ref: "Tag", required: true},
    question: {type: Schema.Types.ObjectId, ref: "Question", required: true},
  },
  {timestamps: true}
);

const TagQuestion =
  models?.TagQuestion ||
  model<TagQuestionType>("TagQuestion", TagQuestionSchema);

export default TagQuestion;

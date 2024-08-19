import {Document, model, models, Schema} from "mongoose";

export type TagType = {
  name: string;
  questions: number;
};

export type TagDoc = TagType & Document;

const TagSchema = new Schema<TagType>(
  {
    name: {type: String, required: true, unique: true},
    questions: {type: Number, default: 0},
  },
  {timestamps: true}
);

const Tag = models?.Tag || model<TagType>("Tag", TagSchema);

export default Tag;

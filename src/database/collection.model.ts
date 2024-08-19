import {Document, model, models, Schema, Types} from "mongoose";

export type CollectionType = {
  author: Types.ObjectId;
  question: Types.ObjectId;
};

export type CollectionDoc = CollectionType & Document;

const CollectionSchema = new Schema<CollectionType>(
  {
    author: {type: Schema.Types.ObjectId, required: true},
    question: {type: Schema.Types.ObjectId, required: true},
  },
  {timestamps: true}
);

const Collection =
  models?.Collection || model<CollectionType>("Collection", CollectionSchema);

export default Collection;

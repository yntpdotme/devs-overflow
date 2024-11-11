import {Document, model, models, Schema, Types} from "mongoose";

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

export type InteractionType = {
  user: Types.ObjectId;
  action: typeof InteractionActionEnums[number];
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
};

export type InteractionDoc = InteractionType & Document;

const InteractionSchema = new Schema<InteractionType>(
  {
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    action: {type: String, enum: InteractionActionEnums, required: true},
    actionId: {type: Schema.Types.ObjectId, required: true},
    actionType: {type: String, enum: ["question", "answer"], required: true},
  },
  {timestamps: true}
);

const Interaction =
  models?.Interaction ||
  model<InteractionType>("Interaction", InteractionSchema);

export default Interaction;

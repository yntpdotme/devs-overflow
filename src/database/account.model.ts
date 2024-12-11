import {Document, model, models, Schema, Types} from "mongoose";

export type AccountType = {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
};

export type AccountDoc = AccountType & Document;

const AccountSchema = new Schema<AccountType>(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    image: {type: String},
    password: {type: String},
    provider: {type: String, required: true},
    providerAccountId: {type: String, required: true},
  },
  {timestamps: true}
);

const Account = models?.Account || model<AccountType>("Account", AccountSchema);

export default Account;

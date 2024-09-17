import mongoose from "mongoose";
import {NextRequest, NextResponse} from "next/server";
import slugify from "slugify";

import {Account, User} from "@/database";
import connectDB from "@/lib/db";
import {handleError} from "@/lib/handlers";
import {ValidationError} from "@/lib/http-errors";
import {SignInWithOAuthSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";

const generateUniqueUsername = async (
  baseUsername: string,
  session: mongoose.ClientSession
): Promise<string> => {
  const username = slugify(baseUsername, {
    lower: true,
    strict: true,
    trim: true,
  });
  const exists = await User.findOne({username}).session(session);
  if (!exists) {
    return slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  let counter = 1;
  while (true) {
    const newUsername = slugify(`${baseUsername}${counter}`, {
      lower: true,
      strict: true,
      trim: true,
    });
    const exists = await User.findOne({username: newUsername}).session(session);
    if (!exists) return newUsername;
    counter++;
  }
};

export const POST = async (request: NextRequest) => {
  let session: mongoose.ClientSession | null = null;

  try {
    const body = await request.json();

    const {success, error, data} = SignInWithOAuthSchema.safeParse(body);
    if (!success) throw new ValidationError(error.flatten().fieldErrors);

    const {provider, providerAccountId, user} = data;

    await connectDB();
    session = await mongoose.startSession();
    session?.startTransaction();

    let existingUser = await User.findOne({email: user.email}).session(session);

    if (!existingUser) {
      const username = await generateUniqueUsername(user.username, session);

      [existingUser] = await User.create(
        [
          {
            name: user.name,
            username,
            email: user.email,
            image: user.image,
          },
        ],
        {session}
      );
    } else {
      const updatedData: {name?: string; image?: string} = {};

      if (existingUser.name !== user.name) updatedData.name = user.name;
      if (existingUser.image !== user.image) updatedData.image = user.image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          {_id: existingUser._id},
          {$set: updatedData}
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name: user.name,
            image: user.image,
            provider,
            providerAccountId,
          },
        ],
        {session}
      );
    }

    await session.commitTransaction();

    return NextResponse.json({success: true});
  } catch (error: unknown) {
    await session?.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session?.endSession();
  }
};

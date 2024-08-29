"use server";

import bcryptjs from "bcryptjs";
import mongoose from "mongoose";

import {signIn} from "@/auth";
import {Account, User} from "@/database";
import {action, handleError} from "@/lib/handlers";
import {NotFoundError} from "@/lib/http-errors";
import {SignInSchema, SignUpSchema} from "@/lib/schemas";
import {ActionResponse, AuthCredentials, ErrorResponse} from "@/types";

export const signUpWithCredentials = async (
  params: AuthCredentials
): Promise<ActionResponse> => {
  const validationResult = await action({params, schema: SignUpSchema});

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {name, username, email, password} = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({email});
    if (existingUser) throw new Error("Email already in use");

    const existingUsername = await User.findOne({username});
    if (existingUsername) throw new Error("Username already taken");

    const [newUser] = await User.create([{username, name, email}], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password,
        },
      ],
      {session}
    );

    await session.commitTransaction();

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {success: true};
  } catch (error: unknown) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> => {
  const validationResult = await action({params, schema: SignInSchema});

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {email, password} = validationResult.params!;

  try {
    const existingUser = await User.findOne({email});
    if (!existingUser) throw new NotFoundError("User");

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) throw new NotFoundError("Account");

    const passwordMatch = await bcryptjs.compare(
      password,
      existingAccount.password
    );

    if (!passwordMatch) throw new Error("Invalid credentials");

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {success: true};
  } catch (error: unknown) {
    return handleError(error) as ErrorResponse;
  }
};

import {NextRequest, NextResponse} from "next/server";

import {User} from "@/database";
import connectDB from "@/lib/db";
import {handleError} from "@/lib/handlers";
import {ValidationError} from "@/lib/http-errors";
import {UserSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";

export const GET = async () => {
  try {
    await connectDB();

    const users = await User.find();

    return NextResponse.json({success: true, data: users}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();

    const {success, error, data} = UserSchema.safeParse(body);
    if (!success) throw new ValidationError(error.flatten().fieldErrors);
    const {email, username} = data;

    const existingUser = await User.findOne({email});
    if (existingUser) throw new Error("Email already in use");

    const existingUsername = await User.findOne({username});
    if (existingUsername) throw new Error("Username already taken");

    const newUser = await User.create(data);

    return NextResponse.json({success: true, data: newUser}, {status: 201});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

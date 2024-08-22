import {NextResponse} from "next/server";

import {User} from "@/database";
import connectDB from "@/lib/db";
import handleError from "@/lib/handlers/error";
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

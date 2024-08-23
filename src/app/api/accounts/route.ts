import {NextRequest, NextResponse} from "next/server";

import {Account} from "@/database";
import connectDB from "@/lib/db";
import handleError from "@/lib/handlers/error";
import {ForbiddenError, ValidationError} from "@/lib/http-errors";
import {AccountSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";

export const GET = async () => {
  try {
    await connectDB();

    const accounts = await Account.find();

    return NextResponse.json({success: true, data: accounts}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();
    const body = await request.json();

    const {success, error, data} = AccountSchema.safeParse(body);
    if (!success) throw new ValidationError(error.flatten().fieldErrors);
    const {provider, providerAccountId} = data;

    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
    });

    if (existingAccount)
      throw new ForbiddenError(
        "An account with the same provider already exists."
      );

    const newAccount = await Account.create(data);

    return NextResponse.json({success: true, data: newAccount}, {status: 201});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

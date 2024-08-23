import {Account} from "@/database";
import connectDB from "@/lib/db";
import handleError from "@/lib/handlers/error";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import {AccountSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
  const {providerAccountId} = await request.json();

  try {
    await connectDB();

    const {success, error, data} = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!success) throw new ValidationError(error.flatten().fieldErrors);

    const account = await Account.findOne(data);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

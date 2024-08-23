import {Account} from "@/database";
import connectDB from "@/lib/db";
import handleError from "@/lib/handlers/error";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import {AccountSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";
import {NextRequest, NextResponse} from "next/server";

export const GET = async (
  _: NextRequest,
  {params}: {params: Promise<{id: string}>}
) => {
  const {id} = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await connectDB();

    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

export const DELETE = async (
  _: NextRequest,
  {params}: {params: Promise<{id: string}>}
) => {
  const {id} = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await connectDB();

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({success: true, data: account}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

export const PUT = async (
  request: Request,
  {params}: {params: Promise<{id: string}>}
) => {
  const {id} = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await connectDB();

    const body = await request.json();
    const {success, error, data} = AccountSchema.partial().safeParse(body);
    if (!success) throw new ValidationError(error.flatten().fieldErrors);

    const updatedAccount = await Account.findByIdAndUpdate(id, data, {new: true});

    if (!updatedAccount) throw new NotFoundError("Account");

    return NextResponse.json({success: true, data: updatedAccount}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

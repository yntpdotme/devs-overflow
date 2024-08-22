import {User} from "@/database";
import connectDB from "@/lib/db";
import handleError from "@/lib/handlers/error";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import {UserSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";
import {NextRequest, NextResponse} from "next/server";

export const GET = async (
  _: NextRequest,
  {params}: {params: Promise<{id: string}>}
) => {
  const {id} = await params;

  if (!id) throw new NotFoundError("User");

  try {
    await connectDB();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

export const DELETE = async (
  _: NextRequest,
  {params}: {params: Promise<{id: string}>}
) => {
  const {id} = await params;

  if (!id) throw new NotFoundError("User");

  try {
    await connectDB();

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

export const PUT = async (
  request: Request,
  {params}: {params: Promise<{id: string}>}
) => {
  const {id} = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await connectDB();

    const body = await request.json();
    const {success, error, data} = UserSchema.partial().safeParse(body);
    if (!success) throw new ValidationError(error.flatten().fieldErrors);

    const updatedUser = await User.findByIdAndUpdate(id, data, {new: true});

    if (!updatedUser) throw new NotFoundError("User");

    return NextResponse.json({success: true, data: updatedUser}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

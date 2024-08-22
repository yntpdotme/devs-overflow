import {User} from "@/database";
import handleError from "@/lib/handlers/error";
import {NotFoundError, ValidationError} from "@/lib/http-errors";
import {UserSchema} from "@/lib/schemas";
import {APIErrorResponse} from "@/types";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
  const {email} = await request.json();

  try {
    const {success, error, data} = UserSchema.partial().safeParse({email});
    if (!success) throw new ValidationError(error.flatten().fieldErrors);

    const user = await User.findOne(data);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({success: true, data: user}, {status: 200});
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

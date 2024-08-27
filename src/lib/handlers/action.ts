"use server";

import {Session} from "next-auth";
import {ZodError, ZodSchema} from "zod";

import {auth} from "@/auth";
import connectDB from "@/lib/db";
import {UnauthorizedError, ValidationError} from "@/lib/http-errors";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

const action = async <T>({params, schema, authorize}: ActionOptions<T>) => {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError)
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      return new Error("Schema validation failed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) return new UnauthorizedError();
  }

  await connectDB();

  return {params, session};
};

export default action;

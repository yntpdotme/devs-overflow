"use server";
import mongoose from "mongoose";
import {revalidatePath} from "next/cache";

import ROUTES from "@/constants/routes";
import {Question} from "@/database";
import Answer, {AnswerDoc} from "@/database/answer.model";
import {action, handleError} from "@/lib/handlers";
import {AnswerSchema} from "@/lib/schemas";
import {ActionResponse, CreateAnswerParams, ErrorResponse} from "@/types";

export const createAnswer = async (
  params: CreateAnswerParams
): Promise<ActionResponse<AnswerDoc>> => {
  const validationResult = await action({
    params,
    schema: AnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {content, questionId} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const [answer] = await Answer.create(
      [{question: questionId, author: userId, content}],
      {session}
    );
    if (!answer) throw new Error("Failed to create answer");

    question.answers += 1;
    await question.save({session});

    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {success: true, data: JSON.parse(JSON.stringify(answer))};
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

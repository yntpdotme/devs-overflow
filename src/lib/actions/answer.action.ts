"use server";
import mongoose from "mongoose";
import {revalidatePath} from "next/cache";

import ROUTES from "@/constants/routes";
import {Question, Vote} from "@/database";
import Answer, {AnswerDoc} from "@/database/answer.model";
import {action, handleError} from "@/lib/handlers";
import {
  AnswerSchema,
  DeleteAnswerSchema,
  GetAnswersSchema,
} from "@/lib/schemas";
import {
  ActionResponse,
  Answer as AnswerType,
  CreateAnswerParams,
  DeleteAnswerParams,
  ErrorResponse,
  GetAnswersParams,
} from "@/types";
import {after} from "next/server";
import {createInteraction} from "./interaction.action";

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

  try {
    session.startTransaction();

    const question = await Question.findById(questionId);
    if (!question) throw new Error("Question not found");

    const [answer] = await Answer.create(
      [{question: questionId, author: userId, content}],
      {session}
    );
    if (!answer) throw new Error("Failed to create answer");

    question.answers += 1;
    await question.save({session});

    after(async () => {
      await createInteraction({
        action: "post",
        actionId: answer._id.toString(),
        actionType: "answer",
        authorId: userId as string,
      });
    });
    
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {success: true, data: JSON.parse(JSON.stringify(answer))};
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session?.endSession();
  }
};

export const getAnswers = async (
  params: GetAnswersParams
): Promise<
  ActionResponse<{answers: AnswerType[]; isNext: boolean; totalAnswers: number}>
> => {
  const validationResult = await action({
    params,
    schema: GetAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    questionId,
    page = 1,
    pageSize = 10,
    filter,
  } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = {createdAt: -1};
      break;

    case "oldest":
      sortCriteria = {createdAt: 1};
      break;

    case "popular":
      sortCriteria = {upvotes: -1};
      break;

    default:
      sortCriteria = {createdAt: -1};
  }

  try {
    const totalAnswers = await Answer.countDocuments({question: questionId});

    const answers = await Answer.find({question: questionId})
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalAnswers > skip + limit;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const deleteAnswer = async (
  params: DeleteAnswerParams
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {answerId} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const answer = await Answer.findById(answerId).session(session);

    if (!answer) throw new Error("Answer not found");
    if (answer.author.toString() !== userId) throw new Error("Unauthorized");

    // remove all votes of the answer
    await Vote.deleteMany({
      actionId: answerId,
      actionType: "answer",
    }).session(session);

    // delete answer
    await Answer.findByIdAndDelete(answerId).session(session);

    // update question's answer count
    const question = await Question.findById(answer.question).session(session);
    if (!question) throw new Error("Question not found");

    question.answers -= 1;
    await question.save({session});

    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: answerId,
        actionType: "answer",
        authorId: userId as string,
      });
    });

    await session.commitTransaction();

    revalidatePath(ROUTES.PROFILE(userId!));

    return {success: true};
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session?.endSession();
  }
};

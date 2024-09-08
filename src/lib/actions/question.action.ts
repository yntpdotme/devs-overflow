"use server"

import mongoose from "mongoose";

import {Question, Tag, TagQuestion} from "@/database";
import {action, handleError} from "@/lib/handlers";
import {AskQuestionSchema} from "@/lib/schemas";
import {ActionResponse, CreateQuestionParams, ErrorResponse} from "@/types";
import { QuestionDoc } from "@/database/question.model";

export const createQuestion = async (
  params: CreateQuestionParams
): Promise<ActionResponse<QuestionDoc>> => {
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {title, content, tags} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{title, content, author: userId}],
      {session}
    );
    if (!question) throw new Error("Filed to create question");

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {name: {$regex: `^${tag}$`, $options: "i"}},
        {$setOnInsert: {name: tag}, $inc: {questions: 1}},
        {upsert: true, new: true, session}
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, {session});
    await Question.findByIdAndUpdate(
      question._id,
      {$push: {tags: {$each: tagIds}}},
      {session}
    );

    await session.commitTransaction();

    return {success: true, data: JSON.parse(JSON.stringify(question))};
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

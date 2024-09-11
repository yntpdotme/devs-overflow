"use server";

import mongoose from "mongoose";

import {Question, Tag, TagQuestion} from "@/database";
import {QuestionDoc} from "@/database/question.model";
import {action, handleError} from "@/lib/handlers";
import {AskQuestionSchema, GetQuestionSchema} from "@/lib/schemas";
import {
  ActionResponse,
  CreateQuestionParams,
  ErrorResponse,
  GetQuestionParams,
  Question as QuestionType,
} from "@/types";

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
    if (!question) throw new Error("Failed to create question");

    const tagUpdates = tags.map(tag => ({
      updateOne: {
        filter: {name: tag.toLowerCase()},
        update: {$setOnInsert: {name: tag.toLowerCase()}, $inc: {questions: 1}},
        upsert: true,
      },
    }));

    await Tag.bulkWrite(tagUpdates, {session});

    const tagNames = tags.map(t => t.toLowerCase());
    const allTags = await Tag.find(
      {name: {$in: tagNames}},
      {_id: 1},
      {session}
    );

    await TagQuestion.insertMany(
      allTags.map(tag => ({tag: tag._id, question: question._id})),
      {session}
    );

    question.tags = allTags.map(t => t._id);

    await question.save({session});
    await session.commitTransaction();

    const finalQuestion = await Question.findById(question._id).lean();

    return {success: true, data: JSON.parse(JSON.stringify(finalQuestion))};
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const getQuestion = async (
  params: GetQuestionParams
): Promise<ActionResponse<QuestionType>> => {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {questionId} = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");

    if (!question) {
      throw new Error("Question not found");
    }

    return {success: true, data: JSON.parse(JSON.stringify(question))};
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

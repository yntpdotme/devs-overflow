"use server";

import mongoose, {ClientSession} from "mongoose";

import {Answer, Question, Vote} from "@/database";
import {action, handleError} from "@/lib/handlers";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "@/lib/schemas";
import {
  ActionResponse,
  CreateVoteParams,
  ErrorResponse,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteCountParams,
} from "@/types";

export const updateVoteCount = async (
  params: UpdateVoteCountParams,
  session?: ClientSession
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {actionId, actionType, voteType, change} = validationResult.params!;
  const Model = actionType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      actionId,
      {$inc: {[voteField]: change}},
      {new: true, session}
    );

    if (!result) throw new Error("Failed to update vote count");

    return {success: true};
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const createVote = async (
  params: CreateVoteParams
): Promise<ActionResponse> => {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {actionId, actionType, voteType} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId,
      actionType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // remove vote if same type
        await Vote.deleteOne({_id: existingVote._id}).session(session);

        await updateVoteCount(
          {actionId, actionType, voteType, change: -1},
          session
        );
      } else {
        // change vote type
        await Vote.findByIdAndUpdate(
          existingVote._id,
          {voteType},
          {new: true, session}
        );

        await updateVoteCount(
          {actionId, actionType, voteType: existingVote.voteType, change: -1},
          session
        );

        await updateVoteCount(
          {actionId, actionType, voteType, change: 1},
          session
        );
      }
    } else {
      await Vote.create([{author: userId, actionId, actionType, voteType}], {
        session,
      });

      await updateVoteCount(
        {actionId, actionType, voteType, change: 1},
        session
      );
    }

    await session.commitTransaction();

    return {success: true};
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
};

export const hasVoted = async (
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> => {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {actionId, actionType} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId,
      actionType,
    });

    if (!vote) {
      return {
        success: false,
        data: {
          hasUpVoted: false,
          hasDownVoted: false,
        },
      };
    }

    return {
      success: true,
      data: {
        hasUpVoted: vote.voteType === "upvote",
        hasDownVoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

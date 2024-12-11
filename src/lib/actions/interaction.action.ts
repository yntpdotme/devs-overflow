"use server";

import mongoose from "mongoose";

import {Interaction, User} from "@/database";
import {InteractionDoc} from "@/database/interaction.model";
import {handleError} from "@/lib/handlers";
import action from "@/lib/handlers/action";
import {CreateInteractionSchema} from "@/lib/schemas";
import {
  ActionResponse,
  CreateInteractionParams,
  ErrorResponse,
  UpdateReputationParams,
} from "@/types";

const updateReputation = async (params: UpdateReputationParams) => {
  const {interaction, session, performerId, authorId} = params;
  const {action, actionType} = interaction;

  let performerPoints = 0;
  let authorPoints = 0;

  switch (action) {
    case "upvote":
      performerPoints = 2;
      authorPoints = 10;
      break;
    case "downvote":
      performerPoints = -1;
      authorPoints = -2;
      break;
    case "post":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
    case "delete":
      authorPoints = actionType === "question" ? 5 : 10;
      break;
  }

  if (performerId === authorId) {
    await User.findByIdAndUpdate(
      performerId,
      {$inc: {reputation: performerPoints}},
      {session}
    );

    return;
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: {_id: performerId},
          update: {$inc: {reputation: authorPoints}},
        },
      },
      {
        updateOne: {
          filter: {_id: authorId},
          update: {$inc: {reputation: performerPoints}},
        },
      },
    ],
    {session}
  );
};

export const createInteraction = async (
  params: CreateInteractionParams
): Promise<ActionResponse<InteractionDoc>> => {
  const validationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {action: a, actionId, actionType, authorId} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const [interaction] = await Interaction.create(
      [{user: userId, action: a, actionId, actionType}],
      {session}
    );

    await updateReputation({
      interaction,
      session,
      performerId: userId!,
      authorId,
    });

    await session.commitTransaction();

    return {success: true, data: JSON.parse(JSON.stringify(interaction))};
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session?.endSession();
  }
};

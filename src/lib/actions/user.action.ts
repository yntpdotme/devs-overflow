"use server";

import {FilterQuery} from "mongoose";

import {Answer, Question, User} from "@/database";
import {action, handleError} from "@/lib/handlers";
import {GetUserSchema, PaginatedSearchParamsSchema} from "@/lib/schemas";
import {
  ActionResponse,
  ErrorResponse,
  GetUserParams,
  PaginatedSearchParams,
  User as UserType,
} from "@/types";

export const getUsers = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{users: UserType[]; isNext: boolean}>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {page = 1, pageSize = 10, query, filter} = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof User> = {};
  if (query) {
    filterQuery.$or = [
      {name: {$regex: new RegExp(query, "i")}},
      {username: {$regex: new RegExp(query, "i")}},
      {email: {$regex: new RegExp(query, "i")}},
    ];
  }

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
    const totalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalUsers > skip + limit;

    return {
      success: true,
      data: {users: JSON.parse(JSON.stringify(users)), isNext},
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUser = async (
  params: GetUserParams
): Promise<
  ActionResponse<{
    user: UserType;
    totalQuestions: number;
    totalAnswers: number;
  }>
> => {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {userId} = validationResult.params!;

  try {
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    const totalQuestions = await Question.countDocuments({author: userId});
    const totalAnswers = await Answer.countDocuments({author: userId});

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

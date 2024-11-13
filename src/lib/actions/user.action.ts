"use server";

import {FilterQuery, PipelineStage, Types} from "mongoose";

import {Answer, Question, User} from "@/database";
import {action, handleError} from "@/lib/handlers";
import {
  GetUserAnswersSchema,
  GetUserQuestionsSchema,
  GetUserSchema,
  GetUserTagsSchema,
  PaginatedSearchParamsSchema,
} from "@/lib/schemas";
import {assignBadges} from "@/lib/utils";
import {
  ActionResponse,
  Answer as AnswerType,
  Badges,
  ErrorResponse,
  GetUserAnswersParams,
  GetUserParams,
  GetUserQuestionsParams,
  GetUserTagsParams,
  PaginatedSearchParams,
  Question as QuestionType,
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

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserStats = async (
  params: GetUserParams
): Promise<
  ActionResponse<{
    totalQuestions: number;
    totalAnswers: number;
    badges: Badges;
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
    const [questionStats] = await Question.aggregate([
      {
        $match: {author: new Types.ObjectId(userId)},
      },
      {
        $group: {
          _id: null,
          count: {$sum: 1},
          upvotes: {$sum: "$upvotes"},
          views: {$sum: "$views"},
        },
      },
    ]);

    const [answerStats] = await Answer.aggregate([
      {
        $match: {author: new Types.ObjectId(userId)},
      },
      {
        $group: {
          _id: null,
          count: {$sum: 1},
          upvotes: {$sum: "$upvotes"},
        },
      },
    ]);

    const badges = assignBadges({
      criteria: [
        {type: "QUESTION_COUNT", count: questionStats.count},
        {type: "ANSWER_COUNT", count: answerStats.count},
        {type: "QUESTION_UPVOTES", count: questionStats.upvotes},
        {type: "ANSWER_UPVOTES", count: answerStats.upvotes},
        {type: "TOTAL_VIEWS", count: questionStats.views},
      ],
    });

    return {
      success: true,
      data: {
        totalQuestions: questionStats?.count || 0,
        totalAnswers: answerStats?.count || 0,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserQuestions = async (
  params: GetUserQuestionsParams
): Promise<ActionResponse<{questions: QuestionType[]; isNext: boolean}>> => {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {userId, page = 1, pageSize = 10} = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const totalQuestions = await Question.countDocuments({author: userId});

    const questions = await Question.find({author: userId})
      .populate("tags", "name")
      .populate("author", "_id name image")
      .sort({views: -1})
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + limit;

    return {
      success: true,
      data: {questions: JSON.parse(JSON.stringify(questions)), isNext},
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserAnswers = async (
  params: GetUserAnswersParams
): Promise<ActionResponse<{answers: AnswerType[]; isNext: boolean}>> => {
  const validationResult = await action({
    params,
    schema: GetUserAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {userId, page = 1, pageSize = 10} = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const totalAnswers = await Answer.countDocuments({author: userId});

    const answers = await Answer.find({author: userId})
      .populate("author", "_id name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + limit;

    return {
      success: true,
      data: {answers: JSON.parse(JSON.stringify(answers)), isNext},
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserTopTags = async (
  params: GetUserTagsParams
): Promise<
  ActionResponse<{tags: {_id: string; name: string; count: number}[]}>
> => {
  const validationResult = await action({
    params,
    schema: GetUserTagsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const {userId} = validationResult.params!;
  try {
    const pipeline: PipelineStage[] = [
      {$match: {author: new Types.ObjectId(userId)}},
      {$unwind: "$tags"},
      {
        $group: {
          _id: "$tags",
          count: {$sum: 1},
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      {$unwind: "$tagInfo"},
      {$sort: {count: -1}},
      {$limit: 10},
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: {tags: JSON.parse(JSON.stringify(tags))},
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

import {FilterQuery} from "mongoose";

import {Question} from "@/database";
import Tag from "@/database/tag.model";
import {action, handleError} from "@/lib/handlers";
import {
  GetTagQuestionsSchema,
  PaginatedSearchParamsSchema,
} from "@/lib/schemas";
import {
  ActionResponse,
  ErrorResponse,
  GetTagQuestionsParams,
  PaginatedSearchParams,
  Question as QuestionType,
  Tag as TagType,
} from "@/types";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{tags: TagType[]; isNext: boolean}>> => {
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

  const filterQuery: FilterQuery<typeof Tag> = {};
  if (query) {
    filterQuery.name = {$regex: new RegExp(query, "i")};
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = {questions: -1};
      break;

    case "recent":
      sortCriteria = {createdAt: -1};
      break;

    case "oldest":
      sortCriteria = {createdAt: 1};
      break;

    case "name":
      sortCriteria = {name: 1};
      break;

    default:
      sortCriteria = {questions: -1};
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);

    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalTags > skip + limit;

    return {
      success: true,
      data: {tags: JSON.parse(JSON.stringify(tags)), isNext},
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTagQuestions = async (
  params: GetTagQuestionsParams
): Promise<
  ActionResponse<{tag: TagType; questions: QuestionType[]; isNext: boolean}>
> => {
  const validationResult = await action({
    params,
    schema: GetTagQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {tagId, page = 1, pageSize = 10, query} = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");

    const filterQuery: FilterQuery<typeof Question> = {
      tags: {$in: [tagId]},
    };

    if (query) {
      filterQuery.title = {$regex: new RegExp(query, "i")};
    }

    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit)
      .lean();

    const isNext = totalQuestions > skip + limit;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

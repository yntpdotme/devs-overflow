import {FilterQuery} from "mongoose";

import Tag from "@/database/tag.model";
import {action, handleError} from "@/lib/handlers";
import {PaginatedSearchParamsSchema} from "@/lib/schemas";
import {ActionResponse, ErrorResponse, PaginatedSearchParams, Tag as TagType} from "@/types";

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
    filterQuery.$or = [{name: {$regex: new RegExp(query, "i")}}];
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

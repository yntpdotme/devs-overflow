"use server";

import {Answer, Question, Tag, User} from "@/database";
import {handleError} from "@/lib/handlers";
import action from "@/lib/handlers/action";
import {GlobalSearchSchema} from "@/lib/schemas";
import {
  ActionResponse,
  ErrorResponse,
  GlobalSearchItem,
  GlobalSearchParams,
} from "@/types";

export const globalSearch = async (
  params: GlobalSearchParams
): Promise<ActionResponse<GlobalSearchItem[]>> => {
  const validationResult = await action({
    params,
    schema: GlobalSearchSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {query, type} = validationResult.params!;
  const regexQuery = {$regex: new RegExp(query, "i")};

  let results = [];
  const modelsAndTypes = [
    {model: Question, type: "question", searchFiled: "title"},
    {model: Answer, type: "answer", searchFiled: "content"},
    {model: User, type: "user", searchFiled: "name"},
    {model: Tag, type: "tag", searchFiled: "name"},
  ];
  const searchableTypes = ["question", "answer", "user", "tag"];

  try {
    const typeLower = type?.toLowerCase();

    if (!typeLower || !searchableTypes.includes(typeLower)) {
      for (const {model, type, searchFiled} of modelsAndTypes) {
        const queryResults = await model
          .find({
            [searchFiled]: regexQuery,
          })
          .limit(2);

        results.push(
          ...queryResults.map(item => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchFiled],
            type,
            id:
              type === "user"
                ? item.username
                : type === "answer"
                  ? item.question
                  : item._id,
          }))
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find(item => item.type === type);
      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchFiled]: regexQuery,
        })
        .limit(8);

      results = queryResults.map(item => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchFiled],
        type,
        id: type === "answer" ? item.question : item._id,
      }));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

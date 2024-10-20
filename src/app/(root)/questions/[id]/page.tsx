import Link from "next/link";
import {notFound} from "next/navigation";
import {after} from "next/server";
import {Suspense} from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import {
  getAnswers,
  getQuestion,
  hasSavedQuestion,
  hasVoted,
  incrementViews,
} from "@/lib/actions";
import {formatNumber, getTimeStamp} from "@/lib/utils";
import {RouteParams, Tag} from "@/types";

const QuestionDetails = async ({params, searchParams}: RouteParams) => {
  const {id} = await params;
  const {page, pageSize, filter} = await searchParams;

  const {success, data: question} = await getQuestion({questionId: id});
  if (!success || !question) return notFound();

  after(async () => {
    await incrementViews({questionId: id});
  });

  const {
    author,
    createdAt,
    answers: totalAnswers,
    views,
    tags,
    content,
    title,
  } = question;

  const {
    success: answersSuccess,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  const hasVotedPromise = hasVoted({
    actionId: question._id,
    actionType: "question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });

  return (
    <section className="px-6 pt-12 sm:px-12 lg:pt-[80px]">
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <div className="flex items-center justify-start gap-2">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-6"
          />
          <Link href={ROUTES.PROFILE(author._id)}>
            <p className="paragraph-medium text-dark300_light700">
              {author.name}
            </p>
          </Link>
        </div>
        <div className="flex justify-end items-center gap-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              actionType="question"
              actionId={question._id}
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>

          <Suspense fallback={<div>Loading...</div>}>
            <SaveQuestion
              questionId={question._id}
              hasSavedQuestionPromise={hasSavedQuestionPromise}
            />
          </Suspense>
        </div>
      </div>

      <h2 className="h2-semibold text-dark200_light900 mt-3 w-full">{title}</h2>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` Asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
          imgStyles="size-[14px]"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={totalAnswers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <div className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={answersSuccess}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
          page={Number(page) || 1}
          isNext={answersResult?.isNext || false}
        />
      </div>

      <div className="mt-12">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </div>
    </section>
  );
};

export default QuestionDetails;

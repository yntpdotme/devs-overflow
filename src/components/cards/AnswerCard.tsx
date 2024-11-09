import Link from "next/link";

import Preview from "@/components/editor/Preview";
import EditDeleteAction from "@/components/user/EditDeleteAction";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { hasVoted } from "@/lib/actions";
import { cn, getTimeStamp } from "@/lib/utils";
import { Answer } from "@/types";
import { Suspense } from "react";

type AnswerCardProps = Answer & {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionButtons?: boolean;
};

const AnswerCard = ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
  showActionButtons,
}: AnswerCardProps) => {
  const hasVotedPromise = hasVoted({
    actionId: _id,
    actionType: "answer",
  });

  return (
    <article
      className={cn("light-border relative border-b py-10", containerClasses)}
    >
      <span id={`answer-${_id}`} className="hash-span" />

      {showActionButtons && (
        <div className="background-light800 flex-center absolute right-0 top-0 size-9 rounded-full">
          <EditDeleteAction type="Answer" itemId={_id} />
        </div>
      )}

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-2 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            imageUrl={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-1.5"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="small-regular text-light400_light500 ml-1 line-clamp-1 max-sm:ml-px max-sm:mt-0.5">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              actionType="answer"
              actionId={_id}
              upvotes={upvotes}
              downvotes={downvotes}
              hasVotedPromise={hasVotedPromise}
            />
          </Suspense>
        </div>
      </div>

      <Preview content={content} />

      {showReadMore && (
        <Link
          href={ROUTES.QUESTION(question) + `#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      )}
    </article>
  );
};

export default AnswerCard;

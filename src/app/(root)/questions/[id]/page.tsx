import Link from "next/link";
import {notFound} from "next/navigation";
import {after} from "next/server";

import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/Votes";
import ROUTES from "@/constants/routes";
import {getQuestion, incrementViews} from "@/lib/actions";
import {formatNumber, getTimeStamp} from "@/lib/utils";
import {RouteParams, Tag} from "@/types";

const QuestionDetails = async ({params}: RouteParams) => {
  const {id} = await params;

  const {success, data: question} = await getQuestion({questionId: id});
  if (!success || !question) return notFound();

  after(async () => {
    await incrementViews({questionId: id});
  });

  const {author, createdAt, answers, views, tags, content, title} = question;

  return (
    <section className="px-6 pt-12 sm:px-12">
      <div className="flex w-full flex-col-reverse justify-between sm:flex-row">
        <div className="flex items-center justify-start gap-2">
          <UserAvatar id={author._id} name={author.name} className="size-6" />
          <Link href={ROUTES.PROFILE(author._id)}>
            <p className="paragraph-medium text-dark300_light700">
              {author.name}
            </p>
          </Link>
        </div>
        <div className="flex justify-end">
          <Votes />
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
          value={answers}
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
    </section>
  );
};

export default QuestionDetails;

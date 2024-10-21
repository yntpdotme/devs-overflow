import DataRenderer from "@/components/DataRenderer";
import ROUTES from "@/constants/routes";
import {getHotQuestions, getTopTags} from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";
import TagCard from "../cards/TagCard";

const RightSidebar = async () => {
  const [
    {success, data: hotQuestions, error},
    {success: tagSuccess, data: tags, error: tagError},
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollbar custom-scrollbar-left background-light900_dark200 light-border sticky left-0 top-0 flex h-full w-[300px] flex-col gap-1 overflow-y-auto border-r p-8 pb-6 pt-[80px] shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-semibold text-dark200_light900">Top Questions</h3>

        <DataRenderer
          success={success}
          error={error}
          data={hotQuestions}
          empty={{
            title: "No questions found",
            message: "No questions have been asked yet.",
          }}
          render={hotQuestions => (
            <div className="mt-7 flex w-full flex-col gap-7">
              {hotQuestions.map(({_id, title}, index) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-start gap-2.5"
                >
                  <Image
                    src={
                      (index & 1) === 0
                        ? "/icons/question-primary.svg"
                        : "/icons/question-accent.svg"
                    }
                    alt="Question"
                    width={20}
                    height={20}
                  />
                  <p className="body-medium text-dark500_light700 self-end line-clamp-2">
                    {title}
                  </p>
                </Link>
              ))}
            </div>
          )}
        />
      </div>

      <div className="mt-12">
        <h3 className="h3-semibold text-dark200_light900">Popular Tags</h3>
        <DataRenderer
          success={tagSuccess}
          error={tagError}
          data={tags}
          empty={{
            title: "No tags found",
            message: "No tags have been created yet.",
          }}
          render={tags => (
            <div className="mt-7 flex w-full flex-col gap-4">
              {tags.map(({_id, name, questions}) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;

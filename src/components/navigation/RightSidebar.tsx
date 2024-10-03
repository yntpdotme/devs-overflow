import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import TagCard from "../cards/TagCard";

const hotQuestions = [
  {_id: "1", title: "How to create a custom hook in React?"},
  {_id: "2", title: "How to use React Query?"},
  {_id: "3", title: "How to use Redux?"},
  {_id: "4", title: "How to use React Router?"},
  {_id: "5", title: "How to use React Context?"},
];

const popularTags = [
  {_id: "1", name: "react", questions: 100},
  {_id: "2", name: "javascript", questions: 200},
  {_id: "3", name: "typescript", questions: 150},
  {_id: "4", name: "nextjs", questions: 50},
  {_id: "5", name: "react-query", questions: 75},
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar custom-scrollbar-left background-light900_dark200 light-border sticky left-0 top-0 flex h-full w-[300px] flex-col gap-1 overflow-y-auto border-r p-8 pb-6 pt-[80px] shadow-light-300 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-semibold text-dark200_light900">Top Questions</h3>

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
              <p className="body-medium text-dark500_light700 self-end">
                {title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h3 className="h3-semibold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex w-full flex-col gap-4">
          {popularTags.map(({_id, name, questions}) => (
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
      </div>
    </section>
  );
};

export default RightSidebar;

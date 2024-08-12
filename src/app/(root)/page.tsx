import Link from "next/link";

import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/navigation/search/LocalSearch";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const questions = [
  {
    _id: "1",
    title: "How to learn React?",
    description: "I want to learn React, can anyone help me?",
    tags: [
      {_id: "1", name: "React"},
      {_id: "2", name: "JavaScript"},
    ],
    author: {_id: "1", name: "John Doe"},
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    description: "I want to learn JavaScript, can anyone help me?",
    tags: [
      {_id: "1", name: "React"},
      {_id: "2", name: "JavaScript"},
    ],
    author: {_id: "1", name: "John Doe"},
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date(),
  },
];

const Home = () => {
  return (
    <>
      <section className="flex flex-col-reverse justify-between gap-4 px-6 pt-10 sm:flex-row sm:items-center sm:px-12 lg:pt-12">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[45px] px-4 py-3 !text-light-900 max-sm:self-end"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION} className="">
            Ask a Question
          </Link>
        </Button>
      </section>

      <section className="mt-11 px-6 sm:px-12">
        <LocalSearch />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-4 px-6 sm:px-12">
        {questions.map(q => (
          <h3 key={q._id} className="text-lg font-semibold">
            {q.title}
          </h3>
        ))}
      </div>
    </>
  );
};

export default Home;

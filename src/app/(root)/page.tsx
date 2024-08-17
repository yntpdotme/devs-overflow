import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
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
    author: {
      _id: "1",
      name: "John Doe",
      image: "",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2025-01-29"),
  },
  {
    _id: "2",
    title: "How to learn JavaScript?",
    description: "I want to learn JavaScript, can anyone help me?",
    tags: [
      {_id: "1", name: "JavaScript"},
      {_id: "2", name: "JS"},
    ],
    author: {
      _id: "2",
      name: "John Smith",
      image: "",
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2024-09-01"),
  },
];

type HomeProps = {
  searchParams: Promise<Record<string, string>>;
};

const Home = async ({searchParams}: HomeProps) => {
  const {q = ""} = await searchParams;

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

      <section className="mt-8 px-6 sm:mt-10 sm:px-12">
        <LocalSearch
          route={ROUTES.HOME}
          placeholder="Search for questions here..."
          otherClasses="flex-1"
        />
      </section>

      <HomeFilter />

      <div className="mt-10 flex w-full flex-col gap-8 px-6 sm:px-12">
        {questions
          .filter(question =>
            question.title.toLowerCase().includes(q?.toLowerCase())
          )
          .map(question => (
            <QuestionCard key={question._id} question={question} />
          ))}
      </div>
    </>
  );
};

export default Home;

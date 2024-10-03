import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import {EMPTY_QUESTION} from "@/constants/states";
import {getQuestions} from "@/lib/actions";
import {RouteParams} from "@/types";

const Home = async ({searchParams}: RouteParams) => {
  const {page, pageSize, query, filter} = await searchParams;

  const {success, data, error} = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const {questions} = data || {};

  return (
    <>
      <section className="flex flex-col-reverse justify-between gap-4 px-6 pt-10 sm:flex-row sm:items-center sm:px-12 lg:pt-16">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[45px] rounded-md px-4 py-3 !text-light-900 max-sm:self-end"
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

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={questions => (
          <div className="mt-10 flex w-full flex-col gap-8 px-6 sm:px-12">
            {questions.map(question => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Home;

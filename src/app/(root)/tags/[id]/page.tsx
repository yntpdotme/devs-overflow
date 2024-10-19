import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import Filter from "@/components/filters/Filter";
import LocalSearch from "@/components/search/LocalSearch";
import {TagQuestionFilters} from "@/constants/filters";
import ROUTES from "@/constants/routes";
import {EMPTY_QUESTION} from "@/constants/states";
import {getTagQuestions} from "@/lib/actions";
import {RouteParams} from "@/types";

const Tag = async ({params, searchParams}: RouteParams) => {
  const {id: tagId} = await params;
  const {page, pageSize, q: query, filter} = await searchParams;

  const {success, data, error} = await getTagQuestions({
    tagId,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter,
  });

  const {tag, questions} = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 px-6 pt-10 sm:px-12 lg:pt-16">
        {tag?.name ? tag.name[0].toUpperCase() + tag.name.slice(1) : ""}
      </h1>

      <section className="mt-8 px-6 sm:mt-10 sm:px-12 flex max-sm:flex-col gap-8">
        <LocalSearch
          route={ROUTES.TAG(tagId)}
          placeholder="Search for tags here..."
          otherClasses="flex-1"
        />

        <Filter
          filters={TagQuestionFilters}
          otherClasses="min-h-[48px] sm:h-full sm:min-w-[180px]"
        />
      </section>

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

export default Tag;

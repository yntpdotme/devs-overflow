import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import {EMPTY_COLLECTIONS} from "@/constants/states";
import {getSavedQuestions} from "@/lib/actions";
import {RouteParams} from "@/types";

const Collections = async ({searchParams}: RouteParams) => {
  const {page, pageSize, q: query, filter} = await searchParams;

  const {success, data, error} = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const {collection} = data || {};

  return (
    <>
      <section className="flex flex-col gap-8 px-6 pt-10 sm:px-12 lg:pt-16">
        <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      </section>

      <section className="mt-8 px-6 sm:mt-10 sm:px-12">
        <LocalSearch
          route={ROUTES.COLLECTION}
          placeholder="Search for questions here..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_COLLECTIONS}
        render={collection => (
          <div className="mt-10 flex w-full flex-col gap-8 px-6 sm:px-12">
            {collection.map(item => (
              <QuestionCard key={item._id} question={item.question} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Collections;

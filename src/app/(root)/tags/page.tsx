import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import {EMPTY_TAGS} from "@/constants/states";
import {getTags} from "@/lib/actions";
import {RouteParams} from "@/types";

const Tags = async ({searchParams}: RouteParams) => {
  const {page, pageSize, query, filter} = await searchParams;

  const {success, data, error} = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const {tags} = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 px-6 pt-10 sm:px-12 lg:pt-16">
        Tags
      </h1>

      <section className="mt-8 px-6 sm:mt-10 sm:px-12">
        <LocalSearch
          route={ROUTES.TAGS}
          placeholder="Search for tags here..."
          otherClasses="flex-1"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={tags => (
          <div className="mt-10 grid w-full grid-cols-1 gap-8 px-6 sm:px-12 lg:grid-cols-2 2xl:grid-cols-3">
            {tags.map(tag => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Tags;

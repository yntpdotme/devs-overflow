import UserCard from "@/components/cards/UserCard";
import DataRenderer from "@/components/DataRenderer";
import Filter from "@/components/filters/Filter";
import LocalSearch from "@/components/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import ROUTES from "@/constants/routes";
import { EMPTY_USERS } from "@/constants/states";
import {getUsers} from "@/lib/actions";
import {RouteParams} from "@/types";

const Community = async ({searchParams}: RouteParams) => {
  const {page, pageSize, q: query, filter} = await searchParams;

  const {success, data, error} = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const {users} = data || {};

  return (
    <>
      <section className="flex flex-col gap-8 px-6 pt-10 sm:px-12 lg:pt-16">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </section>


      <section className="mt-8 px-6 sm:mt-10 sm:px-12 flex max-sm:flex-col gap-8">
        <LocalSearch
          route={ROUTES.COMMUNITY}
          placeholder="There are some great devs here..."
          otherClasses="flex-1"
        />

        <Filter
          filters={UserFilters}
          otherClasses="min-h-[48px] sm:h-full sm:min-w-[180px]"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={users}
        empty={EMPTY_USERS}
        render={users => (
          <div className="mt-10 flex w-full flex-wrap gap-8 px-6 sm:px-12">
            {users.map(user => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      />
    </>
  );
};

export default Community;

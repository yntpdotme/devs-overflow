import JobCard from "@/components/cards/JobCard";
import DataRenderer from "@/components/DataRenderer";
import Filter from "@/components/filters/Filter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import {EMPTY_JOBS} from "@/constants/states";
import {fetchCountries, fetchJobs, fetchLocation} from "@/lib/actions";
import {RouteParams} from "@/types";

const FindJobs = async ({searchParams}: RouteParams) => {
  const {page, pageSize, q, location} = await searchParams;
  const {data: userLocation} = await fetchLocation();

  const buildJobQuery = () => {
    const targetLocation = location || userLocation;

    const searchTerm = q?.trim() || "software engineer jobs";

    if (targetLocation) {
      return `${searchTerm} in ${targetLocation}`;
    }
    return searchTerm;
  };

  const query = buildJobQuery();

  const {
    success,
    data: jobs,
    error,
  } = await fetchJobs({
    query,
    page: page ? parseInt(page) : 1,
  });

  const {data: countryList = []} = await fetchCountries();

  const processedCountries =
    countryList
      ?.map(country => ({
        name: country.name.common,
        value: country.name.common.toLowerCase().replace(/\s+/g, "-"),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 px-6 pt-10 sm:px-12 lg:pt-16">
        Jobs
      </h1>

      <section className="mt-8 flex gap-8 px-6 max-sm:flex-col sm:mt-10 sm:px-12">
        <LocalSearch
          route={ROUTES.JOBS}
          placeholder="Job Title, Company or Keywords"
          otherClasses="flex-1"
        />

        <Filter
          paramKey="location"
          filters={processedCountries}
          otherClasses="min-h-[48px] sm:h-full sm:min-w-[180px]"
          defaultOptionName="All Locations"
        />
      </section>

      <DataRenderer
        success={success}
        error={error}
        data={jobs}
        empty={EMPTY_JOBS}
        render={jobs => (
          <div className="mt-10 flex w-full flex-col gap-8 px-6 sm:px-12">
            {jobs.map(job => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
        )}
      />

      <Pagination
        page={page ? parseInt(page) : 1}
        isNext={jobs?.length === 10}
      />
    </>
  );
};

export default FindJobs;

import {Skeleton} from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <section className="flex flex-col gap-8 px-6 pt-10 sm:px-12 lg:pt-16">
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
      </section>

      <section className="mt-8 flex gap-8 px-6 max-sm:flex-col sm:mt-10 sm:px-12">
        <Skeleton className="h-12 flex-1" />

        <Skeleton className="h-12 sm:w-44" />
      </section>

      <div className="mt-10 flex w-full flex-wrap gap-8 px-6 sm:px-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
          <Skeleton
            key={item}
            className="h-60 w-full rounded-2xl xs:w-[230px]"
          />
        ))}
      </div>
    </>
  );
};

export default Loading;

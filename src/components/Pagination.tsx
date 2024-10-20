"use client";

import {useRouter, useSearchParams} from "next/navigation";

import {Button} from "@/components/ui/button";
import {formUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

type PaginationProps = {
  page: number | string | undefined;
  isNext: boolean;
  containerClasses?: string;
};

const Pagination = ({page = 1, isNext, containerClasses}: PaginationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleNavigation = (type: "prev" | "next" | "first" | "last") => {
    const nextPageNumber =
      type === "prev" ? Number(page) - 1 : Number(page) + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  return (
    <div
      className={cn(
        "max-sm:mt-10 mt-12 px-6 sm:px-12 flex items-center justify-center gap-2",
        containerClasses
      )}
    >
      {/* Previous Page Button */}
      <Button
        onClick={() => handleNavigation("prev")}
        className="light-border-2 btn flex items-center justify-center gap-2 border"
        size="sm"
        disabled={Number(page) === 1}
      >
        <p className="body-medium text-dark200_light800">Prev</p>
      </Button>

      <div className="flex items-center justify-center rounded-md bg-primary-500 px-4 py-3">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {/* Next Page Button */}
      <Button
        onClick={() => handleNavigation("next")}
        className="light-border-2 btn flex items-center justify-center gap-2 border"
        size="sm"
        disabled={!isNext}
      >
        <p className="body-medium text-dark200_light800">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;

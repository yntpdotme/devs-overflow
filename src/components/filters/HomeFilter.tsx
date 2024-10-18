"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {HomePageFilters} from "@/constants/filters";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";
import Filter from "./Filter";

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "";
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  const handleFilterChange = (value: string) => {
    const isSelected = value === selectedFilter;
    setSelectedFilter(isSelected ? "" : value);

    const newUrl = isSelected
      ? removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["filter"],
        })
      : formUrlQuery({
          params: searchParams.toString(),
          key: "filter",
          value: value.toLowerCase(),
        });

    router.push(newUrl, {scroll: false});
  };

  return (
    <div className="mt-10 flex gap-4 px-6 sm:px-12">
      {HomePageFilters.map(({name, value}) => (
        <Button
          key={value}
          onClick={() => handleFilterChange(value)}
          className={cn(
            "hidden body-medium rounded-md capitalize shadow-none sm:block px-6",
            selectedFilter === value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-300 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-dark-400 hover:bg-light-700 dark:bg-dark-300 dark:text-light-700 dark:hover:bg-dark-400"
          )}
        >
          {name}
        </Button>
      ))}

      <Filter
        filters={HomePageFilters}
        containerClasses="w-full sm:hidden"
        otherClasses="min-h-[45px]"
        defaultOptionName="All Questions"
      />
    </div>
  );
};

export default HomeFilter;

"use client";

import {useRouter, useSearchParams} from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {FilterOption} from "@/constants/filter";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

type FilterProps = {
  filters: FilterOption[];
  otherClasses?: string;
  containerClasses?: string;
};

const Filter = ({filters, otherClasses, containerClasses}: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get("filter");
  filters = [{label: "All Questions", value: "all"}, ...filters];

  const handleUpdateParams = (value: string) => {
    const newUrl =
      value === "all"
        ? removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["filter"],
          })
        : formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value,
          });
    router.push(newUrl, {scroll: false});
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "body-medium rounded-lg shadow-none border-none px-5 py-3.5 bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300 flex gap-2 justify-between ring-transparent !ring-0",
            otherClasses
          )}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="border-none bg-light-800 dark:bg-dark-300">
          <SelectGroup>
            {filters.map(item => (
              <SelectItem
                key={item.value}
                value={item.value}
                className={cn(
                  "cursor-pointer capitalize px-5 py-2",
                  "focus:bg-primary-100 focus:text-primary-500",
                  "dark:focus:bg-dark-400 dark:focus:text-primary-500",
                  paramFilter === item.value
                    ? "bg-primary-100 !text-primary-500 dark:bg-dark-400 dark:text-primary-500"
                    : "hover:bg-light-800 dark:hover:bg-dark-300"
                )}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;

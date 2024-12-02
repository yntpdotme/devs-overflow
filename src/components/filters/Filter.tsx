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
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

type Filter = {
  name: string;
  value: string;
};

type FilterProps = {
  paramKey?: string;
  filters: Filter[];
  otherClasses?: string;
  containerClasses?: string;
  defaultOptionName?: string;
};

const Filter = ({
  paramKey = "filter",
  filters,
  otherClasses = "",
  containerClasses = "",
  defaultOptionName = "All",
}: FilterProps) => {

  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get(paramKey);
  filters = [{name: defaultOptionName, value: "all"}, ...filters];

  const handleUpdateParams = (value: string) => {
    const newUrl =
      value === "all"
        ? removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: [paramKey],
          })
        : formUrlQuery({
            params: searchParams.toString(),
            key: paramKey,
            value,
          });

    router.push(newUrl, {scroll: false});
  };

  return (
    <div className={cn("relative", containerClasses)}>
      <Select
        onValueChange={handleUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            "paragraph-medium rounded-lg no-focus shadow-none border-none px-5 py-4 text-dark-400 dark:text-light-700 flex gap-2 justify-between ring-transparent !ring-0 background-light800_darkgradient",
            otherClasses
          )}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" className="" />
          </div>
        </SelectTrigger>
        <SelectContent className="border light-border bg-light-800 dark:bg-dark-200">
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
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;

"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

import {Button} from "@/components/ui/button";
import {GlobalSearchFilters} from "@/constants/filters";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParams = searchParams.get("type");
  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (value: string) => {
    const isSelected = value === active;
    setActive(isSelected ? "" : value);

    const newUrl = isSelected
      ? removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["type"],
        })
      : formUrlQuery({
          params: searchParams.toString(),
          key: "type",
          value: value.toLowerCase(),
        });

    router.push(newUrl, {scroll: false});
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map(item => (
          <Button
            size="sm"
            key={item.value}
            onClick={() => handleTypeClick(item.value)}
            className={cn(
              "light-border-2 small-medium rounded-md px-4 py-1.5 capitalize transition-colors",
              active === item.value
                ? "primary-gradient !text-white hover:bg-primary-100 dark:hover:bg-dark-400"
                : "bg-light-800 text-dark-400 hover:bg-light-700 dark:bg-dark-300 dark:text-light-700 dark:hover:bg-dark-400"
            )}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilter;

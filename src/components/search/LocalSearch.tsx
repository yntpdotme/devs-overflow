"use client";
import Image from "next/image";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

import {Input} from "@/components/ui/input";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";

type LocalSearchProps = {
  route: string;
  placeholder: string;
  otherClasses?: string;
};

const LocalSearch = ({
  route,
  placeholder,
  otherClasses = "",
}: LocalSearchProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: searchQuery,
        });
        router.push(newUrl, {scroll: false});
      } else if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["q"],
        });
        router.push(newUrl, {scroll: false});
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, route, pathname, searchParams]);

  return (
    <div
      className={`light-border border background-light800_darkgradient flex items-center gap-1 rounded-[10px] px-4 py-1.5 ${otherClasses}`}
    >
      <Image
        src="/icons/search.svg"
        width={18}
        height={18}
        alt="Search"
        className="cursor-pointer"
      />

      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />

      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="cursor-pointer"
          aria-label="Clear search"
        >
          <Image
            src="/icons/close.svg"
            width={20}
            height={20}
            alt="Clear"
            className=""
          />
        </button>
      )}
    </div>
  );
};

export default LocalSearch;

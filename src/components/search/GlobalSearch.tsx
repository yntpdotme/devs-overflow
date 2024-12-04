"use client";

import { Input } from "@/components/ui/input";
import {formUrlQuery, removeKeysFromUrlQuery} from "@/lib/url";
import Image from "next/image";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(Boolean(query));
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });
        router.push(newUrl, {scroll: false});
      } else {
        if (query) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["global", "type"],
          });
          router.push(newUrl, {scroll: false});
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, searchParams, router, query, pathname]);

  return (
    <div
      className="w-full max-w-[450px] max-lg:hidden relative"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient light-border relative flex items-center gap-0.5 rounded-xl border px-4 py-0.5">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={16}
          height={16}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent py-0 shadow-none outline-none"
        />
      </div>

      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;

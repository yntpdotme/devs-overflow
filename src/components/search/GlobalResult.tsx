import Image from "next/image";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

import GlobalFilter from "@/components/filters/GlobalFilter";
import ROUTES from "@/constants/routes";
import {globalSearch} from "@/lib/actions";
import logger from "@/lib/logger";
import {GlobalSearchItem} from "@/types";
import {AiOutlineReload} from "react-icons/ai";

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<GlobalSearchItem[]>([]);
  const [isloading, setLoading] = useState(true);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResults = async () => {
      setResult([]);
      setLoading(true);

      try {
        const {data} = await globalSearch({
          query: global as string,
          type,
        });

        setResult(data || []);
      } catch (error) {
        logger.error("Error fetching global search results:", error);
        setResult([]);
      } finally {
        setLoading(false);
      }
    };

    if (global) {
      fetchResults();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
      case "answer":
        return ROUTES.QUESTION(id);
      case "user":
        return ROUTES.PROFILE(id);
      case "tag":
        return ROUTES.TAG(id);
      default:
        return ROUTES.HOME;
    }
  };

  return (
    <div className="light-border absolute top-full z-10 mt-3 w-full rounded-xl border bg-light-800 py-5 shadow-sm dark:bg-dark-200">
      <GlobalFilter />
      <div className="my-5 h-[1px] bg-light-700/50 dark:bg-gray-500/20" />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {isloading ? (
          <div className="flex-center flex-col px-5">
            <AiOutlineReload className="my-2 size-10 animate-spin text-primary-500" />
            <p className="text-dark200_light800 body-regular">
              Browsing the whole database..
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {result?.length > 0 ? (
              result?.map((item: GlobalSearchItem, index) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50"
                >
                  <Image
                    src="/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="body-medium text-dark200_light800 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex-center flex-col px-5">
                <p className="text-5xl">🫣</p>
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  Oops, no results found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;

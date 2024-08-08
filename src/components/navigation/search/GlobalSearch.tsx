import {Input} from "@/components/ui/input";
import Image from "next/image";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[450px] max-lg:hidden">
      <div className="background-light800_darkgradient relative flex items-center rounded-xl px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={18}
          height={18}
          className="cursor-pointer"
        />

        <Input
          type="text"
          placeholder="Search globally"
          className="paragraph-regular no-focus text-dark400_light700 border-none bg-transparent py-0 shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;

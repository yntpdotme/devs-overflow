import {Input} from "@/components/ui/input";
import Image from "next/image";

const GlobalSearch = () => {
  return (
    <div className="w-full max-w-[450px] max-lg:hidden ">
      <div className="background-light800_darkgradient relative flex items-center gap-0.5 rounded-xl px-4 py-0.5 border light-border">
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
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none bg-transparent py-0 shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;

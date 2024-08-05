"use client";

import Image from "next/image";

import {Button} from "@/components/ui/button";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-10 flex-1 rounded-2 px-4 py-3.5";

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button className={buttonClass} onClick={() => {}}>
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={22}
          height={22}
          className="invert-colors object-contain sm:size-[20]"
        />
        <span className="hidden sm:ml-0.5 sm:block">Sign in with Github</span>
      </Button>

      <Button className={buttonClass} onClick={() => {}}>
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={22}
          height={22}
          className="object-contain sm:size-[20]"
        />
        <span className="hidden sm:ml-0.5 sm:block">Sign in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;

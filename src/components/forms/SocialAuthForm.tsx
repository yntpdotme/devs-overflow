"use client";

import {signIn} from "next-auth/react";
import Image from "next/image";

import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import {toast} from "@/hooks/use-toast";
import logger from "@/lib/logger";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-10 flex-1 rounded-2 px-4 py-3.5";

  const onClick = async (provider: "google" | "github") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      logger.error(error);

      toast({
        title: "Sign-in Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occured during sign-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Button className={buttonClass} onClick={() => onClick("github")}>
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={22}
          height={22}
          className="invert-colors object-contain sm:size-[20]"
        />
        <span className="hidden sm:ml-0.5 sm:block">Sign in with Github</span>
      </Button>

      <Button className={buttonClass} onClick={() => onClick("google")}>
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

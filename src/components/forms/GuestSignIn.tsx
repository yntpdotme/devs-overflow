"use client";

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {AiOutlineReload} from "react-icons/ai";

import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import {toast} from "@/hooks/use-toast";
import {signInAsGuest} from "@/lib/actions";

export const GuestSignIn = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const result = await signInAsGuest();

      if (result?.success) {
        toast({
          title: "Success",
          description: "Signed in as guest successfully",
        });

        router.replace(ROUTES.HOME);
      } else {
        toast({
          title: `Error ${result?.status}`,
          description: result?.error?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button
      onClick={onClick}
      className="background-dark400_light900 paragraph-medium text-dark200_light800 mt-6 min-h-10 w-full rounded-2 px-4 font-inter"
      disabled={isPending}
    >
      {isPending ? (
        <>
          <AiOutlineReload className="animate-spin" />
          <span>Signing up as a guest...</span>
        </>
      ) : (
        <>Continue as Guest</>
      )}
    </Button>
  );
};

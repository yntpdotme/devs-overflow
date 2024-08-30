"use client";

import {useRouter} from "next/navigation";
import {useState, useTransition} from "react";

import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import {signInAsGuest} from "@/lib/actions";
import {FormError} from "./FormError";
import {FormSuccess} from "./FormSuccess";

export const GuestSignIn = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onClick = () => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await signInAsGuest();

      if (result?.success) {
        setSuccess("Signed in as guest successfully");

        setTimeout(() => {
          router.push(ROUTES.HOME);
        }, 500);
      }

      setError(result?.error?.message);
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <FormError message={error} />
      <FormSuccess message={success} />
      <Button
        onClick={onClick}
        className="background-dark400_light900 paragraph-medium text-dark200_light800 min-h-10 w-full rounded-2 px-4 font-inter"
        disabled={isPending}
      >
        Continue As Guest
      </Button>
    </div>
  );
};

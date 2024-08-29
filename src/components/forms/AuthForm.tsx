import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import {ReactNode} from "react";
import {GuestSignIn} from "./GuestSignIn";
import SocialAuthForm from "./SocialAuthForm";

type AuthFormProps = {
  children: ReactNode;
  headerLabel: string;
  headerText: string;
  backButtonLabel: string;
  backButtonMessage: string;
  backButtonHref: string;
  showSocial?: boolean;
  showGuestSignIn?: boolean;
};

const AuthForm = ({
  children,
  headerLabel,
  headerText,
  backButtonLabel,
  backButtonMessage,
  backButtonHref,
  showSocial,
  showGuestSignIn,
}: AuthFormProps) => {
  return (
    <section className="light-border background-light800_dark200 shadow-light100_dark100 min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1.5">
          <h1 className="h2-bold text-dark100_light900">{headerLabel}</h1>
          <p className="paragraph-regular text-dark500_light400">
            {headerText}
          </p>
        </div>
        <Link href={ROUTES.HOME}>
          <Image
            src="images/site-logo.svg"
            alt="DevFlow Logo"
            width={50}
            height={50}
            className="object-contain max-sm:size-[40]"
          />
        </Link>
      </div>

      {children}

      {showSocial && <SocialAuthForm />}

      {showGuestSignIn && <GuestSignIn />}

      <p className="paragraph-regular mt-6 text-center">
        {backButtonMessage}
        <Link
          href={backButtonHref || ""}
          className="paragraph-semibold primary-text-gradient ml-1.5"
        >
          {backButtonLabel}
        </Link>
      </p>
    </section>
  );
};

export default AuthForm;

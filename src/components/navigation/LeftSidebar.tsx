import {LogOut} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {auth, signOut} from "@/auth";
import {Button} from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import NavLinks from "./navbar/NavLinks";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-full flex-col justify-between overflow-y-auto border-r px-3 pb-8 pt-10 shadow-light-300 dark:shadow-none max-sm:hidden lg:px-6 lg:pt-12 xl:w-[240px]">
      <div className="flex flex-1 flex-col gap-4 ">
        <NavLinks />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {userId ? (
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
          >
            <Button
              type="submit"
              className="base-medium flex w-fit items-center justify-start gap-4 !bg-transparent px-4 py-3"
            >
              <LogOut className="!size-[15px] text-black dark:text-white" />
              <span className="text-dark300_light900 paragraph-regular max-lg:hidden">
                Logout
              </span>
            </Button>
          </form>
        ) : (
          <>
            <Button
              className="small-medium btn-secondary min-h-[40px] rounded-lg px-4 py-3 shadow-none"
              asChild
            >
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  alt="Account"
                  width={16}
                  height={16}
                  className="invert-colors lg:hidden"
                />
                <span className="primary-text-gradient max-lg:hidden">
                  Sign In
                </span>
              </Link>
            </Button>
            <Button
              className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[40px] rounded-lg border px-4 py-3 shadow-none"
              asChild
            >
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  alt="Account"
                  width={16}
                  height={16}
                  className="invert-colors lg:hidden"
                />
                <span className="max-lg:hidden">Sign Up</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;

import Image from "next/image";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import NavLinks from "./NavLinks";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          width={30}
          height={30}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="border-none !bg-light-900 dark:!bg-dark-200"
      >
        <SheetHeader>
          <SheetTitle className="hidden">Navigation</SheetTitle>

          <SheetClose asChild>
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <Image
                src="images/site-logo.svg"
                width={20}
                height={20}
                alt="DevsFlow Logo"
              />

              <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
                Devs<span className="text-primary-500">Flow</span>
              </p>
            </Link>
          </SheetClose>
        </SheetHeader>

        <SheetClose asChild>
          <section className="no-scrollbar flex h-[calc(100dvh-200px)] flex-col gap-4 overflow-y-auto py-12">
            <NavLinks isMobileNav />
          </section>
        </SheetClose>

        <SheetFooter className="flex flex-col gap-3">
          <SheetClose asChild>
            <Link href={ROUTES.SIGN_IN}>
              <Button className="small-medium btn-secondary min-h-[40px] w-full rounded-lg px-4 py-3 shadow-none">
                <span className="primary-text-gradient">Sign In</span>
              </Button>
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link href={ROUTES.SIGN_UP}>
              <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[40px] w-full rounded-lg border px-4 py-3 shadow-none">
                Sign Up
              </Button>
            </Link>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;

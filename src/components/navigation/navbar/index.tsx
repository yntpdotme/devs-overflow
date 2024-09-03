import Image from "next/image";
import Link from "next/link";

import {auth} from "@/auth";
import GlobalSearch from "@/components/search/GlobalSearch";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 px-6 py-4 shadow-light-300 dark:shadow-none sm:px-12 lg:py-5">
      <Link href={ROUTES.HOME} className="flex items-center gap-2">
        <Image
          src="images/site-logo.svg"
          width={20}
          height={20}
          alt="DevsFlow Logo"
        />

        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Devs<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className="flex-between gap-3.5 sm:gap-5 xl:w-48 xl:justify-end">
        <Theme />

        {session?.user?.id && (
          <UserAvatar
            id={session.user.id}
            name={session.user.name!}
            imageUrl={session.user?.image}
            className="size-6 sm:size-8"
          />
        )}

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import GlobalSearch from "../search/GlobalSearch";
import MobileNavigation from "./MobileNavigation";
import Theme from "./Theme";

const Navbar = () => {
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

      <div className="flex-between gap-2.5 xl:w-48 xl:justify-end">
        <Theme />

        <MobileNavigation />
      </div>
    </nav>
  );
};

export default Navbar;

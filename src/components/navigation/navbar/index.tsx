import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 shadow-light-300 sm:px-12 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1.5">
        <Image
          src="images/site-logo.svg"
          width={20}
          height={20}
          alt="DevsFlow Logo"
        />

        <p className="h2-bold font-space-grotesk text-dark-100 max-sm:hidden dark:text-light-900">
          Devs<span className="text-primary-500">Flow</span>
        </p>
      </Link>

      <p className=" text-dark-100 dark:text-light-900">Global Search</p>

      <div className="flex-between gap-5 text-dark-100 dark:text-light-900">
        Theme
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import React from "react";

import {SheetClose} from "@/components/ui/sheet";
import {sidebarLinks} from "@/constants";
import ROUTES from "@/constants/routes";
import {cn} from "@/lib/utils";

const NavLinks = ({isMobileNav = false}: {isMobileNav?: boolean}) => {
  const pathname = usePathname();
  const userId = "1";

  return (
    <>
      {sidebarLinks.map(item => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "/profile") {
          if (userId) item.route = ROUTES.PROFILE(userId);
        }

        const LinkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              isActive
                ? "primary-gradient rounded-lg text-light-900"
                : "text-dark-300_light900",
              "flex items-center justify-start gap-4 bg-transparent px-4 py-3"
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={16}
              height={16}
              className={cn({"invert-colors": !isActive})}
            />
            <p
              className={cn(
                isActive ? "paragraph-semibold" : "paragraph-regular",
                !isMobileNav && "max-lg:hidden"
              )}
            >
              {item.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;

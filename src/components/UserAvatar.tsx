import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback} from "./ui/avatar";

type UserAvatarProps = {
  id: string;
  username: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
};

const UserAvatar = ({
  name,
  username,
  imageUrl,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  return (
    <Link href={ROUTES.PROFILE(username)}>
      <Avatar className={cn("relative", className)}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="object-cover"
            fill
            quality={100}
          />
        ) : (
          <AvatarFallback
            className={cn(
              "primary-gradient font-space-grotesk text-sm font-semibold text-white",
              fallbackClassName
            )}
          >
            {name.trim().charAt(0)}
          </AvatarFallback>
        )}
      </Avatar>
    </Link>
  );
};

export default UserAvatar;

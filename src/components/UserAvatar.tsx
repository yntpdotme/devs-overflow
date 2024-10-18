import Image from "next/image";
import Link from "next/link";

import ROUTES from "@/constants/routes";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback} from "./ui/avatar";

type UserAvatarProps = {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
};

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className,
  fallbackClassName,
}: UserAvatarProps) => {
  return (
    <Link href={ROUTES.PROFILE(id)}>
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
              "primary-gradient font-space-grotesk font-semibold text-white text-sm",
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

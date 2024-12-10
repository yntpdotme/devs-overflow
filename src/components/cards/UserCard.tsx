import ROUTES from "@/constants/routes";
import {User} from "@/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";

type UserCardProps = {
  user: User;
};

const UserCard = ({user}: UserCardProps) => {
  return (
    <div className="shadow-light100_darknone w-full xs:w-[240px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-xl border p-8">
        <UserAvatar
          id={user._id}
          username={user.username}
          name={user.name}
          imageUrl={user.image}
          className="size-24 xs:size-[100px]"
          fallbackClassName="text-3xl tracking-widest"
        />

        <Link href={ROUTES.PROFILE(user.username)}>
          <div className="mt-4 text-center">
            <h3 className="h3-bold text-dark200_light900 line-clamp-1">
              {user.name}
            </h3>
            <p className="body-regular text-dark500_light500 mt-2">
              @{user.username}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
};

export default UserCard;

import dayjs from "dayjs";
import {notFound} from "next/navigation";

import {auth} from "@/auth";
import UserAvatar from "@/components/UserAvatar";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import {getUser} from "@/lib/actions";
import {RouteParams} from "@/types";
import Link from "next/link";

const Profile = async ({params}: RouteParams) => {
  const {id} = await params;
  if (!id) notFound();

  const loggedInUser = await auth();

  const {success, data, error} = await getUser({
    userId: id,
  });

  if (!success) {
    return (
      <>
        <section className="flex flex-col gap-8 px-6 pt-10 sm:px-12 lg:pt-16">
          <h1 className="h1-bold text-dark100_light900">Profile</h1>
        </section>
        <div className="mt-8 px-6 sm:mt-10 sm:px-12 h1-bold text-dark100_light900">
          {error?.message}
        </div>
      </>
    );
  }

  const {user, totalQuestions, totalAnswers} = data!;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row px-6 pt-10 sm:px-12 lg:pt-16">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={user._id}
            name={user.name}
            imageUrl={user.image}
            className="size-28 rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />

          <div className="max-lg:mt-3 mt-1.5">
            <h2 className="h2-bold text-dark100_light900 mb-1.5">
              {user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{user.username}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-start gap-5">
              {user.portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={user.portfolio}
                  title="Portfolio"
                />
              )}
              {user.location && (
                <ProfileLink
                  imgUrl="/icons/location.svg"
                  href={user.location}
                  title="Location"
                />
              )}

              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(user.createdAt).format("MMMM YYYY")}
              />
            </div>

            {user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedInUser?.user?.id === user._id && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-10 min-w-36 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="px-6 sm:px-12 mt-8">
        <Stats
          totalQuestions={totalQuestions}
          totalAnswers={totalAnswers}
          badges={{GOLD: 0, BRONZE: 0, SILVER: 0}}
        />
      </section>

      <section className="px-6 sm:px-12 mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            List of Questions
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            List of Answers
          </TabsContent>
        </Tabs>
        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-semibold text-dark200_light900 mt-1.5">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <p>List of Tags</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;

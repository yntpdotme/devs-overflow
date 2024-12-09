import dayjs from "dayjs";
import {notFound} from "next/navigation";

import {auth} from "@/auth";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import UserAvatar from "@/components/UserAvatar";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import ProfileLink from "@/components/user/ProfileLink";
import Stats from "@/components/user/Stats";
import {EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS} from "@/constants/states";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
  getUserStats,
  getUserTopTags,
} from "@/lib/actions";
import {RouteParams} from "@/types";
import Link from "next/link";
import ROUTES from "@/constants/routes";

const Profile = async ({params, searchParams}: RouteParams) => {
  const {id} = await params;
  const {page, pageSize} = await searchParams;

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
        <div className="h1-bold text-dark100_light900 mt-8 px-6 sm:mt-10 sm:px-12">
          {error?.message}
        </div>
      </>
    );
  }

  const {user} = data!;

  const {data: userStats} = await getUserStats({
    userId: id,
  });

  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    error: userQuestionsError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
  });

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    error: userAnswersError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
  });

  const {
    success: userTopTagsSuccess,
    data: userTopTags,
    error: userTopTagsError,
  } = await getUserTopTags({
    userId: id,
  });

  const {questions, isNext: hasMoreQuestions} = userQuestions!;
  const {answers, isNext: hasMoreAnswers} = userAnswers!;
  const {tags} = userTopTags!;

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between px-6 pt-10 sm:flex-row sm:px-12 lg:pt-16">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={user._id}
            name={user.name}
            imageUrl={user.image}
            className="size-28 rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />

          <div className="mt-1.5 max-lg:mt-3">
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
            <Link href={ROUTES.EDIT_PROFILE}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-10 min-w-36 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <section className="mt-8 px-6 sm:px-12">
        <Stats
          totalQuestions={userStats?.totalQuestions || 0}
          totalAnswers={userStats?.totalAnswers || 0}
          badges={userStats?.badges || {GOLD: 0, BRONZE: 0, SILVER: 0}}
          reputationPoints={user.reputation || 0}
        />
      </section>

      <section className="mt-10 flex gap-10 px-6 sm:px-12">
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
            <DataRenderer
              data={questions}
              empty={EMPTY_QUESTION}
              success={userQuestionsSuccess}
              error={userQuestionsError}
              render={questions => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map(question => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionButtons={
                        loggedInUser?.user?.id === question.author._id
                      }
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>

          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <DataRenderer
              data={answers}
              empty={EMPTY_ANSWERS}
              success={userAnswersSuccess}
              error={userAnswersError}
              render={answers => (
                <div className="flex w-full flex-col gap-6">
                  {answers.map(answer => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11 border light-border-2"
                      showReadMore
                      showActionButtons={
                        loggedInUser?.user?.id === answer.author._id
                      }
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-semibold text-dark200_light900 mt-1.5">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              data={tags}
              empty={EMPTY_TAGS}
              success={userTopTagsSuccess}
              error={userTopTagsError}
              render={tags => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {tags.map(tag => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;

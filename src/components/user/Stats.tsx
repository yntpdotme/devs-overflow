import Image from "next/image";

import {formatNumber} from "@/lib/utils";
import {BadgeCounts} from "@/types";

type StatsProps = {
  totalQuestions: number;
  totalAnswers: number;
  badges: BadgeCounts;
  reputationPoints: number;
};

type StatsCardProps = {
  imgUrl: string;
  value: number;
  title: string;
};

const StatsCard = ({imgUrl, value, title}: StatsCardProps) => (
  <div className="light-border background-light900_darkgradient shadow-light300_dark200 flex flex-wrap items-center justify-start gap-4 rounded-md border px-6 py-4">
    <Image src={imgUrl} alt={title} width={40} height={50} />
    <div>
      <p className="paragraph-semibold text-dark200_light900">{value}</p>
      <p className="body-medium text-dark300_light700 line-clamp-1">{title}</p>
    </div>
  </div>
);

const Stats = ({
  totalQuestions,
  totalAnswers,
  badges,
  reputationPoints,
}: StatsProps) => {
  return (
    <div className="mt-3">
      <h4 className="h3-semibold text-dark200_light900">
        Stats{" "}
        <span className="small-semibold primary-text-gradient">
          {formatNumber(reputationPoints)}
        </span>
      </h4>

      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div className="light-border background-light900_darkgradient shadow-light300_dark200 flex flex-wrap items-center justify-start gap-6 rounded-md border px-6 py-4 xs:justify-evenly md:gap-4">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Question</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </div>

        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"
        />

        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"
        />

        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"
        />
      </div>
    </div>
  );
};

export default Stats;

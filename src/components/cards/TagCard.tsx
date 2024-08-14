import Link from "next/link";

import {Badge} from "@/components/ui/badge";
import ROUTES from "@/constants/routes";
import {cn, getDeviconClassName} from "@/lib/utils";

type TagCardProps = {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
};

const TagCard = ({_id, name, questions, showCount, compact}: TagCardProps) => {
  const iconClass = getDeviconClassName(name);

  const Content = (
    <>
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={cn(iconClass, "text-sm")}></i>
          <span>{name}</span>
        </div>
      </Badge>

      {showCount && (
        <p className="small-medium text-dark500_light700">{questions}+</p>
      )}
    </>
  );

  if (compact) {
    return (
      <Link
        href={ROUTES.TAG(_id)}
        className="flex items-center justify-between gap-2"
      >
        {Content}
      </Link>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light100_darknone">
      <article className="flex items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">
            {questions}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  );
};

export default TagCard;

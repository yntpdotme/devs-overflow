import AnswerCard from "@/components/cards/AnswerCard";
import DataRenderer from "@/components/DataRenderer";
import {AnswerFilters} from "@/constants/filters";
import {EMPTY_ANSWERS} from "@/constants/states";
import {ActionResponse, Answer} from "@/types";
import Filter from "../filters/Filter";

type AllAnswersProps = ActionResponse<Answer[]> & {
  totalAnswers: number;
};

const AllAnswers = ({data, success, error, totalAnswers}: AllAnswersProps) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <Filter
          filters={AnswerFilters}
          containerClasses="max-xs"
          otherClasses="sm:min-w-[32px]"
        />
      </div>

      <DataRenderer
        data={data}
        error={error}
        success={success}
        empty={EMPTY_ANSWERS}
        render={answers =>
          answers.map(answer => <AnswerCard key={answer._id} {...answer} />)
        }
      />
    </div>
  );
};

export default AllAnswers;

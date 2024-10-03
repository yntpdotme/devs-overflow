import {redirect} from "next/navigation";

import {auth} from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";

const AskQuestion = async () => {
  const session = await auth();
  if (!session) redirect(ROUTES.SIGN_IN);

  return (
    <section className="px-6 pt-10 sm:px-12 lg:pt-16">
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>

      <div className="mt-8 sm:mt-10">
        <QuestionForm />
      </div>
    </section>
  );
};

export default AskQuestion;

import {notFound, redirect} from "next/navigation";

import {auth} from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import {getQuestion} from "@/lib/actions";
import {RouteParams} from "@/types";

const EditQuestion = async ({params}: RouteParams) => {
  const {id} = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) redirect(ROUTES.SIGN_IN);

  const {success, data: question} = await getQuestion({questionId: id});
  if (!success) return notFound();

  return (
    <section className="px-6 pt-10 sm:px-12 lg:pt-16">
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-8 sm:mt-10">
        <QuestionForm question={question} isEdit />
      </div>
    </section>
  );
};

export default EditQuestion;

"use client";

import {toast} from "@/hooks/use-toast";
import {toggleSaveQuestion} from "@/lib/actions";
import {ActionResponse} from "@/types";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {use, useTransition} from "react";

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{saved: boolean}>>;
}) => {
  const [isPending, startTransition] = useTransition();
  const {data} = use(hasSavedQuestionPromise);
  const hasSaved = data?.saved;

  const session = useSession();
  const userId = session.data?.user?.id;

  const handleSave = async () => {
    if (!userId)
      return toast({
        title: "Please login to save a question",
        description: "Only logged-in users can save question.",
        variant: "destructive",
      });

    startTransition(async () => {
      try {
        const {success, data, error} = await toggleSaveQuestion({questionId});

        if (!success) {
          toast({
            title: "Failed to save",
            description: error?.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
        }); 
      } catch (error) {
        toast({
          title: "Failed to save question",
          description:
            "An error occurred while saving question. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      alt="save"
      width={18}
      height={18}
      quality={100}
      className={`cursor-pointer ${isPending && "opacity-50"}`}
      aria-label="save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;

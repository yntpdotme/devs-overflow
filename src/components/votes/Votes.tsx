"use client";

import Image from "next/image";
import {use, useTransition} from "react";

import {toast} from "@/hooks/use-toast";
import {createVote} from "@/lib/actions";
import {formatNumber} from "@/lib/utils";
import {ActionResponse, HasVotedResponse} from "@/types";
import {useSession} from "next-auth/react";

type VotesProps = {
  actionType: "question" | "answer";
  actionId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
};

const Votes = ({
  actionType,
  actionId,
  upvotes,
  downvotes,
  hasVotedPromise,
}: VotesProps) => {
  const [isPending, startTransition] = useTransition();

  const session = useSession();
  const userId = session.data?.user?.id;

  const {success, data} = use(hasVotedPromise);
  const {hasUpVoted, hasDownVoted} = data || {};

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId)
      return toast({
        title: "Please login to vote",
        description: "Only logged-in users can vote.",
        variant: "destructive",
      });

    startTransition(async () => {
      try {
        const result = await createVote({
          actionId,
          actionType,
          voteType,
        });

        if (!result.success) {
          toast({
            title: "Failed to vote",
            description: result.error?.message,
            variant: "destructive",
          });
          return;
        }

        const successMessage =
          voteType === "upvote"
            ? `Upvote ${!hasUpVoted ? "added" : "removed"} successfully`
            : `Downvote ${!hasDownVoted ? "added" : "removed"} successfully`;

        toast({
          title: successMessage,
          description: "Your vote has been recorded.",
        });
      } catch {
        toast({
          title: "Failed to vote",
          description:
            "An error occurred while voting. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpVoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          alt={hasUpVoted ? "upvoted" : "upvote"}
          width={20}
          height={20}
          quality={100}
          className={`cursor-pointer ${isPending && "opacity-50"}`}
          aria-label="Upvote"
          onClick={() => !isPending && handleVote("upvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>

      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownVoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          alt={hasDownVoted ? "downvoted" : "downvote"}
          width={20}
          height={20}
          quality={100}
          className={`cursor-pointer ${isPending && "opacity-50"}`}
          aria-label="Downvote"
          onClick={() => !isPending && handleVote("downvote")}
        />

        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;

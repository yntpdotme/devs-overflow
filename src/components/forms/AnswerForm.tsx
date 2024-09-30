"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {MDXEditorMethods} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import {useSession} from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {useRef, useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {AiOutlineReload} from "react-icons/ai";
import {z} from "zod";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {Skeleton} from "@/components/ui/skeleton";
import {toast} from "@/hooks/use-toast";
import {createAnswer} from "@/lib/actions";
import {api} from "@/lib/api";
import {SubmitAnswerSchema} from "@/lib/schemas";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <Skeleton className="background-light800_dark300 h-96 w-full" />
  ),
});

type AnswerFormProps = {
  questionId: string;
  questionTitle: string;
  questionContent: string;
};

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);
  const session = useSession();

  const form = useForm<z.infer<typeof SubmitAnswerSchema>>({
    resolver: zodResolver(SubmitAnswerSchema),
    defaultValues: {
      content: "",
    },
    mode: "onChange",
  });

  const handleSubmit = (data: z.infer<typeof SubmitAnswerSchema>) => {
    startTransition(async () => {
      const result = await createAnswer({questionId, content: data.content});

      if (result.success) {
        form.reset();

        toast({
          title: "Success",
          description: "Your answer has been posted successfully",
        });

        if (editorRef.current) editorRef.current.setMarkdown("");
      } else {
        if (result.error?.message === "Unauthorized") {
          toast({
            title: "Please log in",
            description: "You need to be logged in to post answer",
            variant: "destructive",
          });

          return;
        }

        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast({
        title: "Please log in",
        description: "You need to be logged in to use this feature",
      });
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const {success, data, error} = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success || !data) {
        return toast({
          title: `Error`,
          description: error?.message || "Something went wrong",
          variant: "destructive",
        });
      }

      const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

      if (editorRef.current) {
        editorRef.current.setMarkdown(formattedAnswer);

        form.setValue("content", formattedAnswer);
        form.trigger("content");
      }

      toast({
        title: "Success",
        description: "AI generated answer has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem with your request",
        variant: "destructive",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="min-h-[40px] border border-primary-500/5 bg-primary-100 text-primary-500 shadow-none hover:bg-primary-100 dark:border-none dark:bg-dark-300 dark:text-primary-500 dark:hover:bg-dark-400"
          onClick={generateAIAnswer}
          disabled={isAISubmitting}
        >
          {isAISubmitting ? (
            <>
              <AiOutlineReload className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex flex-col gap-8"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="content"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="primary-gradient w-fit self-end !text-light-900"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <AiOutlineReload className="animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              "Post Answer"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default AnswerForm;

"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {MDXEditorMethods} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {useRef, useTransition} from "react";
import {useForm} from "react-hook-form";
import {AiOutlineReload} from "react-icons/ai";

import TagCard from "@/components/cards/TagCard";
import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import ROUTES from "@/constants/routes";
import {toast} from "@/hooks/use-toast";
import {createQuestion} from "@/lib/actions";
import {AskQuestionSchema} from "@/lib/schemas";
import {z} from "zod";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <Skeleton className="background-light800_dark300 h-96 w-full" />
  ),
});

const QuestionForm = () => {
  const router = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
    mode: "onChange",
  });

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: {value: string[]}
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();

      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: {value: string[]}) => {
    const newTags = field.value.filter(t => t !== tag);
    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleCreateQuestion = (data: z.infer<typeof AskQuestionSchema>) => {
    startTransition(async () => {
      const result = await createQuestion(data);

      if (result.success) {
        toast({
          title: "Success",
          description: "Question created successfully",
        });

        if (result.data)
          router.push(ROUTES.QUESTION(result.data._id as string));
      } else {
        toast({
          title: `Error ${result.status}`,
          description: result.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({field}) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 border px-4"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({field}) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  value={field.value}
                  editorRef={editorRef}
                  fieldChange={field.onChange}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you&apos;ve put in the
                title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 no-focus placeholder min-h-10 border px-4"
                    onKeyDown={e => handleInputKeyDown(e, field)}
                  />
                  <div className="mt-2.5 text-sm">
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                        {field.value.map((tag: string) => (
                          <TagCard
                            key={tag}
                            _id={tag}
                            name={tag}
                            compact
                            remove
                            isButton
                            handleRemove={() => handleTagRemove(tag, field)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="primary-gradient mt-6 w-fit self-end !text-light-900"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <AiOutlineReload className="animate-spin" />
              <span>Submitting</span>
            </>
          ) : (
            <>Ask A Question</>
          )}
        </Button>
      </form>
    </Form>
  );
};
export default QuestionForm;

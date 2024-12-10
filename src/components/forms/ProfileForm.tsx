"use client";

import {zodResolver} from "@hookform/resolvers/zod";

import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import ROUTES from "@/constants/routes";
import {toast} from "@/hooks/use-toast";
import {updateUser} from "@/lib/actions/user.action";
import {UpdateUserSchema} from "@/lib/schemas";
import {UpdateUserParams} from "@/types";
import {AiOutlineReload} from "react-icons/ai";

const ProfileForm = ({user}: {user: UpdateUserParams}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
    mode: "onChange",
  });

  const handleUpdateProfile = async (
    values: z.infer<typeof UpdateUserSchema>
  ) => {
    startTransition(async () => {
      const {
        success,
        data: user,
        error,
        status,
      } = await updateUser({
        ...values,
      });

      if (success) {
        toast({
          title: "Success",
          description: "Your profile has been updated successfully.",
        });

        router.push(ROUTES.PROFILE(user?.username!));
      } else {
        toast({
          title: `Error (${status})`,
          description: error?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleUpdateProfile)}
        className="mt-9 flex flex-col gap-8"
      >
        <div className="grid sm:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Name <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 border px-4"
                    placeholder="Your Name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({field}) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Username <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 border px-4"
                    placeholder="Your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="portfolio"
            render={({field}) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Portfolio Link
                </FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 border px-4"
                    placeholder="Your Portfolio link"
                    {...field}

                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({field}) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="paragraph-semibold text-dark400_light800">
                  Location <span className="text-primary-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="paragraph-regular background-light800_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 border px-4"
                    placeholder="Where do you live?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="bio"
          render={({field}) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-10 border"
                  placeholder="What's special about you?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-7 flex justify-end">
          <Button
            type="submit"
            className="primary-gradient w-fit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <AiOutlineReload className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;

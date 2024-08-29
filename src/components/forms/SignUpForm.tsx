"use client";

import {useRouter} from "next/navigation";
import {useEffect, useState, useTransition} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";

import PasswordInput from "@/components/PasswordInput";
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
import ROUTES from "@/constants/routes";
import {signUpWithCredentials} from "@/lib/actions";
import {SignUpSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {FormError} from "./FormError";
import {FormSuccess} from "./FormSuccess";

const SignUpForm = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.setFocus("name");
  }, [form]);

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await signUpWithCredentials(values);

      if (result?.success) {
        form.reset();
        setSuccess("Signed up successfully");

        setTimeout(() => {
          router.push(ROUTES.HOME);
        }, 500);
      }

      setError(result?.error?.message);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="John Doe"
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 rounded-1.5 border"
                  disabled={isPending}
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
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="john-doe"
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 rounded-1.5 border"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="hello@john.com"
                  type="email"
                  className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-10 rounded-1.5 border"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput field={field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error} />

        <FormSuccess message={success} />

        <Button
          type="submit"
          className="primary-gradient paragraph-medium min-h-10 w-full rounded-2 px-4 py-2 font-inter !text-light-900"
          disabled={isPending}
        >
          Sign Up
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;

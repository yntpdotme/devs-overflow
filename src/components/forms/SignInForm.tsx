"use client";

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
import {SignInSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {z} from "zod";

import PasswordInput from "@/components/PasswordInput";
import {FormError} from "./FormError";
import {FormSuccess} from "./FormSuccess";

const SignInForm = () => {
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = (values: z.infer<typeof SignInSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-6">
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
                <PasswordInput field={field} />
              </FormControl>
              <FormMessage />
              <div className="text-right text-sm text-[#1DA1F2]">
                <Link href="/">Forget password..?</Link>
              </div>
            </FormItem>
          )}
        />

        <FormError message="" />

        <FormSuccess message="" />

        <Button
          type="submit"
          className="primary-gradient paragraph-medium min-h-10 w-full rounded-2 px-4 py-2 font-inter !text-light-900"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;

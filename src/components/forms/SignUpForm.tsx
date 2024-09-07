"use client";

import {useRouter} from "next/navigation";
import {useEffect, useTransition} from "react";
import {useForm} from "react-hook-form";
import {AiOutlineReload} from "react-icons/ai";
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
import {toast} from "@/hooks/use-toast";
import {signUpWithCredentials} from "@/lib/actions";
import {SignUpSchema} from "@/lib/schemas";
import {zodResolver} from "@hookform/resolvers/zod";

const SignUpForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (data: z.infer<typeof SignUpSchema>) => {
    startTransition(async () => {
      const result = await signUpWithCredentials(data);

      if (result?.success) {
        form.reset();
        toast({
          title: "Success",
          description: "Signed up successfully",
        });

        router.replace(ROUTES.HOME);
      } else {
        toast({
          title: `Error ${result?.status}`,
          description: result?.error?.message,
          variant: "destructive",
        });
      }
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

        <Button
          type="submit"
          className="primary-gradient paragraph-medium min-h-10 w-full rounded-2 px-4 py-2 font-inter !text-light-900"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <AiOutlineReload className="animate-spin" />
              <span>Signing up...</span>
            </>
          ) : (
            <>Sign Up</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;

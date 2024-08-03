import AuthForm from "@/components/forms/AuthForm";
import SignInForm from "@/components/forms/SignInForm";

const SignIn = () => {
  return (
    <AuthForm
      headerLabel="Welcome Back"
      headerText="sign in to access your account"
      backButtonMessage="Don't have an account yet?"
      backButtonLabel="Sign up"
      backButtonHref="/sign-up"
      showSocial
      showGuestSignIn
    >
      <SignInForm />
    </AuthForm>
  );
};

export default SignIn;

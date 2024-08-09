import AuthForm from "@/components/forms/AuthForm";
import SignInForm from "@/components/forms/SignInForm";
import ROUTES from "@/constants/routes";

const SignIn = () => {
  return (
    <AuthForm
      headerLabel="Welcome Back"
      headerText="sign in to access your account"
      backButtonMessage="Don't have an account yet?"
      backButtonLabel="Sign up"
      backButtonHref={ROUTES.SIGN_UP}
      showSocial
      showGuestSignIn
    > 
      <SignInForm />
    </AuthForm>
  );
};

export default SignIn;

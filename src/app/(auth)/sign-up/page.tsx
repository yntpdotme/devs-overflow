import AuthForm from "@/components/forms/AuthForm";
import SignUpForm from "@/components/forms/SignUpForm";

const SignUp = () => {
  return (
    <AuthForm
      headerLabel="Join DevsFlow"
      headerText="to get your questions answered"
      backButtonMessage="Already have an account..?"
      backButtonLabel="Sign in"
      backButtonHref="/sign-in"
      showSocial
    >
      <SignUpForm />
    </AuthForm>
  );
};

export default SignUp;

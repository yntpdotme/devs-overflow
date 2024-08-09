import AuthForm from "@/components/forms/AuthForm";
import SignUpForm from "@/components/forms/SignUpForm";
import ROUTES from "@/constants/routes";

const SignUp = () => {
  return (
    <AuthForm
      headerLabel="Join DevsFlow"
      headerText="to get your questions answered"
      backButtonMessage="Already have an account..?"
      backButtonLabel="Sign in"
      backButtonHref={ROUTES.SIGN_IN}
      showSocial
    >
      <SignUpForm />
    </AuthForm>
  );
};

export default SignUp;

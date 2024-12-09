import {auth} from "@/auth";
import ProfileForm from "@/components/forms/ProfileForm";
import ROUTES from "@/constants/routes";
import {getUser} from "@/lib/actions";
import {redirect} from "next/navigation";

const EditProfile = async () => {
  const session = await auth();
  if (!session?.user?.id) redirect(ROUTES.SIGN_IN);

  const {success, data} = await getUser({userId: session.user.id});
  if (!success || !data) redirect(ROUTES.SIGN_IN);

  return (
    <section className="px-6 pt-10 sm:px-12 lg:pt-16">
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>

      <div className="mt-8 sm:mt-10">
        <ProfileForm {...data} />
      </div>
    </section>
  );
};

export default EditProfile;

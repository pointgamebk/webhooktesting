import ProfileForm from "@/components/shared/ProfileForm";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";

const UpdateProfile = () => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  console.log(userId);
  const user = getUserById(userId);

  return (
    <>
      <section className=" bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-tan">
          Update Profile
        </h3>
      </section>

      <div className="wrapper my-8">
        <ProfileForm />
      </div>
    </>
  );
};

export default UpdateProfile;

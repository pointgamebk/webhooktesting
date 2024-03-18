import ProfileForm from "@/components/shared/ProfileForm";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.actions";

type UpdateProfileProps = {
  params: {
    id: string;
  };
};

const UpdateProfile = async ({ params: { id } }: UpdateProfileProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  const user = await getUserById(userId);
  const isMyProfile = userId === id;

  return (
    <>
      <section className=" bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-tan">
          Update Profile
        </h3>
      </section>

      {user.stripeAccountId ? (
        <div className="wrapper my-8">
          <ProfileForm userId={userId} />
        </div>
      ) : (
        <div className="wrapper my-8">
          <h3 className=" text-center sm:text-left text-tan">
            You must connect a Stripe account to update your profile
          </h3>
        </div>
      )}
    </>
  );
};

export default UpdateProfile;

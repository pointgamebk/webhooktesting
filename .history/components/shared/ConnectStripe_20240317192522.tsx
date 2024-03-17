import { Button } from "../ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { createStripeAccount } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type ConnectStripeProps = {
  userId: string;
};

const ConnectStripe = ({ userId }: ConnectStripeProps) => {
  const router = useRouter();
  const onLink = async () => {
    try {
      const link = await createStripeAccount(userId);

      const url = link as string;
      router.push(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        type="submit"
        role="link"
        size="lg"
        className="button sm:w-fit"
        onClick={onLink}
      >
        Connect Stripe
      </Button>
    </div>
  );
};

export default ConnectStripe;

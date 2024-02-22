"use client";

import { SignedIn, useUser } from "@clerk/nextjs";

import ConnectStripe from "./ConnectStripe";

const ConnectButton = () => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;

  console.log(
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.username,
    user?.photo,
    user?.publicMetadata.userId
  );
  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <ConnectStripe userId={userId} />
      </SignedIn>
    </div>
  );
};

export default ConnectButton;

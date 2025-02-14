"use client";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/loading-spinner";
import { ModeToggle } from "@/components/ui/theme-toggler";
import { signIntoFirebaseWithClerk } from "@/lib/firebase";
import { SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <div className="flex justify-between align-center py-5 px-5 md:px-3">
      <h3 className="font-bold">PDFChatter</h3>
      <div className="gap-x-4 flex">
        {!isLoaded ? (
          <Spinner />
        ) : !isSignedIn ? (
          <>
            <SignInButton
              mode="modal"
              forceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
            >
              <Button variant={`link`}>Chat now</Button>
            </SignInButton>
            <SignInButton
              mode="modal"
              forceRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
            >
              <Button>Sign in</Button>
            </SignInButton>
          </>
        ) : (
          <>
            <Link href={`/chat`}>
              <Button>Chat now</Button>
            </Link>
            {/* {user?.imageUrl && (
              <Image
                width={40}
                height={40}
                src={user?.imageUrl}
                alt="profile"
                className="rounded-full"
              />
            )} */}
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;

"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/loading-spinner";
import { ModeToggle } from "@/components/ui/theme-toggler";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { NavbarProps } from "@/types";

const Navbar: FC<NavbarProps> = ({ className }) => {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div
      className={`flex justify-between align-center py-5 px-5 md:px-3 ${
        className || ""
      }`}
    >
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
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;

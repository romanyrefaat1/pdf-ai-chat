"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { ChevronsLeftRight } from "lucide-react";
import Spinner from "./loading-spinner";

const UserItem = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  return (
    <div className="group">
      {!isLoaded && <Spinner />}
      {isLoaded && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              role="button"
              className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
            >
              <div className="gap-x-2 flex items-center max-w-[150px]">
                {isSignedIn && (
                  <>
                    {user && <Avatar className="w-5 h-5">
                      <AvatarImage src={user?.imageUrl} />
                    </Avatar>}
                    {!user && <Spinner />}
                    <span className="text-start font-medium line-clamp-1">
                      {user?.fullName}&apos;s Workspace
                    </span>
                  </>
                )}
                {!isSignedIn && (
                  <span className={`text-start font-medium line-clamp-1`}>
                    No workspace
                  </span>
                )}
              </div>
              <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-80"
            alignOffset={11}
            align="start"
            forceMount
          >
            <div className="flex flex-col p-2 space-y-4">
              <p className="text-xs font-medium leading-none text-muted-foreground">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              <div className="flex items-center gap-x-2">
                <div className="rounded-md bg-secondary p-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <p className="text-sm line-clamp-1">
                    {isSignedIn && <>{user?.fullName}&apos;s Workspace</>}
                    {!isSignedIn && <>No workspace</>}
                  </p>
                </div>
              </div>
            </div>
            {isSignedIn && (
              <DropdownMenuItem
                className="w-full cursor-pointer text-muted-foreground"
                asChild
              >
                <SignOutButton>Logout</SignOutButton>
              </DropdownMenuItem>
            )}
            {!isSignedIn && (
              <DropdownMenuItem
                className="w-full cursor-pointer text-muted-foreground"
                asChild
              >
                <SignInButton mode="modal">Login</SignInButton>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default UserItem;

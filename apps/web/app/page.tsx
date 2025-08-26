"use client";
import { useMutation, useQuery } from "convex/react";
import { SignInButton,UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/convex/_generated/api";
export default function Page() {
  const addUser = useMutation(api.users.someMutation);
  return (
    <>
      <Authenticated>
        <UserButton />
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Hello World</h1>
            <Button size="sm" onClick={() => addUser({ name: "New User" })}>
              Add a user name new user
            </Button>
          </div>
        </div> 
      </Authenticated>
      <Unauthenticated>
        <p>Must be signed in</p>
        <SignInButton>
          Sign in
        </SignInButton>
      </Unauthenticated>
    </>
  );
}

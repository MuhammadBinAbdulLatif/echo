'use client'
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import SignInView from 'app/(auth)/sign-in/[[...sign-in]]/page'
const AuthGuard = ({ children }: {children: React.ReactNode}) => {
  return (
    <>
    <AuthLoading>
        <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
            <Loader2 size={24} className="animate-spin" />
        </div>
    </AuthLoading>
    <Authenticated>
        {children}
    </Authenticated>
    <Unauthenticated>
        <SignInView />
    </Unauthenticated>
    </>
  );
};

export default AuthGuard;

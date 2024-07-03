"use client";
import React from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { pageUrls } from "@/enums/page-urls";
import { Loader2 } from "lucide-react";

const AuthCallback = ({ origin }: { origin: string }) => {
  const router = useRouter();
  const { data, error, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        router.push(origin ? `/${origin}` : pageUrls.DASHBOARD);
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        router.push(pageUrls.SIGN_IN);
      }
    },
    retry: true,
    retryDelay: 500,
  });

  console.log("Data:", data);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default AuthCallback;

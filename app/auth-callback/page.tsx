"use client";
import AuthCallback from "@/components/auth-callback";
import { trpc } from "@/lib/trpc";

const Page = ({
  searchParams,
}: {
  searchParams: {
    origin: string;
  };
}) => {
  return (
    <div>
      <AuthCallback origin={searchParams.origin} />
    </div>
  );
};

export default trpc.withTRPC(Page);

import Dashboard from "@/components/dashboard";
import { db } from "@/db";
import { pageUrls } from "@/enums/page-urls";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id)
    redirect(`${pageUrls.AUTH_CALLBACK}?origin=${pageUrls.DASHBOARD}`);
  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if (!dbUser)
    redirect(`${pageUrls.AUTH_CALLBACK}?origin=${pageUrls.DASHBOARD}`);
  return <Dashboard />;
};

export default Page;

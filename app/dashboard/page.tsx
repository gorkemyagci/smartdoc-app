import { pageUrls } from "@/enums/page-urls";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id)
    redirect(`${pageUrls.AUTH_CALLBACK}?origin=${pageUrls.DASHBOARD}`);
  return <div>{user?.email}</div>;
};

export default Page;

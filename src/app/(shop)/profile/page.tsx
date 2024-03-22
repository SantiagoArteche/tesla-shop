import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login?redirectTo=/profile");
  }
  return (
    <div className="mb-5">
      <Title title="Profile" />

      {JSON.stringify(session.user, null, 2)}
    </div>
  );
}

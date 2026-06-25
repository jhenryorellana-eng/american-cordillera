import { getCurrentUser, isMember } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { CommunityNav } from "@/components/community/CommunityNav";

export default async function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const member = isMember(user?.role);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteHeader />
      <div className="container-ac flex w-full flex-1 flex-col gap-6 py-6 lg:flex-row">
        <CommunityNav isMember={member} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

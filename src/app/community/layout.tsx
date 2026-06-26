import { getCurrentUser, isMember } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { CommunityNav } from "@/components/community/CommunityNav";
import { CommunityBottomNav } from "@/components/community/CommunityBottomNav";

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
      <div className="container-ac flex w-full flex-1 gap-6 py-4 lg:py-6">
        <CommunityNav isMember={member} />
        {/* pb leaves room for the fixed mobile bottom nav */}
        <main className="min-w-0 flex-1 pb-28 lg:pb-0">{children}</main>
      </div>
      <CommunityBottomNav isMember={member} />
    </div>
  );
}

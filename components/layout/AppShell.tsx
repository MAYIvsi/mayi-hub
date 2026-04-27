import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/supabase/profile";

function getEmailPrefix(email: string | null | undefined) {
  if (!email) return null;
  const at = email.indexOf("@");
  return at === -1 ? email : email.slice(0, at);
}

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const emailPrefix = getEmailPrefix(data.user?.email);
  const profile = data.user ? await getMyProfile(supabase, data.user.id) : null;

  return (
    <div className="flex min-h-dvh w-full">
      <Sidebar emailPrefix={emailPrefix} profile={profile} />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 px-4 pb-20 pt-6 md:px-8 md:pb-8 md:pt-8">
          {children}
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}


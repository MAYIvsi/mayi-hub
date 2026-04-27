import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/supabase/profile";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login?next=/profile");

  const profile = await getMyProfile(supabase, data.user.id);

  return (
    <AppShell>
      <ProfileClient
        initialDisplayName={profile?.display_name ?? null}
        initialAvatarUrl={profile?.avatar_url ?? null}
        initialSteamId={profile?.steam_id ?? null}
      />
    </AppShell>
  );
}


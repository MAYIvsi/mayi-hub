export type ProfileRole = "admin" | "agent";

export type Profile = {
  id: string;
  role: ProfileRole;
  solved_cases: number;
  total_attempts: number;
  display_name: string | null;
  avatar_url: string | null;
  steam_id: string | null;
};

export async function getMyProfile(supabase: {
  from: (table: string) => any;
}, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, solved_cases, total_attempts, display_name, avatar_url, steam_id")
    .eq("id", userId)
    .maybeSingle();

  if (error) return null;
  if (!data) return null;

  return data as Profile;
}


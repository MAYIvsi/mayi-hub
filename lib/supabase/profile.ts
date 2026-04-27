export type ProfileRole = "admin" | "agent";

export type Profile = {
  id: string;
  role: ProfileRole;
  solved_cases: number;
  total_attempts: number;
};

export async function getMyProfile(supabase: {
  from: (table: string) => any;
}, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, solved_cases, total_attempts")
    .eq("id", userId)
    .maybeSingle();

  if (error) return null;
  if (!data) return null;

  return data as Profile;
}


import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/LocalTypes";

/**
 *
 * @returns Functions to interact with Supabase for profile management
 */
const useSupabase = () => {
  const getUser = () => {
    const user = supabase.auth.getUser();
    return user;
  };

  const getAllProfilesByUser = async () => {
    const userResponse = await getUser();
    if (!userResponse || !userResponse.data?.user) {
      console.warn("No authenticated user found. Cannot fetch profiles.");
      return [];
    }

    const userId = userResponse.data.user.id;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching profiles for user:", error);
      return [];
    }
    return data as Profile[];
  };

  // Fetch a profile by its slug. Use maybeSingle to avoid PGRST116 when there are 0 rows.
  const getProfile = async (slug: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    // When no row matches, PostgREST returns 200 with null and maybeSingle() sets data to null.
    if (!data) {
      console.warn("Profile not found for slug:", slug);
      return null;
    }

    return data as Profile;
  };

  // Create a new profile with the given data (excluding id and created_at which are auto-generated)
  const createProfile = async (
    profile: Omit<Profile, "id" | "created_at" | "slug">
  ) => {
    if (!profile.name || !profile.title) {
      console.error("Name and title are required to create a profile.");
      return null;
    }

    // limit the number of profiles to 3 per user
    const existingProfiles = await getAllProfilesByUser();
    if (existingProfiles.length >= 3) {
      console.warn("User has reached the maximum number of profiles (3).");
      return null;
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    if (error) {
      console.log("Supabase insert data:", data, "error:", error);
      console.error("Error creating profile:", error);
      return null;
    }
    return data as Profile;
  };

  // Update an existing profile by its slug with the provided updates (excluding id, created_at, and slug which should not be updated)
  const updateProfile = async (
    slug: string,
    updates: Partial<Omit<Profile, "id" | "created_at" | "slug">>
  ) => {
    // Prevent sending an empty update payload which can cause a 406 Not Acceptable from PostgREST
    if (!updates || Object.keys(updates).length === 0) {
      console.warn("No updates provided. Aborting profile update.");
      return null;
    }

    // Copy updates and strip non-updatable/immutable fields that should not be sent in PATCH
    const safeUpdates: Record<string, unknown> = {
      ...(updates as Partial<Profile>),
    };
    delete safeUpdates.id;
    delete safeUpdates.created_at;
    delete safeUpdates.slug;
    delete safeUpdates.user_id;

    // Remove keys with undefined to avoid sending empty payload values which can trigger 406
    const cleanedUpdates = Object.fromEntries(
      Object.entries(safeUpdates).filter(([, v]) => v !== undefined)
    );

    if (Object.keys(cleanedUpdates).length === 0) {
      console.warn(
        "Only immutable or undefined fields provided. Nothing to update."
      );
      return null;
    }

    console.log(
      "Updating profile with slug:",
      slug,
      "Updates:",
      cleanedUpdates
    );

    const { data, error } = await supabase
      .from("profiles")
      .update(cleanedUpdates)
      .eq("slug", slug)
      .select("*")
      .maybeSingle();

    console.log("Supabase update response - Data:", data, "Error:", error);
    if (error) {
      console.error("Error updating profile:", error);
      return null;
    }

    return data as Profile;
  };

  const deleteProfile = async (slug: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .eq("slug", slug)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Error deleting profile:", error);
      return null;
    }

    return data as Profile;
  };

  return {
    getProfile,
    getAllProfilesByUser,
    createProfile,
    getUser,
    updateProfile,
    deleteProfile,
  };
};

export default useSupabase;

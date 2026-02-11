import { supabase } from "@/lib/supabase"
import { Profile } from "@/types/LocalTypes";

/**
 * 
 * @returns Functions to interact with Supabase for profile management
 */
const useSupabase = () => {

    // Fetch a profile by its ID
    const getProfile = async (slug: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('slug', slug)
            .single();
        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
        return data as Profile;
    }

    // Create a new profile with the given data (excluding id and created_at which are auto-generated)
    const createProfile = async (profile: Omit<Profile, 'id' | 'created_at' | 'slug'>) => {

        if (!profile.name || !profile.title) {
            console.error("Name and title are required to create a profile.");
            return null;
        }

        const { data, error } = await supabase
            .from('profiles')
            .insert(profile)
            .select()
            .single();
        if (error) {
            console.error("Error creating profile:", error);
            return null;
        }
        return data as Profile;
    }

    return {
        getProfile,
        createProfile
    }
}

export default useSupabase;

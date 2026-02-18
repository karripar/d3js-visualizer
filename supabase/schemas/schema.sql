CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  skills JSONB NOT NULL,
  github TEXT,
  linkedin TEXT,
  introduction TEXT,
  projects JSONB,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_profiles_slug ON profiles(slug);

-- 1) helper function (security definer)
CREATE OR REPLACE FUNCTION public.enforce_max_rows_per_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_allowed integer := 3;
  target_user uuid;
  current_count integer;
BEGIN
  target_user := NEW.user_id;

  IF target_user IS NULL THEN
    RAISE EXCEPTION 'cannot determine user identity for max-rows check';
  END IF;

  IF TG_OP = 'INSERT' THEN
    SELECT count(*) INTO current_count
    FROM public.profiles
    WHERE user_id = target_user;

    IF current_count >= max_allowed THEN
      RAISE EXCEPTION 'supabase: maximum of % profiles per user reached', max_allowed;
    END IF;

    RETURN NEW;
  END IF;

  -- TG_OP = 'UPDATE'
  -- If ownership isn't changing, don't enforce the "new row" limit
  IF NEW.user_id = OLD.user_id THEN
    RETURN NEW;
  END IF;

  -- Ownership is changing: enforce limit for the new owner
  SELECT count(*) INTO current_count
  FROM public.profiles
  WHERE user_id = target_user;

  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'supabase: maximum of % profiles per user reached', max_allowed;
  END IF;

  RETURN NEW;
END;
$$;


-- 2) trigger to call the function on insert/update
CREATE TRIGGER trg_enforce_max_rows_per_user
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_max_rows_per_user();



--- RLS Policies

-- Only allow authenticated users to update, and ensure they can only update their own profiles (user_id must match their auth.uid())
alter policy "Allow users to update their own profile"
on "public"."profiles"
to authenticated
using (
  (( SELECT auth.uid() AS uid) = user_id)
  ) with check (
  (( SELECT auth.uid() AS uid) = user_id)
);


-- Only allow authenticated users to delete, and ensure they can only delete their own profiles (user_id must match their auth.uid())
alter policy "Enable delete for users based on user_id"
on "public"."profiles"
to authenticated
using (
  (( SELECT auth.uid() AS uid) = user_id)
);


-- Only allow authenticated users to insert, and ensure they can only insert profiles for themselves (user_id must match their auth.uid())
alter policy "Enable insert for authenticated users only"
on "public"."profiles"
to authenticated
with check (auth.uid() = user_id);



-- needs to be public so that the app can read profiles without authentication (for viewing profiles without logging in)
alter policy "Profiles select public"
on "public"."profiles"
to public
using (
  true
);
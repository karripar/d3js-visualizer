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
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_profiles_slug ON profiles(slug);


ALTER POLICY "Allow users to update their own profile"
ON "public"."profiles"
to authenticated
USING (
  ((SELECT auth.uid() AS uid) = user_id)
) WITH CHECK (
  ((SELECT auth.uid() AS uid) = user_id)
);


ALTER POLICY "Enable delete for users based on user_id"
ON "public"."profiles"
to public
USING (
  (( SELECT auth.uid() AS uid) = user_id)
) with check (
  (( SELECT auth.uid() AS uid) = user_id)
);


ALTER POLICY "Profiles deny delete public"
ON "public"."profiles"
to public
USING (
  false
);


ALTER POLICY "Profiles insert public"
ON "public"."profiles"
to public
USING CHECK (
  true
);


ALTER POLICY "Profiles select public"
ON "public"."profiles"
to public
USING (
  true
);

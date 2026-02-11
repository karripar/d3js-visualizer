CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  skills JSONB NOT NULL,
  github TEXT,
  linkedin TEXT,
  introduction TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_profiles_slug ON profiles(slug);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles readable"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Public insert"
ON profiles FOR INSERT
WITH CHECK (true);

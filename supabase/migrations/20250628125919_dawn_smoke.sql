/*
  # CareerKit Database Schema - Complete Setup

  1. New Tables
    - `cover_letters` - Store generated cover letters with job details
    - `ats_optimized_resumes` - Store ATS analysis results and optimized resumes
    - `portfolios` - Store portfolio projects and metadata
    - `user_profiles` - Extended user information and subscription management

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for authenticated users
    - Ensure users can only access their own data

  3. Performance
    - Add indexes for efficient querying
    - JSONB indexes for complex data queries
    - Timestamp indexes for sorting

  4. Automation
    - Auto-create user profiles on signup
    - Auto-update timestamps on record changes
*/

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title text NOT NULL,
  company_name text NOT NULL,
  personal_info jsonb NOT NULL DEFAULT '{}',
  skills jsonb NOT NULL DEFAULT '[]',
  job_description text,
  generated_letter text NOT NULL,
  template text NOT NULL DEFAULT 'professional',
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Create ats_optimized_resumes table
CREATE TABLE IF NOT EXISTS ats_optimized_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_resume_id uuid REFERENCES resumes(id) ON DELETE SET NULL,
  job_description_used text NOT NULL,
  optimized_resume_data jsonb NOT NULL DEFAULT '{}',
  analysis_result jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  url text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  subscription_type text DEFAULT 'free',
  subscription_expires_at timestamptz,
  free_letters_used integer DEFAULT 0,
  max_free_letters integer DEFAULT 3,
  preferences jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_optimized_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones for cover_letters
DROP POLICY IF EXISTS "Users can view own cover letters" ON cover_letters;
DROP POLICY IF EXISTS "Users can insert own cover letters" ON cover_letters;
DROP POLICY IF EXISTS "Users can update own cover letters" ON cover_letters;
DROP POLICY IF EXISTS "Users can delete own cover letters" ON cover_letters;

CREATE POLICY "Users can view own cover letters"
  ON cover_letters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cover letters"
  ON cover_letters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cover letters"
  ON cover_letters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cover letters"
  ON cover_letters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing policies if they exist and create new ones for ats_optimized_resumes
DROP POLICY IF EXISTS "Users can view own ATS optimized resumes" ON ats_optimized_resumes;
DROP POLICY IF EXISTS "Users can insert own ATS optimized resumes" ON ats_optimized_resumes;
DROP POLICY IF EXISTS "Users can update own ATS optimized resumes" ON ats_optimized_resumes;
DROP POLICY IF EXISTS "Users can delete own ATS optimized resumes" ON ats_optimized_resumes;

CREATE POLICY "Users can view own ATS optimized resumes"
  ON ats_optimized_resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ATS optimized resumes"
  ON ats_optimized_resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ATS optimized resumes"
  ON ats_optimized_resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ATS optimized resumes"
  ON ats_optimized_resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing policies if they exist and create new ones for portfolios
DROP POLICY IF EXISTS "Users can view own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can insert own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can update own portfolios" ON portfolios;
DROP POLICY IF EXISTS "Users can delete own portfolios" ON portfolios;

CREATE POLICY "Users can view own portfolios"
  ON portfolios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios"
  ON portfolios
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON portfolios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
  ON portfolios
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing policies if they exist and create new ones for user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON cover_letters(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cover_letters_company ON cover_letters(company_name);

CREATE INDEX IF NOT EXISTS idx_ats_resumes_user_id ON ats_optimized_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_resumes_created_at ON ats_optimized_resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ats_resumes_original_id ON ats_optimized_resumes(original_resume_id);

CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_title ON portfolios(title);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(subscription_type);

-- Create indexes on JSONB data for efficient queries
CREATE INDEX IF NOT EXISTS idx_cover_letters_personal_info_gin ON cover_letters USING gin(personal_info);
CREATE INDEX IF NOT EXISTS idx_ats_resumes_data_gin ON ats_optimized_resumes USING gin(optimized_resume_data);
CREATE INDEX IF NOT EXISTS idx_ats_resumes_analysis_gin ON ats_optimized_resumes USING gin(analysis_result);
CREATE INDEX IF NOT EXISTS idx_user_profiles_preferences_gin ON user_profiles USING gin(preferences);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist and create new ones
DROP TRIGGER IF EXISTS update_resumes_last_updated ON resumes;
DROP TRIGGER IF EXISTS update_cover_letters_last_updated ON cover_letters;
DROP TRIGGER IF EXISTS update_ats_resumes_last_updated ON ats_optimized_resumes;
DROP TRIGGER IF EXISTS update_portfolios_last_updated ON portfolios;
DROP TRIGGER IF EXISTS update_user_profiles_last_updated ON user_profiles;

CREATE TRIGGER update_resumes_last_updated 
  BEFORE UPDATE ON resumes 
  FOR EACH ROW EXECUTE PROCEDURE update_last_updated_column();

CREATE TRIGGER update_cover_letters_last_updated 
  BEFORE UPDATE ON cover_letters 
  FOR EACH ROW EXECUTE PROCEDURE update_last_updated_column();

CREATE TRIGGER update_ats_resumes_last_updated 
  BEFORE UPDATE ON ats_optimized_resumes 
  FOR EACH ROW EXECUTE PROCEDURE update_last_updated_column();

CREATE TRIGGER update_portfolios_last_updated 
  BEFORE UPDATE ON portfolios 
  FOR EACH ROW EXECUTE PROCEDURE update_last_updated_column();

CREATE TRIGGER update_user_profiles_last_updated 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE PROCEDURE update_last_updated_column();
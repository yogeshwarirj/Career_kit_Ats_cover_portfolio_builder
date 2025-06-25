/*
  # Resume Builder Database Schema

  1. New Tables
    - `resumes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `resume_data` (jsonb) - stores all resume sections
      - `template_used` (text)
      - `version` (integer)
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)
    
    - `resume_changes_log`
      - `id` (uuid, primary key)
      - `resume_id` (uuid, foreign key to resumes)
      - `changed_section` (text)
      - `change_data` (jsonb)
      - `change_timestamp` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Ensure users can only access their own resumes and change logs

  3. Indexes
    - Add indexes for efficient querying by user_id and timestamps
*/

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Resume',
  resume_data jsonb NOT NULL DEFAULT '{}',
  template_used text NOT NULL DEFAULT 'modern-professional',
  version integer NOT NULL DEFAULT 1,
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create resume changes log table
CREATE TABLE IF NOT EXISTS resume_changes_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  changed_section text NOT NULL,
  change_data jsonb NOT NULL DEFAULT '{}',
  change_timestamp timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_changes_log ENABLE ROW LEVEL SECURITY;

-- Create policies for resumes table
CREATE POLICY "Users can view own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for resume_changes_log table
CREATE POLICY "Users can view own resume changes"
  ON resume_changes_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM resumes 
      WHERE resumes.id = resume_changes_log.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own resume changes"
  ON resume_changes_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM resumes 
      WHERE resumes.id = resume_changes_log.resume_id 
      AND resumes.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_last_updated ON resumes(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_resume_changes_resume_id ON resume_changes_log(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_changes_timestamp ON resume_changes_log(change_timestamp DESC);

-- Create index on JSONB data for efficient queries
CREATE INDEX IF NOT EXISTS idx_resumes_data_gin ON resumes USING gin(resume_data);
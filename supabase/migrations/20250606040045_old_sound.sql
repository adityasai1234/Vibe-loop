/*
  # Add loop templates, activities, and achievements

  1. New Tables
    - `loop_templates`: Stores user-created routine templates
    - `activities`: Tracks user interactions for heatmap
    - `achievements`: Stores user badges and streaks
    - `template_songs`: Junction table for template-song relationships

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Loop Templates
CREATE TABLE IF NOT EXISTS loop_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration interval,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE loop_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own templates"
  ON loop_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public templates"
  ON loop_templates
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Template Songs
CREATE TABLE IF NOT EXISTS template_songs (
  template_id uuid REFERENCES loop_templates(id) ON DELETE CASCADE,
  song_id text NOT NULL,
  position integer NOT NULL,
  PRIMARY KEY (template_id, song_id)
);

ALTER TABLE template_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage songs in their templates"
  ON template_songs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM loop_templates
      WHERE id = template_id AND user_id = auth.uid()
    )
  );

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type text NOT NULL,
  level integer DEFAULT 1,
  progress integer DEFAULT 0,
  achieved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_loop_templates_updated_at
  BEFORE UPDATE ON loop_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_achievements_updated_at
  BEFORE UPDATE ON achievements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
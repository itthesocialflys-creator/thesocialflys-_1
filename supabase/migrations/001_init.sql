-- ENUMS
CREATE TYPE app_role AS ENUM ('ADMIN', 'AGENT');
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST');
CREATE TYPE room_type AS ENUM ('DIRECT', 'GROUP');

-- PROFILES (Linked to Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role app_role DEFAULT 'AGENT',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEADS
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  status lead_status DEFAULT 'NEW',
  estimated_value DECIMAL(12, 2) DEFAULT 0.00,
  assigned_agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  source TEXT DEFAULT 'Web Form',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEAD ACTIVITIES
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  performed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CHAT ROOMS & CHAT MESSAGES
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type room_type DEFAULT 'GROUP',
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_members (
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  attached_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'AGENT')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- REALTIME ENABLERS
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- ROW-LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admin can manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);

-- Leads policies
CREATE POLICY "Admin Full Access Leads" ON leads FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
CREATE POLICY "Agent Assigned Leads Access" ON leads FOR ALL USING (
  assigned_agent_id = auth.uid()
);
CREATE POLICY "Public lead insert" ON leads FOR INSERT WITH CHECK (true);

-- Lead activities policies
CREATE POLICY "Admin Full Access Activities" ON lead_activities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
CREATE POLICY "Agent Lead Activities" ON lead_activities FOR ALL USING (
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = lead_activities.lead_id
    AND leads.assigned_agent_id = auth.uid()
  )
);

-- Chat rooms policies
CREATE POLICY "Members can view rooms" ON chat_rooms FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_members WHERE chat_members.room_id = chat_rooms.id AND chat_members.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
CREATE POLICY "Authenticated can create rooms" ON chat_rooms FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Chat members policies
CREATE POLICY "Members can view memberships" ON chat_members FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
CREATE POLICY "Authenticated can join rooms" ON chat_members FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Chat messages policies
CREATE POLICY "Admin Full Access Messages" ON chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN')
);
CREATE POLICY "Room Members Messages" ON chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM chat_members WHERE chat_members.room_id = chat_messages.room_id AND chat_members.user_id = auth.uid())
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_agent ON leads(assigned_agent_id);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX idx_lead_activities_lead ON lead_activities(lead_id);

-- Seed default #sales room (run after first admin is created)
-- INSERT INTO chat_rooms (name, type) VALUES ('#sales', 'GROUP');

-- ROLLCALL PHASE 3: BADGES & ACHIEVEMENTS SCHEMA

-- 1. Master Badges Table (Reference)
CREATE TABLE IF NOT EXISTS public.master_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text NOT NULL,
    icon text NOT NULL, -- Lucide icon name or emoji
    category text NOT NULL, -- 'milestone', 'merit', 'seasonal', 'early_adopter'
    created_at timestamp with time zone DEFAULT now()
);

-- 2. User Badges Table (Tracking who has what)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id uuid REFERENCES public.master_badges(id) ON DELETE CASCADE,
    awarded_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- 3. Seed Master Badges
INSERT INTO public.master_badges (name, description, icon, category) VALUES
('Early Bird', 'Joined during the PBC launch phase.', 'Bird', 'early_adopter'),
('Community Voice', 'Posted your first forum thread.', 'MessageSquare', 'milestone'),
('First Meetup', 'Attended your first local session.', 'Calendar', 'milestone'),
('Helpful Resident', 'Received 10+ upvotes on forum posts.', 'ThumbsUp', 'merit'),
('Tournament Ready', 'Competed in a verified PBC tournament.', 'Trophy', 'merit'),
('Friendly Host', 'Successfully organized 3+ group sessions.', 'Heart', 'merit'),
('PBC Veteran', 'Platform member for over 90 days.', 'Shield', 'seasonal')
ON CONFLICT (name) DO NOTHING;

-- 4. Sample Badge Awards
INSERT INTO public.user_badges (user_id, badge_id)
SELECT p.id, b.id
FROM public.profiles p, public.master_badges b
WHERE b.name = 'Early Bird'
LIMIT 50;

COMMENT ON TABLE public.master_badges IS 'Master catalog of all possible achievements.';
COMMENT ON TABLE public.user_badges IS 'Record of achievements earned by residents.';

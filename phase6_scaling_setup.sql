-- ROLLCALL PHASE 6: GLOBAL SCALING & MONETIZATION SCHEMA

-- 1. Counties Table (Multi-Region Activation)
CREATE TABLE IF NOT EXISTS public.counties (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE, -- 'Palm Beach', 'Broward', 'Miami-Dade'
    state text DEFAULT 'Florida',
    status text DEFAULT 'Inactive', -- 'Inactive', 'Waitlist', 'Pilot', 'Active'
    center_coords jsonb NOT NULL, -- [lat, lng] for map centering
    waitlist_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Monetization: Premium Tier & Promotions
CREATE TABLE IF NOT EXISTS public.promoted_groups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
    county_id uuid REFERENCES public.counties(id),
    priority integer DEFAULT 1,
    ends_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Organizer Subscription Status
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'Free'; -- 'Free', 'Premium', 'Pro'
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified_organizer boolean DEFAULT false;

-- 4. Initial Seed for PBC Pilot
INSERT INTO public.counties (name, status, center_coords)
VALUES ('Palm Beach', 'Active', '[26.65, -80.1]')
ON CONFLICT (name) DO NOTHING;

-- 5. Enable RLS
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promoted_groups ENABLE ROW LEVEL SECURITY;

-- 6. Policies
CREATE POLICY "Anyone can view active counties" ON public.counties
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view promoted groups" ON public.promoted_groups
    FOR SELECT USING (true);

COMMENT ON TABLE public.counties IS 'Geographic regions available for RollCall activation.';
COMMENT ON TABLE public.promoted_groups IS 'Groups with featured placement via premium tier.';

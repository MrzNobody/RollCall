-- ROLLCALL PHASE 2: MODERATION SCHEMA

-- 1. Extend Profiles with Moderation Stats
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trust_score int DEFAULT 100,
ADD COLUMN IF NOT EXISTS warning_count int DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_action_at timestamp with time zone;

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id uuid REFERENCES public.profiles(id),
    target_id uuid, -- Can be a profile ID or group ID
    target_type text NOT NULL, -- 'profile', 'group', 'message'
    reason text NOT NULL,
    description text,
    status text DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
    action_taken text,
    created_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone,
    resolved_by uuid REFERENCES public.profiles(id)
);

-- 3. Create Moderation Logs for Audit
CREATE TABLE IF NOT EXISTS public.moderation_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id uuid REFERENCES public.profiles(id),
    target_id uuid,
    action text NOT NULL, -- 'warn', 'suspend', 'ban', 'dismiss_report'
    reason text,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Sample Reports for Admin Testing
INSERT INTO public.reports (target_id, target_type, reason, description, status)
SELECT id, 'profile', 'Spam', 'User is posting suspicious links in the Helldivers group.', 'pending'
FROM public.profiles
WHERE is_flagged = true
LIMIT 5;

COMMENT ON TABLE public.reports IS 'Community reports for admin review.';
COMMENT ON TABLE public.moderation_logs IS 'Audit trail for all moderator actions.';

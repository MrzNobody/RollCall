-- ROLLCALL PHASE 4: PERSONALIZATION & PRIVACY SCHEMA

-- 1. Direct Messages Table
CREATE TABLE IF NOT EXISTS public.direct_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    content text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Inbox View (Helper for the UI)
CREATE OR REPLACE VIEW public.inbox_summary AS
SELECT 
    LEAST(sender_id, receiver_id) as user_a,
    GREATEST(sender_id, receiver_id) as user_b,
    MAX(created_at) as last_message_at,
    COUNT(*) as total_messages
FROM public.direct_messages
GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id);

-- 3. Sample DM Data
INSERT INTO public.direct_messages (sender_id, receiver_id, content)
SELECT 
    (SELECT id FROM public.profiles LIMIT 1),
    (SELECT id FROM public.profiles OFFSET 1 LIMIT 1),
    'Hey! Loved your post in the forum. Are you going to the meetup tomorrow?'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE public.direct_messages IS 'Private 1-on-1 conversations between residents.';

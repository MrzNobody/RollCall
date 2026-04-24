-- ROLLCALL PHASE 3: SCHEDULING & RSVP SCHEMA

-- 1. Events / Sessions Table
CREATE TABLE IF NOT EXISTS public.events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
    organizer_id uuid REFERENCES public.profiles(id),
    title text NOT NULL,
    description text,
    event_date timestamp with time zone NOT NULL,
    location_name text DEFAULT 'Online / Discord',
    location_address text,
    max_attendees int DEFAULT 10,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. RSVPs Table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'going', -- 'going', 'maybe', 'declined'
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(event_id, user_id)
);

-- 3. Sample Event Data
INSERT INTO public.events (group_id, organizer_id, title, description, event_date, location_name)
SELECT 
    id, 
    (SELECT id FROM public.profiles LIMIT 1), 
    'PBC Weekly Meetup: ' || name, 
    'Join us for our weekly session! All skill levels welcome.', 
    now() + interval '3 days',
    'Jupiter Community Center'
FROM public.groups
LIMIT 15;

COMMENT ON TABLE public.events IS 'Scheduled group sessions and meetups.';
COMMENT ON TABLE public.rsvps IS 'Resident attendance tracking for events.';

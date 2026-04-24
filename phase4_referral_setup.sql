-- ROLLCALL PHASE 4: VIRAL GROWTH & REFERRAL SCHEMA

-- 1. Referral Codes Table
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    code text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Referrals Tracking Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id uuid REFERENCES public.profiles(id),
    referee_id uuid REFERENCES public.profiles(id) UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Generate unique codes for existing users (High Performance Set-Based)
INSERT INTO public.referral_codes (user_id, code)
SELECT 
    id, 
    LOWER(SUBSTRING(username, 1, 4)) || '-' || SUBSTRING(gen_random_uuid()::text, 1, 6)
FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE public.referral_codes IS 'Personalized invite codes for residents.';
COMMENT ON TABLE public.referrals IS 'Tracking successful neighbor recruitments.';

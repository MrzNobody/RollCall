-- ROLLCALL PHASE 5: INSTITUTIONAL HARDENING & COMPLIANCE SCHEMA

-- 0. Add is_admin to profiles (Security Master Key)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 1. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    category text NOT NULL, -- 'Safety', 'Technical', 'Compliance', 'Account', 'Other'
    subject text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
    priority text DEFAULT 'Standard', -- 'Standard', 'High', 'Urgent'
    admin_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Immutable Admin Audit Log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id uuid REFERENCES public.profiles(id),
    action text NOT NULL, -- 'User Ban', 'Group Delete', 'Report Dismiss', etc.
    target_id uuid, -- ID of the user/group/post acted upon
    details jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Data Deletion Requests (Compliance)
CREATE TABLE IF NOT EXISTS public.data_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'Data Export', 'Account Deletion'
    status text DEFAULT 'Pending', -- 'Pending', 'Processing', 'Completed'
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- 4. Enable RLS on these sensitive tables
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_requests ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Support Tickets: Users can only see their own tickets
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own tickets" ON public.support_tickets;
CREATE POLICY "Users can create their own tickets" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Data Requests: Users can only see their own requests
DROP POLICY IF EXISTS "Users can view their own data requests" ON public.data_requests;
CREATE POLICY "Users can view their own data requests" ON public.data_requests
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own data requests" ON public.data_requests;
CREATE POLICY "Users can create their own data requests" ON public.data_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admins can see audit logs
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit log" ON public.admin_audit_log
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
    ));

COMMENT ON TABLE public.support_tickets IS 'Official resident support requests.';
COMMENT ON TABLE public.admin_audit_log IS 'Immutable record of all administrative actions.';
COMMENT ON TABLE public.data_requests IS 'Tracking GDPR/CCPA compliance requests.';

-- SECURITY UTILITY: SOLE ADMIN ACTIVATION
-- Run this to reset all admins and make yourself the only master:
-- UPDATE public.profiles SET is_admin = false;
-- UPDATE public.profiles SET is_admin = true WHERE email = 'YOUR_EMAIL_HERE';


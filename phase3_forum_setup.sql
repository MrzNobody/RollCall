-- ROLLCALL PHASE 3: FORUM & ENGAGEMENT SCHEMA

-- 1. Forum Posts Table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
    author_id uuid REFERENCES public.profiles(id),
    title text NOT NULL,
    content text NOT NULL,
    category text DEFAULT 'discussion', -- 'discussion', 'tip', 'announcement', 'help'
    is_pinned boolean DEFAULT false,
    upvotes int DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Forum Comments Table
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    author_id uuid REFERENCES public.profiles(id),
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Post Votes Table (Prevent double-voting)
CREATE TABLE IF NOT EXISTS public.post_votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id uuid REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id),
    vote_type int DEFAULT 1, -- 1 for upvote, -1 for downvote
    UNIQUE(post_id, user_id)
);

-- 4. Sample Forum Data
INSERT INTO public.forum_posts (group_id, author_id, title, content, category)
SELECT id, (SELECT id FROM public.profiles LIMIT 1), 'Welcome to the PBC Chapter!', 'Glad to have everyone here. Let''s use this forum for long-term planning.', 'announcement'
FROM public.groups
LIMIT 10;

COMMENT ON TABLE public.forum_posts IS 'Community discussion threads.';
COMMENT ON TABLE public.forum_comments IS 'Replies to forum threads.';

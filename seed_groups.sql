-- ROLLCALL: HIGH-FIDELITY PILOT SEED DATA
-- Run this in your Supabase SQL Editor to populate the platform for Palm Beach County.

-- 1. Ensure PBC County is active
INSERT INTO public.counties (name, status, center_coords)
VALUES ('Palm Beach', 'Active', '[26.65, -80.1]')
ON CONFLICT (name) DO UPDATE SET status = 'Active';

-- 2. Seed Diverse Groups
INSERT INTO public.groups (name, category, city, description, members, capacity, image, skill, coords)
VALUES 
('West Palm Valorant Elite', 'Gaming', 'West Palm Beach', 'The premier competitive tactical shooter hub in PBC. Weekly tournaments and local LAN meetups.', 12, 50, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80', 'Competitive', '[26.7153, -80.0534]'),
('Jupiter D&D Guild', 'Tabletop', 'Jupiter', 'A community of storytellers and strategists. From One-Shots to long-term campaigns.', 8, 20, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80', 'All levels', '[26.9342, -80.0942]'),
('Delray Beach Pickleball', 'Sports', 'Delray Beach', 'Casual doubles and local social play. All residents welcome for morning sessions.', 45, 100, 'https://images.unsplash.com/photo-1626225967633-9d3211516f46?auto=format&fit=crop&q=80', 'Casual', '[26.4615, -80.0728]'),
('Boca Retro Gamers', 'Gaming', 'Boca Raton', 'Celebrating the golden age of arcade and console gaming. Retro tournaments and hardware swaps.', 15, 30, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80', 'Casual', '[26.3683, -80.1289]'),
('Lake Worth Strategy Club', 'Tabletop', 'Lake Worth', 'Deep strategy board games and TCG meetups. If it has a rulebook, we play it.', 10, 25, 'https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80', 'Advanced', '[26.6159, -80.0569]'),
('Boynton Beach Soccer Social', 'Sports', 'Boynton Beach', 'Weekly pick-up games and local tournament prep. Join us for fitness and fun.', 22, 40, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80', 'Intermediate', '[26.5256, -80.0664]'),
('The PBC Art Jam', 'Other', 'West Palm Beach', 'A creative space for local artists. Weekly workshops and community mural projects.', 30, 60, 'https://images.unsplash.com/photo-1460661419201-fd4ce18686e6?auto=format&fit=crop&q=80', 'All levels', '[26.7110, -80.0591]');

-- 3. Update Stats
UPDATE public.counties 
SET waitlist_count = (SELECT count(*) FROM public.groups WHERE city = 'West Palm Beach')
WHERE name = 'Palm Beach';

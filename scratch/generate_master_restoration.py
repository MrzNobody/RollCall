import csv
import json
import random

csv_path = 'production_users_import.csv'
output_sql = 'master_restoration.sql'

# CATEGORY POOLS for Group Seeding
GAMING_MODERN = [
    "Warzone 2.0 PBC", "Valorant WPB Hub", "Apex Legends Squads", "LoL Florida West", 
    "Fortnite Zero Build", "Minecraft Survival", "Roblox Dev Group", "CS:GO Veterans", 
    "Overwatch 2 Mains", "FIFA 24 Pro Clubs", "Madden 24 PBC League", "NBA 2K24 Parks", 
    "Street Fighter 6", "Tekken 8 Dojo", "MK1 Tournament Hub", "Elden Ring Co-op", 
    "Baldur's Gate 3 Party", "Helldivers 2 PBC", "Palworld Builders", "Destiny 2 Raids"
]
TABLETOP = [
    "D&D 5e PBC", "Pathfinder 2e Society", "Warhammer 40k WPB", "Catan Nights", 
    "Ticket to Ride", "Pandemic Squad", "Terraforming Mars", "Gloomhaven Party", 
    "Scythe PBC", "7 Wonders Club"
]
SPORTS = [
    "Pickleball Lake Worth", "Soccer WPB League", "Tennis PBC Open", "Basketball Courts", 
    "Golf PBC Society", "Volleyball Beach Hub", "Running PBC", "Cycling WPB", 
    "Swimming PBC", "Padel Club"
]

CITIES = ["West Palm Beach", "Boca Raton", "Jupiter", "Wellington", "Lake Worth", "Palm Beach Gardens", "Delray Beach"]

def clean_val(val):
    return str(val).strip()

with open(output_sql, 'w') as f:
    f.write("-- ROLLCALL MASTER RESTORATION: 500 RESIDENTS & TRIBAL GROUPS\n\n")
    
    # 1. Ensure Table Structure
    f.write("-- Ensure Tables Exist\n")
    f.write("CREATE TABLE IF NOT EXISTS public.profiles (id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, username text UNIQUE, full_name text, subscription_tier text DEFAULT 'Free', is_verified_organizer boolean DEFAULT false, created_at timestamp with time zone DEFAULT now());\n")
    f.write("CREATE TABLE IF NOT EXISTS public.groups (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, name text NOT NULL UNIQUE, category text NOT NULL, city text NOT NULL, description text, capacity integer DEFAULT 50, members integer DEFAULT 1, coords jsonb, image text, created_at timestamp with time zone DEFAULT now());\n")
    f.write("CREATE TABLE IF NOT EXISTS public.memberships (id uuid DEFAULT gen_random_uuid() PRIMARY KEY, user_id uuid REFERENCES auth.users ON DELETE CASCADE, group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE, role text DEFAULT 'member', UNIQUE(user_id, group_id));\n\n")

    # 2. Restoration Function
    f.write("-- Robust User Creation Function\n")
    f.write("""
CREATE OR REPLACE FUNCTION restore_rollcall_user(
    u_email text, u_password text, u_name text, u_username text, u_is_admin boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
    target_id uuid;
BEGIN
    SELECT id INTO target_id FROM auth.users WHERE email = u_email;
    
    IF target_id IS NULL THEN
        target_id := gen_random_uuid();
        INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at)
        VALUES ('00000000-0000-0000-0000-000000000000', target_id, 'authenticated', 'authenticated', u_email, crypt(u_password, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', u_name), u_is_admin, now(), now());
    END IF;

    INSERT INTO public.profiles (id, username, full_name, subscription_tier, is_verified_organizer)
    VALUES (target_id, u_username, u_name, CASE WHEN u_is_admin THEN 'Pro' ELSE 'Free' END, u_is_admin)
    ON CONFLICT (id) DO UPDATE SET is_verified_organizer = u_is_admin, subscription_tier = CASE WHEN u_is_admin THEN 'Pro' ELSE 'Free' END;

    RETURN target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\n""")

    # 3. Seed Super Admin
    f.write("-- SEEDING SUPER ADMIN\n")
    f.write("SELECT restore_rollcall_user('craineri76@gmail.com', 'password123', 'Carlo Raineri', 'Carlo_Admin', true);\n\n")

    # 4. Seed Residents from CSV
    f.write("-- SEEDING 500 RESIDENTS FROM PRODUCTION CSV\n")
    try:
        with open(csv_path, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                email = clean_val(row['email'])
                password = clean_val(row['password'])
                username = email.split('@')[0].replace('.', '_')
                fullname = username.replace('_', ' ').title()
                f.write(f"SELECT restore_rollcall_user('{email}', '{password}', '{fullname}', '{username}');\n")
    except Exception as e:
        f.write(f"-- ERROR READING CSV: {e}\n")

    # 5. Seed Groups
    f.write("\n-- SEEDING TRIBAL GROUPS\n")
    all_groups = [
        (GAMING_MODERN, "Gaming", "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"),
        (TABLETOP, "Tabletop", "https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800"),
        (SPORTS, "Sports", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800")
    ]
    for names, cat, img in all_groups:
        for name in names:
            city = random.choice(CITIES)
            lat = round(random.uniform(26.3, 26.9), 4)
            lng = round(random.uniform(-80.2, -80.0), 4)
            f.write(f"INSERT INTO public.groups (name, category, city, description, coords, image) VALUES ('{name}', '{cat}', '{city}', 'Official PBC {cat} group.', jsonb_build_array({lat}, {lng}), '{img}') ON CONFLICT (name) DO NOTHING;\n")

    # 6. Randomize Memberships
    f.write("\n-- AUTO-JOINING RESIDENTS TO GROUPS\n")
    f.write("""
DO $$
DECLARE
    u RECORD;
    g RECORD;
BEGIN
    FOR u IN SELECT id FROM public.profiles WHERE is_verified_organizer = false LOOP
        FOR g IN (SELECT id FROM public.groups ORDER BY random() LIMIT (random()*2 + 1)::int) LOOP
            INSERT INTO public.memberships (user_id, group_id) VALUES (u.id, g.id) ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END $$;
""")

print("SUCCESS: 'master_restoration.sql' generated with 500 residents.")

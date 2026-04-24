import zipfile
import xml.etree.ElementTree as ET
import json
import random

xlsx_path = 'RollCall_Demo_Data.xlsx'
output_sql = 'production_final_sync.sql'

def get_data():
    try:
        with zipfile.ZipFile(xlsx_path, 'r') as zip_ref:
            strings_xml = zip_ref.read('xl/sharedStrings.xml')
            strings_root = ET.fromstring(strings_xml)
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            shared_strings = [node.text for node in strings_root.findall('.//ns:t', ns)]
            sheet_xml = zip_ref.read('xl/worksheets/sheet1.xml')
            sheet_root = ET.fromstring(sheet_xml)
            rows = []
            for row_node in sheet_root.findall('.//ns:row', ns):
                cells = []
                for cell_node in row_node.findall('.//ns:c', ns):
                    if cell_node.get('t') == 's':
                        val_node = cell_node.find('.//ns:v', ns)
                        cells.append(shared_strings[int(val_node.text)] if val_node is not None else '')
                    else:
                        val_node = cell_node.find('.//ns:v', ns)
                        cells.append(val_node.text if val_node is not None else '')
                rows.append(cells)
            return rows
    except Exception as e:
        print(f"Error reading XLSX: {e}")
        return []

def clean_val(val):
    if val is None: return ""
    return str(val).replace('\n', ' ').replace('\r', ' ').strip()

# CATEGORY POOLS
GAMING_MODERN = [
    "Warzone 2.0 PBC", "Valorant WPB Hub", "Apex Legends Squads", "LoL Florida West", 
    "Fortnite Zero Build", "Minecraft Survival", "Roblox Dev Group", "CS:GO Veterans", 
    "Overwatch 2 Mains", "FIFA 24 Pro Clubs", "Madden 24 PBC League", "NBA 2K24 Parks", 
    "Street Fighter 6", "Tekken 8 Dojo", "MK1 Tournament Hub", "Elden Ring Co-op", 
    "Baldur's Gate 3 Party", "Helldivers 2 PBC", "Palworld Builders", "Destiny 2 Raids"
]
GAMING_CLASSIC = [
    "StarCraft BW Masters", "Diablo II Resurrected", "Quake III Arena", 
    "Age of Empires II", "Smash Melee PBC", "Halo 3 Customs", "WOW Classic Guild"
]
TABLETOP = [
    "D&D 5e PBC", "Pathfinder 2e Society", "Warhammer 40k WPB", "Catan Nights", 
    "Ticket to Ride", "Pandemic Squad", "Terraforming Mars", "Gloomhaven Party", 
    "Scythe PBC", "7 Wonders Club"
]
CARDS = [
    "MTG Commander PBC", "Poker WPB High Stakes", "Bridge Masters", "Euchre Club", 
    "Hearthstone Local", "Pokemon TCG Hub", "Yu-Gi-Oh PBC"
]
SPORTS = [
    "Pickleball Lake Worth", "Soccer WPB League", "Tennis PBC Open", "Basketball Courts", 
    "Golf PBC Society", "Volleyball Beach Hub", "Running PBC", "Cycling WPB", 
    "Swimming PBC", "Padel Club"
]
ART_HOBBIES = [
    "Photography WPB", "Bird Watching Everglades", "Digital Painting", "Pottery PBC", 
    "Urban Sketching", "Gardening PBC", "Cooking Class", "Hiking Florida Trails", "Surfing WPB"
]

CITIES = ["West Palm Beach", "Boca Raton", "Jupiter", "Wellington", "Lake Worth", "Palm Beach Gardens", "Delray Beach"]
SKILLS = ["Casual", "Intermediate", "Competitive", "Pro"]

rows = get_data()

with open(output_sql, 'w') as f:
    f.write("-- ROLLCALL PRODUCTION FINAL SYNC (MASSIVE POPULATION - HARDENED)\n\n")
    f.write("TRUNCATE auth.users CASCADE;\n")
    f.write("TRUNCATE public.profiles CASCADE;\n")
    f.write("TRUNCATE public.groups CASCADE;\n")
    f.write("TRUNCATE public.memberships CASCADE;\n\n")

    f.write("-- CLEANUP OLD FUNCTIONS\n")
    f.write("DROP FUNCTION IF EXISTS create_rollcall_prod_user(text, text, text, text, int, text, text, text, text, text, decimal, int, jsonb, boolean);\n\n")

    f.write("""
CREATE OR REPLACE FUNCTION create_rollcall_prod_user(
    u_email text, u_password text, u_handle text, u_name text, 
    u_age int, u_city text, u_zip text, u_interest text, 
    u_platform text, u_bio text, u_rating decimal, 
    u_reviews int, u_badges jsonb, u_flagged boolean
) 
RETURNS uuid AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, is_super_admin, is_sso_user, is_anonymous
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
    u_email, crypt(u_password, gen_salt('bf', 10)), now(), 
    '{"provider":"email","providers":["email"]}', 
    jsonb_build_object('full_name', u_name, 'username', u_handle),
    now(), now(), false, false, false
  );

  INSERT INTO public.profiles (
    id, username, full_name, age, city, zip, 
    primary_interest, platform, bio, 
    rating, review_count, badges, is_flagged
  )
  VALUES (
    new_user_id, u_handle, u_name, u_age, u_city, u_zip, 
    u_interest, u_platform, u_bio, 
    u_rating, u_reviews, u_badges, u_flagged
  );
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\n""")

    user_ids = []
    badges_pool = ["PBC Veteran", "Early Bird", "Pro Gamer", "Tabletop King", "Friendly Host", "Tournament Ready"]
    
    # Generate 500 Users
    f.write("-- GENERATING 500 USERS (DOLLAR QUOTED)\n")
    for r in rows[2:502]:
        if len(r) < 16: continue
        email = clean_val(r[3])
        password = "password123"
        handle = clean_val(r[2])
        name = clean_val(r[1])
        age = r[5] if str(r[5]).isdigit() else "25"
        city = clean_val(r[6])
        zip_code = clean_val(r[7])
        interest = clean_val(r[9])
        platform = clean_val(r[12])
        bio = clean_val(r[15])
        is_flagged = random.random() < 0.02
        rating = round(random.uniform(2.5, 3.2), 1) if is_flagged else round(random.uniform(4.2, 5.0), 1)
        reviews = random.randint(5, 85)
        user_badges = random.sample(badges_pool, random.randint(1, 3))
        
        f.write(f"SELECT create_rollcall_prod_user($pbc${email}$pbc$, $pbc${password}$pbc$, $pbc${handle}$pbc$, $pbc${name}$pbc$, {age}, $pbc${city}$pbc$, $pbc${zip_code}$pbc$, $pbc${interest}$pbc$, $pbc${platform}$pbc$, $pbc${bio}$pbc$, {rating}, {reviews}, $pbc${json.dumps(user_badges)}$pbc$::jsonb, {'true' if is_flagged else 'false'});\n")

    # Group Generation Logic
    all_group_configs = [
        (GAMING_MODERN, "FPS Gaming", "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800"),
        (GAMING_CLASSIC, "FPS Gaming", "https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800"),
        (TABLETOP, "Dungeons & Dragons", "https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800"),
        (CARDS, "Board Games", "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800"),
        (SPORTS, "Soccer", "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800"),
        (ART_HOBBIES, "Other", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800")
    ]

    f.write("\n-- GENERATING 60+ GROUPS (DOLLAR QUOTED)\n")
    for names, category, img in all_group_configs:
        for name in names:
            city = random.choice(CITIES)
            skill = random.choice(SKILLS)
            cap = random.choice([8, 12, 20, 50])
            lat = round(random.uniform(26.3, 26.9), 4)
            lng = round(random.uniform(-80.2, -80.0), 4)
            desc = f"Join the {name} community in {city}. Open for all residents."
            f.write(f"INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ($pbc${name}$pbc$, $pbc${category}$pbc$, $pbc${city}$pbc$, $pbc${desc}$pbc$, {cap}, 1, $pbc${skill}$pbc$, ARRAY[{lat}, {lng}], $pbc${img}$pbc$);\n")

    f.write("\n-- RANDOMIZING 500 USERS INTO MEMBERSHIPS\n")
    f.write("""
DO $$
DECLARE
    u RECORD;
    g RECORD;
BEGIN
    FOR u IN SELECT id FROM public.profiles LOOP
        FOR g IN (SELECT id FROM public.groups ORDER BY random() LIMIT (random()*3 + 2)::int) LOOP
            IF NOT EXISTS (SELECT 1 FROM public.memberships WHERE user_id = u.id AND group_id = g.id) THEN
                INSERT INTO public.memberships (user_id, group_id) VALUES (u.id, g.id);
                UPDATE public.groups SET members = members + 1 WHERE id = g.id;
            END IF;
        END LOOP;
    END LOOP;
END $$;
""")

print(f"SUCCESS: Hardened Seed Script '{output_sql}' generated.")

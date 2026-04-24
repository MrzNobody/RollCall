import zipfile
import xml.etree.ElementTree as ET
import json
import random

xlsx_path = 'RollCall_Demo_Data.xlsx'
output_sql = 'production_final_sync.sql'

def get_data():
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

rows = get_data()

def clean_val(val):
    if val is None: return ""
    return str(val).replace('\n', ' ').replace('\r', ' ').strip()

badges_pool = ["PBC Veteran", "Early Bird", "Pro Gamer", "Tabletop King", "Friendly Host", "Tournament Ready"]

with open(output_sql, 'w') as f:
    f.write("-- ROLLCALL PRODUCTION FINAL SYNC (SUPABASE HARDENED)\n\n")
    f.write("TRUNCATE auth.users CASCADE;\n")
    f.write("TRUNCATE public.profiles CASCADE;\n\n")

    f.write("""
CREATE OR REPLACE FUNCTION create_rollcall_prod_user(
    u_email text, u_password text, u_handle text, u_name text, 
    u_age int, u_city text, u_zip text, u_interest text, 
    u_platform text, u_bio text, u_rating decimal, 
    u_reviews int, u_badges jsonb, u_flagged boolean
) 
RETURNS void AS $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, 
    recovery_token, email_change_token_new, email_change,
    is_super_admin, phone, phone_confirmed_at, phone_change, 
    phone_change_token, email_change_token_current, 
    email_change_confirm_status, banned_until, reauthentication_token,
    is_sso_user, is_anonymous
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', 
    u_email, crypt(u_password, gen_salt('bf', 10)), now(), 
    '{"provider":"email","providers":["email"]}', 
    jsonb_build_object('full_name', u_name, 'username', u_handle),
    now(), now(), '', 
    '', '', '', 
    false, NULL, NULL, '', 
    '', '', 
    0, NULL, '', 
    false, false
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\n""")

    for r in rows[2:502]:
        if len(r) < 16: continue
        
        email = clean_val(r[3])
        password = clean_val(r[4])
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

print(f"SUCCESS: Supabase-Hardened '{output_sql}' generated.")

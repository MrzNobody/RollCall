-- ROLLCALL PRODUCTION FINAL SYNC (MASSIVE POPULATION)

TRUNCATE auth.users CASCADE;
TRUNCATE public.profiles CASCADE;
TRUNCATE public.groups CASCADE;
TRUNCATE public.memberships CASCADE;


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

-- GENERATING 500 USERS
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('Email', 'password123', 'Gamer Handle', 'Display Name', 25, 'City', 'ZIP', 'Primary Interest', 'Platform', 'Bio', 4.3, 58, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ethan.baker229@yahoo.com', 'password123', 'Epic42914', 'Ethan Baker', 33, 'Jupiter', '33477', 'Sports Games', 'Nintendo Switch', 'Retired Sports Games tryhard, now just vibing. Live in Jupiter, FL.', 4.3, 21, '["PBC Veteran", "Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kylie.nelson829@gmail.com', 'password123', 'KylieNel99', 'Kylie Nelson', 35, 'Singer Island', '33404', 'Tabletop RPG', 'N/A', 'Always down for Tabletop RPG sessions. Singer Island-based. Message me anytime!', 4.7, 23, '["Tournament Ready", "Friendly Host", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('patrick.sanders748@icloud.com', 'password123', 'HackedGeneral81', 'Patrick Sanders', 20, 'Jupiter', '33458', 'Miniature Games', 'PlayStation', 'New to the scene! Trying to find people who love Miniature Games in Jupiter area.', 4.9, 20, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('riley.davis215@outlook.com', 'password123', 'Ivory404176', 'Riley Davis', 40, 'Royal Palm Beach', '33414', 'Puzzle Games', 'PC', 'South FL local. Puzzle Games enthusiast and weekend warrior. Royal Palm Beach represent!', 4.8, 21, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('damian.gomez218@icloud.com', 'password123', 'xXDa813Xx', 'Damian Gomez', 38, 'Juno Beach', '33408', 'Disc Golf', 'N/A', 'Retired Disc Golf tryhard, now just vibing. Live in Juno Beach, FL.', 4.9, 46, '["Tournament Ready", "PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ricky.gonzalez506@gmail.com', 'password123', 'BrokenGamer157', 'Ricky Gonzalez', 50, 'Delray Beach', '33446', 'Worker Placement', 'N/A', 'South FL local. Worker Placement enthusiast and weekend warrior. Delray Beach represent!', 4.7, 42, '["Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('paige.coleman162@icloud.com', 'password123', 'Grind813737', 'Paige Coleman', 45, 'Palm Beach Gardens', '33410', 'Souls-like Games', 'PC', 'New to the scene! Trying to find people who love Souls-like Games in Palm Beach Gardens area.', 4.7, 45, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('blake.coleman246@gmail.com', 'password123', 'BlakeCol82', 'Blake Coleman', 37, 'Royal Palm Beach', '33414', 'Soccer', 'Nintendo Switch', 'Retired Soccer tryhard, now just vibing. Live in Royal Palm Beach, FL.', 4.3, 46, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ryan.murphy124@yahoo.com', 'password123', 'RyanMur18', 'Ryan Murphy', 46, 'Lake Park', '33403', 'Weightlifting', 'PC', 'Casual Weightlifting fan from Lake Park. Also enjoy Battle Royale on weekends.', 4.3, 60, '["Friendly Host", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.torres553@yahoo.com', 'password123', 'xXMaProXx', 'Matthew Torres', 31, 'Belle Glade', '33430', 'Bird Watching', 'N/A', 'Local Belle Glade player. Into Bird Watching and Rock Climbing. Always looking for chill groups!', 4.2, 53, '["Tournament Ready", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elijah.brooks820@gmail.com', 'password123', 'ElijahBro34', 'Elijah Brooks', 39, 'Riviera Beach', '33407', 'Sandbox Games', 'PlayStation', 'Passionate about Sandbox Games. Based in Riviera Beach, FL. Hit me up for games or meetups.', 4.5, 66, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chase.thomas993@gmail.com', 'password123', 'ChaseTho31', 'Chase Thomas', 18, 'North Palm Beach', '33408', 'Dungeons & Dragons', 'N/A', 'Retired Dungeons & Dragons tryhard, now just vibing. Live in North Palm Beach, FL.', 4.6, 32, '["Early Bird", "PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('madison.okafor434@hotmail.com', 'password123', 'xXMaMasterXx', 'Madison Okafor', 36, 'Palm Beach', '33480', 'Basketball', 'PlayStation', 'Passionate about Basketball. Based in Palm Beach, FL. Hit me up for games or meetups.', 5.0, 36, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('leo.miller253@hotmail.com', 'password123', 'CobaltStriker430', 'Leo Miller', 54, 'Delray Beach', '33445', 'Warhammer', 'Steam Deck', 'Local Delray Beach player. Into Warhammer and Magic: The Gathering. Always looking for chill groups!', 4.9, 47, '["Pro Gamer", "Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexandra.smith76@hotmail.com', 'password123', 'AlexandraSmi74', 'Alexandra Smith', 24, 'Juno Beach', '33408', 'Sandbox Games', 'Mobile', 'Juno Beach native. Love Sandbox Games, dabble in Cooperative Board Games. Let''s connect!', 4.3, 27, '["PBC Veteran", "Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('madison.coleman160@outlook.com', 'password123', 'IvoryMadison27', 'Madison Coleman', 53, 'Delray Beach', '33444', 'Miniature Games', 'PC', 'South FL local. Miniature Games enthusiast and weekend warrior. Delray Beach represent!', 4.2, 43, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jacob.wood723@icloud.com', 'password123', 'StormSlayer968', 'Jacob Wood', 53, 'Tequesta', '33469', 'Basketball', 'Nintendo Switch', 'Always down for Basketball sessions. Tequesta-based. Message me anytime!', 4.3, 44, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('courtney.mitchell886@yahoo.com', 'password123', 'CourtneyMit62', 'Courtney Mitchell', 33, 'Boynton Beach', '33435', 'Dungeons & Dragons', 'Steam Deck', 'New to the scene! Trying to find people who love Dungeons & Dragons in Boynton Beach area.', 4.9, 15, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('pedro.jenkins25@yahoo.com', 'password123', 'xXPeBossXx', 'Pedro Jenkins', 32, 'Wellington', '33414', 'Disc Golf', 'N/A', 'South FL local. Disc Golf enthusiast and weekend warrior. Wellington represent!', 4.4, 65, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cameron.clark747@outlook.com', 'password123', 'xXCaBarbarianXx', 'Cameron Clark', 40, 'Manalapan', '33462', 'Platformers', 'PC & Console', 'Passionate about Platformers. Based in Manalapan, FL. Hit me up for games or meetups.', 4.3, 35, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('mia.price335@icloud.com', 'password123', 'JadeMia17', 'Mia Price', 44, 'Palm Beach Gardens', '33418', 'Open World', 'All Platforms', 'Always down for Open World sessions. Palm Beach Gardens-based. Message me anytime!', 4.4, 6, '["Early Bird", "Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('allison.murphy524@icloud.com', 'password123', 'AllisonMur94', 'Allison Murphy', 31, 'Tequesta', '33469', 'Tennis', 'N/A', 'Local Tequesta player. Into Tennis and Warhammer. Always looking for chill groups!', 4.5, 65, '["Tournament Ready", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('charlotte.hall467@icloud.com', 'password123', 'CharlotteHal99', 'Charlotte Hall', 22, 'Loxahatchee', '33470', 'Pickleball', 'N/A', 'New to the scene! Trying to find people who love Pickleball in Loxahatchee area.', 4.2, 24, '["Tabletop King", "Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chase.robinson468@yahoo.com', 'password123', 'xXCh420Xx', 'Chase Robinson', 25, 'Wellington', '33449', 'Social Deduction Games', 'N/A', 'South FL local. Social Deduction Games enthusiast and weekend warrior. Wellington represent!', 4.6, 74, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brittany.perez451@gmail.com', 'password123', 'OmegaBrittany35', 'Brittany Perez', 35, 'Wellington', '33449', 'Adventure Games', 'Xbox', 'Passionate about Adventure Games. Based in Wellington, FL. Hit me up for games or meetups.', 4.6, 29, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('thomas.mitchell478@icloud.com', 'password123', 'Echo561431', 'Thomas Mitchell', 52, 'Greenacres', '33467', 'Bird Watching', 'Nintendo Switch', 'South FL local. Bird Watching enthusiast and weekend warrior. Greenacres represent!', 4.6, 72, '["PBC Veteran", "Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('victoria.perez345@icloud.com', 'password123', 'VictoriaPer69', 'Victoria Perez', 42, 'West Palm Beach', '33405', 'Tabletop RPG', 'N/A', 'West Palm Beach native. Love Tabletop RPG, dabble in Fitness / General Workout. Let''s connect!', 4.8, 66, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexis.evans389@outlook.com', 'password123', 'AlexisEva68', 'Alexis Evans', 34, 'Boca Raton', '33431', 'Puzzle Games', 'N/A', 'Local Boca Raton player. Into Puzzle Games and Tabletop RPG. Always looking for chill groups!', 4.8, 14, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('pedro.gonzalez773@gmail.com', 'password123', 'PedroGon35', 'Pedro Gonzalez', 20, 'Boca Raton', '33433', 'Cooperative Board Games', 'N/A', 'South FL local. Cooperative Board Games enthusiast and weekend warrior. Boca Raton represent!', 4.7, 14, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('robert.diaz988@outlook.com', 'password123', 'OnyxMage952', 'Robert Diaz', 28, 'Delray Beach', '33445', 'Stand-Up Paddleboarding', 'PlayStation', 'Always down for Stand-Up Paddleboarding sessions. Delray Beach-based. Message me anytime!', 4.8, 37, '["Pro Gamer", "Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassidy.morgan519@outlook.com', 'password123', 'CursedShotgun843', 'Cassidy Morgan', 22, 'Royal Palm Beach', '33414', 'Biking / Cycling', 'Mobile', 'Passionate about Biking / Cycling. Based in Royal Palm Beach, FL. Hit me up for games or meetups.', 4.6, 59, '["PBC Veteran", "Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.nelson584@hotmail.com', 'password123', 'xXMaBossXx', 'Matthew Nelson', 47, 'Wellington', '33449', 'Racing Games', 'Mobile', 'South FL local. Racing Games enthusiast and weekend warrior. Wellington represent!', 4.6, 60, '["Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cole.allen88@yahoo.com', 'password123', 'xXCoWitchXx', 'Cole Allen', 30, 'Lake Park', '33403', 'Tabletop RPG', 'N/A', 'South FL local. Tabletop RPG enthusiast and weekend warrior. Lake Park represent!', 4.2, 16, '["Friendly Host", "Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dana.long544@outlook.com', 'password123', 'xXDa42Xx', 'Dana Long', 53, 'Loxahatchee', '33470', 'Warhammer', 'N/A', 'Loxahatchee native. Love Warhammer, dabble in Tabletop RPG. Let''s connect!', 4.9, 16, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jordan.gomez742@hotmail.com', 'password123', 'InfernoJordan25', 'Jordan Gomez', 35, 'Loxahatchee', '33470', 'Open World', 'PC', 'South FL local. Open World enthusiast and weekend warrior. Loxahatchee represent!', 4.7, 58, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.sullivan894@gmail.com', 'password123', 'CrimsonGavin62', 'Gavin Sullivan', 24, 'Belle Glade', '33430', 'Party Games', 'Mobile', 'Passionate about Party Games. Based in Belle Glade, FL. Hit me up for games or meetups.', 4.6, 11, '["Pro Gamer", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cole.zhao795@hotmail.com', 'password123', 'xXCoLanceXx', 'Cole Zhao', 32, 'Lantana', '33462', 'Miniature Games', 'Xbox', 'Lantana native. Love Miniature Games, dabble in Racing Games. Let''s connect!', 4.4, 82, '["PBC Veteran", "Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('aiden.mitchell299@gmail.com', 'password123', 'AidenMit46', 'Aiden Mitchell', 48, 'Tequesta', '33469', 'Co-op Games', 'All Platforms', 'Casual Co-op Games fan from Tequesta. Also enjoy Strategy Games on weekends.', 4.8, 11, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('isabella.hill62@yahoo.com', 'password123', 'IvoryIsabella96', 'Isabella Hill', 22, 'Boynton Beach', '33435', 'Triathlon', 'N/A', 'New to the scene! Trying to find people who love Triathlon in Boynton Beach area.', 4.8, 44, '["PBC Veteran", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('wesley.butler753@outlook.com', 'password123', 'NeonWesley12', 'Wesley Butler', 45, 'West Palm Beach', '33409', 'Battle Royale', 'Xbox', 'New to the scene! Trying to find people who love Battle Royale in West Palm Beach area.', 4.9, 44, '["Early Bird", "Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dylan.parker342@outlook.com', 'password123', 'CursedLord338', 'Dylan Parker', 44, 'Royal Palm Beach', '33411', 'Deck Building', 'N/A', 'South FL local. Deck Building enthusiast and weekend warrior. Royal Palm Beach represent!', 4.3, 44, '["Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nora.coleman845@gmail.com', 'password123', 'xXNoShotgunXx', 'Nora Coleman', 50, 'Riviera Beach', '33407', 'Warhammer', 'N/A', 'New to the scene! Trying to find people who love Warhammer in Riviera Beach area.', 4.8, 76, '["Tournament Ready", "Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gabrielle.baker319@hotmail.com', 'password123', 'JadeShotgun96', 'Gabrielle Baker', 28, 'Wellington', '33449', 'Beach Volleyball', 'Xbox', 'Wellington native. Love Beach Volleyball, dabble in Flag Football. Let''s connect!', 4.2, 76, '["PBC Veteran", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('daniel.howard957@hotmail.com', 'password123', 'LuckyDaniel1', 'Daniel Howard', 39, 'Lantana', '33462', 'Martial Arts', 'N/A', 'Retired Martial Arts tryhard, now just vibing. Live in Lantana, FL.', 4.6, 52, '["Early Bird", "Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.jones586@icloud.com', 'password123', 'AlejandroJon62', 'Alejandro Jones', 33, 'Lake Worth Beach', '33460', 'Deck Building', 'N/A', 'Always down for Deck Building sessions. Lake Worth Beach-based. Message me anytime!', 4.9, 17, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elijah.ruiz539@icloud.com', 'password123', 'GrindMaster420', 'Elijah Ruiz', 24, 'Tequesta', '33469', 'Miniature Games', 'N/A', 'New to the scene! Trying to find people who love Miniature Games in Tequesta area.', 4.4, 27, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christina.barnes647@outlook.com', 'password123', 'ChristinaBar21', 'Christina Barnes', 33, 'Boca Raton', '33433', 'Basketball', 'N/A', 'Always down for Basketball sessions. Boca Raton-based. Message me anytime!', 4.6, 67, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('victor.cox422@hotmail.com', 'password123', 'VictorCox31', 'Victor Cox', 51, 'Wellington', '33449', 'Running / Jogging', 'Steam Deck', 'Wellington native. Love Running / Jogging, dabble in Tennis. Let''s connect!', 4.3, 84, '["Tournament Ready", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('david.murphy307@icloud.com', 'password123', 'BetaDavid39', 'David Murphy', 55, 'Royal Palm Beach', '33411', 'Cooperative Board Games', 'N/A', 'Local Royal Palm Beach player. Into Cooperative Board Games and Magic: The Gathering. Always looking for chill groups!', 4.9, 79, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('serena.howard886@gmail.com', 'password123', 'xXSe561Xx', 'Serena Howard', 54, 'West Palm Beach', '33401', 'MMORPG', 'PlayStation', 'Retired MMORPG tryhard, now just vibing. Live in West Palm Beach, FL.', 4.5, 77, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jasmine.foster898@outlook.com', 'password123', 'BlessedJasmine22', 'Jasmine Foster', 52, 'Delray Beach', '33446', 'Tabletop RPG', 'PC & Console', 'Local Delray Beach player. Into Tabletop RPG and Dungeons & Dragons. Always looking for chill groups!', 5.0, 51, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('madison.richardson378@outlook.com', 'password123', 'xXMa305Xx', 'Madison Richardson', 47, 'Delray Beach', '33445', 'Tennis', 'N/A', 'Retired Tennis tryhard, now just vibing. Live in Delray Beach, FL.', 4.9, 9, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('eva.cooper312@icloud.com', 'password123', 'InfernoPro909', 'Eva Cooper', 20, 'West Palm Beach', '33409', 'Softball', 'N/A', 'Retired Softball tryhard, now just vibing. Live in West Palm Beach, FL.', 4.3, 69, '["PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.barnes455@icloud.com', 'password123', 'MatthewBar56', 'Matthew Barnes', 31, 'Royal Palm Beach', '33414', 'Yoga', 'N/A', 'Casual Yoga fan from Royal Palm Beach. Also enjoy Warhammer on weekends.', 4.7, 26, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('demi.anderson250@yahoo.com', 'password123', 'DemiAnd18', 'Demi Anderson', 39, 'Boca Raton', '33431', 'MMORPG', 'Mobile', 'South FL local. MMORPG enthusiast and weekend warrior. Boca Raton represent!', 4.5, 63, '["Tournament Ready", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jasmine.coleman16@outlook.com', 'password123', 'JasmineCol85', 'Jasmine Coleman', 26, 'West Palm Beach', '33405', 'Platformers', 'PlayStation', 'Always down for Platformers sessions. West Palm Beach-based. Message me anytime!', 4.7, 9, '["PBC Veteran", "Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brenda.russell516@yahoo.com', 'password123', 'GrindPBC931', 'Brenda Russell', 46, 'Delray Beach', '33444', 'Adventure Games', 'Steam Deck', 'Always down for Adventure Games sessions. Delray Beach-based. Message me anytime!', 4.6, 47, '["Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('destiny.cox282@hotmail.com', 'password123', 'HyperDestiny77', 'Destiny Cox', 26, 'Boca Raton', '33433', 'Puzzle Games', 'Steam Deck', 'Always down for Puzzle Games sessions. Boca Raton-based. Message me anytime!', 4.7, 26, '["Tournament Ready", "PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.miller321@icloud.com', 'password123', 'FierceAlejandro33', 'Alejandro Miller', 24, 'Lantana', '33462', 'Platformers', 'PlayStation', 'Always down for Platformers sessions. Lantana-based. Message me anytime!', 4.7, 43, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('genesis.robinson980@hotmail.com', 'password123', 'FierceGenesis16', 'Genesis Robinson', 55, 'Boca Raton', '33431', 'Beach Volleyball', 'PlayStation', 'Always down for Beach Volleyball sessions. Boca Raton-based. Message me anytime!', 4.6, 45, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('eva.zhao232@icloud.com', 'password123', 'Ivory239674', 'Eva Zhao', 54, 'Jupiter', '33477', 'Eurogames', 'N/A', 'Retired Eurogames tryhard, now just vibing. Live in Jupiter, FL.', 4.7, 77, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('daniel.cox765@hotmail.com', 'password123', 'DanielCox58', 'Daniel Cox', 23, 'West Palm Beach', '33405', 'War Games', 'N/A', 'Local West Palm Beach player. Into War Games and Cooperative Board Games. Always looking for chill groups!', 4.9, 79, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ivan.davis279@icloud.com', 'password123', 'xXIvWitchXx', 'Ivan Davis', 23, 'Boca Raton', '33431', 'Bird Watching', 'N/A', 'South FL local. Bird Watching enthusiast and weekend warrior. Boca Raton represent!', 4.8, 38, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dawn.perez47@yahoo.com', 'password123', 'xXDaBarbarianXx', 'Dawn Perez', 37, 'Lake Park', '33403', 'Simulation', 'Steam Deck', 'Lake Park native. Love Simulation, dabble in Indie Games. Let''s connect!', 4.4, 64, '["Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('genesis.lopez513@hotmail.com', 'password123', 'BlazeGenesis51', 'Genesis Lopez', 32, 'North Palm Beach', '33408', 'Platformers', 'All Platforms', 'North Palm Beach native. Love Platformers, dabble in Co-op Games. Let''s connect!', 4.6, 48, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dion.nguyen448@gmail.com', 'password123', 'DionNgu65', 'Dion Nguyen', 23, 'Royal Palm Beach', '33414', 'Warhammer', 'N/A', 'Passionate about Warhammer. Based in Royal Palm Beach, FL. Hit me up for games or meetups.', 4.3, 79, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassandra.ramirez360@yahoo.com', 'password123', 'CassandraRam23', 'Cassandra Ramirez', 40, 'Lake Worth Beach', '33460', 'MOBA', 'Steam Deck', 'New to the scene! Trying to find people who love MOBA in Lake Worth Beach area.', 4.4, 31, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('crystal.taylor155@icloud.com', 'password123', 'CrimsonLance647', 'Crystal Taylor', 38, 'Greenacres', '33463', 'Beach Volleyball', 'N/A', 'Local Greenacres player. Into Beach Volleyball and Fitness / General Workout. Always looking for chill groups!', 4.6, 34, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chloe.long661@gmail.com', 'password123', 'xXChAxeXx', 'Chloe Long', 22, 'Palm Beach Gardens', '33410', 'Kayaking', 'PlayStation', 'Passionate about Kayaking. Based in Palm Beach Gardens, FL. Hit me up for games or meetups.', 4.6, 25, '["Friendly Host", "Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ben.taylor254@icloud.com', 'password123', 'xXBePaladinXx', 'Ben Taylor', 20, 'Boynton Beach', '33437', 'War Games', 'N/A', 'Passionate about War Games. Based in Boynton Beach, FL. Hit me up for games or meetups.', 4.8, 37, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('omar.carter291@outlook.com', 'password123', 'OmarCar52', 'Omar Carter', 42, 'Palm Springs', '33461', 'Magic: The Gathering', 'PlayStation', 'Retired Magic: The Gathering tryhard, now just vibing. Live in Palm Springs, FL.', 4.6, 44, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bianca.lewis317@yahoo.com', 'password123', 'BiancaLew53', 'Bianca Lewis', 41, 'West Palm Beach', '33405', 'Souls-like Games', 'Xbox', 'West Palm Beach native. Love Souls-like Games, dabble in Softball. Let''s connect!', 4.9, 74, '["Tabletop King", "Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jacob.evans45@icloud.com', 'password123', 'EpicJacob93', 'Jacob Evans', 46, 'Boynton Beach', '33436', 'Tennis', 'N/A', 'New to the scene! Trying to find people who love Tennis in Boynton Beach area.', 4.5, 9, '["Early Bird", "PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jordan.long473@outlook.com', 'password123', 'xXJoDruidXx', 'Jordan Long', 46, 'Juno Beach', '33408', 'Hiking', 'PlayStation', 'Juno Beach native. Love Hiking, dabble in Horror Games. Let''s connect!', 4.2, 41, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maria.nelson851@icloud.com', 'password123', 'ModdedAce837', 'Maria Nelson', 27, 'Pahokee', '33476', 'Party Games', 'N/A', 'Always down for Party Games sessions. Pahokee-based. Message me anytime!', 4.8, 70, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elijah.reyes141@gmail.com', 'password123', 'ModdedElijah61', 'Elijah Reyes', 27, 'Greenacres', '33467', 'Strategy Games', 'All Platforms', 'Casual Strategy Games fan from Greenacres. Also enjoy MMORPG on weekends.', 5.0, 33, '["Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.collins430@hotmail.com', 'password123', 'xXMoSlayerXx', 'Morgan Collins', 33, 'Boca Raton', '33431', 'Running / Jogging', 'PC & Console', 'Retired Running / Jogging tryhard, now just vibing. Live in Boca Raton, FL.', 4.4, 52, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jenna.torres999@outlook.com', 'password123', 'AzureRogue520', 'Jenna Torres', 51, 'Boca Raton', '33496', 'Eurogames', 'PC & Console', 'Passionate about Eurogames. Based in Boca Raton, FL. Hit me up for games or meetups.', 4.8, 63, '["Friendly Host", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dana.wood46@outlook.com', 'password123', 'LuckyDana83', 'Dana Wood', 26, 'Greenacres', '33467', 'Trading Card Games', 'Nintendo Switch', 'South FL local. Trading Card Games enthusiast and weekend warrior. Greenacres represent!', 4.8, 49, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brenda.martinez260@gmail.com', 'password123', 'BrendaMar46', 'Brenda Martinez', 48, 'North Palm Beach', '33408', 'Social Deduction Games', 'N/A', 'Retired Social Deduction Games tryhard, now just vibing. Live in North Palm Beach, FL.', 4.2, 18, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('owen.evans377@hotmail.com', 'password123', 'CasualOwen11', 'Owen Evans', 49, 'Belle Glade', '33430', 'RPG', 'Mobile', 'Retired RPG tryhard, now just vibing. Live in Belle Glade, FL.', 4.3, 34, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jake.ward458@gmail.com', 'password123', 'CobaltJake56', 'Jake Ward', 40, 'Tequesta', '33469', 'Bird Watching', 'N/A', 'Tequesta native. Love Bird Watching, dabble in Flag Football. Let''s connect!', 4.4, 49, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brooklyn.cox130@gmail.com', 'password123', 'BrooklynCox92', 'Brooklyn Cox', 20, 'Tequesta', '33469', 'Horror Games', 'PC & Console', 'South FL local. Horror Games enthusiast and weekend warrior. Tequesta represent!', 4.4, 26, '["Pro Gamer", "Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('logan.coleman512@hotmail.com', 'password123', 'xXLo321Xx', 'Logan Coleman', 29, 'West Palm Beach', '33405', 'Kayaking', 'N/A', 'West Palm Beach native. Love Kayaking, dabble in Trading Card Games. Let''s connect!', 4.8, 69, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('david.nelson90@outlook.com', 'password123', 'ClutchDavid9', 'David Nelson', 46, 'Boynton Beach', '33437', 'Sports Games', 'PC & Console', 'Boynton Beach native. Love Sports Games, dabble in RPG. Let''s connect!', 4.3, 24, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('devon.campbell408@icloud.com', 'password123', 'xXDeXLXx', 'Devon Campbell', 37, 'Boca Raton', '33433', 'Deck Building', 'N/A', 'Always down for Deck Building sessions. Boca Raton-based. Message me anytime!', 4.9, 54, '["Early Bird", "Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.castillo187@yahoo.com', 'password123', 'xXGaDruidXx', 'Gavin Castillo', 55, 'Palm Springs', '33461', 'Indie Games', 'Nintendo Switch', 'South FL local. Indie Games enthusiast and weekend warrior. Palm Springs represent!', 4.6, 12, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diana.harris282@yahoo.com', 'password123', 'CobaltDiana69', 'Diana Harris', 53, 'Lake Worth Beach', '33460', 'Fitness / General Workout', 'PC', 'South FL local. Fitness / General Workout enthusiast and weekend warrior. Lake Worth Beach represent!', 4.8, 39, '["PBC Veteran", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('justin.patel633@gmail.com', 'password123', 'xXJu813Xx', 'Justin Patel', 44, 'Juno Beach', '33408', 'Martial Arts', 'N/A', 'New to the scene! Trying to find people who love Martial Arts in Juno Beach area.', 4.2, 64, '["Early Bird", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexis.garcia321@outlook.com', 'password123', 'UltraAlexis17', 'Alexis Garcia', 27, 'Greenacres', '33467', 'RPG', 'Steam Deck', 'Passionate about RPG. Based in Greenacres, FL. Hit me up for games or meetups.', 5.0, 21, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chase.jackson255@yahoo.com', 'password123', 'HackedChase74', 'Chase Jackson', 44, 'Riviera Beach', '33404', 'Beach Volleyball', 'N/A', 'New to the scene! Trying to find people who love Beach Volleyball in Riviera Beach area.', 2.8, 41, '["Friendly Host", "Tabletop King"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('liam.gomez50@gmail.com', 'password123', 'GoldenLiam77', 'Liam Gomez', 40, 'Singer Island', '33404', 'MMORPG', 'PC & Console', 'Local Singer Island player. Into MMORPG and Racing Games. Always looking for chill groups!', 4.7, 82, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sofia.bennett200@outlook.com', 'password123', 'BlazeSofia50', 'Sofia Bennett', 53, 'Juno Beach', '33408', 'Kayaking', 'N/A', 'Always down for Kayaking sessions. Juno Beach-based. Message me anytime!', 4.8, 84, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('owen.robinson204@hotmail.com', 'password123', 'xXOwDruidXx', 'Owen Robinson', 27, 'Royal Palm Beach', '33414', 'Worker Placement', 'N/A', 'Royal Palm Beach native. Love Worker Placement, dabble in Deck Building. Let''s connect!', 4.3, 69, '["Tournament Ready", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('olivia.scott403@hotmail.com', 'password123', 'OnyxOlivia44', 'Olivia Scott', 28, 'Greenacres', '33463', 'Pickleball', 'N/A', 'South FL local. Pickleball enthusiast and weekend warrior. Greenacres represent!', 4.4, 62, '["Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brianna.sanchez991@hotmail.com', 'password123', 'BriannaSan16', 'Brianna Sanchez', 34, 'Loxahatchee', '33470', 'Fitness / General Workout', 'N/A', 'Passionate about Fitness / General Workout. Based in Loxahatchee, FL. Hit me up for games or meetups.', 4.8, 48, '["Pro Gamer", "Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jessica.anderson429@yahoo.com', 'password123', 'xXJe1337Xx', 'Jessica Anderson', 38, 'Tequesta', '33469', 'Worker Placement', 'PC & Console', 'Retired Worker Placement tryhard, now just vibing. Live in Tequesta, FL.', 4.5, 46, '["Tournament Ready", "Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nicole.edwards351@hotmail.com', 'password123', 'EpicNicole99', 'Nicole Edwards', 52, 'Palm Beach', '33480', 'Open World', 'Nintendo Switch', 'Casual Open World fan from Palm Beach. Also enjoy Simulation on weekends.', 4.9, 33, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ashley.johnson574@outlook.com', 'password123', 'StormAshley74', 'Ashley Johnson', 40, 'Loxahatchee', '33470', 'MOBA', 'Mobile', 'South FL local. MOBA enthusiast and weekend warrior. Loxahatchee represent!', 4.8, 18, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hannah.clark249@gmail.com', 'password123', 'HannahCla91', 'Hannah Clark', 33, 'Singer Island', '33404', 'Fitness / General Workout', 'N/A', 'Retired Fitness / General Workout tryhard, now just vibing. Live in Singer Island, FL.', 4.7, 70, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('angel.patterson329@outlook.com', 'password123', 'ModdedXL92', 'Angel Patterson', 36, 'Lake Worth Beach', '33460', 'Fighting Games', 'Mobile', 'South FL local. Fighting Games enthusiast and weekend warrior. Lake Worth Beach represent!', 4.8, 78, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cynthia.sanders292@icloud.com', 'password123', 'xXCy813Xx', 'Cynthia Sanders', 39, 'Delray Beach', '33444', 'Fighting Games', 'Mobile', 'Local Delray Beach player. Into Fighting Games and Sandbox Games. Always looking for chill groups!', 4.7, 56, '["Tabletop King", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('owen.mensah691@yahoo.com', 'password123', 'OwenMen88', 'Owen Mensah', 54, 'Palm Beach Gardens', '33410', 'Dungeons & Dragons', 'PC', 'Casual Dungeons & Dragons fan from Palm Beach Gardens. Also enjoy Indie Games on weekends.', 4.7, 42, '["Friendly Host", "PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('zoe.young310@hotmail.com', 'password123', 'Titan69369', 'Zoe Young', 39, 'Jupiter', '33477', 'Souls-like Games', 'Nintendo Switch', 'New to the scene! Trying to find people who love Souls-like Games in Jupiter area.', 4.9, 13, '["Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ivan.nguyen719@hotmail.com', 'password123', 'xXIv100Xx', 'Ivan Nguyen', 44, 'Royal Palm Beach', '33414', 'Martial Arts', 'PlayStation', 'Casual Martial Arts fan from Royal Palm Beach. Also enjoy Flag Football on weekends.', 5.0, 53, '["Early Bird", "Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dakota.richardson336@hotmail.com', 'password123', 'xXDaGamerXx', 'Dakota Richardson', 28, 'Boynton Beach', '33435', 'Basketball', 'N/A', 'Retired Basketball tryhard, now just vibing. Live in Boynton Beach, FL.', 4.6, 81, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.rodriguez474@outlook.com', 'password123', 'UltraGod837', 'Alejandro Rodriguez', 53, 'Boca Raton', '33431', 'Trading Card Games', 'N/A', 'Passionate about Trading Card Games. Based in Boca Raton, FL. Hit me up for games or meetups.', 4.8, 37, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amanda.barnes185@yahoo.com', 'password123', 'xXAmCaptainXx', 'Amanda Barnes', 44, 'Palm Beach Gardens', '33410', 'Bird Watching', 'Nintendo Switch', 'South FL local. Bird Watching enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.8, 57, '["Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexis.turner545@icloud.com', 'password123', 'AlexisTur41', 'Alexis Turner', 45, 'North Palm Beach', '33408', 'Basketball', 'N/A', 'Local North Palm Beach player. Into Basketball and Fitness / General Workout. Always looking for chill groups!', 4.9, 49, '["Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('liam.garcia609@gmail.com', 'password123', 'xXLiBarbarianXx', 'Liam Garcia', 24, 'Boca Raton', '33433', 'MMORPG', 'PC & Console', 'Always down for MMORPG sessions. Boca Raton-based. Message me anytime!', 2.8, 44, '["Early Bird"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('leo.james227@icloud.com', 'password123', 'ViperLeo8', 'Leo James', 51, 'Boynton Beach', '33435', 'Eurogames', 'N/A', 'Retired Eurogames tryhard, now just vibing. Live in Boynton Beach, FL.', 4.2, 30, '["Early Bird", "Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tanner.cruz189@hotmail.com', 'password123', 'xXTaProXx', 'Tanner Cruz', 42, 'Palm Beach Gardens', '33418', 'Souls-like Games', 'PlayStation', 'Passionate about Souls-like Games. Based in Palm Beach Gardens, FL. Hit me up for games or meetups.', 5.0, 58, '["PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.williams275@icloud.com', 'password123', 'BrokenSlayer193', 'Christian Williams', 21, 'Lake Worth Beach', '33460', 'Simulation', 'Nintendo Switch', 'Passionate about Simulation. Based in Lake Worth Beach, FL. Hit me up for games or meetups.', 4.2, 17, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('anthony.hall938@yahoo.com', 'password123', 'ChillAnthony37', 'Anthony Hall', 43, 'Lake Worth Beach', '33461', 'Worker Placement', 'N/A', 'Casual Worker Placement fan from Lake Worth Beach. Also enjoy Deck Building on weekends.', 4.5, 9, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('robert.johnson577@yahoo.com', 'password123', 'RobertJoh12', 'Robert Johnson', 20, 'Lantana', '33462', 'Warhammer', 'N/A', 'New to the scene! Trying to find people who love Warhammer in Lantana area.', 4.8, 50, '["Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('claudia.thomas782@icloud.com', 'password123', 'xXClAxeXx', 'Claudia Thomas', 34, 'Greenacres', '33467', 'Biking / Cycling', 'N/A', 'Local Greenacres player. Into Biking / Cycling and Disc Golf. Always looking for chill groups!', 4.7, 80, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('derek.vasquez423@yahoo.com', 'password123', 'DerekVas18', 'Derek Vasquez', 18, 'Boca Raton', '33431', 'Miniature Games', 'All Platforms', 'South FL local. Miniature Games enthusiast and weekend warrior. Boca Raton represent!', 5.0, 6, '["PBC Veteran", "Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.hughes833@icloud.com', 'password123', 'ChristianHug23', 'Christian Hughes', 50, 'West Palm Beach', '33405', 'Swimming', 'N/A', 'Retired Swimming tryhard, now just vibing. Live in West Palm Beach, FL.', 4.3, 65, '["Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexandra.rodriguez308@gmail.com', 'password123', 'CyberSniper389', 'Alexandra Rodriguez', 32, 'Wellington', '33449', 'Fighting Games', 'All Platforms', 'Passionate about Fighting Games. Based in Wellington, FL. Hit me up for games or meetups.', 4.4, 8, '["Early Bird", "PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassandra.bell923@hotmail.com', 'password123', 'xXCaLegendXx', 'Cassandra Bell', 31, 'Wellington', '33414', 'Pickleball', 'Nintendo Switch', 'Always down for Pickleball sessions. Wellington-based. Message me anytime!', 4.4, 60, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sara.young513@outlook.com', 'password123', 'InfernoBlade238', 'Sara Young', 23, 'Delray Beach', '33446', 'Pickleball', 'N/A', 'Always down for Pickleball sessions. Delray Beach-based. Message me anytime!', 4.5, 75, '["PBC Veteran", "Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cody.lopez697@hotmail.com', 'password123', 'xXCoStrikerXx', 'Cody Lopez', 29, 'Manalapan', '33462', 'Adventure Games', 'All Platforms', 'Passionate about Adventure Games. Based in Manalapan, FL. Hit me up for games or meetups.', 4.7, 44, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dylan.adams369@outlook.com', 'password123', 'FrostStriker192', 'Dylan Adams', 46, 'Palm Beach Gardens', '33418', 'Tabletop RPG', 'PC & Console', 'South FL local. Tabletop RPG enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.7, 52, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('taylor.martin927@yahoo.com', 'password123', 'TaylorMar97', 'Taylor Martin', 53, 'Boca Raton', '33496', 'Dungeons & Dragons', 'N/A', 'South FL local. Dungeons & Dragons enthusiast and weekend warrior. Boca Raton represent!', 4.3, 62, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tiffany.james370@outlook.com', 'password123', 'TiffanyJam90', 'Tiffany James', 22, 'Loxahatchee', '33470', 'Simulation', 'PC', 'Retired Simulation tryhard, now just vibing. Live in Loxahatchee, FL.', 4.2, 24, '["PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('omar.murphy836@hotmail.com', 'password123', 'OmarMur48', 'Omar Murphy', 45, 'Greenacres', '33467', 'Simulation', 'All Platforms', 'Always down for Simulation sessions. Greenacres-based. Message me anytime!', 4.5, 23, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('eva.rodriguez559@yahoo.com', 'password123', 'GrindAxe966', 'Eva Rodriguez', 55, 'Lake Worth Beach', '33460', 'Simulation', 'All Platforms', 'New to the scene! Trying to find people who love Simulation in Lake Worth Beach area.', 4.4, 74, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('danny.miller946@icloud.com', 'password123', 'LazyCaptain719', 'Danny Miller', 50, 'North Palm Beach', '33408', 'Horror Games', 'All Platforms', 'Passionate about Horror Games. Based in North Palm Beach, FL. Hit me up for games or meetups.', 4.7, 34, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('axel.carter523@hotmail.com', 'password123', 'AxelCar67', 'Axel Carter', 32, 'Jupiter', '33458', 'Pickleball', 'All Platforms', 'Jupiter native. Love Pickleball, dabble in Soccer. Let''s connect!', 4.5, 8, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('pedro.jenkins804@yahoo.com', 'password123', 'xXPeChiefXx', 'Pedro Jenkins', 47, 'Greenacres', '33467', 'Magic: The Gathering', 'N/A', 'Always down for Magic: The Gathering sessions. Greenacres-based. Message me anytime!', 4.3, 53, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('emma.turner529@yahoo.com', 'password123', 'EmmaTur52', 'Emma Turner', 33, 'Boynton Beach', '33436', 'Dungeons & Dragons', 'N/A', 'Retired Dungeons & Dragons tryhard, now just vibing. Live in Boynton Beach, FL.', 4.9, 34, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('serena.baker607@icloud.com', 'password123', 'xXSeKnightXx', 'Serena Baker', 46, 'Lake Worth Beach', '33460', 'Fighting Games', 'PlayStation', 'New to the scene! Trying to find people who love Fighting Games in Lake Worth Beach area.', 4.2, 25, '["Tournament Ready", "Friendly Host", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassandra.sullivan626@icloud.com', 'password123', 'StealthChief866', 'Cassandra Sullivan', 42, 'Greenacres', '33463', 'Running / Jogging', 'PC & Console', 'Retired Running / Jogging tryhard, now just vibing. Live in Greenacres, FL.', 4.9, 38, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tiffany.sanchez393@icloud.com', 'password123', 'TiffanySan72', 'Tiffany Sanchez', 54, 'Delray Beach', '33446', 'Dungeons & Dragons', 'N/A', 'Local Delray Beach player. Into Dungeons & Dragons and Martial Arts. Always looking for chill groups!', 4.5, 23, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ariana.cooper987@hotmail.com', 'password123', 'xXArShotgunXx', 'Ariana Cooper', 42, 'Lake Worth Beach', '33460', 'Simulation', 'Nintendo Switch', 'Lake Worth Beach native. Love Simulation, dabble in Swimming. Let''s connect!', 4.3, 56, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexandra.rodriguez524@gmail.com', 'password123', 'ViperXL557', 'Alexandra Rodriguez', 53, 'Belle Glade', '33430', 'Tabletop RPG', 'Steam Deck', 'Passionate about Tabletop RPG. Based in Belle Glade, FL. Hit me up for games or meetups.', 4.7, 33, '["Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('wesley.collins831@hotmail.com', 'password123', 'BrokenWesley91', 'Wesley Collins', 31, 'Wellington', '33449', 'Strategy Games', 'PC', 'South FL local. Strategy Games enthusiast and weekend warrior. Wellington represent!', 4.7, 21, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('demi.richardson721@outlook.com', 'password123', 'RubyDemi35', 'Demi Richardson', 38, 'Boynton Beach', '33436', 'Magic: The Gathering', 'N/A', 'Boynton Beach native. Love Magic: The Gathering, dabble in Fitness / General Workout. Let''s connect!', 4.8, 44, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('logan.cox780@icloud.com', 'password123', 'xXLoMasterXx', 'Logan Cox', 33, 'Greenacres', '33463', 'Miniature Games', 'N/A', 'South FL local. Miniature Games enthusiast and weekend warrior. Greenacres represent!', 4.4, 46, '["Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('robert.nguyen596@gmail.com', 'password123', 'GrindAxe651', 'Robert Nguyen', 38, 'Belle Glade', '33430', 'Magic: The Gathering', 'Xbox', 'Always down for Magic: The Gathering sessions. Belle Glade-based. Message me anytime!', 4.7, 39, '["PBC Veteran", "Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chase.bell17@gmail.com', 'password123', 'ChaseBel66', 'Chase Bell', 47, 'Delray Beach', '33444', 'Hiking', 'N/A', 'South FL local. Hiking enthusiast and weekend warrior. Delray Beach represent!', 4.3, 22, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dylan.thomas85@outlook.com', 'password123', 'DylanTho16', 'Dylan Thomas', 34, 'Royal Palm Beach', '33414', 'MOBA', 'PlayStation', 'Casual MOBA fan from Royal Palm Beach. Also enjoy RPG on weekends.', 4.2, 68, '["Early Bird", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brian.walker9@outlook.com', 'password123', 'BrokenBlade711', 'Brian Walker', 18, 'Tequesta', '33469', 'RPG', 'PC & Console', 'Retired RPG tryhard, now just vibing. Live in Tequesta, FL.', 4.3, 72, '["PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('grace.taylor544@hotmail.com', 'password123', 'Cobalt69169', 'Grace Taylor', 22, 'Boynton Beach', '33435', 'Sandbox Games', 'PlayStation', 'Retired Sandbox Games tryhard, now just vibing. Live in Boynton Beach, FL.', 4.9, 49, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('pedro.morgan254@outlook.com', 'password123', 'OmegaCleric616', 'Pedro Morgan', 26, 'Greenacres', '33463', 'Beach Volleyball', 'Mobile', 'Casual Beach Volleyball fan from Greenacres. Also enjoy Golf on weekends.', 4.5, 33, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('austin.martin512@hotmail.com', 'password123', 'Azure81313', 'Austin Martin', 33, 'Delray Beach', '33445', 'Disc Golf', 'N/A', 'Local Delray Beach player. Into Disc Golf and Fitness / General Workout. Always looking for chill groups!', 4.8, 45, '["Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('darryl.brown221@gmail.com', 'password123', 'LazySniper519', 'Darryl Brown', 34, 'West Palm Beach', '33401', 'Miniature Games', 'N/A', 'South FL local. Miniature Games enthusiast and weekend warrior. West Palm Beach represent!', 4.5, 48, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diana.ramirez550@outlook.com', 'password123', 'xXDiMonkXx', 'Diana Ramirez', 27, 'Lake Worth Beach', '33461', 'MOBA', 'PC', 'Lake Worth Beach native. Love MOBA, dabble in CrossFit. Let''s connect!', 5.0, 42, '["Early Bird", "Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('finn.allen168@icloud.com', 'password123', 'AzureFinn67', 'Finn Allen', 18, 'Delray Beach', '33446', 'War Games', 'N/A', 'Retired War Games tryhard, now just vibing. Live in Delray Beach, FL.', 4.8, 40, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maria.reyes730@hotmail.com', 'password123', 'GoldenAxe524', 'Maria Reyes', 34, 'Boca Raton', '33433', 'RPG', 'PC', 'New to the scene! Trying to find people who love RPG in Boca Raton area.', 4.9, 26, '["Tournament Ready", "Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('riley.martin954@gmail.com', 'password123', 'xXRiAceXx', 'Riley Martin', 29, 'Boynton Beach', '33435', 'Tabletop RPG', 'Steam Deck', 'Always down for Tabletop RPG sessions. Boynton Beach-based. Message me anytime!', 4.5, 57, '["Tabletop King", "Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dominic.roberts378@yahoo.com', 'password123', 'RubyDominic39', 'Dominic Roberts', 18, 'Palm Beach', '33480', 'Dungeons & Dragons', 'PC', 'Always down for Dungeons & Dragons sessions. Palm Beach-based. Message me anytime!', 4.3, 82, '["Early Bird", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('axel.kelly870@outlook.com', 'password123', 'EchoPaladin244', 'Axel Kelly', 42, 'West Palm Beach', '33401', 'Sports Games', 'PlayStation', 'Retired Sports Games tryhard, now just vibing. Live in West Palm Beach, FL.', 5.0, 64, '["Early Bird", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('derek.russell446@yahoo.com', 'password123', 'DerekRus47', 'Derek Russell', 21, 'Juno Beach', '33408', 'Martial Arts', 'N/A', 'Passionate about Martial Arts. Based in Juno Beach, FL. Hit me up for games or meetups.', 4.3, 17, '["Friendly Host", "Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ivan.clark478@outlook.com', 'password123', 'xXIvGamerXx', 'Ivan Clark', 46, 'Boynton Beach', '33436', 'Tabletop RPG', 'N/A', 'Local Boynton Beach player. Into Tabletop RPG and Fitness / General Workout. Always looking for chill groups!', 4.2, 21, '["PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kevin.castillo94@yahoo.com', 'password123', 'UltraKevin66', 'Kevin Castillo', 27, 'Greenacres', '33463', 'Adventure Games', 'Steam Deck', 'Casual Adventure Games fan from Greenacres. Also enjoy Fitness / General Workout on weekends.', 4.8, 58, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elena.ortiz125@gmail.com', 'password123', 'BlessedXL228', 'Elena Ortiz', 26, 'Delray Beach', '33444', 'Stand-Up Paddleboarding', 'Nintendo Switch', 'Delray Beach native. Love Stand-Up Paddleboarding, dabble in Swimming. Let''s connect!', 4.9, 42, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dylan.ruiz44@icloud.com', 'password123', 'Ghost239588', 'Dylan Ruiz', 25, 'Greenacres', '33467', 'Biking / Cycling', 'N/A', 'South FL local. Biking / Cycling enthusiast and weekend warrior. Greenacres represent!', 4.4, 36, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.nelson629@hotmail.com', 'password123', 'MatthewNel92', 'Matthew Nelson', 20, 'Boynton Beach', '33435', 'Party Games', 'PC', 'Always down for Party Games sessions. Boynton Beach-based. Message me anytime!', 4.4, 27, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('anthony.rivera935@hotmail.com', 'password123', 'HyperAnthony35', 'Anthony Rivera', 40, 'Belle Glade', '33430', 'Card Games / TCG', 'Nintendo Switch', 'Casual Card Games / TCG fan from Belle Glade. Also enjoy War Games on weekends.', 4.7, 52, '["PBC Veteran", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('liam.hill783@yahoo.com', 'password123', 'xXLiChiefXx', 'Liam Hill', 21, 'North Palm Beach', '33408', 'Pickleball', 'N/A', 'South FL local. Pickleball enthusiast and weekend warrior. North Palm Beach represent!', 4.2, 8, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jasmine.perez58@yahoo.com', 'password123', 'JasminePer12', 'Jasmine Perez', 23, 'West Palm Beach', '33409', 'Beach Activities', 'PC', 'West Palm Beach native. Love Beach Activities, dabble in Fighting Games. Let''s connect!', 4.6, 53, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ethan.ruiz984@gmail.com', 'password123', 'ClutchEthan85', 'Ethan Ruiz', 41, 'Lake Park', '33403', 'Trading Card Games', 'Xbox', 'Always down for Trading Card Games sessions. Lake Park-based. Message me anytime!', 4.9, 32, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lara.torres388@outlook.com', 'password123', 'FrostLara23', 'Lara Torres', 29, 'Singer Island', '33404', 'Kayaking', 'PlayStation', 'Always down for Kayaking sessions. Singer Island-based. Message me anytime!', 4.9, 19, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('derek.griffin172@gmail.com', 'password123', 'AlphaDerek2', 'Derek Griffin', 38, 'Royal Palm Beach', '33411', 'Trading Card Games', 'N/A', 'Retired Trading Card Games tryhard, now just vibing. Live in Royal Palm Beach, FL.', 5.0, 83, '["Early Bird", "Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jake.mitchell360@hotmail.com', 'password123', 'xXJaRunnerXx', 'Jake Mitchell', 42, 'Belle Glade', '33430', 'Simulation', 'PC', 'Passionate about Simulation. Based in Belle Glade, FL. Hit me up for games or meetups.', 4.4, 25, '["Tournament Ready", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('david.kim165@gmail.com', 'password123', 'PhantomBarbarian629', 'David Kim', 42, 'Boynton Beach', '33436', 'RPG', 'Mobile', 'South FL local. RPG enthusiast and weekend warrior. Boynton Beach represent!', 4.2, 64, '["Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('leo.carter586@hotmail.com', 'password123', 'xXLeMasterXx', 'Leo Carter', 43, 'Boca Raton', '33431', 'Tabletop RPG', 'N/A', 'South FL local. Tabletop RPG enthusiast and weekend warrior. Boca Raton represent!', 4.6, 83, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diana.parker804@icloud.com', 'password123', 'xXDiWitchXx', 'Diana Parker', 37, 'Delray Beach', '33445', 'Dungeons & Dragons', 'N/A', 'South FL local. Dungeons & Dragons enthusiast and weekend warrior. Delray Beach represent!', 4.9, 85, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lara.reyes64@yahoo.com', 'password123', 'Cyber420353', 'Lara Reyes', 54, 'Jupiter', '33477', 'Souls-like Games', 'Steam Deck', 'New to the scene! Trying to find people who love Souls-like Games in Jupiter area.', 4.9, 40, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('mia.butler515@hotmail.com', 'password123', 'MiaBut25', 'Mia Butler', 20, 'Riviera Beach', '33407', 'MOBA', 'Mobile', 'Passionate about MOBA. Based in Riviera Beach, FL. Hit me up for games or meetups.', 4.4, 19, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dominic.martin566@outlook.com', 'password123', 'AzureDominic59', 'Dominic Martin', 43, 'Palm Springs', '33461', 'Dungeons & Dragons', 'PlayStation', 'South FL local. Dungeons & Dragons enthusiast and weekend warrior. Palm Springs represent!', 5.0, 8, '["PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.king393@icloud.com', 'password123', 'xXChRangerXx', 'Christian King', 34, 'Lantana', '33462', 'Triathlon', 'N/A', 'Casual Triathlon fan from Lantana. Also enjoy Yoga on weekends.', 5.0, 10, '["Friendly Host", "Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chase.wright919@outlook.com', 'password123', 'Phantom305813', 'Chase Wright', 35, 'Loxahatchee', '33470', 'Beach Volleyball', 'PlayStation', 'Casual Beach Volleyball fan from Loxahatchee. Also enjoy Sandbox Games on weekends.', 4.3, 33, '["Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tanner.wood889@outlook.com', 'password123', 'SilverPBC163', 'Tanner Wood', 51, 'Belle Glade', '33430', 'Golf', 'Nintendo Switch', 'Local Belle Glade player. Into Golf and Battle Royale. Always looking for chill groups!', 4.4, 33, '["PBC Veteran", "Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ricky.watson378@icloud.com', 'password123', 'xXRi404Xx', 'Ricky Watson', 35, 'Lake Worth Beach', '33460', 'Dungeons & Dragons', 'N/A', 'Always down for Dungeons & Dragons sessions. Lake Worth Beach-based. Message me anytime!', 4.9, 27, '["PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('patrick.davis292@gmail.com', 'password123', 'xXPaHunterXx', 'Patrick Davis', 23, 'Jupiter', '33458', 'Hiking', 'Xbox', 'Casual Hiking fan from Jupiter. Also enjoy Rock Climbing on weekends.', 4.6, 84, '["Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lucas.sanders434@icloud.com', 'password123', 'BetaLucas33', 'Lucas Sanders', 35, 'Palm Beach Gardens', '33418', 'CrossFit', 'N/A', 'South FL local. CrossFit enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.8, 61, '["Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('mia.walker66@outlook.com', 'password123', 'RapidMia42', 'Mia Walker', 48, 'Delray Beach', '33444', 'Basketball', 'N/A', 'Always down for Basketball sessions. Delray Beach-based. Message me anytime!', 4.5, 29, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hannah.williams303@outlook.com', 'password123', 'xXHaSniperXx', 'Hannah Williams', 49, 'West Palm Beach', '33405', 'Softball', 'Steam Deck', 'South FL local. Softball enthusiast and weekend warrior. West Palm Beach represent!', 4.7, 13, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('james.reyes301@gmail.com', 'password123', 'xXJaPlayerXx', 'James Reyes', 29, 'Palm Springs', '33461', 'Warhammer', 'Mobile', 'New to the scene! Trying to find people who love Warhammer in Palm Springs area.', 4.4, 36, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chris.sullivan967@hotmail.com', 'password123', 'Crimson813200', 'Chris Sullivan', 55, 'Singer Island', '33404', 'Dungeons & Dragons', 'All Platforms', 'Singer Island native. Love Dungeons & Dragons, dabble in Indie Games. Let''s connect!', 4.7, 26, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nicole.white500@outlook.com', 'password123', 'NicoleWhi50', 'Nicole White', 23, 'Boynton Beach', '33437', 'Fighting Games', 'Xbox', 'Retired Fighting Games tryhard, now just vibing. Live in Boynton Beach, FL.', 4.4, 46, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sophia.morgan5@gmail.com', 'password123', 'SophiaMor57', 'Sophia Morgan', 42, 'Loxahatchee', '33470', 'Hiking', 'N/A', 'Casual Hiking fan from Loxahatchee. Also enjoy Fitness / General Workout on weekends.', 4.7, 24, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('patrick.jenkins393@hotmail.com', 'password123', 'GhostPatrick9', 'Patrick Jenkins', 24, 'Delray Beach', '33446', 'Fitness / General Workout', 'N/A', 'Delray Beach native. Love Fitness / General Workout, dabble in Running / Jogging. Let''s connect!', 3.0, 82, '["Pro Gamer"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sophia.anderson745@yahoo.com', 'password123', 'SophiaAnd12', 'Sophia Anderson', 32, 'Wellington', '33414', 'Basketball', 'N/A', 'Local Wellington player. Into Basketball and Yoga. Always looking for chill groups!', 4.4, 32, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('demi.bennett50@gmail.com', 'password123', 'xXDeLanceXx', 'Demi Bennett', 19, 'Delray Beach', '33444', 'Golf', 'N/A', 'Local Delray Beach player. Into Golf and Fitness / General Workout. Always looking for chill groups!', 4.9, 66, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.moore277@hotmail.com', 'password123', 'MorganMoo63', 'Morgan Moore', 51, 'Delray Beach', '33444', 'Card Games / TCG', 'Nintendo Switch', 'South FL local. Card Games / TCG enthusiast and weekend warrior. Delray Beach represent!', 4.4, 56, '["PBC Veteran", "Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brittany.foster303@yahoo.com', 'password123', 'JadeWitch933', 'Brittany Foster', 44, 'Royal Palm Beach', '33411', 'MOBA', 'PlayStation', 'Passionate about MOBA. Based in Royal Palm Beach, FL. Hit me up for games or meetups.', 4.9, 29, '["PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('luis.taylor304@outlook.com', 'password123', 'xXLuHunterXx', 'Luis Taylor', 47, 'Wellington', '33414', 'Tabletop RPG', 'PC & Console', 'South FL local. Tabletop RPG enthusiast and weekend warrior. Wellington represent!', 4.3, 85, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dylan.long117@icloud.com', 'password123', 'xXDyAxeXx', 'Dylan Long', 29, 'Greenacres', '33467', 'Running / Jogging', 'All Platforms', 'New to the scene! Trying to find people who love Running / Jogging in Greenacres area.', 4.9, 78, '["Tabletop King", "Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jayden.scott627@gmail.com', 'password123', 'JaydenSco71', 'Jayden Scott', 40, 'Riviera Beach', '33404', 'Indie Games', 'PC & Console', 'Passionate about Indie Games. Based in Riviera Beach, FL. Hit me up for games or meetups.', 4.8, 6, '["Early Bird", "Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('victor.thompson355@icloud.com', 'password123', 'VictorTho81', 'Victor Thompson', 48, 'Wellington', '33449', 'Fighting Games', 'PC & Console', 'Casual Fighting Games fan from Wellington. Also enjoy MOBA on weekends.', 4.3, 57, '["PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('claudia.taylor837@yahoo.com', 'password123', 'BetaLance821', 'Claudia Taylor', 43, 'Riviera Beach', '33404', 'Trading Card Games', 'PC', 'South FL local. Trading Card Games enthusiast and weekend warrior. Riviera Beach represent!', 4.4, 31, '["PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bianca.robinson974@outlook.com', 'password123', 'LuckyBianca7', 'Bianca Robinson', 47, 'Lake Worth Beach', '33461', 'Fitness / General Workout', 'N/A', 'Local Lake Worth Beach player. Into Fitness / General Workout and Bird Watching. Always looking for chill groups!', 5.0, 76, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('paige.lee535@outlook.com', 'password123', 'Pixel407169', 'Paige Lee', 53, 'Palm Beach Gardens', '33410', 'Golf', 'N/A', 'Casual Golf fan from Palm Beach Gardens. Also enjoy Fitness / General Workout on weekends.', 4.9, 63, '["Tabletop King", "Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexandra.morales111@icloud.com', 'password123', 'Hacked404858', 'Alexandra Morales', 39, 'Lake Worth Beach', '33460', 'Pickleball', 'Steam Deck', 'Lake Worth Beach native. Love Pickleball, dabble in Flag Football. Let''s connect!', 4.7, 61, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.clark517@icloud.com', 'password123', 'xXGaBarbarianXx', 'Gavin Clark', 38, 'Riviera Beach', '33404', 'Party Games', 'Nintendo Switch', 'South FL local. Party Games enthusiast and weekend warrior. Riviera Beach represent!', 4.4, 83, '["Tabletop King", "Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('patrick.turner516@hotmail.com', 'password123', 'ClutchPatrick15', 'Patrick Turner', 29, 'Delray Beach', '33446', 'Softball', 'N/A', 'Local Delray Beach player. Into Softball and Disc Golf. Always looking for chill groups!', 5.0, 44, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('santiago.cox205@outlook.com', 'password123', 'SantiagoCox46', 'Santiago Cox', 21, 'Boca Raton', '33431', 'Eurogames', 'Nintendo Switch', 'Retired Eurogames tryhard, now just vibing. Live in Boca Raton, FL.', 4.5, 14, '["PBC Veteran", "Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('leo.ramirez949@icloud.com', 'password123', 'xXLeShotgunXx', 'Leo Ramirez', 21, 'Palm Beach Gardens', '33410', 'Cooperative Board Games', 'N/A', 'Always down for Cooperative Board Games sessions. Palm Beach Gardens-based. Message me anytime!', 4.6, 75, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('darryl.rivera302@icloud.com', 'password123', 'DarrylRiv97', 'Darryl Rivera', 30, 'Lake Worth Beach', '33460', 'Platformers', 'Xbox', 'South FL local. Platformers enthusiast and weekend warrior. Lake Worth Beach represent!', 4.5, 24, '["Early Bird", "Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amara.kelly41@yahoo.com', 'password123', 'IvoryAmara7', 'Amara Kelly', 27, 'Palm Beach', '33480', 'Triathlon', 'N/A', 'Passionate about Triathlon. Based in Palm Beach, FL. Hit me up for games or meetups.', 4.3, 82, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ben.davis550@icloud.com', 'password123', 'StealthAce905', 'Ben Davis', 52, 'Lantana', '33462', 'Worker Placement', 'Steam Deck', 'Casual Worker Placement fan from Lantana. Also enjoy Puzzle Games on weekends.', 4.2, 85, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('carlos.walker938@gmail.com', 'password123', 'xXCaGodXx', 'Carlos Walker', 42, 'Greenacres', '33463', 'Magic: The Gathering', 'Xbox', 'Local Greenacres player. Into Magic: The Gathering and Golf. Always looking for chill groups!', 4.6, 79, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('damian.garcia856@gmail.com', 'password123', 'DamianGar78', 'Damian Garcia', 45, 'Lake Worth Beach', '33461', 'Indie Games', 'PC', 'Passionate about Indie Games. Based in Lake Worth Beach, FL. Hit me up for games or meetups.', 5.0, 76, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dallas.morales418@icloud.com', 'password123', 'xXDa404Xx', 'Dallas Morales', 34, 'Wellington', '33414', 'Disc Golf', 'N/A', 'Passionate about Disc Golf. Based in Wellington, FL. Hit me up for games or meetups.', 2.9, 44, '["Tabletop King"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('danny.bell951@hotmail.com', 'password123', 'WolfPBC703', 'Danny Bell', 40, 'Boca Raton', '33433', 'Party Games', 'N/A', 'New to the scene! Trying to find people who love Party Games in Boca Raton area.', 4.6, 25, '["Early Bird", "Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jack.richardson765@icloud.com', 'password123', 'RapidJack19', 'Jack Richardson', 26, 'Wellington', '33414', 'First-Person Shooters', 'Nintendo Switch', 'Always down for First-Person Shooters sessions. Wellington-based. Message me anytime!', 4.4, 85, '["Early Bird", "Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kayla.mitchell165@yahoo.com', 'password123', 'KaylaMit88', 'Kayla Mitchell', 27, 'Pahokee', '33476', 'Disc Golf', 'N/A', 'Passionate about Disc Golf. Based in Pahokee, FL. Hit me up for games or meetups.', 4.6, 38, '["Pro Gamer", "PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('michael.torres101@yahoo.com', 'password123', 'xXMiBossXx', 'Michael Torres', 34, 'Boca Raton', '33433', 'Golf', 'N/A', 'New to the scene! Trying to find people who love Golf in Boca Raton area.', 4.9, 11, '["Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('omar.scott157@hotmail.com', 'password123', 'CasualOmar41', 'Omar Scott', 55, 'Palm Beach Gardens', '33418', 'Horror Games', 'Steam Deck', 'South FL local. Horror Games enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.9, 32, '["Tabletop King", "Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ariana.roberts662@hotmail.com', 'password123', 'BlessedLegend880', 'Ariana Roberts', 29, 'Delray Beach', '33444', 'Softball', 'N/A', 'Local Delray Beach player. Into Softball and Fitness / General Workout. Always looking for chill groups!', 4.8, 57, '["Friendly Host", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dana.ross218@gmail.com', 'password123', 'EmeraldDana70', 'Dana Ross', 55, 'Riviera Beach', '33407', 'Sandbox Games', 'PC & Console', 'Casual Sandbox Games fan from Riviera Beach. Also enjoy Party Games on weekends.', 4.6, 62, '["Tournament Ready", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diamond.walker144@icloud.com', 'password123', 'DiamondWal32', 'Diamond Walker', 50, 'Boynton Beach', '33436', 'Warhammer', 'N/A', 'Casual Warhammer fan from Boynton Beach. Also enjoy Tennis on weekends.', 4.7, 74, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('carlos.torres930@outlook.com', 'password123', 'xXCaWizardXx', 'Carlos Torres', 51, 'Lake Worth Beach', '33461', 'Cooperative Board Games', 'PlayStation', 'Retired Cooperative Board Games tryhard, now just vibing. Live in Lake Worth Beach, FL.', 4.4, 29, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lara.reed837@outlook.com', 'password123', 'xXLaPBCXx', 'Lara Reed', 40, 'Riviera Beach', '33407', 'Sports Games', 'Mobile', 'Riviera Beach native. Love Sports Games, dabble in Worker Placement. Let''s connect!', 4.3, 34, '["Friendly Host", "PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jack.lewis425@outlook.com', 'password123', 'Crimson007491', 'Jack Lewis', 32, 'Delray Beach', '33445', 'Warhammer', 'N/A', 'Delray Beach native. Love Warhammer, dabble in Fitness / General Workout. Let''s connect!', 4.6, 38, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('grace.stewart913@hotmail.com', 'password123', 'GraceSte17', 'Grace Stewart', 20, 'Pahokee', '33476', 'Tabletop RPG', 'Steam Deck', 'Retired Tabletop RPG tryhard, now just vibing. Live in Pahokee, FL.', 4.6, 34, '["Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('denise.cox639@hotmail.com', 'password123', 'GhostDenise93', 'Denise Cox', 29, 'Singer Island', '33404', 'MMORPG', 'All Platforms', 'Passionate about MMORPG. Based in Singer Island, FL. Hit me up for games or meetups.', 4.3, 59, '["Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jason.parker516@gmail.com', 'password123', 'Crimson420134', 'Jason Parker', 52, 'West Palm Beach', '33409', 'Basketball', 'PlayStation', 'South FL local. Basketball enthusiast and weekend warrior. West Palm Beach represent!', 4.2, 33, '["PBC Veteran", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('anthony.patel291@hotmail.com', 'password123', 'xXAnGodXx', 'Anthony Patel', 23, 'Wellington', '33414', 'Strategy Games', 'Xbox', 'South FL local. Strategy Games enthusiast and weekend warrior. Wellington represent!', 5.0, 59, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('luna.vega579@outlook.com', 'password123', 'EpicLuna51', 'Luna Vega', 45, 'North Palm Beach', '33408', 'Worker Placement', 'PC & Console', 'North Palm Beach native. Love Worker Placement, dabble in Social Deduction Games. Let''s connect!', 4.2, 38, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('finn.wright802@yahoo.com', 'password123', 'EchoDruid411', 'Finn Wright', 46, 'Wellington', '33414', 'Yoga', 'Steam Deck', 'Passionate about Yoga. Based in Wellington, FL. Hit me up for games or meetups.', 4.4, 52, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('damian.hernandez82@hotmail.com', 'password123', 'GrindGeneral954', 'Damian Hernandez', 41, 'Wellington', '33414', 'Biking / Cycling', 'N/A', 'New to the scene! Trying to find people who love Biking / Cycling in Wellington area.', 4.8, 33, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('axel.foster200@gmail.com', 'password123', 'AxelFos88', 'Axel Foster', 36, 'Lake Park', '33403', 'Weightlifting', 'All Platforms', 'Casual Weightlifting fan from Lake Park. Also enjoy Adventure Games on weekends.', 4.7, 46, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brian.allen563@outlook.com', 'password123', 'StealthBrian36', 'Brian Allen', 23, 'Boca Raton', '33433', 'Dungeons & Dragons', 'Mobile', 'South FL local. Dungeons & Dragons enthusiast and weekend warrior. Boca Raton represent!', 4.8, 51, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.vasquez711@icloud.com', 'password123', 'xXChBardXx', 'Christian Vasquez', 34, 'Juno Beach', '33408', 'Tabletop RPG', 'All Platforms', 'Local Juno Beach player. Into Tabletop RPG and Magic: The Gathering. Always looking for chill groups!', 4.6, 71, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('madison.hall409@outlook.com', 'password123', 'Jade239183', 'Madison Hall', 23, 'Palm Beach Gardens', '33410', 'Biking / Cycling', 'N/A', 'New to the scene! Trying to find people who love Biking / Cycling in Palm Beach Gardens area.', 4.5, 52, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('joshua.griffin212@yahoo.com', 'password123', 'JoshuaGri41', 'Joshua Griffin', 34, 'Wellington', '33449', 'Card Games / TCG', 'PC & Console', 'New to the scene! Trying to find people who love Card Games / TCG in Wellington area.', 4.6, 73, '["Tabletop King", "PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dallas.howard783@hotmail.com', 'password123', 'UltraDallas29', 'Dallas Howard', 29, 'Belle Glade', '33430', 'Worker Placement', 'N/A', 'Passionate about Worker Placement. Based in Belle Glade, FL. Hit me up for games or meetups.', 4.3, 7, '["Pro Gamer", "PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brian.nguyen13@yahoo.com', 'password123', 'xXBrMonkXx', 'Brian Nguyen', 18, 'Greenacres', '33463', 'Warhammer', 'PC & Console', 'Retired Warhammer tryhard, now just vibing. Live in Greenacres, FL.', 4.3, 11, '["Friendly Host", "Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('justin.moore875@icloud.com', 'password123', 'AlphaJustin24', 'Justin Moore', 41, 'Royal Palm Beach', '33414', 'Open World', 'Nintendo Switch', 'Royal Palm Beach native. Love Open World, dabble in Puzzle Games. Let''s connect!', 4.3, 75, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('angel.delacroix432@icloud.com', 'password123', 'AngelDel90', 'Angel Delacroix', 29, 'West Palm Beach', '33401', 'Party Games', 'N/A', 'Casual Party Games fan from West Palm Beach. Also enjoy Triathlon on weekends.', 4.7, 79, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('luis.parker763@outlook.com', 'password123', 'TurboLuis47', 'Luis Parker', 46, 'Delray Beach', '33444', 'Puzzle Games', 'Xbox', 'Always down for Puzzle Games sessions. Delray Beach-based. Message me anytime!', 4.6, 26, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bianca.perez391@hotmail.com', 'password123', 'BetaBianca81', 'Bianca Perez', 23, 'Tequesta', '33469', 'Weightlifting', 'N/A', 'Always down for Weightlifting sessions. Tequesta-based. Message me anytime!', 4.5, 66, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('michael.watson278@icloud.com', 'password123', 'RankedMichael76', 'Michael Watson', 43, 'Jupiter', '33477', 'Sports Games', 'Mobile', 'Passionate about Sports Games. Based in Jupiter, FL. Hit me up for games or meetups.', 2.6, 54, '["PBC Veteran", "Tournament Ready", "Early Bird"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('justin.diaz98@gmail.com', 'password123', 'xXJuClericXx', 'Justin Diaz', 24, 'Riviera Beach', '33407', 'Competitive FPS', 'All Platforms', 'Casual Competitive FPS fan from Riviera Beach. Also enjoy MMORPG on weekends.', 4.9, 41, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maya.murphy540@yahoo.com', 'password123', 'Pixel420366', 'Maya Murphy', 26, 'Delray Beach', '33446', 'Triathlon', 'Mobile', 'Casual Triathlon fan from Delray Beach. Also enjoy Cooperative Board Games on weekends.', 4.6, 33, '["Tabletop King", "Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dominic.murphy423@outlook.com', 'password123', 'DominicMur48', 'Dominic Murphy', 41, 'Palm Beach Gardens', '33418', 'Open World', 'Mobile', 'Local Palm Beach Gardens player. Into Open World and First-Person Shooters. Always looking for chill groups!', 4.4, 78, '["Tournament Ready", "PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('claudia.long904@hotmail.com', 'password123', 'xXClSniperXx', 'Claudia Long', 44, 'Lake Worth Beach', '33460', 'Sports Games', 'Nintendo Switch', 'Lake Worth Beach native. Love Sports Games, dabble in Souls-like Games. Let''s connect!', 3.2, 46, '["Friendly Host", "Tournament Ready"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('michael.coleman279@hotmail.com', 'password123', 'xXMiQueenXx', 'Michael Coleman', 46, 'Palm Beach', '33480', 'Biking / Cycling', 'N/A', 'South FL local. Biking / Cycling enthusiast and weekend warrior. Palm Beach represent!', 4.9, 51, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.white239@gmail.com', 'password123', 'GavinWhi11', 'Gavin White', 18, 'Tequesta', '33469', 'Trading Card Games', 'N/A', 'Local Tequesta player. Into Trading Card Games and War Games. Always looking for chill groups!', 4.4, 71, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('marcus.kim557@icloud.com', 'password123', 'MarcusKim34', 'Marcus Kim', 22, 'Riviera Beach', '33407', 'Yoga', 'N/A', 'Local Riviera Beach player. Into Yoga and Fitness / General Workout. Always looking for chill groups!', 4.9, 75, '["Early Bird", "Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jose.nguyen682@yahoo.com', 'password123', 'xXJoGeneralXx', 'Jose Nguyen', 51, 'Delray Beach', '33444', 'Card Games / TCG', 'PC', 'Passionate about Card Games / TCG. Based in Delray Beach, FL. Hit me up for games or meetups.', 4.4, 75, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('leo.sullivan16@yahoo.com', 'password123', 'OnyxLeo16', 'Leo Sullivan', 38, 'Manalapan', '33462', 'Weightlifting', 'PC & Console', 'Local Manalapan player. Into Weightlifting and Tennis. Always looking for chill groups!', 4.6, 20, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('rebecca.taylor811@gmail.com', 'password123', 'RebeccaTay72', 'Rebecca Taylor', 52, 'Boynton Beach', '33435', 'Board Games', 'N/A', 'Local Boynton Beach player. Into Board Games and Yoga. Always looking for chill groups!', 4.5, 76, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ariana.watson302@hotmail.com', 'password123', 'xXArQueenXx', 'Ariana Watson', 53, 'Tequesta', '33469', 'Kayaking', 'N/A', 'New to the scene! Trying to find people who love Kayaking in Tequesta area.', 4.8, 36, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('miguel.vasquez376@icloud.com', 'password123', 'Chill404519', 'Miguel Vasquez', 52, 'Jupiter', '33458', 'Trading Card Games', 'Steam Deck', 'South FL local. Trading Card Games enthusiast and weekend warrior. Jupiter represent!', 4.8, 77, '["PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nora.mitchell99@hotmail.com', 'password123', 'Pixel561961', 'Nora Mitchell', 25, 'Greenacres', '33463', 'Tabletop RPG', 'N/A', 'Retired Tabletop RPG tryhard, now just vibing. Live in Greenacres, FL.', 4.8, 75, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ashley.reyes51@outlook.com', 'password123', 'AshleyRey87', 'Ashley Reyes', 34, 'Singer Island', '33404', 'Battle Royale', 'PC', 'Local Singer Island player. Into Battle Royale and Horror Games. Always looking for chill groups!', 4.5, 14, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('david.castillo968@yahoo.com', 'password123', 'Inferno777237', 'David Castillo', 22, 'Palm Beach Gardens', '33418', 'Stand-Up Paddleboarding', 'N/A', 'Retired Stand-Up Paddleboarding tryhard, now just vibing. Live in Palm Beach Gardens, FL.', 4.5, 14, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('emma.patel691@icloud.com', 'password123', 'xXEm813Xx', 'Emma Patel', 40, 'Juno Beach', '33408', 'Biking / Cycling', 'N/A', 'Always down for Biking / Cycling sessions. Juno Beach-based. Message me anytime!', 4.3, 53, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ryan.mitchell624@yahoo.com', 'password123', 'RyanMit58', 'Ryan Mitchell', 38, 'Manalapan', '33462', 'Magic: The Gathering', 'Nintendo Switch', 'Local Manalapan player. Into Magic: The Gathering and Pickleball. Always looking for chill groups!', 4.4, 66, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('mason.roberts585@hotmail.com', 'password123', 'MasonRob22', 'Mason Roberts', 53, 'Pahokee', '33476', 'Social Deduction Games', 'N/A', 'South FL local. Social Deduction Games enthusiast and weekend warrior. Pahokee represent!', 4.7, 18, '["Tabletop King", "Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('mia.campbell583@yahoo.com', 'password123', 'GrindVillain812', 'Mia Campbell', 43, 'Juno Beach', '33408', 'Softball', 'All Platforms', 'Casual Softball fan from Juno Beach. Also enjoy Adventure Games on weekends.', 4.2, 38, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dennis.allen313@hotmail.com', 'password123', 'RogueRogue579', 'Dennis Allen', 21, 'Riviera Beach', '33404', 'Adventure Games', 'All Platforms', 'Riviera Beach native. Love Adventure Games, dabble in Sandbox Games. Let''s connect!', 4.3, 7, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('genesis.kim586@gmail.com', 'password123', 'xXGeGodXx', 'Genesis Kim', 48, 'Boca Raton', '33496', 'Soccer', 'Nintendo Switch', 'Casual Soccer fan from Boca Raton. Also enjoy Strategy Games on weekends.', 4.5, 5, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lily.bryant332@hotmail.com', 'password123', 'Storm420424', 'Lily Bryant', 45, 'Jupiter', '33477', 'War Games', 'N/A', 'Always down for War Games sessions. Jupiter-based. Message me anytime!', 4.6, 75, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diamond.morales452@gmail.com', 'password123', 'DiamondMor35', 'Diamond Morales', 27, 'Tequesta', '33469', 'Competitive FPS', 'Xbox', 'Always down for Competitive FPS sessions. Tequesta-based. Message me anytime!', 4.3, 44, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ethan.jenkins24@outlook.com', 'password123', 'EthanJen78', 'Ethan Jenkins', 48, 'Tequesta', '33469', 'Trading Card Games', 'N/A', 'Local Tequesta player. Into Trading Card Games and Fitness / General Workout. Always looking for chill groups!', 4.9, 28, '["PBC Veteran", "Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('luis.diaz206@hotmail.com', 'password123', 'ShadowLuis60', 'Luis Diaz', 36, 'Boca Raton', '33431', 'Pickleball', 'N/A', 'Retired Pickleball tryhard, now just vibing. Live in Boca Raton, FL.', 4.3, 70, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bianca.watson497@hotmail.com', 'password123', 'NovaQueen513', 'Bianca Watson', 38, 'Delray Beach', '33444', 'Beach Activities', 'N/A', 'Delray Beach native. Love Beach Activities, dabble in Soccer. Let''s connect!', 4.4, 6, '["Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('blake.king641@outlook.com', 'password123', 'BlakeKin74', 'Blake King', 40, 'Royal Palm Beach', '33411', 'Indie Games', 'All Platforms', 'Casual Indie Games fan from Royal Palm Beach. Also enjoy Miniature Games on weekends.', 4.8, 29, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('thomas.griffin437@outlook.com', 'password123', 'AlphaThomas70', 'Thomas Griffin', 27, 'Juno Beach', '33408', 'Beach Volleyball', 'Xbox', 'Juno Beach native. Love Beach Volleyball, dabble in Souls-like Games. Let''s connect!', 4.7, 12, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('noah.brown972@gmail.com', 'password123', 'NoahBro50', 'Noah Brown', 52, 'Palm Springs', '33461', 'Trading Card Games', 'Xbox', 'South FL local. Trading Card Games enthusiast and weekend warrior. Palm Springs represent!', 4.8, 76, '["Tournament Ready", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('destiny.rodriguez237@gmail.com', 'password123', 'CyberDestiny89', 'Destiny Rodriguez', 32, 'Wellington', '33414', 'Deck Building', 'PC', 'South FL local. Deck Building enthusiast and weekend warrior. Wellington represent!', 4.4, 29, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('taylor.gonzalez68@yahoo.com', 'password123', 'xXTa954Xx', 'Taylor Gonzalez', 31, 'Lake Worth Beach', '33460', 'Competitive FPS', 'PC', 'New to the scene! Trying to find people who love Competitive FPS in Lake Worth Beach area.', 4.7, 70, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.morales532@hotmail.com', 'password123', 'xXAl42Xx', 'Alejandro Morales', 33, 'West Palm Beach', '33409', 'Beach Volleyball', 'Mobile', 'Retired Beach Volleyball tryhard, now just vibing. Live in West Palm Beach, FL.', 5.0, 42, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('miguel.scott926@yahoo.com', 'password123', 'xXMi561Xx', 'Miguel Scott', 51, 'Boca Raton', '33431', 'Disc Golf', 'N/A', 'New to the scene! Trying to find people who love Disc Golf in Boca Raton area.', 4.7, 18, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brianna.edwards919@yahoo.com', 'password123', 'xXBrStrikerXx', 'Brianna Edwards', 55, 'Palm Beach', '33480', 'Sandbox Games', 'All Platforms', 'Palm Beach native. Love Sandbox Games, dabble in Bird Watching. Let''s connect!', 4.3, 35, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('samantha.roberts787@yahoo.com', 'password123', 'RubySamantha85', 'Samantha Roberts', 20, 'Riviera Beach', '33404', 'Rock Climbing', 'N/A', 'New to the scene! Trying to find people who love Rock Climbing in Riviera Beach area.', 4.4, 19, '["Friendly Host", "PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('melissa.stewart921@yahoo.com', 'password123', 'MelissaSte10', 'Melissa Stewart', 25, 'Boynton Beach', '33437', 'Warhammer', 'Steam Deck', 'Local Boynton Beach player. Into Warhammer and Social Deduction Games. Always looking for chill groups!', 4.7, 39, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lily.roberts840@yahoo.com', 'password123', 'NovaMaster57', 'Lily Roberts', 53, 'Jupiter', '33477', 'Basketball', 'Mobile', 'Jupiter native. Love Basketball, dabble in Party Games. Let''s connect!', 4.7, 77, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.wright954@gmail.com', 'password123', 'ChillHero331', 'Alejandro Wright', 41, 'Singer Island', '33404', 'Soccer', 'PC & Console', 'Casual Soccer fan from Singer Island. Also enjoy Running / Jogging on weekends.', 4.3, 19, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('justin.scott586@hotmail.com', 'password123', 'Crimson777706', 'Justin Scott', 24, 'Boca Raton', '33431', 'Social Deduction Games', 'N/A', 'New to the scene! Trying to find people who love Social Deduction Games in Boca Raton area.', 4.6, 30, '["Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('austin.delacroix726@outlook.com', 'password123', 'AustinDel10', 'Austin Delacroix', 32, 'Boynton Beach', '33437', 'Platformers', 'Nintendo Switch', 'Casual Platformers fan from Boynton Beach. Also enjoy Competitive FPS on weekends.', 4.4, 38, '["Friendly Host", "Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maya.harris308@hotmail.com', 'password123', 'ChillMaya1', 'Maya Harris', 37, 'Boca Raton', '33433', 'Golf', 'Steam Deck', 'Boca Raton native. Love Golf, dabble in Indie Games. Let''s connect!', 2.7, 16, '["Tournament Ready"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('antonio.cruz918@outlook.com', 'password123', 'xXAnPBCXx', 'Antonio Cruz', 52, 'Palm Beach', '33480', 'Beach Activities', 'N/A', 'Always down for Beach Activities sessions. Palm Beach-based. Message me anytime!', 4.6, 18, '["PBC Veteran", "Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('rachel.brown861@gmail.com', 'password123', 'HyperRachel81', 'Rachel Brown', 35, 'Boynton Beach', '33435', 'Indie Games', 'Steam Deck', 'New to the scene! Trying to find people who love Indie Games in Boynton Beach area.', 4.2, 9, '["Tabletop King", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.gomez180@gmail.com', 'password123', 'LazyMorgan5', 'Morgan Gomez', 37, 'Lake Park', '33403', 'Eurogames', 'PC & Console', 'Lake Park native. Love Eurogames, dabble in Souls-like Games. Let''s connect!', 4.3, 64, '["Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('julia.williams397@hotmail.com', 'password123', 'DarkHero955', 'Julia Williams', 47, 'West Palm Beach', '33409', 'Worker Placement', 'Nintendo Switch', 'South FL local. Worker Placement enthusiast and weekend warrior. West Palm Beach represent!', 4.6, 17, '["Tournament Ready", "Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassidy.johnson280@yahoo.com', 'password123', 'CassidyJoh45', 'Cassidy Johnson', 25, 'Tequesta', '33469', 'Horror Games', 'Mobile', 'Tequesta native. Love Horror Games, dabble in Open World. Let''s connect!', 4.4, 51, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('david.jenkins455@gmail.com', 'password123', 'DavidJen13', 'David Jenkins', 52, 'Greenacres', '33467', 'Platformers', 'All Platforms', 'New to the scene! Trying to find people who love Platformers in Greenacres area.', 4.6, 26, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diamond.lee838@yahoo.com', 'password123', 'Hacked100783', 'Diamond Lee', 39, 'Palm Beach Gardens', '33418', 'CrossFit', 'N/A', 'New to the scene! Trying to find people who love CrossFit in Palm Beach Gardens area.', 5.0, 85, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amanda.green882@hotmail.com', 'password123', 'ModdedAmanda47', 'Amanda Green', 27, 'Wellington', '33414', 'Board Games', 'N/A', 'Wellington native. Love Board Games, dabble in Tabletop RPG. Let''s connect!', 4.4, 34, '["Early Bird", "Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maya.patel131@hotmail.com', 'password123', 'Ultra305732', 'Maya Patel', 54, 'Royal Palm Beach', '33411', 'Cooperative Board Games', 'N/A', 'Royal Palm Beach native. Love Cooperative Board Games, dabble in Party Games. Let''s connect!', 4.3, 20, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('antonio.martin214@hotmail.com', 'password123', 'xXAnBardXx44', 'Antonio Martin', 39, 'Boca Raton', '33433', 'Softball', 'N/A', 'New to the scene! Trying to find people who love Softball in Boca Raton area.', 4.8, 28, '["Tournament Ready", "Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('eva.russell569@gmail.com', 'password123', 'xXEvKingXx', 'Eva Russell', 38, 'Palm Beach', '33480', 'Soccer', 'N/A', 'Local Palm Beach player. Into Soccer and Hiking. Always looking for chill groups!', 4.8, 19, '["Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hunter.thompson545@outlook.com', 'password123', 'xXHuWarlockXx', 'Hunter Thompson', 46, 'Boynton Beach', '33435', 'Cooperative Board Games', 'N/A', 'Retired Cooperative Board Games tryhard, now just vibing. Live in Boynton Beach, FL.', 4.7, 10, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('patrick.campbell627@hotmail.com', 'password123', 'xXPa786Xx', 'Patrick Campbell', 18, 'Singer Island', '33404', 'Triathlon', 'PC', 'Retired Triathlon tryhard, now just vibing. Live in Singer Island, FL.', 4.3, 37, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('noah.white391@icloud.com', 'password123', 'NoahWhi94', 'Noah White', 43, 'Riviera Beach', '33404', 'Puzzle Games', 'N/A', 'Riviera Beach native. Love Puzzle Games, dabble in Party Games. Let''s connect!', 4.3, 11, '["Early Bird", "Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('grace.allen148@icloud.com', 'password123', 'xXGrPlayerXx', 'Grace Allen', 19, 'Boca Raton', '33433', 'Flag Football', 'All Platforms', 'New to the scene! Trying to find people who love Flag Football in Boca Raton area.', 4.2, 78, '["Tabletop King", "Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('leo.white421@hotmail.com', 'password123', 'PixelLeo5', 'Leo White', 35, 'Pahokee', '33476', 'Dungeons & Dragons', 'N/A', 'South FL local. Dungeons & Dragons enthusiast and weekend warrior. Pahokee represent!', 4.5, 59, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('allison.reed912@hotmail.com', 'password123', 'OmegaWizard646', 'Allison Reed', 51, 'Boca Raton', '33496', 'Worker Placement', 'Steam Deck', 'Always down for Worker Placement sessions. Boca Raton-based. Message me anytime!', 4.3, 51, '["Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tiffany.lee172@gmail.com', 'password123', 'GrindTiffany73', 'Tiffany Lee', 36, 'Palm Beach Gardens', '33410', 'Beach Volleyball', 'Steam Deck', 'Passionate about Beach Volleyball. Based in Palm Beach Gardens, FL. Hit me up for games or meetups.', 4.6, 7, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.harris282@outlook.com', 'password123', 'RankedGamer619', 'Matthew Harris', 35, 'Delray Beach', '33446', 'War Games', 'Xbox', 'Always down for War Games sessions. Delray Beach-based. Message me anytime!', 4.4, 72, '["Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diego.cox771@icloud.com', 'password123', 'xXDiProXx', 'Diego Cox', 49, 'Boynton Beach', '33435', 'Basketball', 'N/A', 'Local Boynton Beach player. Into Basketball and Hiking. Always looking for chill groups!', 4.2, 60, '["Pro Gamer", "Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jake.ortiz309@icloud.com', 'password123', 'JakeOrt58', 'Jake Ortiz', 48, 'Riviera Beach', '33407', 'Magic: The Gathering', 'N/A', 'Always down for Magic: The Gathering sessions. Riviera Beach-based. Message me anytime!', 5.0, 31, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassandra.walker940@hotmail.com', 'password123', 'CursedCassandra56', 'Cassandra Walker', 24, 'West Palm Beach', '33409', 'Miniature Games', 'Nintendo Switch', 'West Palm Beach native. Love Miniature Games, dabble in Cooperative Board Games. Let''s connect!', 4.8, 31, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nicole.roberts852@gmail.com', 'password123', 'MegaRunner538', 'Nicole Roberts', 18, 'West Palm Beach', '33401', 'Golf', 'N/A', 'Casual Golf fan from West Palm Beach. Also enjoy Basketball on weekends.', 4.7, 30, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('denise.sullivan89@hotmail.com', 'password123', 'DeniseSul58', 'Denise Sullivan', 25, 'Delray Beach', '33445', 'Miniature Games', 'N/A', 'Always down for Miniature Games sessions. Delray Beach-based. Message me anytime!', 4.9, 33, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('luis.davis796@gmail.com', 'password123', 'xXLuGeneralXx', 'Luis Davis', 35, 'Boca Raton', '33433', 'Deck Building', 'Steam Deck', 'Retired Deck Building tryhard, now just vibing. Live in Boca Raton, FL.', 4.8, 29, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kevin.scott733@outlook.com', 'password123', 'PixelSlayer73', 'Kevin Scott', 46, 'Delray Beach', '33444', 'Miniature Games', 'N/A', 'Local Delray Beach player. Into Miniature Games and Fitness / General Workout. Always looking for chill groups!', 4.3, 66, '["Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('savannah.hill927@icloud.com', 'password123', 'Silver999963', 'Savannah Hill', 39, 'Boynton Beach', '33435', 'Tennis', 'PC & Console', 'South FL local. Tennis enthusiast and weekend warrior. Boynton Beach represent!', 4.6, 62, '["PBC Veteran", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sofia.brooks548@outlook.com', 'password123', 'BlessedAxe779', 'Sofia Brooks', 41, 'Boca Raton', '33496', 'Strategy Games', 'All Platforms', 'Always down for Strategy Games sessions. Boca Raton-based. Message me anytime!', 4.3, 79, '["PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ariana.butler144@gmail.com', 'password123', 'ArianaBut13', 'Ariana Butler', 30, 'Tequesta', '33469', 'Disc Golf', 'N/A', 'Always down for Disc Golf sessions. Tequesta-based. Message me anytime!', 4.6, 43, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('carlos.miller827@hotmail.com', 'password123', 'xXCa007Xx', 'Carlos Miller', 31, 'Delray Beach', '33445', 'MMORPG', 'Steam Deck', 'New to the scene! Trying to find people who love MMORPG in Delray Beach area.', 4.9, 11, '["Friendly Host", "Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dion.bell15@yahoo.com', 'password123', 'PatchedHero841', 'Dion Bell', 26, 'Wellington', '33449', 'CrossFit', 'N/A', 'Casual CrossFit fan from Wellington. Also enjoy Fitness / General Workout on weekends.', 4.5, 22, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('damian.baptiste346@icloud.com', 'password123', 'StormDamian88', 'Damian Baptiste', 45, 'Lake Worth Beach', '33460', 'Fighting Games', 'Xbox', 'Always down for Fighting Games sessions. Lake Worth Beach-based. Message me anytime!', 4.6, 68, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cody.diaz948@hotmail.com', 'password123', 'FrostRunner811', 'Cody Diaz', 33, 'Tequesta', '33469', 'Board Games', 'N/A', 'Passionate about Board Games. Based in Tequesta, FL. Hit me up for games or meetups.', 4.8, 56, '["PBC Veteran", "Friendly Host", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dawn.hughes709@yahoo.com', 'password123', 'DawnHug28', 'Dawn Hughes', 48, 'Lantana', '33462', 'Fighting Games', 'PC', 'Casual Fighting Games fan from Lantana. Also enjoy Card Games / TCG on weekends.', 4.6, 68, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('finn.reyes884@hotmail.com', 'password123', 'FinnRey69', 'Finn Reyes', 41, 'Delray Beach', '33444', 'Card Games / TCG', 'Xbox', 'Local Delray Beach player. Into Card Games / TCG and Competitive FPS. Always looking for chill groups!', 4.2, 34, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('riley.hughes258@outlook.com', 'password123', 'xXRiRangerXx', 'Riley Hughes', 45, 'Lake Worth Beach', '33461', 'Souls-like Games', 'PlayStation', 'New to the scene! Trying to find people who love Souls-like Games in Lake Worth Beach area.', 4.6, 32, '["Early Bird", "PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dawn.ross204@outlook.com', 'password123', 'DawnRos24', 'Dawn Ross', 44, 'Greenacres', '33463', 'Party Games', 'N/A', 'New to the scene! Trying to find people who love Party Games in Greenacres area.', 4.6, 85, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('danny.perez149@yahoo.com', 'password123', 'xXDaKingXx', 'Danny Perez', 45, 'Boca Raton', '33431', 'Strategy Games', 'PC', 'Passionate about Strategy Games. Based in Boca Raton, FL. Hit me up for games or meetups.', 4.9, 32, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('allison.nguyen779@outlook.com', 'password123', 'AllisonNgu47', 'Allison Nguyen', 28, 'Lantana', '33462', 'Flag Football', 'Mobile', 'Retired Flag Football tryhard, now just vibing. Live in Lantana, FL.', 4.9, 9, '["Friendly Host", "Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('logan.hall594@yahoo.com', 'password123', 'LoganHal83', 'Logan Hall', 45, 'Greenacres', '33463', 'Party Games', 'N/A', 'New to the scene! Trying to find people who love Party Games in Greenacres area.', 4.7, 33, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elijah.nelson86@hotmail.com', 'password123', 'Savage777417', 'Elijah Nelson', 33, 'Belle Glade', '33430', 'Pickleball', 'N/A', 'South FL local. Pickleball enthusiast and weekend warrior. Belle Glade represent!', 4.6, 71, '["Tabletop King", "Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jacob.watson766@hotmail.com', 'password123', 'BetaAxe791', 'Jacob Watson', 54, 'Palm Beach', '33480', 'Puzzle Games', 'N/A', 'Local Palm Beach player. Into Puzzle Games and Weightlifting. Always looking for chill groups!', 4.8, 48, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('miguel.morgan590@yahoo.com', 'password123', 'Cobalt813344', 'Miguel Morgan', 52, 'Jupiter', '33477', 'Competitive FPS', 'Nintendo Switch', 'Casual Competitive FPS fan from Jupiter. Also enjoy Battle Royale on weekends.', 4.3, 49, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christina.coleman893@yahoo.com', 'password123', 'ChristinaCol51', 'Christina Coleman', 55, 'Loxahatchee', '33470', 'Eurogames', 'PlayStation', 'South FL local. Eurogames enthusiast and weekend warrior. Loxahatchee represent!', 4.3, 25, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('adrian.smith193@icloud.com', 'password123', 'CyberSniper920', 'Adrian Smith', 22, 'Royal Palm Beach', '33414', 'Trading Card Games', 'N/A', 'Royal Palm Beach native. Love Trading Card Games, dabble in Fitness / General Workout. Let''s connect!', 4.6, 83, '["Friendly Host", "Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('julia.reed427@hotmail.com', 'password123', 'JuliaRee70', 'Julia Reed', 36, 'West Palm Beach', '33405', 'MOBA', 'Nintendo Switch', 'Always down for MOBA sessions. West Palm Beach-based. Message me anytime!', 4.5, 33, '["PBC Veteran", "Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('taylor.ross498@hotmail.com', 'password123', 'xXTaAxeXx', 'Taylor Ross', 38, 'Greenacres', '33467', 'Deck Building', 'Mobile', 'Greenacres native. Love Deck Building, dabble in Simulation. Let''s connect!', 4.4, 70, '["Tournament Ready", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.hughes860@yahoo.com', 'password123', 'ChristianHug40', 'Christian Hughes', 29, 'Boynton Beach', '33437', 'Dungeons & Dragons', 'N/A', 'Boynton Beach native. Love Dungeons & Dragons, dabble in Warhammer. Let''s connect!', 4.3, 72, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ryan.nelson547@outlook.com', 'password123', 'ModdedMage415', 'Ryan Nelson', 28, 'North Palm Beach', '33408', 'Simulation', 'PlayStation', 'Local North Palm Beach player. Into Simulation and Card Games / TCG. Always looking for chill groups!', 4.6, 85, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hannah.turner316@gmail.com', 'password123', 'xXHaWarlockXx', 'Hannah Turner', 25, 'Palm Springs', '33461', 'Strategy Games', 'Nintendo Switch', 'Local Palm Springs player. Into Strategy Games and Co-op Games. Always looking for chill groups!', 4.7, 73, '["Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diego.richardson525@icloud.com', 'password123', 'DiegoRic72', 'Diego Richardson', 23, 'Tequesta', '33469', 'MMORPG', 'PC', 'Always down for MMORPG sessions. Tequesta-based. Message me anytime!', 4.4, 40, '["Friendly Host", "Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nathan.nelson221@icloud.com', 'password123', 'xXNaFLXx', 'Nathan Nelson', 23, 'Palm Springs', '33461', 'Dungeons & Dragons', 'PlayStation', 'Passionate about Dungeons & Dragons. Based in Palm Springs, FL. Hit me up for games or meetups.', 4.8, 82, '["PBC Veteran", "Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amara.mitchell180@hotmail.com', 'password123', 'xXAm999Xx', 'Amara Mitchell', 44, 'Jupiter', '33477', 'Worker Placement', 'N/A', 'South FL local. Worker Placement enthusiast and weekend warrior. Jupiter represent!', 4.9, 57, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('austin.robinson28@gmail.com', 'password123', 'AustinRob43', 'Austin Robinson', 32, 'Palm Beach', '33480', 'Rock Climbing', 'N/A', 'Casual Rock Climbing fan from Palm Beach. Also enjoy Biking / Cycling on weekends.', 4.8, 53, '["Tournament Ready", "Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brooklyn.collins994@gmail.com', 'password123', 'OnyxBrooklyn62', 'Brooklyn Collins', 49, 'Jupiter', '33477', 'Worker Placement', 'PC', 'New to the scene! Trying to find people who love Worker Placement in Jupiter area.', 4.8, 7, '["Pro Gamer", "Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('grace.lee280@outlook.com', 'password123', 'xXGr404Xx', 'Grace Lee', 21, 'Boynton Beach', '33436', 'Flag Football', 'N/A', 'Boynton Beach native. Love Flag Football, dabble in Fitness / General Workout. Let''s connect!', 4.2, 66, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elena.sanchez331@outlook.com', 'password123', 'ViperElena88', 'Elena Sanchez', 52, 'Boynton Beach', '33436', 'Souls-like Games', 'All Platforms', 'Passionate about Souls-like Games. Based in Boynton Beach, FL. Hit me up for games or meetups.', 4.2, 11, '["Early Bird", "Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kevin.cruz852@yahoo.com', 'password123', 'MegaAxe939', 'Kevin Cruz', 32, 'Pahokee', '33476', 'Dungeons & Dragons', 'PC', 'Casual Dungeons & Dragons fan from Pahokee. Also enjoy Puzzle Games on weekends.', 4.5, 35, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.vega315@yahoo.com', 'password123', 'GavinVeg26', 'Gavin Vega', 32, 'Boynton Beach', '33435', 'Board Games', 'N/A', 'Local Boynton Beach player. Into Board Games and Warhammer. Always looking for chill groups!', 4.8, 43, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amanda.collins68@outlook.com', 'password123', 'ToxicRunner802', 'Amanda Collins', 20, 'Jupiter', '33458', 'Horror Games', 'Mobile', 'Always down for Horror Games sessions. Jupiter-based. Message me anytime!', 4.7, 52, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jacob.vega518@hotmail.com', 'password123', 'Inferno305593', 'Jacob Vega', 33, 'Pahokee', '33476', 'Trading Card Games', 'Steam Deck', 'Pahokee native. Love Trading Card Games, dabble in Strategy Games. Let''s connect!', 4.4, 6, '["Tournament Ready", "Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('wesley.turner855@outlook.com', 'password123', 'xXWeBladeXx', 'Wesley Turner', 29, 'Delray Beach', '33444', 'Tabletop RPG', 'PC & Console', 'Local Delray Beach player. Into Tabletop RPG and Worker Placement. Always looking for chill groups!', 4.4, 26, '["Friendly Host", "Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diego.jones395@outlook.com', 'password123', 'xXDiBarbarianXx', 'Diego Jones', 25, 'Belle Glade', '33430', 'Puzzle Games', 'N/A', 'New to the scene! Trying to find people who love Puzzle Games in Belle Glade area.', 4.9, 12, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('robert.edwards689@gmail.com', 'password123', 'xXRoLanceXx', 'Robert Edwards', 49, 'West Palm Beach', '33401', 'Trading Card Games', 'N/A', 'West Palm Beach native. Love Trading Card Games, dabble in Cooperative Board Games. Let''s connect!', 4.3, 26, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('damian.lewis206@hotmail.com', 'password123', 'DamianLew6493', 'Damian Lewis', 39, 'Lake Worth Beach', '33460', 'Soccer', 'N/A', 'New to the scene! Trying to find people who love Soccer in Lake Worth Beach area.', 4.4, 17, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('emma.collins510@yahoo.com', 'password123', 'EmmaCol13', 'Emma Collins', 49, 'Jupiter', '33458', 'Competitive FPS', 'PlayStation', 'New to the scene! Trying to find people who love Competitive FPS in Jupiter area.', 4.8, 7, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('allison.foster503@hotmail.com', 'password123', 'EmeraldAllison44', 'Allison Foster', 49, 'Palm Beach Gardens', '33410', 'Sandbox Games', 'Xbox', 'South FL local. Sandbox Games enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.2, 37, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jake.perez320@icloud.com', 'password123', 'xXJa100Xx', 'Jake Perez', 26, 'Manalapan', '33462', 'Disc Golf', 'N/A', 'Retired Disc Golf tryhard, now just vibing. Live in Manalapan, FL.', 4.4, 51, '["Pro Gamer", "PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('diamond.turner329@gmail.com', 'password123', 'OnyxRanger132', 'Diamond Turner', 36, 'Royal Palm Beach', '33411', 'Yoga', 'N/A', 'Always down for Yoga sessions. Royal Palm Beach-based. Message me anytime!', 4.8, 42, '["PBC Veteran", "Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('taylor.king254@yahoo.com', 'password123', 'OnyxTaylor11', 'Taylor King', 33, 'Boca Raton', '33431', 'Sandbox Games', 'All Platforms', 'New to the scene! Trying to find people who love Sandbox Games in Boca Raton area.', 4.5, 67, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('darryl.anderson585@icloud.com', 'password123', 'RubyDarryl13', 'Darryl Anderson', 42, 'Greenacres', '33463', 'Kayaking', 'N/A', 'Passionate about Kayaking. Based in Greenacres, FL. Hit me up for games or meetups.', 4.5, 68, '["Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.gomez49@outlook.com', 'password123', 'xXChFLXx', 'Christian Gomez', 34, 'Palm Beach Gardens', '33410', 'Beach Activities', 'Nintendo Switch', 'South FL local. Beach Activities enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.6, 78, '["Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ben.baptiste680@hotmail.com', 'password123', 'VoltBen54', 'Ben Baptiste', 45, 'Palm Beach Gardens', '33418', 'Hiking', 'Nintendo Switch', 'New to the scene! Trying to find people who love Hiking in Palm Beach Gardens area.', 4.7, 68, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('marcus.sullivan958@hotmail.com', 'password123', 'AzureQueen374', 'Marcus Sullivan', 45, 'North Palm Beach', '33408', 'Rock Climbing', 'N/A', 'Casual Rock Climbing fan from North Palm Beach. Also enjoy Beach Activities on weekends.', 5.0, 15, '["Friendly Host", "Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('taylor.hill263@hotmail.com', 'password123', 'TaylorHil61', 'Taylor Hill', 28, 'Palm Beach Gardens', '33410', 'Sandbox Games', 'All Platforms', 'Local Palm Beach Gardens player. Into Sandbox Games and Card Games / TCG. Always looking for chill groups!', 4.3, 13, '["Friendly Host", "Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('joshua.davis30@outlook.com', 'password123', 'FierceJoshua71', 'Joshua Davis', 26, 'Jupiter', '33477', 'Eurogames', 'All Platforms', 'Casual Eurogames fan from Jupiter. Also enjoy Simulation on weekends.', 4.7, 15, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ethan.rogers535@hotmail.com', 'password123', 'GoldenEthan12', 'Ethan Rogers', 25, 'Pahokee', '33476', 'War Games', 'N/A', 'Pahokee native. Love War Games, dabble in Trading Card Games. Let''s connect!', 4.5, 60, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kayla.howard261@hotmail.com', 'password123', 'GoldenRogue384', 'Kayla Howard', 44, 'Tequesta', '33469', 'Running / Jogging', 'PC', 'Local Tequesta player. Into Running / Jogging and Bird Watching. Always looking for chill groups!', 4.2, 75, '["Early Bird", "PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chris.ward566@icloud.com', 'password123', 'RapidChris90', 'Chris Ward', 34, 'Wellington', '33449', 'First-Person Shooters', 'Nintendo Switch', 'Wellington native. Love First-Person Shooters, dabble in Adventure Games. Let''s connect!', 4.6, 64, '["PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('wesley.stewart809@gmail.com', 'password123', 'BrokenWesley11', 'Wesley Stewart', 44, 'Greenacres', '33463', 'Trading Card Games', 'PC & Console', 'Local Greenacres player. Into Trading Card Games and Flag Football. Always looking for chill groups!', 4.4, 63, '["Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chris.taylor811@yahoo.com', 'password123', 'UltraQueen644', 'Chris Taylor', 46, 'Boynton Beach', '33437', 'Souls-like Games', 'Xbox', 'Retired Souls-like Games tryhard, now just vibing. Live in Boynton Beach, FL.', 4.4, 14, '["Tabletop King", "Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('noah.nelson267@yahoo.com', 'password123', 'CasualNoah37', 'Noah Nelson', 26, 'Loxahatchee', '33470', 'Board Games', 'N/A', 'Casual Board Games fan from Loxahatchee. Also enjoy Disc Golf on weekends.', 4.4, 65, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dominic.ortiz719@yahoo.com', 'password123', 'UltraWarlock440', 'Dominic Ortiz', 34, 'Lake Worth Beach', '33460', 'Cooperative Board Games', 'N/A', 'Retired Cooperative Board Games tryhard, now just vibing. Live in Lake Worth Beach, FL.', 4.5, 74, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.morales230@yahoo.com', 'password123', 'AlejandroMor44', 'Alejandro Morales', 25, 'Belle Glade', '33430', 'Strategy Games', 'All Platforms', 'Belle Glade native. Love Strategy Games, dabble in Simulation. Let''s connect!', 4.9, 8, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brooklyn.jackson633@icloud.com', 'password123', 'BrooklynJac57', 'Brooklyn Jackson', 33, 'Jupiter', '33458', 'Puzzle Games', 'N/A', 'Retired Puzzle Games tryhard, now just vibing. Live in Jupiter, FL.', 4.9, 20, '["PBC Veteran", "Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kayla.white754@hotmail.com', 'password123', 'BlazeKayla13', 'Kayla White', 45, 'Riviera Beach', '33404', 'Competitive FPS', 'All Platforms', 'Always down for Competitive FPS sessions. Riviera Beach-based. Message me anytime!', 4.2, 85, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('genesis.robinson184@outlook.com', 'password123', 'GenesisRob74', 'Genesis Robinson', 55, 'West Palm Beach', '33409', 'Dungeons & Dragons', 'N/A', 'Local West Palm Beach player. Into Dungeons & Dragons and Magic: The Gathering. Always looking for chill groups!', 4.6, 32, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.phillips949@icloud.com', 'password123', 'PatchedGavin34', 'Gavin Phillips', 41, 'Jupiter', '33477', 'Card Games / TCG', 'Xbox', 'Jupiter native. Love Card Games / TCG, dabble in MMORPG. Let''s connect!', 4.9, 39, '["PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cameron.parker723@icloud.com', 'password123', 'xXCaGamerXx', 'Cameron Parker', 28, 'Jupiter', '33458', 'Soccer', 'N/A', 'Casual Soccer fan from Jupiter. Also enjoy CrossFit on weekends.', 4.9, 78, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maya.evans843@outlook.com', 'password123', 'MayaEva84', 'Maya Evans', 50, 'Boynton Beach', '33436', 'Card Games / TCG', 'PlayStation', 'South FL local. Card Games / TCG enthusiast and weekend warrior. Boynton Beach represent!', 4.6, 80, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gabrielle.martinez952@gmail.com', 'password123', 'IronGabrielle4', 'Gabrielle Martinez', 55, 'Royal Palm Beach', '33414', 'Board Games', 'Nintendo Switch', 'South FL local. Board Games enthusiast and weekend warrior. Royal Palm Beach represent!', 4.3, 56, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nora.baptiste561@hotmail.com', 'password123', 'xXNoStrikerXx', 'Nora Baptiste', 22, 'Boca Raton', '33431', 'Board Games', 'N/A', 'Retired Board Games tryhard, now just vibing. Live in Boca Raton, FL.', 2.6, 55, '["Tabletop King", "Friendly Host"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sophia.hughes306@icloud.com', 'password123', 'xXSo42Xx', 'Sophia Hughes', 25, 'Boynton Beach', '33435', 'Bird Watching', 'N/A', 'New to the scene! Trying to find people who love Bird Watching in Boynton Beach area.', 4.3, 16, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('zoe.martin577@hotmail.com', 'password123', 'xXZoStrikerXx', 'Zoe Martin', 35, 'Loxahatchee', '33470', 'Weightlifting', 'N/A', 'New to the scene! Trying to find people who love Weightlifting in Loxahatchee area.', 4.4, 30, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lara.taylor540@hotmail.com', 'password123', 'WolfAxe448', 'Lara Taylor', 49, 'Boynton Beach', '33435', 'Simulation', 'All Platforms', 'Local Boynton Beach player. Into Simulation and Sports Games. Always looking for chill groups!', 4.6, 16, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cody.bryant111@hotmail.com', 'password123', 'xXCoShotgunXx', 'Cody Bryant', 50, 'West Palm Beach', '33409', 'Tabletop RPG', 'PC', 'South FL local. Tabletop RPG enthusiast and weekend warrior. West Palm Beach represent!', 4.9, 69, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nicole.russell639@outlook.com', 'password123', 'ModdedNicole24', 'Nicole Russell', 46, 'Palm Beach', '33480', 'CrossFit', 'N/A', 'Local Palm Beach player. Into CrossFit and Rock Climbing. Always looking for chill groups!', 4.7, 32, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('james.thomas709@icloud.com', 'password123', 'xXJaHeroXx', 'James Thomas', 47, 'Loxahatchee', '33470', 'Weightlifting', 'N/A', 'Local Loxahatchee player. Into Weightlifting and Running / Jogging. Always looking for chill groups!', 4.5, 11, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jessica.vega493@yahoo.com', 'password123', 'JessicaVeg65', 'Jessica Vega', 31, 'West Palm Beach', '33405', 'Party Games', 'Xbox', 'New to the scene! Trying to find people who love Party Games in West Palm Beach area.', 4.8, 15, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ariana.parker600@yahoo.com', 'password123', 'ArianaPar47', 'Ariana Parker', 46, 'West Palm Beach', '33405', 'Card Games / TCG', 'All Platforms', 'New to the scene! Trying to find people who love Card Games / TCG in West Palm Beach area.', 4.2, 54, '["Friendly Host", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lena.white20@icloud.com', 'password123', 'JadeLena9', 'Lena White', 51, 'Boca Raton', '33431', 'Platformers', 'Steam Deck', 'Casual Platformers fan from Boca Raton. Also enjoy First-Person Shooters on weekends.', 4.5, 20, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('darryl.walker135@outlook.com', 'password123', 'xXDaShotgunXx', 'Darryl Walker', 47, 'Greenacres', '33467', 'Dungeons & Dragons', 'Steam Deck', 'New to the scene! Trying to find people who love Dungeons & Dragons in Greenacres area.', 4.7, 85, '["Early Bird", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.griffin49@gmail.com', 'password123', 'FixedMorgan34', 'Morgan Griffin', 53, 'Lake Worth Beach', '33461', 'Weightlifting', 'N/A', 'Passionate about Weightlifting. Based in Lake Worth Beach, FL. Hit me up for games or meetups.', 4.4, 55, '["Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dion.green230@icloud.com', 'password123', 'PhantomDion46', 'Dion Green', 53, 'Delray Beach', '33445', 'Martial Arts', 'PC', 'Delray Beach native. Love Martial Arts, dabble in CrossFit. Let''s connect!', 4.9, 38, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('finn.garcia746@outlook.com', 'password123', 'xXFi100Xx', 'Finn Garcia', 28, 'Royal Palm Beach', '33414', 'Puzzle Games', 'N/A', 'New to the scene! Trying to find people who love Puzzle Games in Royal Palm Beach area.', 4.4, 84, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('thomas.patel855@icloud.com', 'password123', 'WolfThomas65', 'Thomas Patel', 33, 'West Palm Beach', '33401', 'Dungeons & Dragons', 'N/A', 'Retired Dungeons & Dragons tryhard, now just vibing. Live in West Palm Beach, FL.', 5.0, 80, '["PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexandra.vega967@gmail.com', 'password123', 'xXAlMasterXx', 'Alexandra Vega', 41, 'Lake Park', '33403', 'War Games', 'N/A', 'Retired War Games tryhard, now just vibing. Live in Lake Park, FL.', 4.4, 48, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cameron.thompson60@hotmail.com', 'password123', 'MegaCameron52', 'Cameron Thompson', 54, 'Boynton Beach', '33435', 'Adventure Games', 'PlayStation', 'Always down for Adventure Games sessions. Boynton Beach-based. Message me anytime!', 4.5, 83, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('savannah.williams554@outlook.com', 'password123', 'SavannahWil21', 'Savannah Williams', 51, 'Delray Beach', '33446', 'Pickleball', 'Mobile', 'Passionate about Pickleball. Based in Delray Beach, FL. Hit me up for games or meetups.', 4.5, 77, '["Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('connor.reyes643@hotmail.com', 'password123', 'StormConnor7', 'Connor Reyes', 34, 'Royal Palm Beach', '33414', 'Sports Games', 'Mobile', 'Royal Palm Beach native. Love Sports Games, dabble in Co-op Games. Let''s connect!', 4.5, 83, '["Early Bird", "Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('samantha.reed336@hotmail.com', 'password123', 'SamanthaRee56', 'Samantha Reed', 24, 'Wellington', '33449', 'Board Games', 'Nintendo Switch', 'Always down for Board Games sessions. Wellington-based. Message me anytime!', 4.2, 19, '["Pro Gamer", "Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bryan.miller532@icloud.com', 'password123', 'OnyxBryan64', 'Bryan Miller', 53, 'Singer Island', '33404', 'Worker Placement', 'Steam Deck', 'Passionate about Worker Placement. Based in Singer Island, FL. Hit me up for games or meetups.', 4.6, 51, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kayla.nguyen765@yahoo.com', 'password123', 'ModdedKayla16', 'Kayla Nguyen', 20, 'Loxahatchee', '33470', 'Basketball', 'N/A', 'Always down for Basketball sessions. Loxahatchee-based. Message me anytime!', 4.3, 35, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nathan.long498@gmail.com', 'password123', 'NathanLon28', 'Nathan Long', 36, 'Palm Beach Gardens', '33418', 'Puzzle Games', 'All Platforms', 'South FL local. Puzzle Games enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.2, 66, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('crystal.nelson487@hotmail.com', 'password123', 'CrystalNel27', 'Crystal Nelson', 42, 'Greenacres', '33467', 'Softball', 'N/A', 'Retired Softball tryhard, now just vibing. Live in Greenacres, FL.', 5.0, 40, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('savannah.green554@gmail.com', 'password123', 'xXSa42Xx', 'Savannah Green', 39, 'Riviera Beach', '33407', 'Hiking', 'Nintendo Switch', 'Local Riviera Beach player. Into Hiking and CrossFit. Always looking for chill groups!', 4.6, 12, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('finn.thompson986@gmail.com', 'password123', 'LazyFinn27', 'Finn Thompson', 29, 'North Palm Beach', '33408', 'Beach Activities', 'N/A', 'Local North Palm Beach player. Into Beach Activities and Yoga. Always looking for chill groups!', 4.3, 17, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('paige.morris25@hotmail.com', 'password123', 'HyperPaige33', 'Paige Morris', 44, 'Boynton Beach', '33437', 'Magic: The Gathering', 'Mobile', 'Boynton Beach native. Love Magic: The Gathering, dabble in MMORPG. Let''s connect!', 4.3, 81, '["Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('connor.scott28@gmail.com', 'password123', 'HyperConnor13', 'Connor Scott', 29, 'Greenacres', '33463', 'Warhammer', 'All Platforms', 'Local Greenacres player. Into Warhammer and Kayaking. Always looking for chill groups!', 4.5, 19, '["Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('noah.ortiz68@icloud.com', 'password123', 'Mega404240', 'Noah Ortiz', 44, 'Palm Springs', '33461', 'Hiking', 'Xbox', 'Palm Springs native. Love Hiking, dabble in Running / Jogging. Let''s connect!', 4.4, 58, '["PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lily.richardson463@gmail.com', 'password123', 'LuckyAxe985', 'Lily Richardson', 53, 'Manalapan', '33462', 'Cooperative Board Games', 'N/A', 'Always down for Cooperative Board Games sessions. Manalapan-based. Message me anytime!', 4.2, 46, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kayla.ross47@yahoo.com', 'password123', 'EagleStriker405', 'Kayla Ross', 36, 'Pahokee', '33476', 'Miniature Games', 'PC & Console', 'Pahokee native. Love Miniature Games, dabble in Magic: The Gathering. Let''s connect!', 4.6, 30, '["Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('aiden.sanders924@gmail.com', 'password123', 'AidenSan62', 'Aiden Sanders', 18, 'Loxahatchee', '33470', 'Hiking', 'PlayStation', 'Always down for Hiking sessions. Loxahatchee-based. Message me anytime!', 4.2, 52, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('savannah.edwards474@outlook.com', 'password123', 'SavannahEdw66', 'Savannah Edwards', 25, 'West Palm Beach', '33401', 'Weightlifting', 'N/A', 'New to the scene! Trying to find people who love Weightlifting in West Palm Beach area.', 4.6, 48, '["Tabletop King", "Friendly Host", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ricky.barnes927@hotmail.com', 'password123', 'RickyBar10', 'Ricky Barnes', 49, 'Jupiter', '33477', 'Dungeons & Dragons', 'N/A', 'Jupiter native. Love Dungeons & Dragons, dabble in Worker Placement. Let''s connect!', 5.0, 54, '["Early Bird", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('damian.russell131@outlook.com', 'password123', 'DamianRus76', 'Damian Russell', 22, 'Delray Beach', '33446', 'Rock Climbing', 'Mobile', 'New to the scene! Trying to find people who love Rock Climbing in Delray Beach area.', 5.0, 30, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('austin.lewis906@yahoo.com', 'password123', 'Viper321431', 'Austin Lewis', 20, 'Lake Park', '33403', 'MOBA', 'PC', 'Retired MOBA tryhard, now just vibing. Live in Lake Park, FL.', 4.9, 28, '["Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('derek.hall338@outlook.com', 'password123', 'Rapid404100', 'Derek Hall', 28, 'Lake Worth Beach', '33460', 'CrossFit', 'Nintendo Switch', 'New to the scene! Trying to find people who love CrossFit in Lake Worth Beach area.', 4.5, 42, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elena.stewart128@gmail.com', 'password123', 'ModdedRanger387', 'Elena Stewart', 55, 'Tequesta', '33469', 'Simulation', 'PC', 'South FL local. Simulation enthusiast and weekend warrior. Tequesta represent!', 4.4, 26, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('santiago.miller239@hotmail.com', 'password123', 'BetaGeneral476', 'Santiago Miller', 44, 'Delray Beach', '33444', 'Pickleball', 'N/A', 'Casual Pickleball fan from Delray Beach. Also enjoy Martial Arts on weekends.', 4.4, 53, '["Early Bird", "Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('emma.clark608@yahoo.com', 'password123', 'EmmaCla91', 'Emma Clark', 22, 'West Palm Beach', '33401', 'Tennis', 'N/A', 'West Palm Beach native. Love Tennis, dabble in War Games. Let''s connect!', 4.3, 22, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nicholas.ross983@outlook.com', 'password123', 'OnyxNicholas70', 'Nicholas Ross', 50, 'Manalapan', '33462', 'Board Games', 'N/A', 'Local Manalapan player. Into Board Games and Worker Placement. Always looking for chill groups!', 4.4, 43, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tyler.king656@yahoo.com', 'password123', 'PhantomQueen684', 'Tyler King', 30, 'Lake Worth Beach', '33460', 'Party Games', 'N/A', 'New to the scene! Trying to find people who love Party Games in Lake Worth Beach area.', 5.0, 49, '["Friendly Host", "Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kylie.adams478@hotmail.com', 'password123', 'KylieAda40', 'Kylie Adams', 32, 'Wellington', '33414', 'Horror Games', 'PC', 'Local Wellington player. Into Horror Games and Fitness / General Workout. Always looking for chill groups!', 4.3, 77, '["Early Bird", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cole.coleman451@yahoo.com', 'password123', 'PixelCole4', 'Cole Coleman', 36, 'Boynton Beach', '33435', 'Eurogames', 'N/A', 'Boynton Beach native. Love Eurogames, dabble in Fitness / General Workout. Let''s connect!', 4.3, 51, '["Tabletop King", "Pro Gamer", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jose.anderson933@gmail.com', 'password123', 'Blessed007141', 'Jose Anderson', 34, 'Boynton Beach', '33437', 'Sports Games', 'All Platforms', 'Passionate about Sports Games. Based in Boynton Beach, FL. Hit me up for games or meetups.', 4.8, 53, '["Tabletop King", "PBC Veteran", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hector.cook546@icloud.com', 'password123', 'RogueHector77', 'Hector Cook', 30, 'Lake Worth Beach', '33460', 'Beach Activities', 'Steam Deck', 'Passionate about Beach Activities. Based in Lake Worth Beach, FL. Hit me up for games or meetups.', 4.3, 10, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amanda.mensah521@icloud.com', 'password123', 'GoldenAmanda67', 'Amanda Mensah', 28, 'Boca Raton', '33433', 'Soccer', 'N/A', 'Local Boca Raton player. Into Soccer and Swimming. Always looking for chill groups!', 4.8, 84, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('justin.gonzalez884@yahoo.com', 'password123', 'xXJuDukeXx', 'Justin Gonzalez', 46, 'Lake Worth Beach', '33460', 'Dungeons & Dragons', 'N/A', 'Always down for Dungeons & Dragons sessions. Lake Worth Beach-based. Message me anytime!', 4.7, 40, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lauren.ross525@hotmail.com', 'password123', 'SuperLauren58', 'Lauren Ross', 47, 'West Palm Beach', '33409', 'Party Games', 'N/A', 'Passionate about Party Games. Based in West Palm Beach, FL. Hit me up for games or meetups.', 4.6, 46, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('rebecca.butler526@hotmail.com', 'password123', 'LazyLegend949', 'Rebecca Butler', 50, 'Palm Beach Gardens', '33410', 'Strategy Games', 'PC & Console', 'South FL local. Strategy Games enthusiast and weekend warrior. Palm Beach Gardens represent!', 4.3, 50, '["Pro Gamer", "Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jessica.watson935@outlook.com', 'password123', 'ChillHero289', 'Jessica Watson', 52, 'Delray Beach', '33446', 'Flag Football', 'Nintendo Switch', 'New to the scene! Trying to find people who love Flag Football in Delray Beach area.', 4.4, 37, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alexis.kim867@yahoo.com', 'password123', 'xXAlXLXx', 'Alexis Kim', 38, 'Boca Raton', '33496', 'Running / Jogging', 'PC', 'Always down for Running / Jogging sessions. Boca Raton-based. Message me anytime!', 4.7, 62, '["Pro Gamer", "Tournament Ready", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('owen.gonzalez703@icloud.com', 'password123', 'RogueOwen76', 'Owen Gonzalez', 45, 'Lantana', '33462', 'Strategy Games', 'PlayStation', 'New to the scene! Trying to find people who love Strategy Games in Lantana area.', 4.4, 44, '["Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.campbell692@hotmail.com', 'password123', 'MorganCam14', 'Morgan Campbell', 24, 'Boynton Beach', '33436', 'Simulation', 'Nintendo Switch', 'Passionate about Simulation. Based in Boynton Beach, FL. Hit me up for games or meetups.', 4.5, 50, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('alejandro.brooks12@yahoo.com', 'password123', 'BrokenAlejandro53', 'Alejandro Brooks', 51, 'Royal Palm Beach', '33414', 'Trading Card Games', 'N/A', 'Royal Palm Beach native. Love Trading Card Games, dabble in Tabletop RPG. Let''s connect!', 5.0, 24, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('julia.jenkins163@hotmail.com', 'password123', 'OnyxJulia26', 'Julia Jenkins', 48, 'Manalapan', '33462', 'Sandbox Games', 'PlayStation', 'Casual Sandbox Games fan from Manalapan. Also enjoy Fitness / General Workout on weekends.', 4.3, 40, '["PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bryan.kelly472@icloud.com', 'password123', 'RankedStriker295', 'Bryan Kelly', 49, 'Juno Beach', '33408', 'Fighting Games', 'Xbox', 'Passionate about Fighting Games. Based in Juno Beach, FL. Hit me up for games or meetups.', 4.8, 60, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sebastian.washington907@yahoo.com', 'password123', 'FixedSebastian81', 'Sebastian Washington', 33, 'West Palm Beach', '33409', 'Rock Climbing', 'PlayStation', 'Always down for Rock Climbing sessions. West Palm Beach-based. Message me anytime!', 4.6, 16, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tanner.nelson213@hotmail.com', 'password123', 'BetaMage75', 'Tanner Nelson', 34, 'Boynton Beach', '33436', 'First-Person Shooters', 'Xbox', 'New to the scene! Trying to find people who love First-Person Shooters in Boynton Beach area.', 4.4, 25, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ariana.ortiz562@yahoo.com', 'password123', 'xXArPlayerXx', 'Ariana Ortiz', 23, 'Boca Raton', '33433', 'RPG', 'PlayStation', 'Retired RPG tryhard, now just vibing. Live in Boca Raton, FL.', 4.4, 32, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('james.bryant158@icloud.com', 'password123', 'NovaJames28', 'James Bryant', 35, 'West Palm Beach', '33401', 'Hiking', 'N/A', 'Passionate about Hiking. Based in West Palm Beach, FL. Hit me up for games or meetups.', 4.7, 63, '["Tournament Ready", "Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('savannah.ward54@hotmail.com', 'password123', 'ShadowXL387', 'Savannah Ward', 46, 'Palm Beach Gardens', '33418', 'First-Person Shooters', 'PlayStation', 'Palm Beach Gardens native. Love First-Person Shooters, dabble in Competitive FPS. Let''s connect!', 4.6, 50, '["Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('charlotte.moore836@outlook.com', 'password123', 'JadeCharlotte81', 'Charlotte Moore', 24, 'Pahokee', '33476', 'Warhammer', 'All Platforms', 'Local Pahokee player. Into Warhammer and Bird Watching. Always looking for chill groups!', 4.8, 55, '["Pro Gamer", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('savannah.gomez68@outlook.com', 'password123', 'PixelSavannah9', 'Savannah Gomez', 32, 'Palm Beach', '33480', 'Magic: The Gathering', 'PC & Console', 'Retired Magic: The Gathering tryhard, now just vibing. Live in Palm Beach, FL.', 4.6, 83, '["PBC Veteran", "Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('grace.kelly872@icloud.com', 'password123', 'PhantomMage624', 'Grace Kelly', 38, 'Boynton Beach', '33437', 'Stand-Up Paddleboarding', 'PlayStation', 'Retired Stand-Up Paddleboarding tryhard, now just vibing. Live in Boynton Beach, FL.', 4.3, 17, '["Tabletop King", "Early Bird", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lily.smith141@outlook.com', 'password123', 'xXLiMythXx', 'Lily Smith', 21, 'Boca Raton', '33496', 'Competitive FPS', 'Steam Deck', 'Boca Raton native. Love Competitive FPS, dabble in Fitness / General Workout. Let''s connect!', 4.7, 14, '["Early Bird", "Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.johnson811@icloud.com', 'password123', 'ToxicMatthew4', 'Matthew Johnson', 51, 'West Palm Beach', '33409', 'Fitness / General Workout', 'N/A', 'Casual Fitness / General Workout fan from West Palm Beach. Also enjoy Fitness / General Workout on weekends.', 4.5, 62, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('destiny.lopez188@icloud.com', 'password123', 'Blaze954504', 'Destiny Lopez', 38, 'Lake Park', '33403', 'MOBA', 'Nintendo Switch', 'Passionate about MOBA. Based in Lake Park, FL. Hit me up for games or meetups.', 4.6, 64, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('valentina.williams169@yahoo.com', 'password123', 'ValentinaWil64', 'Valentina Williams', 37, 'Palm Beach', '33480', 'Golf', 'N/A', 'Palm Beach native. Love Golf, dabble in Swimming. Let''s connect!', 5.0, 54, '["Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amanda.murphy625@icloud.com', 'password123', 'AmandaMur71', 'Amanda Murphy', 50, 'Manalapan', '33462', 'Party Games', 'Steam Deck', 'Manalapan native. Love Party Games, dabble in Deck Building. Let''s connect!', 4.9, 60, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('amanda.foster5@gmail.com', 'password123', 'GoldenAmanda52', 'Amanda Foster', 30, 'Boynton Beach', '33435', 'Social Deduction Games', 'Xbox', 'South FL local. Social Deduction Games enthusiast and weekend warrior. Boynton Beach represent!', 4.6, 53, '["PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('pedro.ramirez714@gmail.com', 'password123', 'xXPe239Xx', 'Pedro Ramirez', 41, 'Belle Glade', '33430', 'Magic: The Gathering', 'Nintendo Switch', 'Belle Glade native. Love Magic: The Gathering, dabble in Sandbox Games. Let''s connect!', 4.3, 30, '["Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bailey.coleman408@hotmail.com', 'password123', 'Azure321194', 'Bailey Coleman', 42, 'Boca Raton', '33496', 'Cooperative Board Games', 'N/A', 'Passionate about Cooperative Board Games. Based in Boca Raton, FL. Hit me up for games or meetups.', 4.2, 40, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('emma.sullivan834@yahoo.com', 'password123', 'RankedEmma27', 'Emma Sullivan', 40, 'Juno Beach', '33408', 'First-Person Shooters', 'PlayStation', 'Retired First-Person Shooters tryhard, now just vibing. Live in Juno Beach, FL.', 4.6, 24, '["Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('melissa.wilson181@outlook.com', 'password123', 'MelissaWil27', 'Melissa Wilson', 28, 'Manalapan', '33462', 'Strategy Games', 'Xbox', 'Retired Strategy Games tryhard, now just vibing. Live in Manalapan, FL.', 4.6, 12, '["PBC Veteran", "Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('wesley.stewart82@outlook.com', 'password123', 'HyperGamer284', 'Wesley Stewart', 28, 'Delray Beach', '33444', 'Board Games', 'N/A', 'Local Delray Beach player. Into Board Games and Swimming. Always looking for chill groups!', 4.5, 13, '["Tabletop King", "Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elena.gomez385@hotmail.com', 'password123', 'HackedElena63', 'Elena Gomez', 18, 'Lake Park', '33403', 'Puzzle Games', 'N/A', 'Local Lake Park player. Into Puzzle Games and Warhammer. Always looking for chill groups!', 2.6, 59, '["Pro Gamer"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('rebecca.kelly468@icloud.com', 'password123', 'RebeccaKel13', 'Rebecca Kelly', 18, 'Delray Beach', '33444', 'Bird Watching', 'N/A', 'New to the scene! Trying to find people who love Bird Watching in Delray Beach area.', 5.0, 76, '["Pro Gamer", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brenda.mitchell654@outlook.com', 'password123', 'RapidCaptain895', 'Brenda Mitchell', 18, 'Lake Worth Beach', '33460', 'Trading Card Games', 'N/A', 'Retired Trading Card Games tryhard, now just vibing. Live in Lake Worth Beach, FL.', 4.6, 44, '["Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('angel.thompson301@hotmail.com', 'password123', 'AngelTho28', 'Angel Thompson', 42, 'Delray Beach', '33444', 'Magic: The Gathering', 'N/A', 'New to the scene! Trying to find people who love Magic: The Gathering in Delray Beach area.', 4.7, 25, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('james.nelson679@hotmail.com', 'password123', 'JamesNel41', 'James Nelson', 48, 'Delray Beach', '33445', 'Biking / Cycling', 'N/A', 'South FL local. Biking / Cycling enthusiast and weekend warrior. Delray Beach represent!', 5.0, 59, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kylie.williams975@gmail.com', 'password123', 'KylieWil78', 'Kylie Williams', 48, 'Jupiter', '33458', 'Triathlon', 'Mobile', 'Passionate about Triathlon. Based in Jupiter, FL. Hit me up for games or meetups.', 4.5, 35, '["Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ethan.campbell960@yahoo.com', 'password123', 'RubyCaptain131', 'Ethan Campbell', 55, 'Greenacres', '33467', 'Puzzle Games', 'PC & Console', 'Casual Puzzle Games fan from Greenacres. Also enjoy Platformers on weekends.', 4.6, 35, '["Tournament Ready", "Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('emma.martinez873@icloud.com', 'password123', 'IronEmma38', 'Emma Martinez', 52, 'West Palm Beach', '33401', 'Trading Card Games', 'N/A', 'Local West Palm Beach player. Into Trading Card Games and Fitness / General Workout. Always looking for chill groups!', 4.6, 82, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('denise.johnson706@gmail.com', 'password123', 'CursedDenise91', 'Denise Johnson', 50, 'Palm Beach Gardens', '33418', 'Beach Activities', 'N/A', 'Casual Beach Activities fan from Palm Beach Gardens. Also enjoy Puzzle Games on weekends.', 4.5, 17, '["Friendly Host", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chris.kim745@icloud.com', 'password123', 'LuckyChris85', 'Chris Kim', 49, 'Boynton Beach', '33437', 'War Games', 'N/A', 'South FL local. War Games enthusiast and weekend warrior. Boynton Beach represent!', 4.5, 77, '["Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jordan.washington100@yahoo.com', 'password123', 'ToxicJordan75', 'Jordan Washington', 43, 'Palm Springs', '33461', 'Triathlon', 'Nintendo Switch', 'Local Palm Springs player. Into Triathlon and Soccer. Always looking for chill groups!', 4.5, 30, '["Early Bird", "Pro Gamer", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ricky.williams695@yahoo.com', 'password123', 'xXRiBladeXx', 'Ricky Williams', 24, 'Juno Beach', '33408', 'Tabletop RPG', 'Xbox', 'Retired Tabletop RPG tryhard, now just vibing. Live in Juno Beach, FL.', 4.4, 53, '["Pro Gamer", "Friendly Host", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('lily.barnes407@icloud.com', 'password123', 'SavageLily77', 'Lily Barnes', 33, 'Delray Beach', '33445', 'Hiking', 'PC', 'Passionate about Hiking. Based in Delray Beach, FL. Hit me up for games or meetups.', 4.5, 67, '["Friendly Host", "Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gabrielle.perez24@hotmail.com', 'password123', 'xXGaLegendXx', 'Gabrielle Perez', 32, 'Pahokee', '33476', 'Stand-Up Paddleboarding', 'N/A', 'Pahokee native. Love Stand-Up Paddleboarding, dabble in Running / Jogging. Let''s connect!', 4.5, 83, '["PBC Veteran", "Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('sophia.vasquez570@hotmail.com', 'password123', 'xXSoSlayerXx', 'Sophia Vasquez', 43, 'West Palm Beach', '33405', 'Fitness / General Workout', 'Xbox', 'New to the scene! Trying to find people who love Fitness / General Workout in West Palm Beach area.', 4.2, 8, '["Early Bird", "Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('nicole.collins589@yahoo.com', 'password123', 'NicoleCol21', 'Nicole Collins', 26, 'West Palm Beach', '33409', 'Simulation', 'Xbox', 'Local West Palm Beach player. Into Simulation and Horror Games. Always looking for chill groups!', 4.3, 65, '["PBC Veteran", "Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('logan.james927@outlook.com', 'password123', 'xXLoPlayerXx', 'Logan James', 51, 'West Palm Beach', '33409', 'Miniature Games', 'PC', 'South FL local. Miniature Games enthusiast and weekend warrior. West Palm Beach represent!', 4.5, 67, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kevin.cooper606@outlook.com', 'password123', 'FrostKevin94', 'Kevin Cooper', 31, 'Palm Springs', '33461', 'Party Games', 'N/A', 'Palm Springs native. Love Party Games, dabble in Weightlifting. Let''s connect!', 4.4, 45, '["Tabletop King", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('christian.garcia649@yahoo.com', 'password123', 'RubyChristian85', 'Christian Garcia', 35, 'Boca Raton', '33433', 'Adventure Games', 'Mobile', 'Passionate about Adventure Games. Based in Boca Raton, FL. Hit me up for games or meetups.', 4.3, 17, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('claudia.mitchell656@gmail.com', 'password123', 'ModdedClaudia43', 'Claudia Mitchell', 39, 'Boca Raton', '33433', 'Sports Games', 'PlayStation', 'South FL local. Sports Games enthusiast and weekend warrior. Boca Raton represent!', 4.5, 9, '["Early Bird", "Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('darryl.morales542@outlook.com', 'password123', 'JadeDarryl35', 'Darryl Morales', 24, 'Belle Glade', '33430', 'Eurogames', 'N/A', 'Retired Eurogames tryhard, now just vibing. Live in Belle Glade, FL.', 4.6, 27, '["Tournament Ready", "PBC Veteran", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('anthony.russell10@hotmail.com', 'password123', 'AnthonyRus94', 'Anthony Russell', 34, 'Delray Beach', '33446', 'Trading Card Games', 'All Platforms', 'Delray Beach native. Love Trading Card Games, dabble in War Games. Let''s connect!', 4.2, 39, '["Tournament Ready", "Tabletop King", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('wesley.lee294@outlook.com', 'password123', 'xXWePaladinXx', 'Wesley Lee', 50, 'Palm Beach', '33480', 'Tabletop RPG', 'Steam Deck', 'Palm Beach native. Love Tabletop RPG, dabble in Tennis. Let''s connect!', 4.8, 37, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('anthony.phillips715@gmail.com', 'password123', 'xXAnKnightXx', 'Anthony Phillips', 52, 'Pahokee', '33476', 'Softball', 'N/A', 'Casual Softball fan from Pahokee. Also enjoy Cooperative Board Games on weekends.', 4.6, 50, '["Early Bird", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('jasmine.bryant527@outlook.com', 'password123', 'SuperWitch389', 'Jasmine Bryant', 26, 'Royal Palm Beach', '33414', 'CrossFit', 'PC', 'Retired CrossFit tryhard, now just vibing. Live in Royal Palm Beach, FL.', 4.2, 60, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('kevin.jenkins958@icloud.com', 'password123', 'xXKeHunterXx', 'Kevin Jenkins', 20, 'Pahokee', '33476', 'Board Games', 'N/A', 'Local Pahokee player. Into Board Games and Softball. Always looking for chill groups!', 2.7, 24, '["Tournament Ready", "Tabletop King", "Early Bird"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('elijah.morris87@hotmail.com', 'password123', 'ElijahMor62', 'Elijah Morris', 30, 'Belle Glade', '33430', 'Tennis', 'N/A', 'South FL local. Tennis enthusiast and weekend warrior. Belle Glade represent!', 4.9, 13, '["Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('riley.morgan832@outlook.com', 'password123', 'Alpha420860', 'Riley Morgan', 52, 'Boynton Beach', '33437', 'Social Deduction Games', 'Mobile', 'Retired Social Deduction Games tryhard, now just vibing. Live in Boynton Beach, FL.', 4.6, 39, '["PBC Veteran", "Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('tiffany.wright165@yahoo.com', 'password123', 'xXTi420Xx', 'Tiffany Wright', 20, 'Greenacres', '33467', 'War Games', 'Xbox', 'Local Greenacres player. Into War Games and Social Deduction Games. Always looking for chill groups!', 4.4, 46, '["Friendly Host", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('gavin.cruz14@yahoo.com', 'password123', 'Epic561351', 'Gavin Cruz', 50, 'Royal Palm Beach', '33411', 'Tabletop RPG', 'N/A', 'Royal Palm Beach native. Love Tabletop RPG, dabble in War Games. Let''s connect!', 4.6, 17, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('logan.howard718@yahoo.com', 'password123', 'xXLoQueenXx', 'Logan Howard', 34, 'Delray Beach', '33445', 'RPG', 'PC', 'Delray Beach native. Love RPG, dabble in Yoga. Let''s connect!', 4.2, 48, '["Tournament Ready", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('valentina.anderson886@gmail.com', 'password123', 'xXVaShotgunXx', 'Valentina Anderson', 23, 'Lake Worth Beach', '33460', 'Board Games', 'N/A', 'Local Lake Worth Beach player. Into Board Games and Worker Placement. Always looking for chill groups!', 4.8, 34, '["PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.coleman288@outlook.com', 'password123', 'xXMoProXx', 'Morgan Coleman', 41, 'Jupiter', '33477', 'Indie Games', 'Steam Deck', 'Passionate about Indie Games. Based in Jupiter, FL. Hit me up for games or meetups.', 4.2, 72, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('victor.evans373@outlook.com', 'password123', 'StormVictor13', 'Victor Evans', 49, 'Jupiter', '33458', 'Horror Games', 'Mobile', 'Retired Horror Games tryhard, now just vibing. Live in Jupiter, FL.', 4.7, 71, '["Early Bird", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dominic.clark43@hotmail.com', 'password123', 'DominicCla34', 'Dominic Clark', 25, 'Delray Beach', '33446', 'Soccer', 'All Platforms', 'South FL local. Soccer enthusiast and weekend warrior. Delray Beach represent!', 4.6, 20, '["PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('courtney.king645@gmail.com', 'password123', 'xXCoSlayerXx', 'Courtney King', 46, 'Royal Palm Beach', '33414', 'Swimming', 'Nintendo Switch', 'New to the scene! Trying to find people who love Swimming in Royal Palm Beach area.', 4.4, 59, '["PBC Veteran", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassidy.ramirez449@hotmail.com', 'password123', 'xXCaClericXx', 'Cassidy Ramirez', 28, 'Boca Raton', '33433', 'Fighting Games', 'Nintendo Switch', 'Local Boca Raton player. Into Fighting Games and Fitness / General Workout. Always looking for chill groups!', 3.1, 15, '["Tabletop King", "PBC Veteran"]'::jsonb, true);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('brenda.nguyen266@outlook.com', 'password123', 'BrendaNgu47', 'Brenda Nguyen', 51, 'Pahokee', '33476', 'Sports Games', 'Xbox', 'South FL local. Sports Games enthusiast and weekend warrior. Pahokee represent!', 4.4, 41, '["Tabletop King"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('chris.taylor548@gmail.com', 'password123', 'SwiftChief648', 'Chris Taylor', 31, 'Wellington', '33449', 'Swimming', 'N/A', 'South FL local. Swimming enthusiast and weekend warrior. Wellington represent!', 4.5, 75, '["Tabletop King", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('olivia.brooks225@outlook.com', 'password123', 'OliviaBro42', 'Olivia Brooks', 40, 'West Palm Beach', '33401', 'Yoga', 'N/A', 'Casual Yoga fan from West Palm Beach. Also enjoy Hiking on weekends.', 4.4, 10, '["Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('zach.gonzalez209@hotmail.com', 'password123', 'xXZaMasterXx', 'Zach Gonzalez', 35, 'Greenacres', '33463', 'Dungeons & Dragons', 'Nintendo Switch', 'Greenacres native. Love Dungeons & Dragons, dabble in Deck Building. Let''s connect!', 4.3, 12, '["Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('maya.anderson907@yahoo.com', 'password123', 'xXMa007Xx', 'Maya Anderson', 28, 'Palm Beach Gardens', '33418', 'Deck Building', 'N/A', 'Passionate about Deck Building. Based in Palm Beach Gardens, FL. Hit me up for games or meetups.', 4.4, 56, '["PBC Veteran", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('bryan.cooper387@icloud.com', 'password123', 'Storm30514', 'Bryan Cooper', 24, 'West Palm Beach', '33401', 'War Games', 'PC & Console', 'Casual War Games fan from West Palm Beach. Also enjoy RPG on weekends.', 4.9, 81, '["Friendly Host", "PBC Veteran", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hannah.patterson836@yahoo.com', 'password123', 'PhantomHannah62', 'Hannah Patterson', 46, 'Juno Beach', '33408', 'Puzzle Games', 'Mobile', 'Retired Puzzle Games tryhard, now just vibing. Live in Juno Beach, FL.', 4.9, 37, '["Early Bird", "Pro Gamer", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('hector.adams233@icloud.com', 'password123', 'xXHeMasterXx', 'Hector Adams', 19, 'Wellington', '33414', 'Fitness / General Workout', 'N/A', 'Wellington native. Love Fitness / General Workout, dabble in Triathlon. Let''s connect!', 4.2, 37, '["Tournament Ready", "Early Bird"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('ethan.gonzalez366@gmail.com', 'password123', 'StormEthan47', 'Ethan Gonzalez', 36, 'Delray Beach', '33444', 'Cooperative Board Games', 'N/A', 'Delray Beach native. Love Cooperative Board Games, dabble in Dungeons & Dragons. Let''s connect!', 4.9, 14, '["Friendly Host", "Pro Gamer"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('morgan.smith897@gmail.com', 'password123', 'ModdedMorgan64', 'Morgan Smith', 40, 'Palm Beach Gardens', '33410', 'MMORPG', 'PlayStation', 'Retired MMORPG tryhard, now just vibing. Live in Palm Beach Gardens, FL.', 4.4, 17, '["Tournament Ready", "Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('matthew.cox131@yahoo.com', 'password123', 'xXMaChiefXx', 'Matthew Cox', 38, 'Boca Raton', '33496', 'War Games', 'N/A', 'New to the scene! Trying to find people who love War Games in Boca Raton area.', 4.8, 52, '["Pro Gamer", "Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('cassidy.richardson86@hotmail.com', 'password123', 'xXCaPaladinXx', 'Cassidy Richardson', 42, 'Wellington', '33414', 'Strategy Games', 'Steam Deck', 'Local Wellington player. Into Strategy Games and Eurogames. Always looking for chill groups!', 4.3, 23, '["Tournament Ready", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('pedro.lewis472@yahoo.com', 'password123', 'xXPeProXx', 'Pedro Lewis', 36, 'Delray Beach', '33446', 'First-Person Shooters', 'PlayStation', 'Passionate about First-Person Shooters. Based in Delray Beach, FL. Hit me up for games or meetups.', 4.4, 32, '["Tabletop King", "PBC Veteran"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('anthony.reyes151@outlook.com', 'password123', 'AnthonyRey20', 'Anthony Reyes', 19, 'Boynton Beach', '33436', 'Deck Building', 'Steam Deck', 'Always down for Deck Building sessions. Boynton Beach-based. Message me anytime!', 4.3, 19, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('zach.okafor114@yahoo.com', 'password123', 'Fixed6933', 'Zach Okafor', 36, 'West Palm Beach', '33401', 'Miniature Games', 'N/A', 'South FL local. Miniature Games enthusiast and weekend warrior. West Palm Beach represent!', 5.0, 77, '["Friendly Host"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('dakota.price434@yahoo.com', 'password123', 'CyberDakota67', 'Dakota Price', 32, 'Palm Beach Gardens', '33418', 'Fighting Games', 'Steam Deck', 'Retired Fighting Games tryhard, now just vibing. Live in Palm Beach Gardens, FL.', 4.4, 85, '["PBC Veteran", "Tabletop King", "Tournament Ready"]'::jsonb, false);
END $$;
DO $$
DECLARE u_id uuid; BEGIN
  u_id := create_rollcall_prod_user('santiago.diaz663@icloud.com', 'password123', 'SantiagoDia44', 'Santiago Diaz', 41, 'Boca Raton', '33431', 'Magic: The Gathering', 'PlayStation', 'Local Boca Raton player. Into Magic: The Gathering and Open World. Always looking for chill groups!', 4.8, 67, '["Friendly Host"]'::jsonb, false);
END $$;

-- GENERATING 60+ GROUPS
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Warzone 2.0 PBC', 'FPS Gaming', 'Lake Worth', 'Join the Warzone 2.0 PBC community in Lake Worth. Open for all residents.', 8, 1, 'Competitive', ARRAY[26.7276, -80.1091], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Valorant WPB Hub', 'FPS Gaming', 'Jupiter', 'Join the Valorant WPB Hub community in Jupiter. Open for all residents.', 8, 1, 'Competitive', ARRAY[26.3506, -80.1149], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Apex Legends Squads', 'FPS Gaming', 'Delray Beach', 'Join the Apex Legends Squads community in Delray Beach. Open for all residents.', 8, 1, 'Intermediate', ARRAY[26.3903, -80.0008], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('LoL Florida West', 'FPS Gaming', 'Jupiter', 'Join the LoL Florida West community in Jupiter. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.4012, -80.1834], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Fortnite Zero Build', 'FPS Gaming', 'Lake Worth', 'Join the Fortnite Zero Build community in Lake Worth. Open for all residents.', 8, 1, 'Casual', ARRAY[26.5268, -80.1088], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Minecraft Survival', 'FPS Gaming', 'Palm Beach Gardens', 'Join the Minecraft Survival community in Palm Beach Gardens. Open for all residents.', 12, 1, 'Intermediate', ARRAY[26.5625, -80.0118], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Roblox Dev Group', 'FPS Gaming', 'Wellington', 'Join the Roblox Dev Group community in Wellington. Open for all residents.', 20, 1, 'Pro', ARRAY[26.4099, -80.1798], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('CS:GO Veterans', 'FPS Gaming', 'Lake Worth', 'Join the CS:GO Veterans community in Lake Worth. Open for all residents.', 50, 1, 'Casual', ARRAY[26.6167, -80.0659], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Overwatch 2 Mains', 'FPS Gaming', 'Delray Beach', 'Join the Overwatch 2 Mains community in Delray Beach. Open for all residents.', 20, 1, 'Intermediate', ARRAY[26.7572, -80.082], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('FIFA 24 Pro Clubs', 'FPS Gaming', 'Delray Beach', 'Join the FIFA 24 Pro Clubs community in Delray Beach. Open for all residents.', 12, 1, 'Intermediate', ARRAY[26.7279, -80.0425], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Madden 24 PBC League', 'FPS Gaming', 'Boca Raton', 'Join the Madden 24 PBC League community in Boca Raton. Open for all residents.', 50, 1, 'Intermediate', ARRAY[26.6105, -80.0009], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('NBA 2K24 Parks', 'FPS Gaming', 'Jupiter', 'Join the NBA 2K24 Parks community in Jupiter. Open for all residents.', 20, 1, 'Pro', ARRAY[26.7316, -80.0487], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Street Fighter 6', 'FPS Gaming', 'West Palm Beach', 'Join the Street Fighter 6 community in West Palm Beach. Open for all residents.', 20, 1, 'Competitive', ARRAY[26.5694, -80.1538], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Tekken 8 Dojo', 'FPS Gaming', 'Jupiter', 'Join the Tekken 8 Dojo community in Jupiter. Open for all residents.', 8, 1, 'Intermediate', ARRAY[26.5793, -80.1204], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('MK1 Tournament Hub', 'FPS Gaming', 'Delray Beach', 'Join the MK1 Tournament Hub community in Delray Beach. Open for all residents.', 12, 1, 'Intermediate', ARRAY[26.6927, -80.0741], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Elden Ring Co-op', 'FPS Gaming', 'Lake Worth', 'Join the Elden Ring Co-op community in Lake Worth. Open for all residents.', 20, 1, 'Intermediate', ARRAY[26.3923, -80.1013], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Baldur's Gate 3 Party', 'FPS Gaming', 'Lake Worth', 'Join the Baldur's Gate 3 Party community in Lake Worth. Open for all residents.', 50, 1, 'Intermediate', ARRAY[26.3932, -80.1563], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Helldivers 2 PBC', 'FPS Gaming', 'West Palm Beach', 'Join the Helldivers 2 PBC community in West Palm Beach. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.8993, -80.0062], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Palworld Builders', 'FPS Gaming', 'Wellington', 'Join the Palworld Builders community in Wellington. Open for all residents.', 12, 1, 'Intermediate', ARRAY[26.3749, -80.1034], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Destiny 2 Raids', 'FPS Gaming', 'Lake Worth', 'Join the Destiny 2 Raids community in Lake Worth. Open for all residents.', 8, 1, 'Casual', ARRAY[26.3042, -80.1725], 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('StarCraft BW Masters', 'FPS Gaming', 'West Palm Beach', 'Join the StarCraft BW Masters community in West Palm Beach. Open for all residents.', 50, 1, 'Pro', ARRAY[26.4242, -80.1429], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Diablo II Resurrected', 'FPS Gaming', 'Wellington', 'Join the Diablo II Resurrected community in Wellington. Open for all residents.', 12, 1, 'Casual', ARRAY[26.4916, -80.1298], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Quake III Arena', 'FPS Gaming', 'Jupiter', 'Join the Quake III Arena community in Jupiter. Open for all residents.', 50, 1, 'Intermediate', ARRAY[26.5602, -80.0847], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Age of Empires II', 'FPS Gaming', 'Jupiter', 'Join the Age of Empires II community in Jupiter. Open for all residents.', 50, 1, 'Casual', ARRAY[26.5258, -80.0118], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Smash Melee PBC', 'FPS Gaming', 'Jupiter', 'Join the Smash Melee PBC community in Jupiter. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.7074, -80.1139], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Halo 3 Customs', 'FPS Gaming', 'Delray Beach', 'Join the Halo 3 Customs community in Delray Beach. Open for all residents.', 20, 1, 'Intermediate', ARRAY[26.4901, -80.196], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('WOW Classic Guild', 'FPS Gaming', 'Wellington', 'Join the WOW Classic Guild community in Wellington. Open for all residents.', 8, 1, 'Competitive', ARRAY[26.4933, -80.0332], 'https://images.unsplash.com/photo-1550745679-562174279c27?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('D&D 5e PBC', 'Dungeons & Dragons', 'Palm Beach Gardens', 'Join the D&D 5e PBC community in Palm Beach Gardens. Open for all residents.', 12, 1, 'Pro', ARRAY[26.5676, -80.0326], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Pathfinder 2e Society', 'Dungeons & Dragons', 'Delray Beach', 'Join the Pathfinder 2e Society community in Delray Beach. Open for all residents.', 20, 1, 'Pro', ARRAY[26.5545, -80.1981], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Warhammer 40k WPB', 'Dungeons & Dragons', 'Jupiter', 'Join the Warhammer 40k WPB community in Jupiter. Open for all residents.', 50, 1, 'Intermediate', ARRAY[26.819, -80.1429], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Catan Nights', 'Dungeons & Dragons', 'West Palm Beach', 'Join the Catan Nights community in West Palm Beach. Open for all residents.', 50, 1, 'Pro', ARRAY[26.6509, -80.1422], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Ticket to Ride', 'Dungeons & Dragons', 'West Palm Beach', 'Join the Ticket to Ride community in West Palm Beach. Open for all residents.', 20, 1, 'Casual', ARRAY[26.8989, -80.1425], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Pandemic Squad', 'Dungeons & Dragons', 'Wellington', 'Join the Pandemic Squad community in Wellington. Open for all residents.', 50, 1, 'Competitive', ARRAY[26.8723, -80.1927], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Terraforming Mars', 'Dungeons & Dragons', 'Palm Beach Gardens', 'Join the Terraforming Mars community in Palm Beach Gardens. Open for all residents.', 12, 1, 'Casual', ARRAY[26.5426, -80.1451], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Gloomhaven Party', 'Dungeons & Dragons', 'Delray Beach', 'Join the Gloomhaven Party community in Delray Beach. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.7049, -80.1992], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Scythe PBC', 'Dungeons & Dragons', 'Jupiter', 'Join the Scythe PBC community in Jupiter. Open for all residents.', 50, 1, 'Intermediate', ARRAY[26.8965, -80.0718], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('7 Wonders Club', 'Dungeons & Dragons', 'Palm Beach Gardens', 'Join the 7 Wonders Club community in Palm Beach Gardens. Open for all residents.', 8, 1, 'Intermediate', ARRAY[26.4637, -80.0264], 'https://images.unsplash.com/photo-1611996591638-8055c06d152f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('MTG Commander PBC', 'Board Games', 'Wellington', 'Join the MTG Commander PBC community in Wellington. Open for all residents.', 50, 1, 'Pro', ARRAY[26.5268, -80.1095], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Poker WPB High Stakes', 'Board Games', 'Delray Beach', 'Join the Poker WPB High Stakes community in Delray Beach. Open for all residents.', 50, 1, 'Pro', ARRAY[26.8517, -80.1677], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Bridge Masters', 'Board Games', 'Boca Raton', 'Join the Bridge Masters community in Boca Raton. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.555, -80.163], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Euchre Club', 'Board Games', 'Jupiter', 'Join the Euchre Club community in Jupiter. Open for all residents.', 20, 1, 'Intermediate', ARRAY[26.3036, -80.08], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Hearthstone Local', 'Board Games', 'Wellington', 'Join the Hearthstone Local community in Wellington. Open for all residents.', 20, 1, 'Intermediate', ARRAY[26.4754, -80.1515], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Pokemon TCG Hub', 'Board Games', 'Jupiter', 'Join the Pokemon TCG Hub community in Jupiter. Open for all residents.', 50, 1, 'Competitive', ARRAY[26.8238, -80.001], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Yu-Gi-Oh PBC', 'Board Games', 'Jupiter', 'Join the Yu-Gi-Oh PBC community in Jupiter. Open for all residents.', 8, 1, 'Casual', ARRAY[26.4744, -80.1878], 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Pickleball Lake Worth', 'Soccer', 'Palm Beach Gardens', 'Join the Pickleball Lake Worth community in Palm Beach Gardens. Open for all residents.', 12, 1, 'Intermediate', ARRAY[26.7061, -80.0399], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Soccer WPB League', 'Soccer', 'Lake Worth', 'Join the Soccer WPB League community in Lake Worth. Open for all residents.', 12, 1, 'Pro', ARRAY[26.4028, -80.1184], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Tennis PBC Open', 'Soccer', 'Delray Beach', 'Join the Tennis PBC Open community in Delray Beach. Open for all residents.', 20, 1, 'Competitive', ARRAY[26.5079, -80.0832], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Basketball Courts', 'Soccer', 'West Palm Beach', 'Join the Basketball Courts community in West Palm Beach. Open for all residents.', 50, 1, 'Pro', ARRAY[26.6395, -80.0033], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Golf PBC Society', 'Soccer', 'Lake Worth', 'Join the Golf PBC Society community in Lake Worth. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.8018, -80.0511], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Volleyball Beach Hub', 'Soccer', 'Wellington', 'Join the Volleyball Beach Hub community in Wellington. Open for all residents.', 50, 1, 'Intermediate', ARRAY[26.8262, -80.1911], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Running PBC', 'Soccer', 'Wellington', 'Join the Running PBC community in Wellington. Open for all residents.', 50, 1, 'Casual', ARRAY[26.6811, -80.0218], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Cycling WPB', 'Soccer', 'Delray Beach', 'Join the Cycling WPB community in Delray Beach. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.356, -80.1959], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Swimming PBC', 'Soccer', 'Boca Raton', 'Join the Swimming PBC community in Boca Raton. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.346, -80.0373], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Padel Club', 'Soccer', 'Boca Raton', 'Join the Padel Club community in Boca Raton. Open for all residents.', 12, 1, 'Intermediate', ARRAY[26.8558, -80.0453], 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Photography WPB', 'Other', 'Palm Beach Gardens', 'Join the Photography WPB community in Palm Beach Gardens. Open for all residents.', 20, 1, 'Competitive', ARRAY[26.8091, -80.1522], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Bird Watching Everglades', 'Other', 'Palm Beach Gardens', 'Join the Bird Watching Everglades community in Palm Beach Gardens. Open for all residents.', 50, 1, 'Competitive', ARRAY[26.8322, -80.1867], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Digital Painting', 'Other', 'Boca Raton', 'Join the Digital Painting community in Boca Raton. Open for all residents.', 50, 1, 'Casual', ARRAY[26.768, -80.0327], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Pottery PBC', 'Other', 'West Palm Beach', 'Join the Pottery PBC community in West Palm Beach. Open for all residents.', 8, 1, 'Pro', ARRAY[26.7598, -80.154], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Urban Sketching', 'Other', 'Palm Beach Gardens', 'Join the Urban Sketching community in Palm Beach Gardens. Open for all residents.', 50, 1, 'Competitive', ARRAY[26.6462, -80.1882], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Gardening PBC', 'Other', 'Wellington', 'Join the Gardening PBC community in Wellington. Open for all residents.', 12, 1, 'Competitive', ARRAY[26.3693, -80.1733], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Cooking Class', 'Other', 'Palm Beach Gardens', 'Join the Cooking Class community in Palm Beach Gardens. Open for all residents.', 20, 1, 'Pro', ARRAY[26.8219, -80.0483], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Hiking Florida Trails', 'Other', 'Jupiter', 'Join the Hiking Florida Trails community in Jupiter. Open for all residents.', 20, 1, 'Competitive', ARRAY[26.5306, -80.1649], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');
INSERT INTO public.groups (name, category, city, description, capacity, members, skill, coords, image) VALUES ('Surfing WPB', 'Other', 'Delray Beach', 'Join the Surfing WPB community in Delray Beach. Open for all residents.', 8, 1, 'Competitive', ARRAY[26.4995, -80.1264], 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800');

-- RANDOMIZING 500 USERS INTO MEMBERSHIPS

DO $$
DECLARE
    u RECORD;
    g RECORD;
    membership_count int;
BEGIN
    FOR u IN SELECT id FROM public.profiles LOOP
        -- Join 2 to 5 random groups
        FOR g IN (SELECT id FROM public.groups ORDER BY random() LIMIT (random()*3 + 2)::int) LOOP
            -- Check if already member
            IF NOT EXISTS (SELECT 1 FROM public.memberships WHERE user_id = u.id AND group_id = g.id) THEN
                INSERT INTO public.memberships (user_id, group_id) VALUES (u.id, g.id);
                -- Update member count
                UPDATE public.groups SET members = members + 1 WHERE id = g.id;
            END IF;
        END LOOP;
    END LOOP;
END $$;

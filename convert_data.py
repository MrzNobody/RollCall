import pandas as pd
import json
import random

# Load the demo data
df = pd.read_excel('RollCall_Demo_Data.xlsx', header=None)
data_rows = df.iloc[2:102].fillna('') 

# Start with the Table setup (Auto-Migration + Constraint Removal)
sql = """-- 1. UNHOOK THE DATABASE GATEKEEPER (Allows profiles without auth accounts for demo)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. STAGE THE TABLE (Add missing columns if needed)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.00;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT false;

-- 3. INJECT REAL PERSONAS
INSERT INTO profiles (id, username, full_name, website, avatar_url, rating, review_count, badges, is_flagged) VALUES 
"""

vals = []
badges_pool = ['active', 'reliable', 'super_host', 'pbc_veteran', 'always_early', 'community_champion']

for i, row in enumerate(data_rows.values):
    fname = str(row[1]).strip() or 'Unknown User'
    uname = str(row[2]).strip().lower().replace(' ', '_') or f'user_{i}'
    city = str(row[6]).strip() or 'Palm Beach County'
    
    # AI Simulation for demographic variety
    rating = round(random.uniform(4.5, 5.0), 2) # Making everyone look good for the pilot
    review_count = random.randint(10, 60)
    
    # 2% Flagging logic
    is_evil = (i % 50 == 0)
    flagged = 'true' if is_evil else 'false'
    if is_evil:
        rating = 2.40 
    
    badges = random.sample(badges_pool, k=random.randint(0, 2))
    avatar = f'https://api.dicebear.com/7.x/avataaars/svg?seed={uname}'
    
    line = f"(gen_random_uuid(), '{uname}', '{fname}', '{city}', '{avatar}', {rating}, {review_count}, '{json.dumps(badges)}', {flagged})"
    vals.append(line)

sql += ',\n'.join(vals) + ';'

with open('inject_demo_data.sql', 'w') as f:
    f.write(sql)

print(f"DONE: Generated inject_demo_data.sql. Constraint removal included.")

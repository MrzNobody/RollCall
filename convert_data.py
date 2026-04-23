import pandas as pd
import random

# Load the full demo data
df = pd.read_excel('RollCall_Demo_Data.xlsx', header=None)
data_rows = df.iloc[2:502].fillna('') # Grabbing all 500 users

sql = "-- RollCall Production Account Sync (500 Users)\n"
sql += "-- NOTE: Ensure you have run the 'create_real_rollcall_user' function first!\n\n"

vals = []

for i, row in enumerate(data_rows.values):
    fname = str(row[1]).strip() or 'Anonymous'
    u_handle = str(row[2]).strip().lower().replace(' ', '_') or f'user_{i}'
    u_email = str(row[3]).strip() or f'{u_handle}@example.com'
    u_pass = str(row[4]).strip() or 'RollCall2026!'
    
    # We call our new SQL function for each user
    line = f"SELECT create_real_rollcall_user('{u_email}', '{u_pass}', '{u_handle}', '{fname}');"
    vals.append(line)

sql += '\n'.join(vals)

with open('production_auth_sync.sql', 'w') as f:
    f.write(sql)

print(f"DONE: Generated production_auth_sync.sql with 500 REAL login accounts.")

import zipfile
import xml.etree.ElementTree as ET
import csv
import os

# XLSX is just a ZIP of XML files
xlsx_path = 'RollCall_Demo_Data.xlsx'
output_csv = 'production_users_import.csv'

try:
    with zipfile.ZipFile(xlsx_path, 'r') as zip_ref:
        # 1. Get Shared Strings (where the text is stored)
        strings_xml = zip_ref.read('xl/sharedStrings.xml')
        strings_root = ET.fromstring(strings_xml)
        # Handle namespaces
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        shared_strings = [node.text for node in strings_root.findall('.//ns:t', ns)]

        # 2. Get Sheet Data
        sheet_xml = zip_ref.read('xl/worksheets/sheet1.xml')
        sheet_root = ET.fromstring(sheet_xml)
        
        rows = []
        for row_node in sheet_root.findall('.//ns:row', ns):
            cells = []
            for cell_node in row_node.findall('.//ns:c', ns):
                # 't="s"' means it's an index into shared strings
                if cell_node.get('t') == 's':
                    val_node = cell_node.find('.//ns:v', ns)
                    if val_node is not None:
                        cells.append(shared_strings[int(val_node.text)])
                    else:
                        cells.append("")
                else:
                    val_node = cell_node.find('.//ns:v', ns)
                    cells.append(val_node.text if val_node is not None else "")
            rows.append(cells)

    # 3. Write to CSV
    with open(output_csv, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['email', 'password']) # Headers
        
        # Start from row 3 (Index 2)
        for r in rows[2:502]:
            if len(r) >= 4:
                # Column Index: B=1 (Name), C=2 (Handle), D=3 (Email), E=4 (Password)
                email = str(r[3]).strip()
                password = str(r[4]).strip()
                if email and '@' in email:
                    writer.writerow([email, password])

    print(f"SUCCESS: '{output_csv}' created with the users from your Excel.")

except Exception as e:
    print(f"ERROR: {str(e)}")

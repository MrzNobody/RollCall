import XLSX from 'xlsx';
import path from 'path';

const excelPath = './RollCall_Demo_Data.xlsx';
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('--- EXCEL DATA PREVIEW ---');
console.log(JSON.stringify(data.slice(0, 3), null, 2));
console.log('--- TOTAL ROWS:', data.length);

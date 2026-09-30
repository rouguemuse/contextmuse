import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/comprehensive_audit_data.json', 'utf8'));
console.log('INNCONTROL IMAGES:');
console.table(data.inncontrolImages);

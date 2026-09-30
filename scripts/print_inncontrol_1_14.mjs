import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/comprehensive_audit_data.json', 'utf8'));
data.inncontrolImages.slice(0, 14).forEach((img, i) => {
  console.log(`[${i+1}] Page: ${img.page} | Src: ${img.src} | Alt: ${img.alt} | Exists: ${img.exists}`);
});

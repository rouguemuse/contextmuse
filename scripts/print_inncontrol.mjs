import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/comprehensive_audit_data.json', 'utf8'));
data.inncontrolImages.forEach((img, i) => {
  console.log(`[${i+1}] Page: ${img.page}`);
  console.log(`    Src: ${img.src}`);
  console.log(`    Alt: ${img.alt}`);
  console.log(`    Context: ${img.context}`);
  console.log(`    Exists: ${img.exists}`);
});

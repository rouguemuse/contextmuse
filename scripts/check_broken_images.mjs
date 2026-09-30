import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/comprehensive_audit_data.json', 'utf8'));
const broken = data.images.filter(img => !img.exists && img.src && !img.src.startsWith('data:'));
console.log(`Found ${broken.length} broken / missing images:`);
broken.forEach((b, i) => {
  console.log(`[${i+1}] Page: ${b.page}`);
  console.log(`    Src: ${b.src}`);
  console.log(`    Alt: ${b.alt}`);
  console.log(`    Context: ${b.context}`);
});

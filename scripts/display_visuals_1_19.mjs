import fs from 'fs';
const data = JSON.parse(fs.readFileSync('scratch/visual_audit_raw.json', 'utf8'));
data.slice(0, 19).forEach((item, idx) => {
  console.log(`[#${idx+1}] Page: ${item.page}`);
  console.log(`     Claimed: ${item.claimedProject}`);
  console.log(`     File:    ${item.src}`);
  console.log(`     Alt:     ${item.alt}`);
  console.log('---');
});

import fs from 'fs';
const auditData = JSON.parse(fs.readFileSync('scratch/comprehensive_audit_data.json', 'utf8'));

console.log('=== H1 HEADING AUDIT ===');
auditData.routes.forEach(r => {
  if (r.relPath.includes('backup') || r.relPath.includes('scratch') || r.relPath.includes('partials')) return;
  if (r.h1s.length !== 1) {
    console.log(`[ISSUE] ${r.relPath}: Found ${r.h1s.length} <h1> tags! (${r.h1s.join(' | ')})`);
  }
});

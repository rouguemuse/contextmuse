const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (['node_modules', '.git', '.vercel', 'dist', 'build', '.tempmediaStorage'].includes(file)) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.html') || file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('.');
const formDetails = [];
const mailtoDetails = [];
const phoneDetails = [];

for (const file of files) {
  if (file.includes('backup') || file.includes('scratch') || file.includes('scripts' + path.sep)) continue;
  const content = fs.readFileSync(file, 'utf8');
  
  // Forms
  const formRegex = /<form([\s\S]*?)>([\s\S]*?)<\/form>/gi;
  let match;
  while ((match = formRegex.exec(content)) !== null) {
    const attrs = match[1];
    const body = match[2];
    const actionMatch = attrs.match(/action=["']([^"']*)["']/i);
    const methodMatch = attrs.match(/method=["']([^"']*)["']/i);
    const idMatch = attrs.match(/id=["']([^"']*)["']/i);
    const classMatch = attrs.match(/class=["']([^"']*)["']/i);
    
    // Inputs
    const inputMatches = [...body.matchAll(/<(?:input|textarea|select)[^>]*name=["']([^"']*)["'][^>]*>/gi)].map(m => m[1]);
    
    // Buttons
    const buttons = [...body.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

    formDetails.push({
      file: file.replace(/\\/g, '/'),
      id: idMatch ? idMatch[1] : '(none)',
      class: classMatch ? classMatch[1] : '(none)',
      action: actionMatch ? actionMatch[1] : '(none)',
      method: methodMatch ? methodMatch[1].toUpperCase() : 'GET',
      inputs: inputMatches,
      buttons
    });
  }

  // mailto
  const mailtoMatch = [...content.matchAll(/href=["'](mailto:[^"']+)["']/gi)].map(m => m[1]);
  if (mailtoMatch.length > 0) {
    mailtoDetails.push({ file: file.replace(/\\/g, '/'), emails: [...new Set(mailtoMatch)] });
  }

  // wa.me / tel
  const phoneMatch = [...content.matchAll(/href=["']((?:tel:|https:\/\/wa\.me)[^"']+)["']/gi)].map(m => m[1]);
  if (phoneMatch.length > 0) {
    phoneDetails.push({ file: file.replace(/\\/g, '/'), phones: [...new Set(phoneMatch)] });
  }
}

console.log('=== FORMS FOUND (' + formDetails.length + ') ===');
console.log(JSON.stringify(formDetails, null, 2));

console.log('\n=== MAILTO FOUND (' + mailtoDetails.length + ' files) ===');
console.log(JSON.stringify(mailtoDetails, null, 2));

console.log('\n=== PHONES / WHATSAPP FOUND (' + phoneDetails.length + ' files) ===');
console.log(JSON.stringify(phoneDetails, null, 2));

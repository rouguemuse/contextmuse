const fs = require('fs');
const content = fs.readFileSync('signal/demo/index.html', 'utf8');
const lines = content.split('\n');

const terms = ['causal', 'directly produces', 'walkouts', 'anonymized', 'synthetic', 'priority 01', 'priority 02', 'priority 03'];
terms.forEach(t => {
  lines.forEach((l, i) => {
    if (l.toLowerCase().includes(t)) {
      console.log(`${t} (L${i+1}): ${l.trim().slice(0, 120)}`);
    }
  });
});

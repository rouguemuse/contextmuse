const fs = require('fs');
const path = require('path');

// 1. Update custom/index.html
{
  const file = 'custom/index.html';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<title>.*?<\/title>/,
    '<title>Custom Operations Systems &amp; Bespoke Software | Context &amp; Muse</title>'
  );
  content = content.replace(
    /<meta name="description" content=".*?">/,
    '<meta name="description" content="Customer-facing websites paired with bespoke operational machinery underneath—intake, inventory, scheduling, recommendations, and field service workflows.">'
  );
  content = content.replace(
    /<meta property="og:title" content=".*?">/,
    '<meta property="og:title" content="Custom Operations Systems &amp; Bespoke Software | Context &amp; Muse">'
  );
  content = content.replace(
    /<meta property="og:description" content=".*?">/,
    '<meta property="og:description" content="Customer-facing websites paired with bespoke operational machinery underneath—intake, inventory, scheduling, recommendations, and field service workflows.">'
  );
  content = content.replace(
    /<meta name="twitter:title" content=".*?">/,
    '<meta name="twitter:title" content="Custom Operations Systems &amp; Bespoke Software | Context &amp; Muse">'
  );
  content = content.replace(
    /<meta name="twitter:description" content=".*?">/,
    '<meta name="twitter:description" content="Customer-facing websites paired with bespoke operational machinery underneath—intake, inventory, scheduling, recommendations, and field service workflows.">'
  );
  content = content.replace(
    'Systems built around the way your business actually works.',
    'Custom Operations Systems built around how your business actually runs.'
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated custom/index.html');
}

// 2. Update systems/index.html
{
  const file = 'systems/index.html';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<title>.*?<\/title>/,
    '<title>Systems Architecture &amp; Engineering Standards | Context &amp; Muse</title>'
  );
  content = content.replace(
    /<meta name="description" content=".*?">/,
    '<meta name="description" content="Full-stack web architecture, deterministic workflows, performance engineering, and reliable database integrations for commercial business systems.">'
  );
  content = content.replace(
    /<meta property="og:title" content=".*?">/,
    '<meta property="og:title" content="Systems Architecture &amp; Engineering Standards | Context &amp; Muse">'
  );
  content = content.replace(
    /<meta property="og:description" content=".*?">/,
    '<meta property="og:description" content="Full-stack web architecture, deterministic workflows, performance engineering, and reliable database integrations for commercial business systems.">'
  );
  content = content.replace(
    /<meta name="twitter:title" content=".*?">/,
    '<meta name="twitter:title" content="Systems Architecture &amp; Engineering Standards | Context &amp; Muse">'
  );
  content = content.replace(
    /<meta name="twitter:description" content=".*?">/,
    '<meta name="twitter:description" content="Full-stack web architecture, deterministic workflows, performance engineering, and reliable database integrations for commercial business systems.">'
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated systems/index.html');
}

// 3. Update quick-launch/index.html
{
  const file = 'quick-launch/index.html';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<title>.*?<\/title>/,
    '<title>Quick-Launch Web Systems · Rapid Production Sprints | Context &amp; Muse</title>'
  );
  content = content.replace(
    /<meta name="description" content=".*?">/,
    '<meta name="description" content="Clean, custom-built business websites without unnecessary technical baggage or maintenance headaches. Defined scope, fixed pricing, and rapid delivery.">'
  );
  content = content.replace(
    /<meta property="og:title" content=".*?">/,
    '<meta property="og:title" content="Quick-Launch Web Systems · Rapid Production Sprints | Context &amp; Muse">'
  );
  content = content.replace(
    /<meta property="og:description" content=".*?">/,
    '<meta property="og:description" content="Clean, custom-built business websites without unnecessary technical baggage or maintenance headaches. Defined scope, fixed pricing, and rapid delivery.">'
  );
  content = content.replace(
    /<meta name="twitter:title" content=".*?">/,
    '<meta name="twitter:title" content="Quick-Launch Web Systems · Rapid Production Sprints | Context &amp; Muse">'
  );
  content = content.replace(
    /<meta name="twitter:description" content=".*?">/,
    '<meta name="twitter:description" content="Clean, custom-built business websites without unnecessary technical baggage or maintenance headaches. Defined scope, fixed pricing, and rapid delivery.">'
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated quick-launch/index.html');
}

// 4. Update work/website-audit-system/index.html
{
  const file = 'work/website-audit-system/index.html';
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /<meta name="description" content="Case study on Context & Muse">/,
    '<meta name="description" content="Case study on Context &amp; Muse Website Audit System: automated visual capture, multi-viewport layout validation, and verifiable evidence generation for commercial sites.">'
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated work/website-audit-system/index.html');
}

// 5. Update gensort/index.html (add Twitter Card)
{
  const file = 'gensort/index.html';
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('name="twitter:card"')) {
    const tw = `
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="GenSort | Visual &amp; Digital Asset Organization">
    <meta name="twitter:description" content="GenSort turns messy collections of visual and digital assets into searchable, comparable, structured libraries without forcing you to reorganize everything by hand.">
    <meta name="twitter:image" content="https://www.contextmuse.com/assets/images/gensort_comparison.png">
`;
    content = content.replace('</head>', tw + '</head>');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated gensort/index.html');
  }
}

console.log('Core metadata improvements applied successfully.');

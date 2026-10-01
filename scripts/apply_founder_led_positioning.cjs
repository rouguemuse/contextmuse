// scripts/apply_founder_led_positioning.cjs
const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  let count = 0;
  for (const { search, replace } of replacements) {
    if (typeof search === 'string') {
      if (content.includes(search)) {
        content = content.replace(search, replace);
        count++;
      } else {
        console.warn(`[WARN] Could not find string in ${filePath}:`, search.substring(0, 60));
      }
    } else if (search instanceof RegExp) {
      if (search.test(content)) {
        content = content.replace(search, replace);
        count++;
      } else {
        console.warn(`[WARN] Regex did not match in ${filePath}:`, search);
      }
    }
  }
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Applied ${count}/${replacements.length} replacements to ${filePath}`);
}

// 1. services/index.html
replaceInFile('services/index.html', [
  {
    search: '"name": "Commercial Studio Services",',
    replace: '"name": "Founder-Led Systems Services",'
  },
  {
    search: '"description": "Conversion audits, funnel sprints, custom business tools, and agency white-label production partnerships."',
    replace: '"description": "Founder-led business systems diagnostic, custom quote and lead engines, operational workflow tools, and direct software engineering by Jayme Volstad."'
  },
  {
    search: '<span class="services-hero-eyebrow">APPLIED SYSTEMS STUDIO &bull; WAYS TO WORK TOGETHER</span>',
    replace: '<span class="services-hero-eyebrow">FOUNDER-LED &bull; WAYS TO WORK TOGETHER</span>'
  },
  {
    search: `<h1>Context &amp; Muse finds expensive operational messes<br>and builds the system that replaces them.</h1>`,
    replace: `<h1>I find where a business is losing time, money, or customers—<br>and build the system that fixes it.</h1>`
  },
  {
    search: `Clear scope, fixed investment tiers, and custom software engineering for businesses that have outgrown templates and disconnected spreadsheets.`,
    replace: `Context &amp; Muse is intentionally founder-led and independent. Direct collaboration with Jayme Volstad, transparent scope, and custom software engineering for businesses that have outgrown generic templates, manual quote bottlenecks, and disconnected tools.`
  },
  {
    search: `Run our free, evidence-based diagnostic to spot visible messaging ambiguity, conversion leaks, and intake friction in seconds.`,
    replace: `Run the free, evidence-based diagnostic to spot visible messaging ambiguity, conversion leaks, and intake friction in seconds.`
  }
]);

// 2. about/index.html
replaceInFile('about/index.html', [
  {
    search: `<p class="about-hero-sub">\n                        Context &amp; Muse turns fragmented information, difficult workflows, and unclear decisions into systems people can understand and use.\n                    </p>`,
    replace: `<p class="about-hero-sub">\n                        Context &amp; Muse is intentionally founder-led and independent. I find where a business is losing time, money, or customers, then build practical custom solutions around it.\n                    </p>`
  },
  {
    search: `                    <div class="numbered-cap-item">\n                        <span class="cap-number">03</span>\n                        <div class="cap-body">\n                            <strong>Turn operations into tools</strong>\n                            <p>Interactive dashboards, intake interfaces, user flow mapping, and technical implementation planning — connecting what people know to what a system can do.</p>\n                        </div>\n                    </div>`,
    replace: `                    <div class="numbered-cap-item">\n                        <span class="cap-number">03</span>\n                        <div class="cap-body">\n                            <strong>Turn operations into tools</strong>\n                            <p>Interactive dashboards, intake interfaces, user flow mapping, and technical implementation planning — connecting what people know to what a system can do.</p>\n                        </div>\n                    </div>\n                    <div class="numbered-cap-item">\n                        <span class="cap-number">04</span>\n                        <div class="cap-body">\n                            <strong>Build practical custom solutions</strong>\n                            <p>Commercial websites, quote and lead systems, custom operational tools, workflow systems, diagnostics, restaurant systems, and owned products such as Signal.</p>\n                        </div>\n                    </div>`
  }
]);

// 3. restaurant-systems/index.html
replaceInFile('restaurant-systems/index.html', [
  {
    search: `<title>Restaurant Systems | Operational Consulting &amp; Workflow Design</title>`,
    replace: `<title>Restaurant Systems | Workflow Design, POS Architecture &amp; Decision Support</title>`
  },
  {
    search: `<span class="eyebrow" style="color: var(--accent-teal); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;">OPERATIONAL DESIGN &amp; HOSPITALITY CONSULTING</span>`,
    replace: `<span class="eyebrow" style="color: var(--accent-teal); font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;">OPERATIONAL DESIGN &amp; RESTAURANT SYSTEMS</span>`
  },
  {
    search: `<a href="#capabilities" class="btn btn-secondary" style="border-color: var(--border-light); color: var(--text-primary);">Our Services</a>`,
    replace: `<a href="#capabilities" class="btn btn-secondary" style="border-color: var(--border-light); color: var(--text-primary);">System Capabilities</a>`
  },
  {
    search: `<span class="eyebrow" style="color: var(--accent-teal); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 2.5rem;">OUR SERVICES</span>`,
    replace: `<span class="eyebrow" style="color: var(--accent-teal); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 2.5rem;">SYSTEM CAPABILITIES</span>`
  },
  {
    search: `We eliminate small modifier pricing leaks that quietly compound across thousands of transactions.`,
    replace: `Eliminating small modifier pricing leaks that quietly compound across thousands of transactions.`
  },
  {
    search: `We map historic transaction peaks directly to kitchen station prep hours to help you optimize labor spend without degrading service speed.`,
    replace: `Mapping historic transaction peaks directly to kitchen station prep hours to optimize labor spend without degrading service speed.`
  },
  {
    search: `We design intuitive, low-friction handoff systems between kitchen staff, floor servers, and third-party delivery dispatchers.`,
    replace: `Designing intuitive, low-friction handoff systems between kitchen staff, floor servers, and third-party delivery dispatchers.`
  },
  {
    search: `Translating high-level consulting decks into floor-tested manager checklists, line prep structures, and logic schemas. We specialize in configuring Point of Sale (POS) backend structures to accurately capture discount parameters.`,
    replace: `Translating abstract operational goals into floor-tested manager checklists, line prep structures, and logic schemas. Configuring Point of Sale (POS) backend structures to accurately capture discount parameters and protect margins.`
  }
]);

// 4. contact/success/index.html
replaceInFile('contact/success/index.html', [
  {
    search: `<p class="footer-tagline">Applied systems studio. Finding expensive operational messes and building the digital systems that replace them.</p>`,
    replace: `<p class="footer-tagline">Founder-led and independent. Finding where a business is losing time, money, or customers, and building the practical systems that fix it.</p>`
  },
  {
    search: `<div class="footer-col-title">Studio</div>`,
    replace: `<div class="footer-col-title">About</div>`
  }
]);

// 5. website-system-check/index.html
replaceInFile('website-system-check/index.html', [
  {
    search: `<p class="footer-tagline">Applied systems studio. Finding expensive operational messes and building the digital systems that replace them.</p>`,
    replace: `<p class="footer-tagline">Founder-led and independent. Finding where a business is losing time, money, or customers, and building the practical systems that fix it.</p>`
  },
  {
    search: `<div class="footer-col-title">Studio</div>`,
    replace: `<div class="footer-col-title">About</div>`
  }
]);

// 6. work/client-opportunity-engine/index.html & work/contest-atlas/index.html
replaceInFile('work/client-opportunity-engine/index.html', [
  {
    search: `<span>Studio Product</span>`,
    replace: `<span>Owned Product</span>`
  },
  {
    search: `the operator configures their studio's target project scope`,
    replace: `the operator configures their target project scope`
  }
]);

replaceInFile('work/contest-atlas/index.html', [
  {
    search: `<span>Studio Product Concept</span>`,
    replace: `<span>Owned Product Concept</span>`
  }
]);

// 7. preview/index.html
replaceInFile('preview/index.html', [
  {
    search: `Independent studio by Jayme Volstad.`,
    replace: `Founder-led systems builder by Jayme Volstad.`
  },
  {
    search: `<span class="hero-eyebrow">INDEPENDENT DESIGN &amp; SYSTEMS STUDIO</span>`,
    replace: `<span class="hero-eyebrow">FOUNDER-LED &bull; INDEPENDENT SYSTEMS BUILDER</span>`
  }
]);

console.log('Positioning updates complete.');

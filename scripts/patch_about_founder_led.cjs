// scripts/patch_about_founder_led.cjs
const fs = require('fs');

let c = fs.readFileSync('about/index.html', 'utf8');

c = c.replace(
  /<p class="about-hero-sub">[\s\S]*?<\/p>/,
  `<p class="about-hero-sub">\r\n                        Context &amp; Muse is intentionally founder-led and independent. I find where a business is losing time, money, or customers, then build practical custom solutions around it.\r\n                    </p>`
);

const cap3Target = '<strong>Turn operations into tools</strong>';
const cap3DivEnd = '<!-- ── HOW I THINK';

if (c.includes(cap3Target)) {
  const cap4Addition = `                    <div class="numbered-cap-item">\r\n                        <span class="cap-number">04</span>\r\n                        <div class="cap-body">\r\n                            <strong>Build practical custom solutions</strong>\r\n                            <p>Commercial websites, quote and lead systems, custom operational tools, workflow systems, diagnostics, restaurant systems, and owned products such as Signal.</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </section>\r\n\r\n        <!-- ── HOW I THINK`;

  c = c.replace(/<\/div>\s*<\/div>\s*<\/section>\s*<!-- ── HOW I THINK/, cap4Addition);
  console.log('Added Cap 04 to about/index.html');
}

fs.writeFileSync('about/index.html', c, 'utf8');
console.log('about/index.html updated successfully.');

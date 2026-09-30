import fs from 'fs';

console.log('Standardizing pricing across the repository...');

// -------------------------------------------------------------
// 1. systems/index.html
// -------------------------------------------------------------
if (fs.existsSync('systems/index.html')) {
  let s = fs.readFileSync('systems/index.html', 'utf8');

  // Meta tags and titles
  s = s.replace(/Custom Websites &amp; Systems — Projects from \$1,500/g, 'Custom Websites &amp; Systems — From $2,500');
  s = s.replace(/Projects from \$1,500\./g, 'Quote + Lead Systems from $2,500.');

  // Tier 1: Starter Website From $500 -> Business System Diagnostic $395
  const oldTier1 = `<div class="tier-card">
                        <div>
                            <div class="tier-header">
                                <h3 class="tier-title">Starter Website</h3>
                                <span class="tier-price">From $500</span>
                                <div class="tier-for">A focused, custom one-page website.</div>
                            </div>
                            <ul class="tier-list">
                                <li>Mobile-friendly design</li>
                                <li>Your services, photos, and contact details</li>
                                <li>Contact form or booking link</li>
                                <li>Basic search setup and launch</li>
                            </ul>
                        </div>
                        <a href="#intake" data-service-target="starter-website" class="btn btn-secondary" style="width: 100%; box-sizing: border-box; text-align: center; text-decoration: none; padding: 0.8rem; border: 1px solid var(--text-primary); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 4px; display: block;">Start a Website &rarr;</a>
                    </div>`;

  const newTier1 = `<div class="tier-card">
                        <div>
                            <div class="tier-header">
                                <h3 class="tier-title">Business System Diagnostic</h3>
                                <span class="tier-price">$395</span>
                                <div class="tier-for">100% credited toward a qualifying build within 30 days.</div>
                            </div>
                            <ul class="tier-list">
                                <li>Evidence-based analysis of website friction &amp; intake leaks</li>
                                <li>Technical stack &amp; customer journey review</li>
                                <li>High-impact operational recommendation report</li>
                                <li>100% fee credited if you build with Context &amp; Muse</li>
                            </ul>
                        </div>
                        <a href="/contact/?service=diagnostic" class="btn btn-secondary" style="width: 100%; box-sizing: border-box; text-align: center; text-decoration: none; padding: 0.8rem; border: 1px solid var(--text-primary); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 4px; display: block;">Start the $395 Diagnostic &rarr;</a>
                    </div>`;

  // Tier 2: Business Website From $1,500 -> Quote + Lead System From $2,500
  const oldTier2 = `<div class="tier-card featured">
                        <div>
                            <div class="tier-header">
                                <h3 class="tier-title">Business Website</h3>
                                <span class="tier-price">From $1,500</span>
                                <div class="tier-for">More room to explain your business and help customers take the next step.</div>
                            </div>
                            <ul class="tier-list">
                                <li>Up to five core pages</li>
                                <li>Clear service and pricing information</li>
                                <li>Structured inquiry form</li>
                                <li>Connection to your existing booking or payment service</li>
                                <li>Basic search setup and launch</li>
                            </ul>
                        </div>
                        <a href="#intake" data-service-target="business-website" class="btn btn-primary" style="width: 100%; box-sizing: border-box; text-align: center; text-decoration: none; padding: 0.8rem; background: var(--accent-teal); border: 1px solid var(--accent-teal); color: #FAF9F5; font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 4px; display: block;">Discuss Your Website &rarr;</a>
                    </div>`;

  const newTier2 = `<div class="tier-card featured">
                        <div>
                            <div class="tier-header">
                                <h3 class="tier-title">Quote + Lead System</h3>
                                <span class="tier-price">From $2,500</span>
                                <div class="tier-for">Multi-market implementations typically from $4,500+.</div>
                            </div>
                            <ul class="tier-list">
                                <li>Multi-page commercial acquisition platform</li>
                                <li>Service-area directory &amp; territory qualification</li>
                                <li>Structured inquiry triage &amp; automated notification routing</li>
                                <li>Mobile-first speed &amp; localized search architecture</li>
                                <li>Direct client CMS for service zones &amp; pricing</li>
                            </ul>
                        </div>
                        <a href="#intake" data-service-target="quote-lead" class="btn btn-primary" style="width: 100%; box-sizing: border-box; text-align: center; text-decoration: none; padding: 0.8rem; background: var(--accent-teal); border: 1px solid var(--accent-teal); color: #FAF9F5; font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 4px; display: block;">Discuss a Quote &amp; Lead System &rarr;</a>
                    </div>`;

  // Tier 3: Tools & Workflow Help -> Custom Operations System From $6,500
  const oldTier3 = `<div class="tier-card">
                        <div>
                            <div class="tier-header">
                                <h3 class="tier-title">Tools &amp; Workflow Help</h3>
                                <span class="tier-price">Quoted by scope</span>
                                <div class="tier-for">A focused solution for something that takes too much manual work.</div>
                            </div>
                            <div style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 600;">Possible projects include:</div>
                            <ul class="tier-list tier-list-examples" style="border-top: none; padding-top: 0; margin-top: 0; margin-bottom: 1.25rem;">
                                <li>Quote calculators</li>
                                <li>Customer intake flows</li>
                                <li>Tracking dashboards</li>
                                <li>Simple task automations</li>
                            </ul>
                            <div style="font-family: var(--font-sans); font-size: 12.5px; color: var(--text-secondary); font-style: italic; margin-bottom: 1.5rem; line-height: 1.45;">
                                Each project covers one agreed workflow or tool.
                            </div>
                        </div>
                        <a href="#intake" data-service-target="tools-workflow" class="btn btn-secondary" style="width: 100%; box-sizing: border-box; text-align: center; text-decoration: none; padding: 0.8rem; border: 1px solid var(--text-primary); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 4px; display: block;">Tell Me What You Need &rarr;</a>
                    </div>`;

  const newTier3 = `<div class="tier-card">
                        <div>
                            <div class="tier-header">
                                <h3 class="tier-title">Custom Operations System</h3>
                                <span class="tier-price">From $6,500</span>
                                <div class="tier-for">Bespoke operational software built around unique business constraints.</div>
                            </div>
                            <div style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 600;">Engineered capabilities include:</div>
                            <ul class="tier-list tier-list-examples" style="border-top: none; padding-top: 0; margin-top: 0; margin-bottom: 1.25rem;">
                                <li>Bespoke operational dashboards &amp; internal portals</li>
                                <li>Parametric estimation &amp; ledger calculators</li>
                                <li>Multi-system CRM/ERP webhook integrations</li>
                                <li>Complete data ownership with zero recurring seats</li>
                            </ul>
                            <div style="font-family: var(--font-sans); font-size: 12.5px; color: var(--text-secondary); font-style: italic; margin-bottom: 1.5rem; line-height: 1.45;">
                                Milestone-based billing: 40% deposit &bull; 30% prototype &bull; 30% launch.
                            </div>
                        </div>
                        <a href="#intake" data-service-target="custom-system" class="btn btn-secondary" style="width: 100%; box-sizing: border-box; text-align: center; text-decoration: none; padding: 0.8rem; border: 1px solid var(--text-primary); color: var(--text-primary); font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; border-radius: 4px; display: block;">Discuss Custom Operations &rarr;</a>
                    </div>`;

  s = s.replace(oldTier1, newTier1);
  s = s.replace(oldTier2, newTier2);
  s = s.replace(oldTier3, newTier3);

  // Form select options
  const oldSelect = `<select id="form-service" name="service_type" style="width: 100%; padding: 0.75rem 0.85rem; border: 1px solid var(--border-light); border-radius: 4px; font-family: var(--font-sans); font-size: 14px; background: var(--bg-paper); box-sizing: border-box; color: var(--text-primary);">
                                    <option value="starter-website">Starter Website (From $500)</option>
                                    <option value="business-website" selected>Business Website (From $1,500)</option>
                                    <option value="tools-workflow">Tools &amp; Workflow Help (Quoted by scope)</option>
                                    <option value="conversion-audit">Conversion Audit ($195 flat rate)</option>
                                    <option value="custom">Custom Scope / Other</option>
                                </select>`;

  const newSelect = `<select id="form-service" name="service_type" style="width: 100%; padding: 0.75rem 0.85rem; border: 1px solid var(--border-light); border-radius: 4px; font-family: var(--font-sans); font-size: 14px; background: var(--bg-paper); box-sizing: border-box; color: var(--text-primary);">
                                    <option value="diagnostic">Business System Diagnostic ($395 fixed)</option>
                                    <option value="quote-lead" selected>Quote + Lead System (From $2,500)</option>
                                    <option value="multi-market">Multi-Market Quote + Lead System (From $4,500)</option>
                                    <option value="custom-system">Custom Operations System (From $6,500)</option>
                                    <option value="custom">Custom Scope / Other</option>
                                </select>`;

  s = s.replace(oldSelect, newSelect);
  fs.writeFileSync('systems/index.html', s, 'utf8');
  console.log('Updated systems/index.html pricing and tiers.');
}

// -------------------------------------------------------------
// 2. quick-launch/index.html
// -------------------------------------------------------------
if (fs.existsSync('quick-launch/index.html')) {
  let ql = fs.readFileSync('quick-launch/index.html', 'utf8');
  ql = ql.replace(/Launch Site Websites — From \$1,500/g, 'Quote + Lead Systems — From $2,500');
  ql = ql.replace(/<span class="ql-price-val">From \$1,500<\/span>/g, '<span class="ql-price-val">From $2,500</span>');
  ql = ql.replace(/Typical project range: \$1,500–\$1,950/g, 'Typical project range: $2,500–$4,500');
  fs.writeFileSync('quick-launch/index.html', ql, 'utf8');
  console.log('Updated quick-launch/index.html pricing.');
}

// -------------------------------------------------------------
// 3. terms/index.html
// -------------------------------------------------------------
if (fs.existsSync('terms/index.html')) {
  let t = fs.readFileSync('terms/index.html', 'utf8');
  t = t.replace('<li><strong>Launch Sites ($1,500+) &amp; Conversion Sites ($2,750+):</strong>', '<li><strong>Quote + Lead Systems ($2,500+) &amp; Multi-Market Systems ($4,500+):</strong>');
  t = t.replace('<li><strong>Custom Business Systems ($4,500+):</strong>', '<li><strong>Custom Operations Systems ($6,500+):</strong>');
  t = t.replace('If you purchase a <strong>Conversion Audit ($195 flat rate)</strong>, the full $195 fee is 100% credited', 'If you purchase a <strong>Business System Diagnostic ($395 flat rate)</strong>, the full $395 fee is 100% credited');
  fs.writeFileSync('terms/index.html', t, 'utf8');
  console.log('Updated terms/index.html pricing.');
}

// -------------------------------------------------------------
// 4. custom/index.html
// -------------------------------------------------------------
if (fs.existsSync('custom/index.html')) {
  let c = fs.readFileSync('custom/index.html', 'utf8');
  c = c.replace('<option value="custom-system">Custom Operations System (From $3,500)</option>', '<option value="custom-system">Custom Operations System (From $6,500)</option>');
  c = c.replace("'custom-system': { value: 'custom-system', label: 'Custom Operations System (From $3,500)', btn: 'Discuss Custom System →' }", "'custom-system': { value: 'custom-system', label: 'Custom Operations System (From $6,500)', btn: 'Discuss Custom System →' }");
  c = c.replace(/'diagnostic': 'Book \$395 Diagnostic →'/, "'diagnostic': 'Start the $395 Diagnostic →'");
  fs.writeFileSync('custom/index.html', c, 'utf8');
  console.log('Updated custom/index.html pricing.');
}

// -------------------------------------------------------------
// 5. index.html
// -------------------------------------------------------------
if (fs.existsSync('index.html')) {
  let idx = fs.readFileSync('index.html', 'utf8');
  idx = idx.replace('<span class="ladder-price">From $3,500</span>', '<span class="ladder-price">From $6,500</span>');
  idx = idx.replace('<option value="$3500-custom-system">Custom Operations System ($3,500+)</option>', '<option value="$6500-custom-system">Custom Operations System ($6,500+)</option>');
  // Update CTA label on index.html
  idx = idx.replace('<a href="/contact/?service=diagnostic" class="btn-ladder-cta" id="cta-diag-395">Book a $395 Diagnostic &rarr;</a>', '<a href="/contact/?service=diagnostic" class="btn-ladder-cta" id="cta-diag-395">Start the $395 Diagnostic &rarr;</a>');
  fs.writeFileSync('index.html', idx, 'utf8');
  console.log('Updated index.html pricing.');
}

// -------------------------------------------------------------
// 6. services/index.html
// -------------------------------------------------------------
if (fs.existsSync('services/index.html')) {
  let srv = fs.readFileSync('services/index.html', 'utf8');
  srv = srv.replace('<span class="ladder-price">From $3,500</span>', '<span class="ladder-price">From $6,500</span>');
  srv = srv.replace('<a href="/contact/?service=diagnostic" class="btn-ladder-cta">Book a $395 Diagnostic &rarr;</a>', '<a href="/contact/?service=diagnostic" class="btn-ladder-cta">Start the $395 Diagnostic &rarr;</a>');
  srv = srv.replace('<td style="padding: 0.85rem 1rem; font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary);">$3,500+</td>', '<td style="padding: 0.85rem 1rem; font-family: var(--font-mono); font-size: 13px; color: var(--text-secondary);">$6,500+</td>');
  fs.writeFileSync('services/index.html', srv, 'utf8');
  console.log('Updated services/index.html pricing.');
}

// -------------------------------------------------------------
// 7. website-system-check/index.html
// -------------------------------------------------------------
if (fs.existsSync('website-system-check/index.html')) {
  let wsc = fs.readFileSync('website-system-check/index.html', 'utf8');
  wsc = wsc.replace('<option value="$3500-custom-system">Custom Operations System ($3,500+)</option>', '<option value="$6500-custom-system">Custom Operations System ($6,500+)</option>');
  wsc = wsc.replace('Book $395 Business System Diagnostic →', 'Start the $395 Diagnostic →');
  fs.writeFileSync('website-system-check/index.html', wsc, 'utf8');
  console.log('Updated website-system-check/index.html pricing.');
}

// -------------------------------------------------------------
// 8. systems/client-builds/index.html
// -------------------------------------------------------------
if (fs.existsSync('systems/client-builds/index.html')) {
  let scb = fs.readFileSync('systems/client-builds/index.html', 'utf8');
  scb = scb.replace(
    '<a href="/custom/?service=audit#intake" style="border: 1px solid rgba(250,249,245,0.4); color: #FAF9F5; font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.85rem 1.8rem; border-radius: 4px; text-decoration: none; display: inline-block;">Book a $195 Audit &rarr;</a>',
    '<a href="/contact/?service=diagnostic" style="border: 1px solid rgba(250,249,245,0.4); color: #FAF9F5; font-family: var(--font-mono); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 0.85rem 1.8rem; border-radius: 4px; text-decoration: none; display: inline-block;">Start the $395 Diagnostic &rarr;</a>'
  );
  fs.writeFileSync('systems/client-builds/index.html', scb, 'utf8');
  console.log('Updated systems/client-builds/index.html CTA.');
}

console.log('Pricing standardization script completed.');

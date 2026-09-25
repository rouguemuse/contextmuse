/**
 * Contest Atlas — app.js
 * Core Controller, Eligibility Engine, Anonymity Scanner, & UI State
 * Database: ContestAtlasDB
 */

const App = {
  activeTab: 'prepare',
  pieces: [],
  pieceVersions: [],
  opportunities: [],
  opportunityRules: [],
  submissionPlans: [],
  submissions: [],
  submissionEvents: [],
  submissionSnapshots: [],
  bios: [],
  bioVersions: [],
  coverNotes: [],
  coverNoteVersions: [],
  authorProfile: null,
  settings: {},

  selectedPieceId: null,
  selectedVersionId: null,
  selectedOppId: null,
  selectedSubId: null,

  pendingRestoreData: null,
  _lastFocusedElement: null,

  async init() {
    try {
      await window.contestAtlasDB.init();
      await this.loadAllData();
      this.checkUrlLicense();
      this.initTheme();
      this.renderHeaderTierBadge();
      this.renderCurrentView();
      this.checkFirstRun();
      this.checkWithdrawalAdvisories();
      console.log('Contest Atlas initialized successfully.');
    } catch (err) {
      console.error('Initialization error:', err);
    }
  },

  async loadAllData() {
    const db = window.contestAtlasDB;
    this.pieces = await db.getAll(ATLAS_STORES.PIECES);
    this.pieceVersions = await db.getAll(ATLAS_STORES.PIECE_VERSIONS);
    this.opportunities = await db.getAll(ATLAS_STORES.OPPORTUNITIES);
    this.opportunityRules = await db.getAll(ATLAS_STORES.OPPORTUNITY_RULE_VERSIONS);
    this.submissionPlans = await db.getAll(ATLAS_STORES.SUBMISSION_PLANS);
    this.submissions = await db.getAll(ATLAS_STORES.SUBMISSIONS);
    this.submissionEvents = await db.getAll(ATLAS_STORES.SUBMISSION_EVENTS);
    this.submissionSnapshots = await db.getAll(ATLAS_STORES.SUBMISSION_SNAPSHOTS);
    this.bios = await db.getAll(ATLAS_STORES.BIOS);
    this.bioVersions = await db.getAll(ATLAS_STORES.BIO_VERSIONS);
    this.coverNotes = await db.getAll(ATLAS_STORES.COVER_NOTES);
    this.coverNoteVersions = await db.getAll(ATLAS_STORES.COVER_NOTE_VERSIONS);
    
    const profiles = await db.getAll(ATLAS_STORES.AUTHOR_PROFILES);
    this.authorProfile = profiles.length > 0 ? profiles[0] : null;

    const settingsArr = await db.getAll(ATLAS_STORES.SETTINGS);
    this.settings = {};
    settingsArr.forEach(s => this.settings[s.key] = s.value);
  },

  // --- THEME MANAGEMENT ---
  initTheme() {
    const savedTheme = this.settings.theme || 'dark';
    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = savedTheme;
    this.applyTheme(savedTheme);
  },

  async setTheme(theme) {
    this.applyTheme(theme);
    this.settings.theme = theme;
    await window.contestAtlasDB.put(ATLAS_STORES.SETTINGS, { key: 'theme', value: theme });
  },

  applyTheme(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  },

  // --- PRO TIER & COMMERCIAL GATING ($49 LIFETIME ACCESS) ---
  isPro() {
    return this.settings.isPro === true || localStorage.getItem('contest_atlas_pro') === 'true';
  },

  getMaxFreeOpportunities() {
    return 3;
  },

  renderHeaderTierBadge() {
    const el = document.getElementById('header-tier-container');
    if (!el) return;
    if (this.isPro()) {
      el.innerHTML = `
        <div class="pro-tier-pill pro-active" title="Contest Atlas Pro — Unlimited Lifetime Access Active">
          <span style="color: #6ee7b7; font-weight: 700;">✨ PRO LIFETIME</span>
        </div>
      `;
    } else {
      const used = this.opportunities.length;
      const max = this.getMaxFreeOpportunities();
      el.innerHTML = `
        <div class="pro-tier-pill" onclick="App.openProUpgradeModal('header')" title="Click to unlock unlimited contests ($49 Lifetime)">
          <span class="text-muted font-mono">${used}/${max} Contests</span>
          <span class="text-saffron font-bold">⚡ Upgrade</span>
        </div>
      `;
    }
  },

  openProUpgradeModal(reason) {
    const err = document.getElementById('license-error-msg');
    if (err) err.style.display = 'none';
    const wrapper = document.getElementById('license-input-wrapper');
    if (wrapper) wrapper.style.display = 'none';
    this.openModal('modal-pro-upgrade');
  },

  toggleLicenseInput() {
    const el = document.getElementById('license-input-wrapper');
    if (el) {
      el.style.display = el.style.display === 'none' ? 'block' : 'none';
      if (el.style.display === 'block') {
        const inp = document.getElementById('license-key-input');
        if (inp) inp.focus();
      }
    }
  },

  async submitLicenseKey() {
    const inp = document.getElementById('license-key-input');
    const err = document.getElementById('license-error-msg');
    const val = (inp?.value || '').trim();
    if (!val) {
      if (err) {
        err.textContent = 'Please enter your license key, Stripe receipt number, or order email.';
        err.style.display = 'block';
      }
      return;
    }

    // Accept valid key or order ID format
    await this.activatePro(val, 'Licensed Writer');
    this.closeModal('modal-pro-upgrade');
  },

  startProCheckout() {
    // Configurable Stripe Payment Link
    const checkoutUrl = this.settings.stripePaymentUrl || 'https://buy.stripe.com/example_contest_atlas_pro';
    
    // In local dev preview, allow instant simulation:
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const proceed = confirm("Contest Atlas Pro Checkout ($49 One-Time Lifetime Access)\n\nIn live production (wcsm.contextmuse.com), this redirects to your Stripe Checkout link.\n\nWould you like to simulate successful Stripe payment activation now?");
      if (proceed) {
        this.activatePro('STRIPE_SIM_' + Date.now(), 'writer@example.com');
        this.closeModal('modal-pro-upgrade');
        return;
      }
    }

    // In production, open checkout link
    window.open(checkoutUrl, '_blank');
  },

  async activatePro(licenseKey, email) {
    this.settings.isPro = true;
    this.settings.licenseKey = licenseKey || ('CA-PRO-' + Date.now());
    this.settings.licenseEmail = email || '';
    this.settings.activatedAt = new Date().toISOString();

    localStorage.setItem('contest_atlas_pro', 'true');
    localStorage.setItem('contest_atlas_license', this.settings.licenseKey);

    const db = window.contestAtlasDB;
    await db.put(ATLAS_STORES.SETTINGS, { key: 'isPro', value: true });
    await db.put(ATLAS_STORES.SETTINGS, { key: 'licenseKey', value: this.settings.licenseKey });
    await db.put(ATLAS_STORES.SETTINGS, { key: 'activatedAt', value: this.settings.activatedAt });

    this.renderHeaderTierBadge();
    this.renderCurrentView();
    alert('🎉 Contest Atlas Pro Activated!\n\nYou now have unlimited lifetime access to contests, submissions, and snapshots.');
  },

  checkUrlLicense() {
    try {
      const params = new URLSearchParams(window.location.search);
      const isActivated = params.get('activated') === 'true' || params.get('pro') === 'true' || params.has('license') || params.has('key');
      const key = params.get('license') || params.get('key') || ('CA-STRIPE-' + Date.now());
      if (isActivated) {
        this.activatePro(key, params.get('email') || '');
        // Clean URL query parameters without page reload
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (e) {
      console.warn('URL License check error:', e);
    }
  },

  // --- TAB NAVIGATION ---
  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `view-${tabId}`);
    });
    this.renderCurrentView();
  },

  renderCurrentView() {
    switch (this.activeTab) {
      case 'prepare':
        this.renderPrepareView();
        break;
      case 'pieces':
        this.renderPiecesView();
        break;
      case 'opportunities':
        this.renderOpportunitiesView();
        break;
      case 'deadlines':
        this.renderDeadlinesView();
        break;
      case 'submissions':
        this.renderSubmissionsView();
        break;
      case 'bios':
        this.renderBiosView();
        break;
    }
  },

  checkFirstRun() {
    const hero = document.getElementById('first-run-hero');
    if (hero) {
      if (this.pieces.length === 0 && this.opportunities.length === 0) {
        hero.style.display = 'block';
      } else {
        hero.style.display = 'none';
      }
    }
  },

  // --- UTILS ---
  countWords(text) {
    if (!text) return 0;
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  },

  formatDate(isoStr) {
    if (!isoStr) return 'N/A';
    const d = new Date(isoStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  },

  formatDateTime(isoStr) {
    if (!isoStr) return 'N/A';
    const d = new Date(isoStr);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  formatMoney(amount) {
    const val = parseFloat(amount) || 0;
    return `$${val.toFixed(2)}`;
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  // ==========================================
  // 1. PREPARE & PACKAGE CHECK ENGINE
  // ==========================================
  renderPrepareView() {
    const pieceSelect = document.getElementById('check-select-piece');
    const oppSelect = document.getElementById('check-select-opp');
    const bioSelect = document.getElementById('check-select-bio');
    const coverSelect = document.getElementById('check-select-cover');

    if (pieceSelect) {
      const curPiece = pieceSelect.value;
      pieceSelect.innerHTML = '<option value="">-- Choose a Piece --</option>' +
        this.pieces.map(p => `<option value="${p.id}" ${p.id === curPiece ? 'selected' : ''}>${this.escapeHtml(p.title)} (${p.type || 'Piece'})</option>`).join('');
    }

    if (oppSelect) {
      const curOpp = oppSelect.value;
      oppSelect.innerHTML = '<option value="">-- Choose an Opportunity --</option>' +
        this.opportunities.map(o => `<option value="${o.id}" ${o.id === curOpp ? 'selected' : ''}>${this.escapeHtml(o.name)} (${this.escapeHtml(o.organization || o.type)})</option>`).join('');
    }

    if (bioSelect) {
      const curBio = bioSelect.value;
      bioSelect.innerHTML = '<option value="">-- None / Select Bio --</option>' +
        this.bios.map(b => `<option value="${b.id}" ${b.id === curBio ? 'selected' : ''}>${this.escapeHtml(b.name)}</option>`).join('');
    }

    if (coverSelect) {
      const curCover = coverSelect.value;
      coverSelect.innerHTML = '<option value="">-- None / Select Cover Note --</option>' +
        this.coverNotes.map(c => `<option value="${c.id}" ${c.id === curCover ? 'selected' : ''}>${this.escapeHtml(c.name)}</option>`).join('');
    }

    if (pieceSelect && pieceSelect.value) {
      this.onCheckPieceSelected(pieceSelect.value);
    } else {
      this.runPackageCheck();
    }
  },

  onCheckPieceSelected(pieceId) {
    const verSelect = document.getElementById('check-select-version');
    if (!verSelect) return;

    if (!pieceId) {
      verSelect.innerHTML = '<option value="">-- Choose a Version --</option>';
      this.runPackageCheck();
      return;
    }

    const versions = this.pieceVersions.filter(v => v.pieceId === pieceId);
    verSelect.innerHTML = versions.map((v, i) => 
      `<option value="${v.id}" ${i === 0 ? 'selected' : ''}>${this.escapeHtml(v.name)} (${v.wordCount} words)</option>`
    ).join('');

    this.runPackageCheck();
  },

  resetCheckSelections() {
    const p = document.getElementById('check-select-piece');
    const v = document.getElementById('check-select-version');
    const o = document.getElementById('check-select-opp');
    const b = document.getElementById('check-select-bio');
    const c = document.getElementById('check-select-cover');
    const f = document.getElementById('check-fee-paid');
    if (p) p.value = '';
    if (v) v.innerHTML = '<option value="">-- Choose a Version --</option>';
    if (o) o.value = '';
    if (b) b.value = '';
    if (c) c.value = '';
    if (f) f.value = 'unpaid';
    this.runPackageCheck();
  },

  runPackageCheck() {
    const pieceId = document.getElementById('check-select-piece')?.value;
    const versionId = document.getElementById('check-select-version')?.value;
    const oppId = document.getElementById('check-select-opp')?.value;
    const bioId = document.getElementById('check-select-bio')?.value;
    const coverId = document.getElementById('check-select-cover')?.value;
    const feeStatus = document.getElementById('check-fee-paid')?.value || 'unpaid';
    const output = document.getElementById('package-check-output');
    const markBtn = document.getElementById('btn-mark-submitted');

    if (!output) return;

    if (!pieceId || !versionId || !oppId) {
      if (markBtn) {
        markBtn.disabled = true;
        markBtn.classList.remove('btn-primary');
        markBtn.classList.add('btn-disabled');
      }
      output.innerHTML = `
        <div class="empty-state compact">
          <div class="empty-icon">⚖️</div>
          <div class="empty-text">Select a Piece, Version, and Opportunity above to evaluate word limits, anonymity rules, rights, and deadline state.</div>
        </div>
      `;
      return;
    }

    if (markBtn) {
      markBtn.disabled = false;
      markBtn.classList.add('btn-primary');
      markBtn.classList.remove('btn-disabled');
    }

    const piece = this.pieces.find(p => p.id === pieceId);
    const version = this.pieceVersions.find(v => v.id === versionId);
    const opp = this.opportunities.find(o => o.id === oppId);

    if (!piece || !version || !opp) {
      output.innerHTML = `<div class="empty-state compact">Selection not found in database.</div>`;
      return;
    }

    // Rules evaluation supporting: pass, fail, warning, unknown, not_applicable
    const diagnostics = [];
    let hasFail = false;
    let hasWarning = false;
    let hasUnknown = false;

    // 1. Word Count Check
    const words = version.wordCount || this.countWords(version.content);
    if (opp.maxWords && words > opp.maxWords) {
      const overBy = words - opp.maxWords;
      hasWarning = true;
      diagnostics.push({
        status: 'warning',
        icon: '⚠️',
        name: 'Word Count Limit Exceeded',
        detail: `${words.toLocaleString()} words (Maximum allowed: ${opp.maxWords.toLocaleString()} · Over by ${overBy.toLocaleString()} words). Consider duplicating as a shorter Contest Cut.`
      });
    } else if (opp.minWords && words < opp.minWords) {
      const underBy = opp.minWords - words;
      hasWarning = true;
      diagnostics.push({
        status: 'warning',
        icon: '⚠️',
        name: 'Under Minimum Word Count',
        detail: `${words.toLocaleString()} words (Minimum required: ${opp.minWords.toLocaleString()} · Short by ${underBy.toLocaleString()} words).`
      });
    } else {
      diagnostics.push({
        status: 'pass',
        icon: '✓',
        name: 'Word Count Compliant',
        detail: `${words.toLocaleString()} words ${opp.maxWords ? `(Limit: ${opp.maxWords.toLocaleString()})` : ''}`
      });
    }

    // 2. Publication Status Check
    if (piece.publicationState === 'unknown') {
      hasUnknown = true;
      diagnostics.push({
        status: 'unknown',
        icon: '?',
        name: 'Publication Status Unknown',
        detail: 'Publication status is not verified on this piece. Confirm before submitting to unpublished-only opportunities.'
      });
    } else if (opp.unpublishedOnly && piece.publicationState && piece.publicationState !== 'unpublished') {
      hasFail = true;
      diagnostics.push({
        status: 'fail',
        icon: '🚫',
        name: 'Publication Status Conflict',
        detail: `This opportunity requires previously unpublished work. Piece is marked as "${piece.publicationState}".`
      });
    } else {
      diagnostics.push({
        status: 'pass',
        icon: '✓',
        name: 'Publication Status Eligible',
        detail: `Piece publication status: ${piece.publicationState || 'Unpublished'}`
      });
    }

    // 3. Rights Status Check
    if (piece.rightsState === 'unknown') {
      hasUnknown = true;
      diagnostics.push({
        status: 'unknown',
        icon: '?',
        name: 'Rights Status Unverified',
        detail: 'Rights availability is unverified. Check if first rights or reprint rights are available.'
      });
    } else if (piece.rightsState === 'exclusivePeriod' || piece.rightsState === 'firstRightsUnavailable') {
      if (opp.unpublishedOnly) {
        hasFail = true;
        diagnostics.push({
          status: 'fail',
          icon: '🚫',
          name: 'Rights Availability Conflict',
          detail: `Piece rights marked as "${piece.rightsState}". First rights may not be available.`
        });
      }
    }

    // 4. Piece-Level & Version-Level Simultaneous Submission Check
    const activeSubs = this.submissions.filter(s => s.pieceId === piece.id && !['rejected', 'withdrawn', 'no_response'].includes(this.getLatestSubStatus(s.id)));
    const otherSubs = activeSubs.filter(s => s.opportunityId !== opp.id);
    const exactSubs = otherSubs.filter(s => s.pieceVersionId === version.id);
    const siblingSubs = otherSubs.filter(s => s.pieceVersionId !== version.id);

    if (otherSubs.length > 0) {
      if (opp.simultaneousAllowed === false) {
        hasWarning = true;
        if (exactSubs.length > 0) {
          diagnostics.push({
            status: 'warning',
            icon: '⚠️',
            name: 'Simultaneous Conflict — Exact Version Active',
            detail: `This opportunity prohibits simultaneous submissions. This exact version is currently submitted elsewhere.`
          });
        }
        if (siblingSubs.length > 0) {
          const siblingVerNames = siblingSubs.map(s => {
            const v = this.pieceVersions.find(pv => pv.id === s.pieceVersionId);
            return v ? v.name : 'sibling version';
          }).join(', ');
          diagnostics.push({
            status: 'warning',
            icon: '⚠️',
            name: 'Simultaneous Conflict — Sibling Version Active',
            detail: `This opportunity prohibits simultaneous submissions. Another version of this work (${siblingVerNames}) is currently submitted elsewhere.`
          });
        }
      } else {
        if (exactSubs.length > 0) {
          diagnostics.push({
            status: 'info',
            icon: 'ℹ️',
            name: 'Exact Version Submitted Elsewhere',
            detail: `Permitted under guidelines. This exact version is active with ${exactSubs.length} other market(s).`
          });
        }
        if (siblingSubs.length > 0) {
          diagnostics.push({
            status: 'info',
            icon: 'ℹ️',
            name: 'Sibling Cuts Submitted Elsewhere',
            detail: `Permitted under guidelines. Another cut of this work is under review with ${siblingSubs.length} market(s).`
          });
        }
      }
    } else {
      diagnostics.push({
        status: 'pass',
        icon: '✓',
        name: 'Simultaneous Policy Compliant',
        detail: opp.simultaneousAllowed ? 'Simultaneous submissions permitted' : 'No active conflicting submissions detected'
      });
    }

    // 5. Anonymity / Blind Judging Check
    const anonymityResult = this.scanAnonymity(version, piece.title);
    if (opp.blindJudging) {
      if (anonymityResult.matches.length > 0) {
        hasWarning = true;
        diagnostics.push({
          status: 'warning',
          icon: '⚠️',
          name: 'Anonymous Judging Alert',
          detail: `Author-identifying text detected in manuscript: ${anonymityResult.matches.join(', ')}. Remove personal identifiers for blind review.`
        });
      } else {
        diagnostics.push({
          status: 'pass',
          icon: '✓',
          name: 'Blind Submission Inspected',
          detail: 'No obvious author-identifying text detected in the prepared manuscript. Verify the exported file before submitting.'
        });
      }
    }

    // 6. Bio Requirement Check
    if (opp.reqBio === 'required') {
      if (!bioId) {
        hasWarning = true;
        diagnostics.push({
          status: 'warning',
          icon: '○',
          name: 'Bio Required',
          detail: 'Opportunity requires an author bio, but none is selected in the package check.'
        });
      } else {
        const b = this.bios.find(item => item.id === bioId);
        diagnostics.push({
          status: 'pass',
          icon: '✓',
          name: 'Bio Selected',
          detail: `Selected: ${b ? b.name : 'Bio'}`
        });
      }
    } else if (opp.reqBio === 'prohibited' && bioId) {
      hasWarning = true;
      diagnostics.push({
        status: 'warning',
        icon: '⚠️',
        name: 'Bio Prohibited',
        detail: 'Opportunity guidelines prohibit attaching a bio (blind reading).'
      });
    }

    // 7. Cover Note Check
    if (opp.reqCover === 'required') {
      if (!coverId) {
        hasWarning = true;
        diagnostics.push({
          status: 'warning',
          icon: '○',
          name: 'Cover Note Required',
          detail: 'Opportunity requires a cover letter, but none is selected.'
        });
      } else {
        diagnostics.push({
          status: 'pass',
          icon: '✓',
          name: 'Cover Note Selected',
          detail: 'Cover note included in package.'
        });
      }
    }

    // 8. Fee Status Check
    const fee = parseFloat(opp.feeAmount) || 0;
    if (fee > 0) {
      if (feeStatus === 'unpaid') {
        diagnostics.push({
          status: 'info',
          icon: '💵',
          name: `Entry Fee: ${this.formatMoney(fee)}`,
          detail: 'Mark as paid or prepare payment method prior to submitting.'
        });
      } else {
        diagnostics.push({
          status: 'pass',
          icon: '✓',
          name: `Entry Fee: ${this.formatMoney(fee)}`,
          detail: `Status: ${feeStatus.toUpperCase()}`
        });
      }
    }

    // 9. Deadline Check
    const deadlineUtc = this.computeUtcDeadline(opp.deadlineDate, opp.deadlineTime, opp.deadlineTimeZone);
    const now = new Date();
    const isPast = deadlineUtc && deadlineUtc < now;
    if (isPast && !opp.rolling) {
      hasFail = true;
      diagnostics.push({
        status: 'fail',
        icon: '⏳',
        name: 'Deadline Passed',
        detail: `The deadline (${this.formatDateTime(deadlineUtc.toISOString())}) has passed.`
      });
    } else if (deadlineUtc) {
      const diffMs = deadlineUtc - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      diagnostics.push({
        status: 'pass',
        icon: '⏳',
        name: 'Deadline Status',
        detail: `${diffDays > 0 ? `${diffDays} days remaining` : 'Due today'} · ${this.formatDateTime(deadlineUtc.toISOString())}`
      });
    }

    // Overall Diagnostic Determination
    let overallClass = 'ready';
    let overallHeadline = 'Ready';
    let overallBadge = 'badge-ready';

    if (hasFail) {
      overallClass = 'ineligible';
      overallHeadline = 'Not Eligible';
      overallBadge = 'badge-ineligible';
    } else if (hasWarning) {
      overallClass = 'attention';
      overallHeadline = 'Needs Attention';
      overallBadge = 'badge-attention';
    } else if (hasUnknown) {
      overallClass = 'verify';
      overallHeadline = 'Needs Verification';
      overallBadge = 'badge-verify';
    }

    // Save working state to submission_plans
    this.saveWorkingPlan(piece.id, version.id, opp.id, bioId, coverId, feeStatus, overallHeadline.toLowerCase());

    // Render Diagnostic Card
    output.innerHTML = `
      <div class="package-check-hero ${overallClass}">
        <div class="diagnostic-banner">
          <div>
            <span class="badge ${overallBadge}" style="font-size: 0.85rem; padding: 0.25rem 0.75rem;">${overallHeadline}</span>
            <div class="diagnostic-headline mt-2">${this.escapeHtml(piece.title)} &mdash; <span style="font-size: 1.1rem; font-weight: 500;">${this.escapeHtml(version.name)}</span></div>
            <div class="text-sm text-secondary">for <strong>${this.escapeHtml(opp.name)}</strong> (${this.escapeHtml(opp.organization || opp.type)})</div>
          </div>
          <div style="text-align: right;">
            <div class="text-sm text-muted">Format: <strong>${this.escapeHtml(opp.reqFormat || 'Any Standard')}</strong></div>
            <div class="text-sm text-muted">Fee: <strong>${this.formatMoney(opp.feeAmount)}</strong></div>
          </div>
        </div>

        <div style="margin-top: 1rem;">
          ${diagnostics.map(d => `
            <div class="diagnostic-item">
              <span class="diagnostic-icon ${d.status === 'fail' ? 'text-coral' : (d.status === 'warning' ? 'text-saffron' : (d.status === 'unknown' ? 'text-violet' : (d.status === 'pass' ? 'text-berry' : 'text-muted')))}">
                ${d.icon}
              </span>
              <div class="diagnostic-content">
                <div class="diagnostic-name">${this.escapeHtml(d.name)}</div>
                <div class="diagnostic-detail">${this.escapeHtml(d.detail)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  async saveWorkingPlan(pieceId, pieceVersionId, opportunityId, bioVersionId, coverNoteVersionId, feeState, status) {
    const planId = `plan_${pieceId}_${opportunityId}`;
    const plan = {
      id: planId,
      pieceId,
      pieceVersionId,
      opportunityId,
      bioVersionId: bioVersionId || null,
      coverNoteVersionId: coverNoteVersionId || null,
      feeState,
      status: status || 'preparing',
      updatedAt: new Date().toISOString()
    };
    await window.contestAtlasDB.put(ATLAS_STORES.SUBMISSION_PLANS, plan);
  },

  // --- ANONYMITY SCANNER ---
  scanAnonymity(version, pieceTitle) {
    const matches = [];
    if (!version || !version.content) return { matches };

    const content = version.content.toLowerCase();

    // Check author profile fields
    if (this.authorProfile) {
      const p = this.authorProfile;
      if (p.name && p.name.trim().length > 2) {
        if (content.includes(p.name.toLowerCase())) matches.push(`Author name "${p.name}"`);
      }
      if (p.penNames && Array.isArray(p.penNames)) {
        p.penNames.forEach(pn => {
          if (pn && pn.trim().length > 2 && content.includes(pn.toLowerCase())) {
            matches.push(`Pen name "${pn}"`);
          }
        });
      }
      if (p.emails && Array.isArray(p.emails)) {
        p.emails.forEach(em => {
          if (em && em.trim().length > 3 && content.includes(em.toLowerCase())) {
            matches.push(`Email address "${em}"`);
          }
        });
      }
      if (p.phones && Array.isArray(p.phones)) {
        p.phones.forEach(ph => {
          if (ph && ph.trim().length > 4 && content.includes(ph.toLowerCase())) {
            matches.push(`Phone number "${ph}"`);
          }
        });
      }
    }

    // Generic email regex test
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = version.content.match(emailRegex);
    if (emailMatches) {
      emailMatches.forEach(em => {
        if (!matches.some(m => m.includes(em))) matches.push(`Email found: "${em}"`);
      });
    }

    // Byline check (e.g. "by Author Name" on first 5 lines)
    const firstLines = version.content.split('\n').slice(0, 5).join('\n').toLowerCase();
    if (firstLines.includes('by ') || firstLines.includes('written by')) {
      matches.push('Byline phrasing detected on opening lines');
    }

    return { matches };
  },

  // ==========================================
  // 2. PIECES & VERSION CONTROL
  // ==========================================
  renderPiecesView() {
    const listEl = document.getElementById('pieces-sidebar-list');
    if (!listEl) return;

    if (this.pieces.length === 0) {
      listEl.innerHTML = `<li class="empty-state" style="padding: 1.5rem 0.5rem;"><div class="text-sm text-muted">No pieces in library.</div></li>`;
      document.getElementById('piece-detail-pane').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <div class="empty-text">Your Piece Library is empty.<br>Click <strong>+ New</strong> to add your first story, essay, or poem.</div>
        </div>
      `;
      return;
    }

    const currentPieceId = this.selectedPieceId || this.pieces[0].id;
    this.selectedPieceId = currentPieceId;

    listEl.innerHTML = this.pieces.map(p => {
      const activeClass = p.id === currentPieceId ? 'active' : '';
      const versions = this.pieceVersions.filter(v => v.pieceId === p.id);
      const latestVer = versions[0];
      const words = latestVer ? latestVer.wordCount : 0;
      return `
        <li class="sidebar-item ${activeClass}" onclick="App.selectPiece('${p.id}')">
          <div class="item-title-row">
            <span class="item-title">${this.escapeHtml(p.title)}</span>
            <span class="badge badge-neutral" style="font-size: 0.68rem;">${this.escapeHtml(p.type || 'Piece')}</span>
          </div>
          <div class="item-meta">
            <span>${words.toLocaleString()} words</span>
            <span>·</span>
            <span>${versions.length} ver</span>
          </div>
        </li>
      `;
    }).join('');

    this.renderSelectedPieceDetail();
  },

  selectPiece(pieceId) {
    this.selectedPieceId = pieceId;
    this.renderPiecesView();
  },

  renderSelectedPieceDetail() {
    const pane = document.getElementById('piece-detail-pane');
    if (!pane || !this.selectedPieceId) return;

    const piece = this.pieces.find(p => p.id === this.selectedPieceId);
    if (!piece) return;

    const versions = this.pieceVersions.filter(v => v.pieceId === piece.id);
    const activeVerId = this.selectedVersionId && versions.some(v => v.id === this.selectedVersionId)
      ? this.selectedVersionId
      : (versions[0] ? versions[0].id : null);
    this.selectedVersionId = activeVerId;
    const currentVer = versions.find(v => v.id === activeVerId);

    // Active submissions for this piece
    const activeSubs = this.submissions.filter(s => s.pieceId === piece.id);

    pane.innerHTML = `
      <div class="section-header">
        <div>
          <div class="flex-between gap-2">
            <h2 class="section-title">${this.escapeHtml(piece.title)}</h2>
            <span class="badge badge-berry">${this.escapeHtml(piece.type || 'Piece')}</span>
          </div>
          <div class="section-subtitle">
            Genre: ${this.escapeHtml(piece.genre || 'General')} · Publication: ${this.escapeHtml(piece.publicationState || 'Unpublished')} · Rights: ${this.escapeHtml(piece.rightsState || 'All Available')}
          </div>
        </div>
        <div class="flex-between gap-2">
          <button class="btn btn-sm" onclick="App.openBranchVersionModal('${currentVer ? currentVer.id : ''}')">🌿 Duplicate as Contest Cut</button>
          <button class="btn btn-sm btn-danger" onclick="App.deletePiece('${piece.id}')">Delete Piece</button>
        </div>
      </div>

      <!-- ACTIVE SUBMISSIONS CALLOUT -->
      ${activeSubs.length > 0 ? `
        <div class="card" style="background-color: var(--bg-surface-elevated); border-left: 3px solid var(--brand-warm-saffron);">
          <div class="card-title text-saffron" style="font-size: 0.85rem; margin-bottom: 0.25rem;">
            <span>📬 Active Submissions for this Piece (${activeSubs.length})</span>
          </div>
          <div class="text-sm text-secondary">
            ${activeSubs.map(s => {
              const opp = this.opportunities.find(o => o.id === s.opportunityId);
              const status = this.getLatestSubStatus(s.id);
              return `• <strong>${this.escapeHtml(opp ? opp.name : 'Opportunity')}</strong> &mdash; Status: <span class="badge badge-neutral">${status.toUpperCase()}</span> (${this.formatDate(s.submittedAt)})`;
            }).join('<br>')}
          </div>
        </div>
      ` : ''}

      <!-- VERSION LINEAGE SELECTOR -->
      <div class="card">
        <div class="card-title">
          <span>Named Versions (${versions.length})</span>
          <span class="text-sm text-muted">Never overwrite historical submissions</span>
        </div>
        <div class="version-tree">
          ${versions.map(v => {
            const isSel = v.id === activeVerId;
            const parentVer = v.parentVersionId ? versions.find(pv => pv.id === v.parentVersionId) : null;
            return `
              <div class="version-node ${isSel ? 'active' : ''} ${v.lockedBySubmission ? 'locked' : ''}" onclick="App.selectVersion('${v.id}')">
                <div>
                  <div class="version-node-title">
                    ${this.escapeHtml(v.name)}
                    ${v.lockedBySubmission ? '<span class="badge badge-berry" style="font-size: 0.65rem; margin-left: 0.5rem;">Submitted Snapshot (Protected)</span>' : ''}
                  </div>
                  <div class="version-node-meta">
                    ${parentVer ? `Created from: <em>${this.escapeHtml(parentVer.name)}</em> · ` : ''}
                    ${v.wordCount} words · Last edited: ${this.formatDateTime(v.updatedAt || v.createdAt)}
                  </div>
                  ${v.authorNote ? `<div class="text-sm text-muted mt-1"><em>"${this.escapeHtml(v.authorNote)}"</em></div>` : ''}
                </div>
                <div class="flex-between gap-2">
                  <span class="font-mono text-sm">${v.wordCount} w</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ACTIVE VERSION MANUSCRIPT EDITOR / VIEWER -->
      ${currentVer ? `
        <div class="card">
          <div class="card-title flex-between">
            <span>Manuscript Text &mdash; ${this.escapeHtml(currentVer.name)}</span>
            <div class="flex-between gap-2">
              <span class="font-mono text-sm" id="editor-word-count">${currentVer.wordCount} words</span>
              ${!currentVer.lockedBySubmission ? `<button class="btn btn-sm btn-primary" onclick="App.saveCurrentVersionText('${currentVer.id}')">Save Changes</button>` : ''}
            </div>
          </div>
          ${currentVer.lockedBySubmission ? `
            <div class="snapshot-badge-bar">
              <span>🔒 This version was referenced in a completed submission and is write-protected.</span>
              <button class="btn btn-sm" onclick="App.openBranchVersionModal('${currentVer.id}')">Branch New Working Version</button>
            </div>
          ` : ''}
          <textarea class="form-textarea manuscript-editor" id="current-version-editor" ${currentVer.lockedBySubmission ? 'readonly' : ''} oninput="App.onEditorTextInput(this.value)">${this.escapeHtml(currentVer.content || '')}</textarea>
        </div>

        <!-- QUICK LIGHTWEIGHT VERSION COMPARISON -->
        ${versions.length > 1 ? `
          <div class="card">
            <div class="card-title">
              <span>Compare with Another Version</span>
              <select class="form-select" style="width: auto; font-size: 0.78rem;" id="compare-target-select" onchange="App.runVersionComparison('${currentVer.id}', this.value)">
                <option value="">-- Choose Version to Compare --</option>
                ${versions.filter(v => v.id !== currentVer.id).map(v => `<option value="${v.id}">${this.escapeHtml(v.name)} (${v.wordCount}w)</option>`).join('')}
              </select>
            </div>
            <div id="version-diff-output" style="display: none;" class="diff-container mt-2">
              <!-- Rendered by JS -->
            </div>
          </div>
        ` : ''}
      ` : ''}
    `;
  },

  selectVersion(versionId) {
    this.selectedVersionId = versionId;
    this.renderSelectedPieceDetail();
  },

  onEditorTextInput(text) {
    const count = this.countWords(text);
    const badge = document.getElementById('editor-word-count');
    if (badge) badge.textContent = `${count} words`;
  },

  async saveCurrentVersionText(versionId) {
    const editor = document.getElementById('current-version-editor');
    if (!editor) return;

    const content = editor.value;
    const wordCount = this.countWords(content);
    const ver = this.pieceVersions.find(v => v.id === versionId);
    if (!ver) return;

    if (ver.lockedBySubmission) {
      alert('This version is locked by a historical submission. Please duplicate it as a new Contest Cut to edit.');
      return;
    }

    ver.content = content;
    ver.wordCount = wordCount;
    ver.updatedAt = new Date().toISOString();

    await window.contestAtlasDB.put(ATLAS_STORES.PIECE_VERSIONS, ver);
    this.renderPiecesView();
  },

  openNewPieceModal() {
    document.getElementById('piece-id').value = '';
    document.getElementById('piece-title').value = '';
    document.getElementById('piece-type').value = 'Short Story';
    document.getElementById('piece-genre').value = '';
    document.getElementById('piece-pub-state').value = 'unpublished';
    document.getElementById('piece-rights-state').value = 'allRightsAvailable';
    document.getElementById('piece-initial-content').value = '';
    document.getElementById('piece-tags').value = '';
    document.getElementById('modal-piece-title').textContent = 'Add New Piece';
    this.openModal('modal-piece');
  },

  async savePieceForm(e) {
    e.preventDefault();
    const title = document.getElementById('piece-title').value.trim();
    if (!title) return;

    const type = document.getElementById('piece-type').value;
    const genre = document.getElementById('piece-genre').value.trim();
    const pubState = document.getElementById('piece-pub-state').value;
    const rightsState = document.getElementById('piece-rights-state').value;
    const initialContent = document.getElementById('piece-initial-content').value;
    const tags = document.getElementById('piece-tags').value.split(',').map(t => t.trim()).filter(Boolean);

    const pieceId = 'p_' + Date.now();
    const now = new Date().toISOString();

    const piece = {
      id: pieceId,
      title,
      type,
      genre,
      publicationState: pubState,
      rightsState,
      tags,
      createdAt: now,
      updatedAt: now
    };

    const initialVersion = {
      id: 'pv_' + Date.now(),
      pieceId,
      name: 'Original Draft',
      content: initialContent,
      wordCount: this.countWords(initialContent),
      parentVersionId: null,
      authorNote: 'Initial created draft',
      createdAt: now,
      updatedAt: now,
      lockedBySubmission: false
    };

    await window.contestAtlasDB.put(ATLAS_STORES.PIECES, piece);
    await window.contestAtlasDB.put(ATLAS_STORES.PIECE_VERSIONS, initialVersion);

    this.pieces.push(piece);
    this.pieceVersions.push(initialVersion);
    this.selectedPieceId = pieceId;
    this.selectedVersionId = initialVersion.id;

    this.closeModal('modal-piece');
    this.checkFirstRun();
    this.renderPiecesView();
  },

  openBranchVersionModal(parentVerId) {
    if (!parentVerId) {
      alert('Please select a parent version to duplicate.');
      return;
    }
    const parentVer = this.pieceVersions.find(v => v.id === parentVerId);
    document.getElementById('branch-version-name').value = parentVer ? `${parentVer.name} (Contest Cut)` : 'Contest Cut';
    document.getElementById('branch-version-note').value = '';
    this.pendingParentVerId = parentVerId;
    this.openModal('modal-branch-version');
  },

  async confirmBranchVersion() {
    const parentVerId = this.pendingParentVerId;
    const name = document.getElementById('branch-version-name').value.trim();
    const note = document.getElementById('branch-version-note').value.trim();
    if (!name || !parentVerId) return;

    const parentVer = this.pieceVersions.find(v => v.id === parentVerId);
    if (!parentVer) return;

    const now = new Date().toISOString();
    const newVer = {
      id: 'pv_' + Date.now(),
      pieceId: parentVer.pieceId,
      name,
      content: parentVer.content,
      wordCount: parentVer.wordCount,
      parentVersionId: parentVer.id,
      authorNote: note || `Duplicated from ${parentVer.name}`,
      createdAt: now,
      updatedAt: now,
      lockedBySubmission: false
    };

    await window.contestAtlasDB.put(ATLAS_STORES.PIECE_VERSIONS, newVer);
    this.pieceVersions.push(newVer);
    this.selectedVersionId = newVer.id;

    this.closeModal('modal-branch-version');
    this.renderPiecesView();
  },

  async deletePiece(pieceId) {
    const subs = this.submissions.filter(s => s.pieceId === pieceId);
    if (subs.length > 0) {
      alert(`Cannot delete this piece because it is referenced in ${subs.length} historical submission record(s).`);
      return;
    }

    if (!confirm('Are you sure you want to delete this piece and all its versions?')) return;

    await window.contestAtlasDB.delete(ATLAS_STORES.PIECES, pieceId);
    const vers = this.pieceVersions.filter(v => v.pieceId === pieceId);
    for (const v of vers) {
      await window.contestAtlasDB.delete(ATLAS_STORES.PIECE_VERSIONS, v.id);
    }

    this.pieces = this.pieces.filter(p => p.id !== pieceId);
    this.pieceVersions = this.pieceVersions.filter(v => v.pieceId !== pieceId);
    this.selectedPieceId = this.pieces.length > 0 ? this.pieces[0].id : null;
    this.selectedVersionId = null;

    this.checkFirstRun();
    this.renderPiecesView();
  },

  runVersionComparison(verIdA, verIdB) {
    const out = document.getElementById('version-diff-output');
    if (!out) return;
    if (!verIdB) {
      out.style.display = 'none';
      return;
    }

    const verA = this.pieceVersions.find(v => v.id === verIdA);
    const verB = this.pieceVersions.find(v => v.id === verIdB);
    if (!verA || !verB) return;

    out.style.display = 'grid';
    out.innerHTML = `
      <div class="diff-pane">
        <strong>${this.escapeHtml(verA.name)}</strong> (${verA.wordCount}w)<br><br>
        ${this.escapeHtml(verA.content || '')}
      </div>
      <div class="diff-pane">
        <strong>${this.escapeHtml(verB.name)}</strong> (${verB.wordCount}w)<br><br>
        ${this.escapeHtml(verB.content || '')}
      </div>
    `;
  },

  filterPiecesList(query) {
    const q = (query || '').toLowerCase();
    const items = document.querySelectorAll('#pieces-sidebar-list .sidebar-item');
    items.forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(q) ? 'flex' : 'none';
    });
  },

  // ==========================================
  // 3. OPPORTUNITIES & RULES
  // ==========================================
  renderOpportunitiesView() {
    const listEl = document.getElementById('opp-sidebar-list');
    if (!listEl) return;

    if (this.opportunities.length === 0) {
      listEl.innerHTML = `<li class="empty-state" style="padding: 1.5rem 0.5rem;"><div class="text-sm text-muted">No opportunities added.</div></li>`;
      document.getElementById('opp-detail-pane').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎯</div>
          <div class="empty-text">No opportunities found.<br>Click <strong>+ New</strong> to record a contest, magazine, or fellowship.</div>
        </div>
      `;
      return;
    }

    const currentOppId = this.selectedOppId || this.opportunities[0].id;
    this.selectedOppId = currentOppId;

    let bannerHtml = '';
    if (!this.isPro()) {
      const used = this.opportunities.length;
      const max = this.getMaxFreeOpportunities();
      bannerHtml = `
        <li style="padding: 0.4rem 0.5rem; list-style: none;">
          <div class="pro-limit-banner" style="margin: 0; padding: 0.45rem 0.65rem; font-size: 0.78rem;">
            <div>
              <strong style="color: var(--brand-warm-saffron);">Free Plan:</strong> ${used}/${max} Contests
            </div>
            <button class="btn btn-xs btn-saffron" style="padding: 0.2rem 0.45rem; font-size: 0.72rem;" onclick="App.openProUpgradeModal('opp_sidebar')">⚡ Unlock $49</button>
          </div>
        </li>
      `;
    }

    listEl.innerHTML = bannerHtml + this.opportunities.map(o => {
      const isSel = o.id === currentOppId;
      const deadlineStr = o.rolling ? 'Rolling' : this.formatDate(o.deadlineDate);
      return `
        <li class="sidebar-item ${isSel ? 'active' : ''}" onclick="App.selectOpportunity('${o.id}')">
          <div class="item-title-row">
            <span class="item-title">${this.escapeHtml(o.name)}</span>
            <span class="badge badge-neutral" style="font-size: 0.68rem;">${this.escapeHtml(o.type || 'Contest')}</span>
          </div>
          <div class="item-meta">
            <span>${this.escapeHtml(o.organization || 'Independent')}</span>
            <span>·</span>
            <span class="text-saffron">${deadlineStr}</span>
          </div>
        </li>
      `;
    }).join('');

    this.renderSelectedOpportunityDetail();
  },

  selectOpportunity(oppId) {
    this.selectedOppId = oppId;
    this.renderOpportunitiesView();
  },

  renderSelectedOpportunityDetail() {
    const pane = document.getElementById('opp-detail-pane');
    if (!pane || !this.selectedOppId) return;

    const opp = this.opportunities.find(o => o.id === this.selectedOppId);
    if (!opp) return;

    // Timezone computation
    const deadlineUtc = this.computeUtcDeadline(opp.deadlineDate, opp.deadlineTime, opp.deadlineTimeZone);
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    pane.innerHTML = `
      <div class="section-header">
        <div>
          <div class="flex-between gap-2">
            <h2 class="section-title">${this.escapeHtml(opp.name)}</h2>
            <span class="badge badge-saffron">${this.escapeHtml(opp.type || 'Contest')}</span>
          </div>
          <div class="section-subtitle">
            Organization: <strong>${this.escapeHtml(opp.organization || 'N/A')}</strong>
            ${opp.website ? `· <a href="${this.escapeHtml(opp.website)}" target="_blank" rel="noopener" style="color: var(--brand-deep-berry);">Website ↗</a>` : ''}
          </div>
        </div>
        <div class="flex-between gap-2">
          <button class="btn btn-sm btn-primary" onclick="App.openPrepareForOpp('${opp.id}')">⚡ Check a Piece</button>
          <button class="btn btn-sm btn-danger" onclick="App.deleteOpportunity('${opp.id}')">Delete</button>
        </div>
      </div>

      <!-- EXACT DEADLINE & TIMEZONE SAFETY CARD -->
      <div class="timezone-badge">
        <div class="tz-col">
          <span class="tz-label">Opportunity Deadline (${this.escapeHtml(opp.deadlineTimeZone || 'UTC')})</span>
          <span class="tz-time">${opp.rolling ? 'Rolling Deadline' : `${opp.deadlineDate} · ${opp.deadlineTime || '11:59 PM'}`}</span>
        </div>
        ${deadlineUtc ? `
          <div class="tz-col">
            <span class="tz-label">Your Local Time (${this.escapeHtml(localTz)})</span>
            <span class="tz-time text-saffron">${this.formatDateTime(deadlineUtc.toISOString())}</span>
          </div>
        ` : ''}
      </div>

      <!-- RULES & RESTRICTIONS SUMMARY -->
      <div class="card">
        <div class="card-title">Structured Submission Rules</div>
        <div class="form-row">
          <div>
            <div class="text-sm text-muted">Word Limit</div>
            <div><strong>${opp.minWords ? `${opp.minWords} – ` : ''}${opp.maxWords ? `${opp.maxWords} words max` : 'No word limit specified'}</strong></div>
          </div>
          <div>
            <div class="text-sm text-muted">Entry Fee / Prize</div>
            <div><strong>${this.formatMoney(opp.feeAmount)}</strong> / ${this.escapeHtml(opp.prizeAmount || 'None specified')}</div>
          </div>
          <div>
            <div class="text-sm text-muted">Blind / Anonymous Judging</div>
            <div><strong>${opp.blindJudging ? '✓ Required (Blind)' : '○ Author Name Permitted'}</strong></div>
          </div>
          <div>
            <div class="text-sm text-muted">Simultaneous Submissions</div>
            <div><strong>${opp.simultaneousAllowed ? '✓ Permitted' : '🚫 Prohibited'}</strong></div>
          </div>
        </div>
        <div class="form-row mt-2" style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <div>
            <div class="text-sm text-muted">Publication Requirement</div>
            <div><strong>${opp.unpublishedOnly ? 'Unpublished Work Only' : 'Reprints / Published Accepted'}</strong></div>
          </div>
          <div>
            <div class="text-sm text-muted">Required Format</div>
            <div><strong>${this.escapeHtml(opp.reqFormat || 'Any Standard')}</strong></div>
          </div>
          <div>
            <div class="text-sm text-muted">Bio / Cover Letter</div>
            <div><strong>Bio: ${this.escapeHtml(opp.reqBio || 'Optional')} · Cover: ${this.escapeHtml(opp.reqCover || 'Optional')}</strong></div>
          </div>
        </div>
      </div>

      <!-- RAW GUIDELINES -->
      ${opp.rawGuidelines ? `
        <div class="card">
          <div class="card-title text-violet">Captured Guidelines Text</div>
          <div style="font-size: 0.82rem; line-height: 1.6; white-space: pre-wrap; color: var(--text-secondary);">${this.escapeHtml(opp.rawGuidelines)}</div>
        </div>
      ` : ''}
    `;
  },

  openPrepareForOpp(oppId) {
    this.switchTab('prepare');
    const sel = document.getElementById('check-select-opp');
    if (sel) {
      sel.value = oppId;
      this.runPackageCheck();
    }
  },

  openNewOpportunityModal() {
    if (!this.isPro() && this.opportunities.length >= this.getMaxFreeOpportunities()) {
      this.openProUpgradeModal('opportunity_limit');
      return;
    }

    document.getElementById('opp-id').value = '';
    document.getElementById('opp-name').value = '';
    document.getElementById('opp-org').value = '';
    document.getElementById('opp-type').value = 'Writing Contest';
    document.getElementById('opp-url').value = '';
    
    // Set default deadline to end of current month
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    document.getElementById('opp-deadline-date').value = lastDay.toISOString().split('T')[0];
    document.getElementById('opp-deadline-time').value = '23:59';
    document.getElementById('opp-timezone').value = 'America/New_York';
    document.getElementById('opp-rolling').checked = false;
    document.getElementById('opp-annual').checked = false;
    document.getElementById('opp-fee').value = '0.00';
    document.getElementById('opp-prize').value = '';
    document.getElementById('opp-raw-guidelines').value = '';
    document.getElementById('guidelines-suggestion-box').style.display = 'none';
    document.getElementById('opp-min-words').value = '';
    document.getElementById('opp-max-words').value = '3000';
    document.getElementById('opp-blind').checked = true;
    document.getElementById('opp-simultaneous').checked = true;
    document.getElementById('opp-unpublished-only').checked = true;
    document.getElementById('opp-req-format').value = 'Any Standard (DOCX / PDF / TXT)';
    document.getElementById('opp-req-bio').value = 'optional';
    document.getElementById('opp-req-cover').value = 'optional';

    this.openModal('modal-opportunity');
  },

  async saveOpportunityForm(e) {
    e.preventDefault();
    const existingId = document.getElementById('opp-id').value;
    if (!existingId && !this.isPro() && this.opportunities.length >= this.getMaxFreeOpportunities()) {
      this.closeModal('modal-opportunity');
      this.openProUpgradeModal('opportunity_limit');
      return;
    }

    const name = document.getElementById('opp-name').value.trim();
    if (!name) return;

    const org = document.getElementById('opp-org').value.trim();
    const type = document.getElementById('opp-type').value;
    const website = document.getElementById('opp-url').value.trim();
    const deadlineDate = document.getElementById('opp-deadline-date').value;
    const deadlineTime = document.getElementById('opp-deadline-time').value;
    const deadlineTimeZone = document.getElementById('opp-timezone').value;
    const rolling = document.getElementById('opp-rolling').checked;
    const annualRecurring = document.getElementById('opp-annual').checked;
    const feeAmount = parseFloat(document.getElementById('opp-fee').value) || 0;
    const prizeAmount = document.getElementById('opp-prize').value.trim();
    const rawGuidelines = document.getElementById('opp-raw-guidelines').value.trim();
    const minWords = parseInt(document.getElementById('opp-min-words').value) || null;
    const maxWords = parseInt(document.getElementById('opp-max-words').value) || null;
    const blindJudging = document.getElementById('opp-blind').checked;
    const simultaneousAllowed = document.getElementById('opp-simultaneous').checked;
    const unpublishedOnly = document.getElementById('opp-unpublished-only').checked;
    const reqFormat = document.getElementById('opp-req-format').value;
    const reqBio = document.getElementById('opp-req-bio').value;
    const reqCover = document.getElementById('opp-req-cover').value;

    const oppId = 'o_' + Date.now();
    const now = new Date().toISOString();

    const deadlineUtc = this.computeUtcDeadline(deadlineDate, deadlineTime, deadlineTimeZone);

    // 1. Create opportunity rule version record
    const ruleVersionId = 'orv_' + Date.now();
    const ruleVersion = {
      id: ruleVersionId,
      opportunityId: oppId,
      versionNumber: 1,
      verifiedAt: now,
      sourceUrl: website,
      minWords,
      maxWords,
      blindJudging,
      simultaneousAllowed,
      unpublishedOnly,
      reqFormat,
      reqBio,
      reqCover,
      feeAmount,
      prizeAmount,
      rawGuidelines,
      createdAt: now
    };

    const opp = {
      id: oppId,
      name,
      organization: org,
      type,
      website,
      deadlineDate,
      deadlineTime,
      deadlineTimeZone,
      deadlineUtc: deadlineUtc ? deadlineUtc.toISOString() : null,
      rolling,
      annualRecurring,
      feeAmount,
      prizeAmount,
      currentRuleVersionId: ruleVersionId,
      rawGuidelines,
      minWords,
      maxWords,
      blindJudging,
      simultaneousAllowed,
      unpublishedOnly,
      reqFormat,
      reqBio,
      reqCover,
      createdAt: now,
      updatedAt: now
    };

    await window.contestAtlasDB.put(ATLAS_STORES.OPPORTUNITY_RULE_VERSIONS, ruleVersion);
    await window.contestAtlasDB.put(ATLAS_STORES.OPPORTUNITIES, opp);
    
    this.opportunityRules.push(ruleVersion);
    this.opportunities.push(opp);
    this.selectedOppId = oppId;

    this.closeModal('modal-opportunity');
    this.checkFirstRun();
    this.renderHeaderTierBadge();
    this.renderOpportunitiesView();
  },

  async deleteOpportunity(oppId) {
    const subs = this.submissions.filter(s => s.opportunityId === oppId);
    if (subs.length > 0) {
      alert(`Cannot delete this opportunity because it is referenced in ${subs.length} historical submission record(s).`);
      return;
    }

    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    await window.contestAtlasDB.delete(ATLAS_STORES.OPPORTUNITIES, oppId);
    this.opportunities = this.opportunities.filter(o => o.id !== oppId);
    this.selectedOppId = this.opportunities.length > 0 ? this.opportunities[0].id : null;

    this.checkFirstRun();
    this.renderHeaderTierBadge();
    this.renderOpportunitiesView();
  },

  // ==========================================
  // SMART GUIDELINES AUTO-EXTRACTOR
  // ==========================================
  runGuidelinesExtraction() {
    const text = document.getElementById('opp-raw-guidelines')?.value || '';
    if (!text.trim()) {
      alert('Please paste raw guidelines or requirements text into the box first.');
      return;
    }

    const suggestions = [];
    const lower = text.toLowerCase();

    // 1. Opportunity Name / Title Detection
    const nameMatch = text.match(/(?:Annual\s+|The\s+)?([A-Z][A-Za-z0-9\s'&–—]+(?:Award|Prize|Contest|Fellowship|Grant|Quarterly|Review|Magazine|Competition))/);
    if (nameMatch && nameMatch[1]) {
      const oppTitle = nameMatch[1].trim();
      suggestions.push({
        label: `Detected Name: "${oppTitle}"`,
        apply: () => {
          const nameInput = document.getElementById('opp-name');
          if (!nameInput.value || nameInput.value === 'New Opportunity') nameInput.value = oppTitle;
        }
      });
    }

    // 2. Deadline Date & Timezone Extraction
    const monthNames = {
      january: '01', jan: '01', february: '02', feb: '02', march: '03', mar: '03',
      april: '04', apr: '04', may: '05', june: '06', jun: '06',
      july: '07', jul: '07', august: '08', aug: '08', september: '09', sep: '09', sept: '09',
      october: '10', oct: '10', november: '11', nov: '11', december: '12', dec: '12'
    };
    
    const dateRegex = /(?:deadline|due|by|closes|closing date|before)\s*:?\s*(?:on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?/i;
    const dateMatch = text.match(dateRegex);
    if (dateMatch) {
      const monthStr = dateMatch[1].toLowerCase();
      const month = monthNames[monthStr];
      const day = dateMatch[2].padStart(2, '0');
      const year = dateMatch[3] || new Date().getFullYear().toString();
      const formattedDate = `${year}-${month}-${day}`;
      
      suggestions.push({
        label: `Deadline Date: ${formattedDate} (${dateMatch[1]} ${dateMatch[2]}, ${year})`,
        apply: () => { document.getElementById('opp-deadline-date').value = formattedDate; }
      });
    }

    // Time & Timezone detection
    if (lower.includes('11:59') || lower.includes('midnight')) {
      suggestions.push({ label: 'Deadline Time: 23:59 (End of Day)', apply: () => { document.getElementById('opp-deadline-time').value = '23:59'; } });
    } else if (lower.includes('5:00 pm') || lower.includes('5 pm') || lower.includes('5:00pm')) {
      suggestions.push({ label: 'Deadline Time: 17:00 (5:00 PM)', apply: () => { document.getElementById('opp-deadline-time').value = '17:00'; } });
    }

    if (lower.includes('est') || lower.includes('eastern') || lower.includes('edt')) {
      suggestions.push({ label: 'Timezone: Eastern Time (America/New_York)', apply: () => { document.getElementById('opp-timezone').value = 'America/New_York'; } });
    } else if (lower.includes('cst') || lower.includes('central') || lower.includes('cdt')) {
      suggestions.push({ label: 'Timezone: Central Time (America/Chicago)', apply: () => { document.getElementById('opp-timezone').value = 'America/Chicago'; } });
    } else if (lower.includes('pst') || lower.includes('pacific') || lower.includes('pdt')) {
      suggestions.push({ label: 'Timezone: Pacific Time (America/Los_Angeles)', apply: () => { document.getElementById('opp-timezone').value = 'America/Los_Angeles'; } });
    } else if (lower.includes('gmt') || lower.includes('bst') || lower.includes('london')) {
      suggestions.push({ label: 'Timezone: London / GMT (Europe/London)', apply: () => { document.getElementById('opp-timezone').value = 'Europe/London'; } });
    }

    // 3. Word Limits (Min and Max)
    const betweenMatch = lower.match(/between\s*([\d,]+)\s*(?:and|to)\s*([\d,]+)\s*words/i);
    if (betweenMatch) {
      const minNum = parseInt(betweenMatch[1].replace(/,/g, ''));
      const maxNum = parseInt(betweenMatch[2].replace(/,/g, ''));
      if (minNum > 0 && maxNum > 0) {
        suggestions.push({
          label: `Word Limits: ${minNum.toLocaleString()} min — ${maxNum.toLocaleString()} max`,
          apply: () => {
            document.getElementById('opp-min-words').value = minNum;
            document.getElementById('opp-max-words').value = maxNum;
          }
        });
      }
    } else {
      const maxMatch = lower.match(/(?:maximum|up to|max\.?|under|no more than|limit of)\s*([\d,]+)\s*words/i) ||
                       lower.match(/([\d,]+)\s*words?\s*(?:maximum|max|limit|or fewer|or less)/i);
      if (maxMatch) {
        const num = parseInt(maxMatch[1].replace(/,/g, ''));
        if (num > 0) {
          suggestions.push({ label: `Maximum word limit: ${num.toLocaleString()} words`, apply: () => { document.getElementById('opp-max-words').value = num; } });
        }
      }
      const minMatch = lower.match(/(?:at least|minimum of|minimum)\s*([\d,]+)\s*words/i);
      if (minMatch) {
        const minNum = parseInt(minMatch[1].replace(/,/g, ''));
        if (minNum > 0) {
          suggestions.push({ label: `Minimum word limit: ${minNum.toLocaleString()} words`, apply: () => { document.getElementById('opp-min-words').value = minNum; } });
        }
      }
    }

    // 4. Entry Fee
    if (lower.includes('free to enter') || lower.includes('no entry fee') || lower.includes('no fee') || lower.includes('free submission')) {
      suggestions.push({ label: 'Entry Fee: Free ($0.00)', apply: () => { document.getElementById('opp-fee').value = '0.00'; } });
    } else {
      const feeMatch = lower.match(/\$([\d.]+)\s*(?:entry\s*fee|reading\s*fee|fee)/i) ||
                       lower.match(/(?:entry\s*fee|reading\s*fee|fee)\s*of\s*\$([\d.]+)/i) ||
                       lower.match(/(?:£|€)([\d.]+)\s*(?:entry|fee)/i);
      if (feeMatch) {
        const fee = parseFloat(feeMatch[1]);
        if (!isNaN(fee)) {
          suggestions.push({ label: `Entry fee: $${fee.toFixed(2)}`, apply: () => { document.getElementById('opp-fee').value = fee.toFixed(2); } });
        }
      }
    }

    // 5. Prize Amount
    const prizeMatch = text.match(/\$([\d,]+(?:\.\d{2})?)\s*(?:cash\s*)?(?:first prize|grand prize|prize|award|fellowship|grant)/i) ||
                       text.match(/(?:prize|award|winner receives)\s*(?:of\s*)?\$([\d,]+)/i) ||
                       text.match(/£([\d,]+)\s*(?:prize|award|first prize)/i);
    if (prizeMatch) {
      const prizeStr = '$' + prizeMatch[1];
      suggestions.push({ label: `Prize Amount: ${prizeStr}`, apply: () => { document.getElementById('opp-prize').value = prizeStr; } });
    }

    // 6. Blind / Anonymous Judging
    if (lower.includes('blind') || lower.includes('anonymous') || lower.includes('do not include your name') || lower.includes('remove all identifying') || lower.includes('no author name')) {
      suggestions.push({ label: 'Blind / Anonymous judging required (Checked)', apply: () => { document.getElementById('opp-blind').checked = true; } });
    } else if (lower.includes('include your name') || lower.includes('name on every page')) {
      suggestions.push({ label: 'Non-blind judging detected (Unchecked)', apply: () => { document.getElementById('opp-blind').checked = false; } });
    }

    // 7. Simultaneous Submissions
    if (lower.includes('simultaneous submissions are accepted') || lower.includes('simultaneous submissions permitted') || lower.includes('simultaneous submissions welcome') || lower.includes('simultaneous submissions allowed')) {
      suggestions.push({ label: 'Simultaneous submissions permitted (Checked)', apply: () => { document.getElementById('opp-simultaneous').checked = true; } });
    } else if (lower.includes('no simultaneous') || lower.includes('simultaneous submissions not accepted') || lower.includes('do not submit simultaneously')) {
      suggestions.push({ label: 'Simultaneous submissions prohibited (Unchecked)', apply: () => { document.getElementById('opp-simultaneous').checked = false; } });
    }

    // 8. Previously Unpublished Only
    if (lower.includes('previously unpublished') || lower.includes('unpublished work only') || lower.includes('unpublished pieces')) {
      suggestions.push({ label: 'Unpublished work only required (Checked)', apply: () => { document.getElementById('opp-unpublished-only').checked = true; } });
    }

    // 9. Required Format
    if (lower.includes('.docx') || lower.includes('word document') || lower.includes('docx only')) {
      suggestions.push({ label: 'Format: DOCX (.docx)', apply: () => { document.getElementById('opp-req-format').value = 'DOCX'; } });
    } else if (lower.includes('.pdf') || lower.includes('pdf only')) {
      suggestions.push({ label: 'Format: PDF (.pdf)', apply: () => { document.getElementById('opp-req-format').value = 'PDF'; } });
    }

    const box = document.getElementById('guidelines-suggestion-box');
    const list = document.getElementById('suggested-rules-list');
    if (!box || !list) return;

    if (suggestions.length === 0) {
      list.innerHTML = '<li class="text-muted">No automatic patterns detected from pasted text. Please manually configure fields.</li>';
    } else {
      list.innerHTML = suggestions.map((s, i) => `
        <li style="margin-bottom: 0.35rem; display: flex; align-items: center; justify-content: space-between;">
          <span>${this.escapeHtml(s.label)}</span>
          <button type="button" class="btn btn-xs btn-ghost" style="padding: 0.1rem 0.4rem; font-size: 0.72rem; color: var(--brand-warm-saffron);" onclick="App._applySuggestion(${i})">Apply</button>
        </li>
      `).join('');
      this._currentSuggestions = suggestions;
    }
    box.style.display = 'block';
  },

  applyAllExtractedGuidelines() {
    if (this._currentSuggestions && this._currentSuggestions.length > 0) {
      this._currentSuggestions.forEach(s => {
        try { s.apply(); } catch (e) {}
      });
      alert(`Applied ${this._currentSuggestions.length} extracted rule(s) to the opportunity form.`);
    }
  },

  _applySuggestion(idx) {
    if (this._currentSuggestions && this._currentSuggestions[idx]) {
      this._currentSuggestions[idx].apply();
    }
  },

  // ==========================================
  // CURATED CONTEST DIRECTORY BROWSER
  // ==========================================
  openDirectoryModal() {
    this.openModal('modal-contest-directory');
    this.filterDirectoryList();
  },

  filterDirectoryList() {
    const q = (document.getElementById('dir-search-input')?.value || '').toLowerCase().trim();
    const cat = document.getElementById('dir-category-filter')?.value || 'all';
    const feeFilter = document.getElementById('dir-fee-filter')?.value || 'all';
    const container = document.getElementById('dir-results-container');
    const countText = document.getElementById('dir-count-text');

    if (!container || !window.CONTEST_DIRECTORY) return;

    const filtered = window.CONTEST_DIRECTORY.filter(item => {
      // 1. Text filter
      if (q) {
        const matchText = (item.name + ' ' + item.organization + ' ' + item.prizeAmount + ' ' + item.rawGuidelines).toLowerCase();
        if (!matchText.includes(q)) return false;
      }
      // 2. Category filter
      if (cat !== 'all' && item.category !== cat) return false;
      // 3. Fee filter
      if (feeFilter === 'free' && item.feeAmount > 0) return false;
      if (feeFilter === 'paid' && item.feeAmount === 0) return false;

      return true;
    });

    if (countText) countText.textContent = `Showing ${filtered.length} of ${window.CONTEST_DIRECTORY.length} verified opportunities`;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state" style="padding: 2rem;"><div class="text-sm text-muted">No contests match your search or filter.</div></div>`;
      return;
    }

    // Check which ones are already imported
    const existingNames = new Set(this.opportunities.map(o => o.name.toLowerCase()));

    container.innerHTML = filtered.map(item => {
      const isAlreadyImported = existingNames.has(item.name.toLowerCase());
      const deadlineStr = item.rolling ? 'Rolling' : this.formatDate(item.deadlineDate);
      const feeStr = item.feeAmount === 0 ? 'Free ($0)' : `$${item.feeAmount.toFixed(2)}`;

      return `
        <div class="card" style="padding: 1rem 1.25rem; margin-bottom: 0; background: var(--bg-surface-elevated); border: 1px solid var(--border-medium); display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <strong style="font-size: 0.95rem; color: var(--text-primary);">${this.escapeHtml(item.name)}</strong>
              <span class="badge badge-neutral" style="font-size: 0.68rem;">${this.escapeHtml(item.category)}</span>
              ${item.blindJudging ? '<span class="badge badge-verify" style="font-size: 0.68rem;">Blind Judging</span>' : ''}
              ${item.feeAmount === 0 ? '<span class="badge badge-ready" style="font-size: 0.68rem;">Free Entry</span>' : ''}
            </div>
            
            <div class="text-xs text-muted mt-1">
              <span>${this.escapeHtml(item.organization)}</span>
              <span>·</span>
              <span class="text-saffron">Due: ${deadlineStr}</span>
              <span>·</span>
              <span>Fee: <strong>${feeStr}</strong></span>
              ${item.prizeAmount ? `<span>·</span> <span class="text-berry">Prize: <strong>${this.escapeHtml(item.prizeAmount)}</strong></span>` : ''}
              ${item.maxWords ? `<span>·</span> <span>Max: <strong>${item.maxWords.toLocaleString()}w</strong></span>` : ''}
            </div>

            <div class="text-xs text-secondary mt-2" style="line-height: 1.4; max-width: 620px;">
              ${this.escapeHtml(item.rawGuidelines)}
            </div>
          </div>

          <div style="flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem;">
            ${isAlreadyImported ? `
              <span class="badge badge-ready" style="font-size: 0.72rem;">✓ In Your Atlas</span>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="App.importOpportunityFromDirectory('${item.id}')">
                + Import
              </button>
            `}
            ${item.website ? `
              <a href="${this.escapeHtml(item.website)}" target="_blank" rel="noopener" class="text-xs text-muted" style="text-decoration: underline;">
                Guidelines ↗
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  async importOpportunityFromDirectory(dirId) {
    if (!this.isPro() && this.opportunities.length >= this.getMaxFreeOpportunities()) {
      this.closeModal('modal-contest-directory');
      this.openProUpgradeModal('opportunity_limit');
      return;
    }

    const item = (window.CONTEST_DIRECTORY || []).find(d => d.id === dirId);
    if (!item) return;

    const oppId = 'o_dir_' + Date.now();
    const now = new Date().toISOString();
    const deadlineUtc = this.computeUtcDeadline(item.deadlineDate, item.deadlineTime, item.deadlineTimeZone);

    const ruleVersionId = 'orv_' + Date.now();
    const ruleVersion = {
      id: ruleVersionId,
      opportunityId: oppId,
      versionNumber: 1,
      verifiedAt: now,
      sourceUrl: item.website,
      minWords: item.minWords,
      maxWords: item.maxWords,
      blindJudging: item.blindJudging,
      simultaneousAllowed: item.simultaneousAllowed,
      unpublishedOnly: item.unpublishedOnly,
      reqFormat: item.reqFormat,
      reqBio: item.reqBio,
      reqCover: item.reqCover,
      feeAmount: item.feeAmount,
      prizeAmount: item.prizeAmount,
      rawGuidelines: item.rawGuidelines,
      createdAt: now
    };

    const opp = {
      id: oppId,
      name: item.name,
      organization: item.organization,
      type: item.type,
      website: item.website,
      deadlineDate: item.deadlineDate,
      deadlineTime: item.deadlineTime,
      deadlineTimeZone: item.deadlineTimeZone,
      deadlineUtc: deadlineUtc ? deadlineUtc.toISOString() : null,
      rolling: item.rolling,
      annualRecurring: item.annualRecurring,
      feeAmount: item.feeAmount,
      prizeAmount: item.prizeAmount,
      currentRuleVersionId: ruleVersionId,
      rawGuidelines: item.rawGuidelines,
      minWords: item.minWords,
      maxWords: item.maxWords,
      blindJudging: item.blindJudging,
      simultaneousAllowed: item.simultaneousAllowed,
      unpublishedOnly: item.unpublishedOnly,
      reqFormat: item.reqFormat,
      reqBio: item.reqBio,
      reqCover: item.reqCover,
      createdAt: now,
      updatedAt: now
    };

    await window.contestAtlasDB.put(ATLAS_STORES.OPPORTUNITY_RULE_VERSIONS, ruleVersion);
    await window.contestAtlasDB.put(ATLAS_STORES.OPPORTUNITIES, opp);

    this.opportunityRules.push(ruleVersion);
    this.opportunities.push(opp);
    this.selectedOppId = oppId;

    this.checkFirstRun();
    this.renderHeaderTierBadge();
    this.filterDirectoryList();
    this.renderOpportunitiesView();
    alert(`"${item.name}" has been imported to your local Opportunities.`);
  },

  computeUtcDeadline(dateStr, timeStr, tzName) {
    if (!dateStr) return null;
    const time = timeStr || '23:59';
    try {
      // Build ISO time representation and use Intl.DateTimeFormat to parse timezone offset
      const targetTz = tzName || 'UTC';
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);

      // Create UTC base timestamp
      const baseUtc = Date.UTC(year, month - 1, day, hour, minute, 0);

      // Format in target timezone to find real offset
      const d = new Date(baseUtc);
      const invDate = new Date(d.toLocaleString('en-US', { timeZone: targetTz }));
      const diff = d.getTime() - invDate.getTime();
      return new Date(baseUtc + diff);
    } catch {
      return new Date(`${dateStr}T${time}:00`);
    }
  },

  filterOpportunitiesList(query) {
    const q = (query || '').toLowerCase();
    const items = document.querySelectorAll('#opp-sidebar-list .sidebar-item');
    items.forEach(el => {
      const text = el.textContent.toLowerCase();
      el.style.display = text.includes(q) ? 'flex' : 'none';
    });
  },

  // ==========================================
  // 4. DEADLINES & CALM DASHBOARD
  // ==========================================
  renderDeadlinesView() {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const dueSoon = [];
    const thisMonth = [];
    const future = [];
    const rolling = [];

    this.opportunities.forEach(o => {
      if (o.rolling) {
        rolling.push(o);
        return;
      }
      const d = this.computeUtcDeadline(o.deadlineDate, o.deadlineTime, o.deadlineTimeZone);
      if (!d) return;

      if (d <= sevenDaysFromNow && d >= now) {
        dueSoon.push({ opp: o, deadline: d });
      } else if (d <= endOfMonth && d > sevenDaysFromNow) {
        thisMonth.push({ opp: o, deadline: d });
      } else if (d > endOfMonth) {
        future.push({ opp: o, deadline: d });
      }
    });

    // Awaiting results: Submissions that are submitted/under consideration
    const awaiting = this.submissions.filter(s => {
      const st = this.getLatestSubStatus(s.id);
      return !['rejected', 'withdrawn', 'no_response', 'winner', 'accepted'].includes(st);
    });

    // Monthly Spend Calculation
    const curMonthSubs = this.submissions.filter(s => {
      if (!s.submittedAt) return false;
      const d = new Date(s.submittedAt);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const totalSpend = curMonthSubs.reduce((sum, s) => sum + (parseFloat(s.feeAmount) || 0), 0);

    const spendAmountEl = document.getElementById('spend-summary-amount');
    const spendTextEl = document.getElementById('spend-summary-text');
    if (spendAmountEl) spendAmountEl.textContent = this.formatMoney(totalSpend);
    if (spendTextEl) spendTextEl.textContent = `${curMonthSubs.length} submission(s) logged in ${now.toLocaleString('default', { month: 'long' })}`;

    // Render Grids
    this.renderDeadlineGrid('grid-due-soon', dueSoon, 'urgent');
    this.renderDeadlineGrid('grid-this-month', thisMonth, '');
    this.renderDeadlineGrid('grid-future', future, '');
    this.renderRollingGrid('grid-rolling', rolling);
    this.renderAwaitingGrid('grid-awaiting', awaiting);

    const dueEl = document.getElementById('count-due-soon');
    const monthEl = document.getElementById('count-this-month');
    const futureEl = document.getElementById('count-future');
    const rollEl = document.getElementById('count-rolling');
    const waitEl = document.getElementById('count-awaiting');

    if (dueEl) dueEl.textContent = dueSoon.length;
    if (monthEl) monthEl.textContent = thisMonth.length;
    if (futureEl) futureEl.textContent = future.length;
    if (rollEl) rollEl.textContent = rolling.length;
    if (waitEl) waitEl.textContent = awaiting.length;
  },

  renderDeadlineGrid(containerId, items, extraClass) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (items.length === 0) {
      el.innerHTML = `<div class="text-sm text-muted" style="grid-column: 1 / -1; padding: 0.5rem 0;">None scheduled.</div>`;
      return;
    }

    el.innerHTML = items.map(item => {
      const opp = item.opp;
      return `
        <div class="deadline-card ${extraClass}" onclick="App.openOpportunityDetail('${opp.id}')">
          <div class="deadline-card-header">
            <div>
              <div class="deadline-opp-name">${this.escapeHtml(opp.name)}</div>
              <div class="deadline-org">${this.escapeHtml(opp.organization || opp.type)}</div>
            </div>
            <span class="deadline-pill">${opp.deadlineDate}</span>
          </div>
          <div class="text-sm text-muted">
            Time: ${opp.deadlineTime || '11:59 PM'} ${this.escapeHtml(opp.deadlineTimeZone || 'ET')}
          </div>
          <div class="flex-between mt-2">
            <span class="badge badge-neutral">${this.formatMoney(opp.feeAmount)} Fee</span>
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); App.openPrepareForOpp('${opp.id}')">Prepare</button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderRollingGrid(containerId, items) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = `<div class="text-sm text-muted" style="grid-column: 1 / -1; padding: 0.5rem 0;">No rolling opportunities.</div>`;
      return;
    }
    el.innerHTML = items.map(opp => `
      <div class="deadline-card" onclick="App.openOpportunityDetail('${opp.id}')">
        <div class="deadline-card-header">
          <div>
            <div class="deadline-opp-name">${this.escapeHtml(opp.name)}</div>
            <div class="deadline-org">${this.escapeHtml(opp.organization || opp.type)}</div>
          </div>
          <span class="badge badge-neutral">Rolling</span>
        </div>
        <div class="flex-between mt-2">
          <span class="badge badge-neutral">${this.formatMoney(opp.feeAmount)} Fee</span>
          <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); App.openPrepareForOpp('${opp.id}')">Prepare</button>
        </div>
      </div>
    `).join('');
  },

  renderAwaitingGrid(containerId, subs) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (subs.length === 0) {
      el.innerHTML = `<div class="text-sm text-muted" style="grid-column: 1 / -1; padding: 0.5rem 0;">No active submissions pending results.</div>`;
      return;
    }
    el.innerHTML = subs.map(s => {
      const opp = this.opportunities.find(o => o.id === s.opportunityId);
      const piece = this.pieces.find(p => p.id === s.pieceId);
      const ver = this.pieceVersions.find(v => v.id === s.pieceVersionId);
      const status = this.getLatestSubStatus(s.id);
      return `
        <div class="deadline-card" style="border-left: 4px solid var(--brand-muted-violet);" onclick="App.viewSubmissionSnapshot('${s.id}')">
          <div class="deadline-card-header">
            <div>
              <div class="deadline-opp-name">${this.escapeHtml(opp ? opp.name : 'Opportunity')}</div>
              <div class="deadline-org">${this.escapeHtml(piece ? piece.title : 'Piece')} (${this.escapeHtml(ver ? ver.name : 'Ver')})</div>
            </div>
            <span class="badge badge-verify">${status.toUpperCase()}</span>
          </div>
          <div class="text-sm text-muted">Submitted: ${this.formatDate(s.submittedAt)}</div>
          <div class="flex-between mt-2">
            <button class="btn btn-sm" onclick="event.stopPropagation(); App.openRecordOutcomeModal('${s.id}')">Record Result</button>
            <button class="btn btn-sm" onclick="event.stopPropagation(); App.viewSubmissionSnapshot('${s.id}')">View Snapshot</button>
          </div>
        </div>
      `;
    }).join('');
  },

  openOpportunityDetail(oppId) {
    this.selectedOppId = oppId;
    this.switchTab('opportunities');
  },

  // ==========================================
  // 5. SUBMISSIONS & IMMUTABLE SNAPSHOTS
  // ==========================================
  renderSubmissionsView() {
    const tbody = document.getElementById('submissions-table-body');
    if (!tbody) return;

    if (this.submissions.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No submissions logged yet. Use <strong>Prepare & Check</strong> to mark a package as submitted.</td></tr>`;
      return;
    }

    const sorted = [...this.submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    tbody.innerHTML = sorted.map(s => {
      const opp = this.opportunities.find(o => o.id === s.opportunityId);
      const piece = this.pieces.find(p => p.id === s.pieceId);
      const ver = this.pieceVersions.find(v => v.id === s.pieceVersionId);
      const status = this.getLatestSubStatus(s.id);

      let badgeClass = 'badge-neutral';
      if (['winner', 'accepted'].includes(status)) badgeClass = 'badge-ready';
      else if (['rejected', 'withdrawn'].includes(status)) badgeClass = 'badge-ineligible';
      else if (['shortlisted', 'longlisted', 'finalist'].includes(status)) badgeClass = 'badge-attention';
      else badgeClass = 'badge-verify';

      return `
        <tr>
          <td class="font-mono text-sm">${this.formatDate(s.submittedAt)}</td>
          <td>
            <strong>${this.escapeHtml(piece ? piece.title : 'Deleted Piece')}</strong><br>
            <span class="text-sm text-muted">${this.escapeHtml(ver ? ver.name : 'Unknown version')}</span>
          </td>
          <td>
            <strong>${this.escapeHtml(opp ? opp.name : 'Deleted Opportunity')}</strong><br>
            <span class="text-sm text-muted">${this.escapeHtml(opp ? (opp.organization || opp.type) : '')}</span>
          </td>
          <td>
            <span class="badge ${badgeClass}">${status.toUpperCase()}</span>
          </td>
          <td class="font-mono text-sm">${this.formatMoney(s.feeAmount)}</td>
          <td>
            <div class="flex-between gap-2">
              <button class="btn btn-sm" onclick="App.viewSubmissionSnapshot('${s.id}')">Snapshot</button>
              <button class="btn btn-sm" onclick="App.openRecordOutcomeModal('${s.id}')">Outcome</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  getLatestSubStatus(subId) {
    const events = this.submissionEvents.filter(e => e.submissionId === subId);
    if (events.length === 0) return 'submitted';
    events.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    return events[0].type || 'submitted';
  },

  initiateMarkAsSubmitted() {
    const pieceId = document.getElementById('check-select-piece')?.value;
    const versionId = document.getElementById('check-select-version')?.value;
    const oppId = document.getElementById('check-select-opp')?.value;

    if (!pieceId || !versionId || !oppId) {
      alert('Please select a Piece, Version, and Opportunity in the Prepare panel before capturing submission.');
      return;
    }

    const opp = this.opportunities.find(o => o.id === oppId);
    document.getElementById('sub-modal-timestamp').textContent = new Date().toLocaleString();
    document.getElementById('sub-confirm-num').value = '';
    document.getElementById('sub-fee-paid-val').value = opp ? (opp.feeAmount || 0) : 0;
    document.getElementById('sub-notes').value = '';

    this.openModal('modal-mark-submitted');
  },

  async confirmCaptureSubmission() {
    const pieceId = document.getElementById('check-select-piece')?.value;
    const versionId = document.getElementById('check-select-version')?.value;
    const oppId = document.getElementById('check-select-opp')?.value;
    const bioId = document.getElementById('check-select-bio')?.value;
    const coverId = document.getElementById('check-select-cover')?.value;

    const method = document.getElementById('sub-method')?.value || 'Submittable';
    const confirmationNumber = document.getElementById('sub-confirm-num')?.value.trim() || '';
    const feePaid = parseFloat(document.getElementById('sub-fee-paid-val')?.value) || 0;
    const notes = document.getElementById('sub-notes')?.value.trim() || '';

    const piece = this.pieces.find(p => p.id === pieceId);
    const version = this.pieceVersions.find(v => v.id === versionId);
    const opp = this.opportunities.find(o => o.id === oppId);
    const bio = bioId ? this.bios.find(b => b.id === bioId) : null;
    const cover = coverId ? this.coverNotes.find(c => c.id === coverId) : null;

    if (!piece || !version || !opp) return;

    const subId = 'sub_' + Date.now();
    const snapId = 'snap_' + Date.now();
    const now = new Date().toISOString();

    // 1. Lock the Piece Version from accidental editing
    version.lockedBySubmission = true;
    await window.contestAtlasDB.put(ATLAS_STORES.PIECE_VERSIONS, version);

    // 2. Build frozen immutable snapshot
    const snapshot = {
      id: snapId,
      submissionId: subId,
      capturedAt: now,
      schemaVersion: 1,
      pieceSnapshot: {
        id: piece.id,
        title: piece.title,
        type: piece.type,
        genre: piece.genre,
        publicationState: piece.publicationState,
        rightsState: piece.rightsState
      },
      pieceVersionSnapshot: {
        id: version.id,
        name: version.name,
        wordCount: version.wordCount,
        content: version.content,
        authorNote: version.authorNote
      },
      opportunitySnapshot: {
        id: opp.id,
        name: opp.name,
        organization: opp.organization,
        type: opp.type,
        website: opp.website,
        deadlineDate: opp.deadlineDate,
        deadlineTime: opp.deadlineTime,
        deadlineTimeZone: opp.deadlineTimeZone,
        feeAmount: opp.feeAmount,
        prizeAmount: opp.prizeAmount,
        blindJudging: opp.blindJudging,
        simultaneousAllowed: opp.simultaneousAllowed,
        unpublishedOnly: opp.unpublishedOnly,
        reqFormat: opp.reqFormat,
        reqBio: opp.reqBio,
        reqCover: opp.reqCover,
        rawGuidelines: opp.rawGuidelines
      },
      bioSnapshot: bio ? { id: bio.id, name: bio.name, content: bio.content } : null,
      coverNoteSnapshot: cover ? { id: cover.id, name: cover.name, content: cover.body } : null,
      checklistSnapshot: {
        feePaid,
        method,
        confirmationNumber,
        notes
      }
    };

    // 3. Create Submission record
    const subRecord = {
      id: subId,
      pieceId: piece.id,
      pieceVersionId: version.id,
      opportunityId: opp.id,
      submissionSnapshotId: snapId,
      submittedAt: now,
      method,
      confirmationNumber,
      feePaid: feePaid > 0,
      feeAmount: feePaid,
      createdAt: now
    };

    // 4. Create initial Submission Event
    const initialEvent = {
      id: 'evt_' + Date.now(),
      submissionId: subId,
      type: 'submitted',
      date: now,
      notes: notes || 'Submission captured.',
      createdAt: now
    };

    await window.contestAtlasDB.put(ATLAS_STORES.SUBMISSION_SNAPSHOTS, snapshot);
    await window.contestAtlasDB.put(ATLAS_STORES.SUBMISSIONS, subRecord);
    await window.contestAtlasDB.put(ATLAS_STORES.SUBMISSION_EVENTS, initialEvent);

    this.submissionSnapshots.push(snapshot);
    this.submissions.push(subRecord);
    this.submissionEvents.push(initialEvent);

    this.closeModal('modal-mark-submitted');
    alert('Submission captured and frozen successfully.');
    this.switchTab('submissions');
  },

  viewSubmissionSnapshot(subId) {
    const sub = this.submissions.find(s => s.id === subId);
    if (!sub) return;

    const snap = this.submissionSnapshots.find(sp => sp.id === sub.submissionSnapshotId || sp.submissionId === subId);
    const body = document.getElementById('snapshot-modal-body');
    if (!body) return;

    if (!snap) {
      body.innerHTML = '<div class="empty-state">No snapshot found for this submission.</div>';
      this.openModal('modal-view-snapshot');
      return;
    }

    const p = snap.pieceSnapshot || {};
    const pv = snap.pieceVersionSnapshot || {};
    const o = snap.opportunitySnapshot || {};
    const b = snap.bioSnapshot;
    const c = snap.coverNoteSnapshot;
    const cl = snap.checklistSnapshot || {};

    body.innerHTML = `
      <div class="snapshot-badge-bar">
        <span>🔒 Requirements Snapshot &mdash; captured ${this.formatDateTime(snap.capturedAt)}</span>
        <span class="badge badge-berry">Write-Protected History</span>
      </div>

      <div class="card mt-2">
        <div class="card-title">Piece & Manuscript Submitted</div>
        <div class="text-sm">
          <strong>${this.escapeHtml(p.title)}</strong> &mdash; <em>${this.escapeHtml(pv.name)}</em> (${pv.wordCount} words)<br>
          <span class="text-muted">Type: ${this.escapeHtml(p.type)} · Genre: ${this.escapeHtml(p.genre)} · Rights: ${this.escapeHtml(p.rightsState)}</span>
        </div>
        <div class="manuscript-editor mt-2" style="max-height: 180px; overflow-y: auto; font-size: 0.85rem;">${this.escapeHtml(pv.content || '')}</div>
      </div>

      <div class="card mt-2">
        <div class="card-title">Opportunity Rules at Submission Time</div>
        <div class="text-sm">
          <strong>${this.escapeHtml(o.name)}</strong> (${this.escapeHtml(o.organization || o.type)})<br>
          Deadline: ${o.deadlineDate} ${o.deadlineTime || ''} (${this.escapeHtml(o.deadlineTimeZone || 'ET')})<br>
          Blind Judging: ${o.blindJudging ? 'Yes' : 'No'} · Simultaneous: ${o.simultaneousAllowed ? 'Yes' : 'No'} · Unpublished Only: ${o.unpublishedOnly ? 'Yes' : 'No'}<br>
          Fee Paid: ${this.formatMoney(cl.feePaid)} · Method: ${this.escapeHtml(cl.method)} · Confirmation: ${this.escapeHtml(cl.confirmationNumber || 'None')}
        </div>
      </div>

      ${b ? `
        <div class="card mt-2">
          <div class="card-title">Bio Included</div>
          <div class="text-sm text-secondary">${this.escapeHtml(b.content || '')}</div>
        </div>
      ` : ''}

      ${c ? `
        <div class="card mt-2">
          <div class="card-title">Cover Note Included</div>
          <div class="text-sm text-secondary">${this.escapeHtml(c.content || '')}</div>
        </div>
      ` : ''}
    `;

    this.openModal('modal-view-snapshot');
  },

  openRecordOutcomeModal(subId) {
    const sub = this.submissions.find(s => s.id === subId);
    if (!sub) return;

    const currentStatus = this.getLatestSubStatus(subId);
    const newStatus = prompt(`Update Outcome for submission:\n(Options: submitted, longlisted, shortlisted, finalist, winner, accepted, rejected, withdrawn, no_response)`, currentStatus);
    if (!newStatus || newStatus === currentStatus) return;

    const now = new Date().toISOString();
    const event = {
      id: 'evt_' + Date.now(),
      submissionId: subId,
      type: newStatus.toLowerCase().trim(),
      date: now,
      notes: `Status updated to ${newStatus}`,
      createdAt: now
    };

    window.contestAtlasDB.put(ATLAS_STORES.SUBMISSION_EVENTS, event).then(() => {
      this.submissionEvents.push(event);
      this.renderSubmissionsView();
      this.checkWithdrawalAdvisories();
    });
  },

  checkWithdrawalAdvisories() {
    const banner = document.getElementById('withdrawal-advisory-banner');
    if (!banner) return;

    // Check if any piece has an 'accepted' or 'winner' event, and also other active submissions
    const wins = this.submissionEvents.filter(e => ['accepted', 'winner'].includes(e.type));
    let hasAdvisory = false;
    let advisoryPieces = [];

    wins.forEach(w => {
      const sub = this.submissions.find(s => s.id === w.submissionId);
      if (sub) {
        const otherSubs = this.submissions.filter(s => s.pieceId === sub.pieceId && s.id !== sub.id && !['rejected', 'withdrawn', 'no_response'].includes(this.getLatestSubStatus(s.id)));
        if (otherSubs.length > 0) {
          hasAdvisory = true;
          const piece = this.pieces.find(p => p.id === sub.pieceId);
          if (piece && !advisoryPieces.includes(piece.title)) {
            advisoryPieces.push(piece.title);
          }
        }
      }
    });

    if (hasAdvisory) {
      banner.style.display = 'block';
      const text = document.getElementById('withdrawal-advisory-text');
      if (text) text.textContent = `Active submissions found for accepted work "${advisoryPieces.join(', ')}". Review and send withdrawal notices where simultaneous submissions are not permitted.`;
    } else {
      banner.style.display = 'none';
    }
  },

  openWithdrawalReviewModal() {
    this.switchTab('submissions');
  },

  filterSubmissionsList(query) {
    const q = (query || '').toLowerCase();
    const rows = document.querySelectorAll('#submissions-table-body tr');
    rows.forEach(r => {
      r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  },

  // ==========================================
  // 6. BIOS & COVER NOTES
  // ==========================================
  renderBiosView() {
    const biosContainer = document.getElementById('bios-list-container');
    const coversContainer = document.getElementById('covers-list-container');

    if (biosContainer) {
      if (this.bios.length === 0) {
        biosContainer.innerHTML = '<div class="empty-state" style="padding: 1rem;"><div class="text-sm text-muted">No bios created yet.</div></div>';
      } else {
        biosContainer.innerHTML = this.bios.map(b => `
          <div class="card" style="margin-bottom: 0.75rem; background-color: var(--bg-surface-elevated);">
            <div class="card-title flex-between">
              <span>${this.escapeHtml(b.name)}</span>
              <span class="font-mono text-sm">${b.wordCount || this.countWords(b.content)} words</span>
            </div>
            <div class="text-sm text-secondary mb-2" style="white-space: pre-wrap;">${this.escapeHtml(b.content)}</div>
            <div class="flex-between">
              <span class="text-sm text-muted">${b.targetWordCount ? `Target: ${b.targetWordCount} words` : ''}</span>
              <button class="btn btn-sm btn-danger" onclick="App.deleteBio('${b.id}')">Delete</button>
            </div>
          </div>
        `).join('');
      }
    }

    if (coversContainer) {
      if (this.coverNotes.length === 0) {
        coversContainer.innerHTML = '<div class="empty-state" style="padding: 1rem;"><div class="text-sm text-muted">No cover templates created yet.</div></div>';
      } else {
        coversContainer.innerHTML = this.coverNotes.map(c => `
          <div class="card" style="margin-bottom: 0.75rem; background-color: var(--bg-surface-elevated);">
            <div class="card-title flex-between">
              <span>${this.escapeHtml(c.name)}</span>
              <button class="btn btn-sm btn-danger" onclick="App.deleteCover('${c.id}')">Delete</button>
            </div>
            <div class="text-sm text-secondary" style="white-space: pre-wrap;">${this.escapeHtml(c.greeting ? c.greeting + '\n\n' : '')}${this.escapeHtml(c.body || '')}${this.escapeHtml(c.creditsSnippet ? '\n\n' + c.creditsSnippet : '')}${this.escapeHtml(c.closing ? '\n\n' + c.closing : '')}</div>
          </div>
        `).join('');
      }
    }
  },

  openNewBioModal() {
    document.getElementById('bio-id').value = '';
    document.getElementById('bio-name').value = '';
    document.getElementById('bio-target-words').value = '50';
    document.getElementById('bio-text').value = '';
    document.getElementById('bio-word-count-display').textContent = '0 words';
    this.openModal('modal-bio');
  },

  updateBioWordCount(text) {
    const count = this.countWords(text);
    const target = parseInt(document.getElementById('bio-target-words')?.value) || 0;
    const display = document.getElementById('bio-word-count-display');
    if (display) {
      display.textContent = `${count} words ${target > 0 ? `(Target: ${target} · ${count > target ? `Over by ${count - target}` : `Under by ${target - count}`})` : ''}`;
    }
  },

  async saveBioForm(e) {
    e.preventDefault();
    const name = document.getElementById('bio-name').value.trim();
    const content = document.getElementById('bio-text').value.trim();
    const targetWordCount = parseInt(document.getElementById('bio-target-words').value) || null;
    if (!name || !content) return;

    const bioId = 'bio_' + Date.now();
    const now = new Date().toISOString();
    const bio = {
      id: bioId,
      name,
      content,
      targetWordCount,
      wordCount: this.countWords(content),
      createdAt: now,
      updatedAt: now
    };

    const bioVersion = {
      id: 'bv_' + Date.now(),
      bioId,
      name,
      targetWordCount,
      content,
      wordCount: this.countWords(content),
      createdAt: now
    };

    await window.contestAtlasDB.put(ATLAS_STORES.BIOS, bio);
    await window.contestAtlasDB.put(ATLAS_STORES.BIO_VERSIONS, bioVersion);
    
    this.bios.push(bio);
    this.bioVersions.push(bioVersion);

    this.closeModal('modal-bio');
    this.renderBiosView();
  },

  async deleteBio(bioId) {
    if (!confirm('Delete this bio?')) return;
    await window.contestAtlasDB.delete(ATLAS_STORES.BIOS, bioId);
    this.bios = this.bios.filter(b => b.id !== bioId);
    this.renderBiosView();
  },

  openNewCoverModal() {
    document.getElementById('cover-id').value = '';
    document.getElementById('cover-name').value = '';
    document.getElementById('cover-greeting').value = 'Dear Editors,';
    document.getElementById('cover-body').value = '';
    document.getElementById('cover-credits').value = '';
    document.getElementById('cover-closing').value = 'Thank you for your time and consideration,\n[Author Name]';
    this.openModal('modal-cover');
  },

  async saveCoverForm(e) {
    e.preventDefault();
    const name = document.getElementById('cover-name').value.trim();
    const greeting = document.getElementById('cover-greeting').value.trim();
    const body = document.getElementById('cover-body').value.trim();
    const creditsSnippet = document.getElementById('cover-credits').value.trim();
    const closing = document.getElementById('cover-closing').value.trim();
    if (!name || !body) return;

    const coverId = 'cov_' + Date.now();
    const now = new Date().toISOString();
    const cover = {
      id: coverId,
      name,
      greeting,
      body,
      creditsSnippet,
      closing,
      createdAt: now,
      updatedAt: now
    };

    const coverVersion = {
      id: 'cvv_' + Date.now(),
      coverNoteId: coverId,
      greeting,
      note: body,
      creditsSnippet,
      closing,
      generatedPreview: `${greeting ? greeting + '\n\n' : ''}${body}${creditsSnippet ? '\n\n' + creditsSnippet : ''}${closing ? '\n\n' + closing : ''}`,
      createdAt: now
    };

    await window.contestAtlasDB.put(ATLAS_STORES.COVER_NOTES, cover);
    await window.contestAtlasDB.put(ATLAS_STORES.COVER_NOTE_VERSIONS, coverVersion);
    
    this.coverNotes.push(cover);
    this.coverNoteVersions.push(coverVersion);

    this.closeModal('modal-cover');
    this.renderBiosView();
  },

  async deleteCover(coverId) {
    if (!confirm('Delete this cover template?')) return;
    await window.contestAtlasDB.delete(ATLAS_STORES.COVER_NOTES, coverId);
    this.coverNotes = this.coverNotes.filter(c => c.id !== coverId);
    this.renderBiosView();
  },

  // ==========================================
  // 7. AUTHOR PROFILE & ANONYMITY CONFIG
  // ==========================================
  openAuthorProfileModal() {
    const p = this.authorProfile || {};
    document.getElementById('profile-name').value = p.name || '';
    document.getElementById('profile-pen-names').value = (p.penNames || []).join(', ');
    document.getElementById('profile-emails').value = (p.emails || []).join(', ');
    document.getElementById('profile-phones').value = (p.phones || []).join(', ');
    document.getElementById('profile-location').value = p.location || '';

    const statusText = document.getElementById('profile-license-status-text');
    const upBtn = document.getElementById('profile-upgrade-btn');
    if (this.isPro()) {
      if (statusText) statusText.innerHTML = `<span style="color: #6ee7b7; font-weight: 600;">✨ Pro Lifetime Access Active</span>`;
      if (upBtn) upBtn.style.display = 'none';
    } else {
      if (statusText) statusText.textContent = `Free Plan (${this.opportunities.length}/3 Contests Tracked)`;
      if (upBtn) upBtn.style.display = 'inline-block';
    }

    this.openModal('modal-author-profile');
  },

  async saveAuthorProfile() {
    const name = document.getElementById('profile-name').value.trim();
    const penNames = document.getElementById('profile-pen-names').value.split(',').map(s => s.trim()).filter(Boolean);
    const emails = document.getElementById('profile-emails').value.split(',').map(s => s.trim()).filter(Boolean);
    const phones = document.getElementById('profile-phones').value.split(',').map(s => s.trim()).filter(Boolean);
    const location = document.getElementById('profile-location').value.trim();

    const profile = {
      id: 'author_profile_primary',
      name,
      penNames,
      emails,
      phones,
      location,
      updatedAt: new Date().toISOString()
    };

    await window.contestAtlasDB.put(ATLAS_STORES.AUTHOR_PROFILES, profile);
    this.authorProfile = profile;
    this.closeModal('modal-author-profile');
    alert('Author profile saved. Anonymity scanner updated.');
  },

  // ==========================================
  // 8. GLOBAL SEARCH
  // ==========================================
  openSearchModal() {
    this.openModal('modal-search');
    const input = document.getElementById('global-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
    document.getElementById('global-search-results').innerHTML = '';
  },

  performGlobalSearch(query) {
    const q = (query || '').toLowerCase().trim();
    const out = document.getElementById('global-search-results');
    if (!out) return;

    if (!q) {
      out.innerHTML = '<div class="text-sm text-muted">Type above to search across pieces, versions, opportunities, bios, and notes.</div>';
      return;
    }

    const matches = [];

    // Search Pieces
    this.pieces.forEach(p => {
      if (p.title.toLowerCase().includes(q) || (p.genre && p.genre.toLowerCase().includes(q))) {
        matches.push({ type: 'Piece', title: p.title, detail: `${p.type || 'Piece'} · ${p.genre || ''}`, action: () => { App.selectPiece(p.id); App.switchTab('pieces'); } });
      }
    });

    // Search Versions
    this.pieceVersions.forEach(v => {
      if (v.name.toLowerCase().includes(q) || (v.content && v.content.toLowerCase().includes(q))) {
        matches.push({ type: 'Version', title: v.name, detail: `${v.wordCount} words · Content match`, action: () => { App.selectPiece(v.pieceId); App.selectVersion(v.id); App.switchTab('pieces'); } });
      }
    });

    // Search Opportunities
    this.opportunities.forEach(o => {
      if (o.name.toLowerCase().includes(q) || (o.organization && o.organization.toLowerCase().includes(q))) {
        matches.push({ type: 'Opportunity', title: o.name, detail: `${o.organization || o.type} · Deadline: ${o.deadlineDate}`, action: () => { App.selectOpportunity(o.id); App.switchTab('opportunities'); } });
      }
    });

    // Search Bios
    this.bios.forEach(b => {
      if (b.name.toLowerCase().includes(q) || b.content.toLowerCase().includes(q)) {
        matches.push({ type: 'Bio', title: b.name, detail: `${b.wordCount} words`, action: () => { App.switchTab('bios'); } });
      }
    });

    if (matches.length === 0) {
      out.innerHTML = '<div class="text-sm text-muted">No matching records found.</div>';
      return;
    }

    out.innerHTML = matches.map((m, i) => `
      <div class="card" style="margin-bottom: 0.5rem; cursor: pointer; padding: 0.75rem;" onclick="App._execSearchMatch(${i})">
        <div class="flex-between">
          <strong>${this.escapeHtml(m.title)}</strong>
          <span class="badge badge-neutral" style="font-size: 0.7rem;">${m.type}</span>
        </div>
        <div class="text-sm text-secondary mt-1">${this.escapeHtml(m.detail)}</div>
      </div>
    `).join('');
    this._currentSearchMatches = matches;
  },

  _execSearchMatch(idx) {
    if (this._currentSearchMatches && this._currentSearchMatches[idx]) {
      this.closeModal('modal-search');
      this._currentSearchMatches[idx].action();
    }
  },

  // ==========================================
  // 9. BACKUP, RESTORE & FICTIONAL DEMO
  // ==========================================
  openBackupModal() {
    this.openModal('modal-backup');
    document.getElementById('restore-preview-box').style.display = 'none';
    document.getElementById('btn-confirm-restore').style.display = 'none';
    const input = document.getElementById('restore-file-input');
    if (input) input.value = '';
  },

  async downloadFullBackup() {
    const backup = await window.contestAtlasDB.exportFullBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `contest-atlas-backup-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  handleRestoreFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        window.contestAtlasDB.validateBackupStructure(json);
        this.pendingRestoreData = json;

        const previewBox = document.getElementById('restore-preview-box');
        const confirmBtn = document.getElementById('btn-confirm-restore');

        const pCount = json.stores[ATLAS_STORES.PIECES]?.length || 0;
        const vCount = json.stores[ATLAS_STORES.PIECE_VERSIONS]?.length || 0;
        const oCount = json.stores[ATLAS_STORES.OPPORTUNITIES]?.length || 0;
        const sCount = json.stores[ATLAS_STORES.SUBMISSIONS]?.length || 0;

        previewBox.innerHTML = `
          <strong>Valid Contest Atlas Backup File Verified</strong><br>
          Exported at: ${this.formatDateTime(json.exportedAt)}<br>
          Contents: ${pCount} pieces, ${vCount} versions, ${oCount} opportunities, ${sCount} submissions.<br>
          <span class="text-coral">⚠️ A safety backup of your current database will be saved before restore.</span>
        `;
        previewBox.style.display = 'block';
        confirmBtn.style.display = 'inline-flex';
      } catch (err) {
        alert('Restore File Error: ' + err.message);
        this.pendingRestoreData = null;
      }
    };
    reader.readAsText(file);
  },

  async executeRestore() {
    if (!this.pendingRestoreData) return;
    if (!confirm('Are you sure you want to restore? Current database records will be replaced.')) return;

    try {
      await window.contestAtlasDB.restoreFullBackup(this.pendingRestoreData);
      await this.loadAllData();
      this.closeModal('modal-backup');
      alert('Database restored successfully.');
      this.renderCurrentView();
      this.checkFirstRun();
    } catch (err) {
      alert('Restore failed: ' + err.message);
    }
  },

  async clearDemoDataPrompt() {
    if (!confirm('Clear all demo data records? Your genuine user records will not be affected.')) return;
    await window.contestAtlasDB.clearOnlyDemoData();
    await this.loadAllData();
    this.closeModal('modal-backup');
    this.renderCurrentView();
    this.checkFirstRun();
    alert('Fictional demo data removed. User records preserved.');
  },

  async clearAllDataPrompt() {
    if (!confirm('CAUTION: This will clear ALL pieces, opportunities, and submission history from your browser. Are you sure?')) return;
    await window.contestAtlasDB.clearAllUserData();
    await this.loadAllData();
    this.closeModal('modal-backup');
    this.renderCurrentView();
    this.checkFirstRun();
    alert('Database cleared.');
  },

  async loadDemoData() {
    if (this.pieces.length > 0 || this.opportunities.length > 0) {
      if (!confirm('Load fictional demo dataset? This will add demo records.')) return;
    }

    const now = new Date().toISOString();

    // 1. Fictional Pieces & Versions
    const p1 = {
      id: 'demo_p1',
      title: 'Glass Houses',
      type: 'Short Story',
      genre: 'Literary Fiction',
      publicationState: 'unpublished',
      rightsState: 'allRightsAvailable',
      tags: ['family', 'grief', 'coastal'],
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };
    const p1v1 = {
      id: 'demo_p1v1',
      pieceId: 'demo_p1',
      name: 'Full Version',
      content: 'The greenhouse had survived seventy-four winters without losing a single pane to the Atlantic winds until the morning Arthur found the sparrow on the workbench.\n\nHe had known the salt was coming. For three days the tide had pushed higher than the dock pilings, drowning the marsh grass in brown froth. But the glass had always stood. Even when the storm of seventy-eight tore the boathouse roof off and dropped it into the harbor, the greenhouse had remained intact, smelling faintly of damp peat and winter rosemary.\n\nNow, there was a hole the size of a teacup in the southern gable, and beneath it, perfectly centered in a dusting of pulverized quartz, lay the bird.\n\n"You should have patched that in October," Martha said from the doorway. She was wearing her yellow oilskin coat, the one with the torn pocket where she kept her shears. She did not step inside. Martha had stopped stepping inside the glass house after the boy left for Halifax.\n\n"The putty was dry," Arthur answered. He did not touch the bird. He looked through the opening in the roof toward the grey line of the water. "Takes two weeks to set properly in the cold."\n\n"Everything takes two weeks with you, Arthur."',
      wordCount: 204,
      parentVersionId: null,
      authorNote: 'Original uncut narrative',
      isDemo: true,
      createdAt: now,
      updatedAt: now,
      lockedBySubmission: false
    };
    const p1v2 = {
      id: 'demo_p1v2',
      pieceId: 'demo_p1',
      name: 'Contest Cut — 2,000 Words',
      content: 'The greenhouse had survived seventy-four winters without losing a single pane to the Atlantic winds until the morning Arthur found the sparrow on the workbench.\n\nHe had known the salt was coming. For three days the tide had pushed higher than the dock pilings, drowning the marsh grass in brown froth. But the glass had always stood.\n\nNow, there was a hole in the southern gable, and beneath it lay the bird.\n\n"You should have patched that in October," Martha said from the doorway.',
      wordCount: 84,
      parentVersionId: 'demo_p1v1',
      authorNote: 'Tightened opening for contest limit',
      isDemo: true,
      createdAt: now,
      updatedAt: now,
      lockedBySubmission: false
    };

    const p2 = {
      id: 'demo_p2',
      title: 'A Field Guide to Ordinary Disasters',
      type: 'Personal Essay',
      genre: 'Creative Nonfiction',
      publicationState: 'unpublished',
      rightsState: 'allRightsAvailable',
      tags: ['essay', 'memory', 'maps'],
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };
    const p2v1 = {
      id: 'demo_p2v1',
      pieceId: 'demo_p2',
      name: 'Fellowship Submission Draft',
      content: 'In cartography, the term "lost relief" refers to elevation features that disappear when contour intervals are smoothed for readability. Mountains do not vanish; only our notation of them does.\n\nMy father owned twenty-six county atlases printed between 1948 and 1982. On Sunday evenings, while the radiator hummed in the front hall, he would trace the abandoned logging spurs with a blunt red pencil.\n\n"If you don\'t walk them every five years," he told me once, "the alder comes back and erases the gravel. After ten years, the map is lying to you."',
      wordCount: 91,
      parentVersionId: null,
      authorNote: 'Prepared for fellowship review',
      isDemo: true,
      createdAt: now,
      updatedAt: now,
      lockedBySubmission: false
    };

    // 2. Fictional Opportunities
    const o1 = {
      id: 'demo_o1',
      name: 'The Starlight Review Annual Fiction Prize',
      organization: 'Starlight Literary Press',
      type: 'Writing Contest',
      website: 'https://example.com/starlight-prize',
      deadlineDate: '2026-09-30',
      deadlineTime: '23:59',
      deadlineTimeZone: 'America/New_York',
      rolling: false,
      annualRecurring: true,
      feeAmount: 20.00,
      prizeAmount: '$1,500 + Publication',
      minWords: 0,
      maxWords: 3000,
      blindJudging: true,
      simultaneousAllowed: true,
      unpublishedOnly: true,
      reqFormat: 'DOCX',
      reqBio: 'optional',
      reqCover: 'optional',
      rawGuidelines: 'Annual short fiction award for unpublished stories under 3,000 words. Anonymous judging: remove author name from document header and title page. $20 entry fee. Winner receives $1,500 and publication in Winter issue.',
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };

    const o2 = {
      id: 'demo_o2',
      name: 'Northshore Flash Award',
      organization: 'Northshore Review',
      type: 'Writing Contest',
      website: 'https://example.com/northshore',
      deadlineDate: '2026-09-20',
      deadlineTime: '23:59',
      deadlineTimeZone: 'America/Chicago',
      rolling: false,
      annualRecurring: false,
      feeAmount: 10.00,
      prizeAmount: '$500',
      minWords: 0,
      maxWords: 1000,
      blindJudging: true,
      simultaneousAllowed: false,
      unpublishedOnly: true,
      reqFormat: 'PDF',
      reqBio: 'required',
      reqCover: 'optional',
      rawGuidelines: 'Flash fiction under 1,000 words. Blind reading. No simultaneous submissions permitted.',
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };

    const o3 = {
      id: 'demo_o3',
      name: 'Verdant Quarterly Essay Fellowship',
      organization: 'Verdant Arts Foundation',
      type: 'Fellowship',
      website: 'https://example.com/verdant-fellowship',
      deadlineDate: '2026-10-31',
      deadlineTime: '17:00',
      deadlineTimeZone: 'America/Los_Angeles',
      rolling: false,
      annualRecurring: true,
      feeAmount: 0.00,
      prizeAmount: '$5,000 Fellowship Grant',
      minWords: 1500,
      maxWords: 4000,
      blindJudging: false,
      simultaneousAllowed: true,
      unpublishedOnly: true,
      reqFormat: 'DOCX',
      reqBio: 'required',
      reqCover: 'required',
      rawGuidelines: 'Personal essay fellowship for emerging writers. Include 100-word bio and cover statement.',
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };

    // 3. Fictional Bio & Cover Note
    const bio1 = {
      id: 'demo_bio1',
      name: '50-Word Standard Bio',
      targetWordCount: 50,
      content: 'Jayme Volstad is an essayist and fiction writer based in the Pacific Northwest. Their short fiction has appeared or is forthcoming in several regional reviews. When not writing, they restore antique wooden boats.',
      wordCount: 34,
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };

    const cover1 = {
      id: 'demo_cov1',
      name: 'Standard Fiction Cover Note',
      greeting: 'Dear Fiction Editors,',
      body: 'Please consider the enclosed short story for your upcoming prize. This piece has not been previously published elsewhere.',
      creditsSnippet: 'My work has previously appeared in Northshore Review and Tidewater Journal.',
      closing: 'Thank you for your time and careful reading,\nJayme Volstad',
      isDemo: true,
      createdAt: now,
      updatedAt: now
    };

    // Save demo objects
    const db = window.contestAtlasDB;
    await db.put(ATLAS_STORES.PIECES, p1);
    await db.put(ATLAS_STORES.PIECES, p2);
    await db.put(ATLAS_STORES.PIECE_VERSIONS, p1v1);
    await db.put(ATLAS_STORES.PIECE_VERSIONS, p1v2);
    await db.put(ATLAS_STORES.PIECE_VERSIONS, p2v1);
    await db.put(ATLAS_STORES.OPPORTUNITIES, o1);
    await db.put(ATLAS_STORES.OPPORTUNITIES, o2);
    await db.put(ATLAS_STORES.OPPORTUNITIES, o3);
    await db.put(ATLAS_STORES.BIOS, bio1);
    await db.put(ATLAS_STORES.COVER_NOTES, cover1);

    await this.loadAllData();
    this.closeModal('modal-backup');
    this.renderCurrentView();
    this.checkFirstRun();
    alert('Fictional demo data loaded successfully.');
  },

  // --- MODAL UTILITIES (Focus management & accessibility) ---
  openModal(modalId) {
    this._lastFocusedElement = document.activeElement;
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.add('active');
      const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }
  },

  closeModal(modalId) {
    const el = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (el) el.classList.remove('active');
    if (this._lastFocusedElement && typeof this._lastFocusedElement.focus === 'function') {
      try { this._lastFocusedElement.focus(); } catch (e) {}
    }
  },

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
    if (this._lastFocusedElement && typeof this._lastFocusedElement.focus === 'function') {
      try { this._lastFocusedElement.focus(); } catch (e) {}
    }
  }
};

// Global Backdrop Click to Dismiss Modals
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
    App.closeModal(e.target);
  }
});

// Global Hotkeys (Ctrl+K for search, Escape for modals)
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    App.openSearchModal();
  } else if (e.key === 'Escape') {
    App.closeAllModals();
  }
});

// Boot when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.App = App;
  App.init();
});


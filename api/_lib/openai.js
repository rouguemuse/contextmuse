/**
 * Synthesizes structured evidence into an evidence-first, plain-language diagnostic.
 * Integrates with OpenAI API (server-side only) with a robust deterministic fallback.
 */

const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Deterministic fallback synthesis when OpenAI is unavailable or disabled
 */
export function synthesizeDeterministic(evidenceList, siteContext, meta, context = {}) {
  const sorted = [...evidenceList].sort((a, b) => {
    const sevScore = { high: 3, medium: 2, low: 1, positive: 0 };
    return (sevScore[b.severity] || 0) - (sevScore[a.severity] || 0);
  });

  const highPriority = sorted.filter(e => e.severity === 'high');
  const mediumPriority = sorted.filter(e => e.severity === 'medium');

  const mostImportant = highPriority[0] || mediumPriority[0] || sorted[0] || {
    id: 'baseline_review_complete',
    category: 'message_clarity',
    severity: 'low',
    confidence: 'HIGH',
    confidence_reason: 'Direct site inspection completed without detecting critical bottlenecks.',
    title: 'Baseline structure verified with room for structured intake',
    observed_fact: 'Core site layout, headlines, and contact mechanisms are operational.',
    evidence: ['Verified page markup and navigation links.'],
    inference: 'The primary leverage point is upgrading generic contact pathways into high-converting qualification tools.',
    why_it_matters: 'Every friction point in customer intake introduces manual overhead and reduces quote velocity.',
    recommendation: 'Evaluate structured intake options tailored to your service specifications.',
    implementation_options: [
      'Multi-step project inquiry flow',
      'Preliminary sizing and qualification checklist'
    ],
    verification_needed: 'Confirm what specifications are required before issuing an initial customer scope.',
    source_element: 'body'
  };

  const quickWins = [];
  const systemOpportunities = [];
  const worthVerifying = [];
  const technicalNotes = [];

  for (const item of sorted) {
    if (item.id === mostImportant.id) continue;

    const formatted = {
      id: item.id,
      category: item.category,
      severity: item.severity,
      confidence: item.confidence || 'MEDIUM',
      confidence_reason: item.confidence_reason || '',
      title: item.title,
      observed_fact: item.observed_fact,
      evidence: Array.isArray(item.evidence) ? item.evidence : [item.evidence || ''],
      inference: item.inference,
      why_it_matters: item.why_it_matters,
      recommendation: item.recommendation,
      implementation_options: Array.isArray(item.implementation_options) ? item.implementation_options : [],
      verification_needed: item.verification_needed || '',
      source_element: item.source_element || ''
    };

    if (item.confidence === 'LOW') {
      if (worthVerifying.length < 2) worthVerifying.push(formatted);
    } else if (item.category === 'intake_operations') {
      if (systemOpportunities.length < 2) systemOpportunities.push(formatted);
    } else if (item.category === 'message_clarity' || item.category === 'conversion_friction' || item.category === 'trust_signals') {
      if (quickWins.length < 2) quickWins.push(formatted);
    } else if (item.category === 'technical_basics') {
      if (technicalNotes.length < 2) technicalNotes.push(formatted);
    }
  }

  // Determine most relevant case proof
  let proofKey = 'quote_lead';
  const effectiveInd = (siteContext?.effectiveIndustry || '').toLowerCase();
  if (effectiveInd.includes('restaurant') || effectiveInd.includes('hospitality') || effectiveInd.includes('food')) {
    proofKey = 'restaurant';
  } else if (effectiveInd.includes('hvac') || effectiveInd.includes('mechanical') || effectiveInd.includes('equipment') || effectiveInd.includes('contracting')) {
    proofKey = 'custom_operations';
  } else {
    proofKey = 'quote_lead';
  }

  const conflictNote = siteContext?.industryConflict
    ? `Analyzed as ${siteContext.effectiveIndustry} based on on-page content (user provided "${siteContext.industryConflict.userProvided}").`
    : null;

  return {
    source: 'deterministic_engine',
    quick_read_summary: `We analyzed ${meta.url} for ${siteContext.companyName} (${siteContext.effectiveIndustry}). Here is an evidence-first breakdown of observed intake mechanisms, conversion paths, and workflow friction.`,
    industry_context_note: conflictNote,
    most_important: mostImportant,
    system_opportunities: systemOpportunities,
    quick_wins: quickWins,
    worth_verifying: worthVerifying,
    technical_notes: technicalNotes,
    proof_key: proofKey
  };
}

/**
 * Synthesizes evidence via OpenAI chat completion using structured evidence & SiteContext
 */
export async function synthesizeWithOpenAI(evidenceList, siteContext, meta, context = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return synthesizeDeterministic(evidenceList, siteContext, meta, context);
  }

  const model = process.env.OPENAI_AUDIT_MODEL || DEFAULT_MODEL;

  const systemPrompt = `You are Jayme Volstad, founder of Context & Muse — an applied systems and digital product studio in Austin, Texas.
Context & Muse finds expensive operational messes and builds the custom software, quoting engines, and internal systems that replace them.

You are generating a rigorous, EVIDENCE-FIRST First-Pass Diagnostic for a prospective client who submitted their website URL.

CORE OPERATIONAL PRINCIPLES:
1. STRICT SEPARATION OF FACT AND INTERPRETATION:
   - "observed_fact": Exactly what was observed on the page (e.g. "Primary contact form has 4 fields: Name, Email, Phone, Message with an open textarea").
   - "evidence": Array of exact code/text excerpts.
   - "inference": The logical deduction (e.g. "If jobs require specific technical specs, staff must follow up manually").
   - "confidence": HIGH (directly in DOM), MEDIUM (strong structural deduction), or LOW (hypothesis).
   - "confidence_reason": Why this confidence level applies.
   - "why_it_matters": Commercial / operational impact.
   - "recommendation": Core advice.
   - "implementation_options": 2-3 concrete possibilities (e.g. structured RFQ, step-by-step intake, file upload). DO NOT PRESUMPTUOUSLY DEMAND A QUOTE CALCULATOR.
   - "verification_needed": Specific question to confirm with the business owner.

2. NEVER MAKE BUSINESS ARCHITECTURE LEAPS:
   - Do NOT assume a textarea requires a quote calculator.
   - Do NOT assume multiple locations requires automated territory routing unless evidence supports it.
   - Do NOT assume no /portfolio URL means no proof exists if on-page proof was found.
   - Base all reasoning on the extracted SiteContext (${siteContext.effectiveIndustry}).

3. INDUSTRY MISMATCH HANDLING:
   - If the user entered an industry that conflicts with the observed site content (e.g. "book" for a commercial HVAC site), IGNORE the user's incorrect industry and anchor strictly in the verified site context (${siteContext.effectiveIndustry}).

4. Tone: Calm, direct, intellectual, editorial, respectful. Zero generic AI hype words ("supercharge", "unlock", "game-changer", "seamless").

5. Output MUST be valid JSON conforming strictly to the requested schema.`;

  const userPrompt = `Target URL: ${meta.url}
Company Name: ${siteContext.companyName}
Verified Industry: ${siteContext.effectiveIndustry}
User-Provided Hint: ${context.businessType || '(none)'}
Industry Conflict Detected: ${siteContext.industryConflict ? JSON.stringify(siteContext.industryConflict) : 'false'}
Target Audience: ${siteContext.audienceType}
Mentioned Job Variables in Site Copy: ${JSON.stringify(siteContext.detectedJobVariables || [])}
On-Page Proof Signals: ${JSON.stringify(siteContext.proofSignals || {})}

Extracted Evidence Records:
${JSON.stringify(evidenceList, null, 2)}

Synthesize into the following JSON structure:
{
  "quick_read_summary": "1-2 sentence executive overview in Jayme's voice summarizing the primary findings for this business.",
  "industry_context_note": ${siteContext.industryConflict ? `"${siteContext.industryConflict.reason}"` : "null"},
  "most_important": {
    "id": "...",
    "category": "intake_operations | message_clarity | conversion_friction | trust_signals | technical_basics",
    "severity": "high | medium | low",
    "confidence": "HIGH | MEDIUM | LOW",
    "confidence_reason": "...",
    "title": "Clear concise title",
    "observed_fact": "Concrete observation of what exists",
    "evidence": ["Exact excerpt 1", "Exact excerpt 2"],
    "inference": "Logical deduction explaining why this matters",
    "why_it_matters": "Business/operational consequence",
    "recommendation": "Core strategic guidance",
    "implementation_options": ["Option 1", "Option 2", "Option 3"],
    "verification_needed": "What to verify with the business",
    "source_element": "DOM selector or region"
  },
  "system_opportunities": [
    {
      "id": "...",
      "category": "intake_operations",
      "severity": "high | medium",
      "confidence": "HIGH | MEDIUM",
      "confidence_reason": "...",
      "title": "...",
      "observed_fact": "...",
      "evidence": ["..."],
      "inference": "...",
      "why_it_matters": "...",
      "recommendation": "...",
      "implementation_options": ["..."],
      "verification_needed": "...",
      "source_element": "..."
    }
  ],
  "quick_wins": [
    {
      "id": "...",
      "category": "message_clarity | conversion_friction | trust_signals",
      "severity": "medium | low",
      "confidence": "HIGH | MEDIUM",
      "confidence_reason": "...",
      "title": "...",
      "observed_fact": "...",
      "evidence": ["..."],
      "inference": "...",
      "why_it_matters": "...",
      "recommendation": "...",
      "implementation_options": ["..."],
      "verification_needed": "...",
      "source_element": "..."
    }
  ],
  "worth_verifying": [
    {
      "id": "...",
      "category": "message_clarity | trust_signals | intake_operations",
      "severity": "low | medium",
      "confidence": "LOW",
      "confidence_reason": "...",
      "title": "...",
      "observed_fact": "...",
      "evidence": ["..."],
      "inference": "...",
      "why_it_matters": "...",
      "recommendation": "...",
      "implementation_options": ["..."],
      "verification_needed": "...",
      "source_element": "..."
    }
  ],
  "technical_notes": [
    {
      "id": "...",
      "category": "technical_basics",
      "severity": "high | medium | low",
      "confidence": "HIGH",
      "confidence_reason": "...",
      "title": "...",
      "observed_fact": "...",
      "evidence": ["..."],
      "inference": "...",
      "why_it_matters": "...",
      "recommendation": "...",
      "implementation_options": ["..."],
      "verification_needed": "...",
      "source_element": "..."
    }
  ],
  "proof_key": "quote_lead" | "custom_operations" | "restaurant"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9500);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.15,
        max_tokens: 1800
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`OpenAI API returned status ${response.status}. Falling back to deterministic synthesis.`);
      return synthesizeDeterministic(evidenceList, siteContext, meta, context);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return synthesizeDeterministic(evidenceList, siteContext, meta, context);
    }

    const parsed = JSON.parse(content);
    return {
      source: 'openai_synthesizer',
      model,
      quick_read_summary: parsed.quick_read_summary || `Diagnostic summary for ${meta.url}`,
      industry_context_note: parsed.industry_context_note || (siteContext.industryConflict ? siteContext.industryConflict.reason : null),
      most_important: parsed.most_important,
      system_opportunities: Array.isArray(parsed.system_opportunities) ? parsed.system_opportunities.slice(0, 3) : [],
      quick_wins: Array.isArray(parsed.quick_wins) ? parsed.quick_wins.slice(0, 3) : [],
      worth_verifying: Array.isArray(parsed.worth_verifying) ? parsed.worth_verifying.slice(0, 2) : [],
      technical_notes: Array.isArray(parsed.technical_notes) ? parsed.technical_notes.slice(0, 3) : [],
      proof_key: parsed.proof_key || 'quote_lead'
    };
  } catch (err) {
    console.warn(`OpenAI synthesis error: ${err.message}. Gracefully falling back to deterministic results.`);
    return synthesizeDeterministic(evidenceList, siteContext, meta, context);
  }
}

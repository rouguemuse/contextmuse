/**
 * Synthesizes structured evidence into a prioritized, plain-language diagnostic.
 * Integrates with OpenAI API (server-side only) with a reliable deterministic fallback.
 */

const DEFAULT_MODEL = 'gpt-4o-mini';

/**
 * Deterministic fallback synthesis when OpenAI is unavailable or disabled
 */
export function synthesizeDeterministic(evidenceList, meta, context = {}) {
  const sorted = [...evidenceList].sort((a, b) => {
    const sevScore = { high: 3, medium: 2, low: 1, positive: 0 };
    return (sevScore[b.severity] || 0) - (sevScore[a.severity] || 0);
  });

  const highPriority = sorted.filter(e => e.severity === 'high');
  const mediumPriority = sorted.filter(e => e.severity === 'medium');
  const lowPriority = sorted.filter(e => e.severity === 'low' || e.severity === 'positive');

  const mostImportant = highPriority[0] || mediumPriority[0] || sorted[0] || {
    title: 'Clean baseline with immediate room for structured qualification',
    observation: 'Core site structure is intact, but the intake flow can be elevated into a high-converting system.',
    why_it_matters: 'Every friction point in the customer journey creates drop-off and manual follow-up overhead.',
    what_could_improve: 'Replace generic inquiry forms with an interactive sizing calculator or structured qualification workbench.'
  };

  const quickWins = [];
  const systemOpportunities = [];
  const technicalNotes = [];

  for (const item of sorted) {
    if (item.id === mostImportant.id) continue;

    const formatted = {
      id: item.id,
      title: item.title,
      observation: item.observation,
      why_it_matters: item.business_impact,
      what_could_improve: item.improvement,
      evidence: item.evidence
    };

    if (item.category === 'intake_operations') {
      if (systemOpportunities.length < 2) systemOpportunities.push(formatted);
    } else if (item.category === 'message_clarity' || item.category === 'conversion_friction' || item.category === 'trust_signals') {
      if (quickWins.length < 2) quickWins.push(formatted);
    } else if (item.category === 'technical_basics') {
      if (technicalNotes.length < 2) technicalNotes.push(formatted);
    }
  }

  // Determine most relevant case proof
  let proofKey = 'quote_lead';
  const allText = JSON.stringify(evidenceList).toLowerCase() + (context.businessType || '').toLowerCase();
  if (allText.includes('restaurant') || allText.includes('food') || allText.includes('bar') || allText.includes('menu')) {
    proofKey = 'restaurant';
  } else if (allText.includes('calculator') || allText.includes('pricing') || allText.includes('territory') || allText.includes('quote')) {
    proofKey = 'quote_lead';
  } else if (allText.includes('internal') || allText.includes('portal') || allText.includes('operations')) {
    proofKey = 'custom_operations';
  }

  return {
    source: 'deterministic_engine',
    quick_read_summary: `We analyzed ${meta.url} across messaging clarity, conversion paths, trust signals, and customer intake flow. Here is what we observed.`,
    most_important: {
      id: mostImportant.id,
      title: mostImportant.title,
      observation: mostImportant.observation,
      why_it_matters: mostImportant.business_impact || mostImportant.why_it_matters,
      what_could_improve: mostImportant.improvement || mostImportant.what_could_improve,
      evidence: mostImportant.evidence
    },
    quick_wins: quickWins,
    system_opportunities: systemOpportunities,
    technical_notes: technicalNotes,
    proof_key: proofKey
  };
}

/**
 * Synthesizes evidence via OpenAI chat completion using structured evidence
 */
export async function synthesizeWithOpenAI(evidenceList, meta, context = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return synthesizeDeterministic(evidenceList, meta, context);
  }

  const model = process.env.OPENAI_AUDIT_MODEL || DEFAULT_MODEL;

  const systemPrompt = `You are Jayme Volstad, founder of Context & Muse — an applied systems and digital product studio.
Context & Muse finds expensive operational messes and builds the custom software, quoting engines, and internal systems that replace them.

You are generating a concise, high-value "First-Pass Diagnostic" (Quick Read) for a prospective client who submitted their website URL.
CRITICAL RULES:
1. Ground every statement strictly in the provided evidence records. DO NOT invent metrics, scores, or claims.
2. Tone: Calm, direct, intellectual, editorial, respectful. No aggressive sales hype, no generic AI corporate buzzwords ("unlock", "supercharge", "synergy", "seamless").
3. Focus on visible customer-journey friction, intake bottlenecks, missing qualifications, and operational system opportunities.
4. Output MUST be valid JSON conforming strictly to the requested schema.`;

  const userPrompt = `Target URL: ${meta.url}
Business Type Context: ${context.businessType || 'General Business'}
Improvement Goal: ${context.goal || 'Conversion and operational flow'}

Extracted Evidence Records:
${JSON.stringify(evidenceList, null, 2)}

Page Metadata:
${JSON.stringify({
  title: meta.title,
  description: meta.description,
  h1s: meta.h1s,
  hasPricing: meta.hasPricing,
  hasTerritory: meta.hasTerritory,
  formsCount: meta.forms.length,
  hasTel: meta.hasTel,
  hasMailto: meta.hasMailto,
  isHttps: meta.isHttps,
  hasViewport: meta.hasViewport
}, null, 2)}

Synthesize these into a structured JSON diagnostic with the following structure:
{
  "quick_read_summary": "1-2 sentence executive overview in Jayme's voice",
  "most_important": {
    "title": "Clear concise title of the single biggest bottleneck",
    "observation": "What was specifically observed on the website",
    "why_it_matters": "Why this causes drop-off, lost revenue, or manual overhead",
    "what_could_improve": "Clear next step or system recommendation",
    "evidence": "Brief excerpt of the captured evidence"
  },
  "quick_wins": [
    {
      "title": "...",
      "observation": "...",
      "why_it_matters": "...",
      "what_could_improve": "..."
    }
  ],
  "system_opportunities": [
    {
      "title": "...",
      "observation": "...",
      "why_it_matters": "...",
      "what_could_improve": "..."
    }
  ],
  "technical_notes": [
    {
      "title": "...",
      "observation": "...",
      "why_it_matters": "...",
      "what_could_improve": "..."
    }
  ],
  "proof_key": "quote_lead" | "custom_operations" | "restaurant"
}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout

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
        temperature: 0.2,
        max_tokens: 1200
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`OpenAI API returned status ${response.status}. Falling back to deterministic synthesis.`);
      return synthesizeDeterministic(evidenceList, meta, context);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return synthesizeDeterministic(evidenceList, meta, context);
    }

    const parsed = JSON.parse(content);
    return {
      source: 'openai_synthesizer',
      model,
      quick_read_summary: parsed.quick_read_summary || `Diagnostic summary for ${meta.url}`,
      most_important: parsed.most_important,
      quick_wins: Array.isArray(parsed.quick_wins) ? parsed.quick_wins.slice(0, 2) : [],
      system_opportunities: Array.isArray(parsed.system_opportunities) ? parsed.system_opportunities.slice(0, 2) : [],
      technical_notes: Array.isArray(parsed.technical_notes) ? parsed.technical_notes.slice(0, 2) : [],
      proof_key: parsed.proof_key || 'quote_lead'
    };
  } catch (err) {
    console.warn(`OpenAI synthesis error: ${err.message}. Gracefully falling back to deterministic results.`);
    return synthesizeDeterministic(evidenceList, meta, context);
  }
}

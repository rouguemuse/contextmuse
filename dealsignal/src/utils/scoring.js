/**
 * Calculate the overall DealSignal Score (0-100) based on various FBA signals.
 * @param {Object} deal 
 * @returns {number} Score
 */
export function calculateDealScore(deal) {
  let score = 0;

  // 1. Profit Score (Max 30 points)
  // Assume >$10 profit gets max points
  const profit = parseFloat(deal.netProfit) || 0;
  if (profit >= 10) score += 30;
  else if (profit > 0) score += (profit / 10) * 30;

  // 2. ROI Score (Max 30 points)
  // Assume >50% ROI gets max points
  const roi = parseFloat(deal.roi) || 0;
  if (roi >= 50) score += 30;
  else if (roi > 0) score += (roi / 50) * 30;

  // 3. Velocity / Sales Rank Score (Max 20 points)
  // Lower rank is better. Assume <50k rank is max points, 200k is 0 points.
  const rank = parseInt(deal.salesRank, 10) || 200000;
  if (rank <= 50000) score += 20;
  else if (rank < 200000) score += ((200000 - rank) / 150000) * 20;

  // 4. Competition & Restriction Risk (Max 20 points)
  // Baseline 20 points, deduct for risks.
  let riskScore = 20;
  if (deal.competition === 'High') riskScore -= 10;
  else if (deal.competition === 'Medium') riskScore -= 5;

  if (deal.restriction === 'Gated' || deal.restriction === 'IP Claim Risk') {
    riskScore -= 15;
  }
  
  score += Math.max(0, riskScore);

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Helper to calculate ROI and Profit
 */
export function calculateFinancials(sourcePrice, amazonPrice, estimatedFees, prepCost) {
  const cogs = (parseFloat(sourcePrice) || 0) + (parseFloat(prepCost) || 0);
  const revenue = parseFloat(amazonPrice) || 0;
  const fees = parseFloat(estimatedFees) || 0;

  const netProfit = revenue - cogs - fees;
  const roi = cogs > 0 ? (netProfit / cogs) * 100 : 0;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return {
    netProfit: netProfit.toFixed(2),
    roi: roi.toFixed(2),
    margin: margin.toFixed(2)
  };
}

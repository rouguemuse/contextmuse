import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Activity, Layers, ShieldCheck } from 'lucide-react';

const METRIC_CARDS = [
  {
    id: '01',
    code: 'INGESTION PIPELINE',
    title: 'Schema Validation',
    value: '1,420 req/s',
    delta: '+12.4% vs baseline',
    desc: 'Deterministic field normalization and payload validation across distributed edge nodes.',
    icon: Layers,
  },
  {
    id: '02',
    code: 'DECISION LATENCY',
    title: 'Rule-Graph Dispatch',
    value: '18.4 ms',
    delta: 'p99 < 24.0ms target',
    desc: 'Sub-millisecond priority routing with zero unverified state transitions.',
    icon: Activity,
  },
  {
    id: '03',
    code: 'VERIFICATION GATES',
    title: 'Telemetry Coverage',
    value: '100.0%',
    delta: '14 / 14 gates active',
    desc: 'Continuous WCAG 2.1 luminance and DOM bounding-box alignment assertions.',
    icon: ShieldCheck,
  },
];

const QUEUE_ROWS = [
  {
    id: 'RT-4091',
    task: 'Multi-region schema normalization check',
    env: 'us-east · edge-04',
    latency: '11.2 ms',
    status: 'VERIFIED',
    tone: 'positive',
  },
  {
    id: 'RT-4092',
    task: 'Surface luminance & contrast threshold audit',
    env: 'eu-central · ui-02',
    latency: '16.8 ms',
    status: 'ACTIVE',
    tone: 'warning',
  },
  {
    id: 'RT-4093',
    task: 'Viewport plumb-line geometry verification',
    env: 'global · runner-09',
    latency: '9.4 ms',
    status: 'READY',
    tone: 'brand',
  },
];

/**
 * Shared Neutral vs. Token-Applied Specimen Interface
 * Keeps content, DOM structure, and information nodes 100% constant across:
 * - 'neutral' (Baseline unstyled reference specimen)
 * - 'plaidis' (Study 01: Plaidis / Locomotive tokens)
 * - 'linear'  (Study 02: Linear tokens)
 * - 'stripe'  (Study 03: Stripe HDS tokens)
 *
 * Uses a canonical coordinate frame (1040×650 for Desktop 16:10, 390×844 for Mobile)
 * scaled proportionally via ResizeObserver so the specimen never clips or reflows
 * when inspected on narrow viewports (390px, 768px) or zoomed in the Detail Inspector.
 */
export default function DesignSystemSpecimen({
  variant = 'neutral',
  viewport = 'desktop',
  simulatingHover = false,
  reducedMotion = false,
}) {
  const isMobile = viewport === 'mobile';
  const canonicalWidth = isMobile ? 390 : 1040;
  const canonicalHeight = isMobile ? 844 : 650;

  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return undefined;

    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        setScale(rect.width / canonicalWidth);
      }
    };

    updateScale();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateScale);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canonicalWidth]);

  // Variant-specific token configurations grounded in Phase 1 extractions
  const isNeutral = variant === 'neutral';
  const isPlaidis = variant === 'plaidis';
  const isLinear = variant === 'linear';
  const isStripe = variant === 'stripe';

  // Outer canvas style
  const canvasStyle = isNeutral
    ? {
        backgroundColor: '#F4F4F5',
        color: '#18181B',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }
    : isPlaidis
    ? {
        backgroundColor: '#EDE9E0',
        color: '#23282A',
        fontFamily: '"Helvetica Neue", Helvetica, -apple-system, BlinkMacSystemFont, sans-serif',
      }
    : isLinear
    ? {
        backgroundColor: '#08090A',
        color: '#F7F8F8',
        fontFamily: '"Inter Variable", "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        fontFeatureSettings: '"cv01", "ss03"',
      }
    : {
        // Stripe
        backgroundColor: '#F8FAFD',
        color: '#061B31',
        fontFamily: 'sohne-var, "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        fontFeatureSettings: '"ss01"',
      };

  // Top Header Bar style
  const headerStyle = isNeutral
    ? {
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E4E4E7',
        padding: isMobile ? '10px 12px' : '12px 24px',
      }
    : isPlaidis
    ? {
        backgroundColor: '#23282A',
        color: '#EDE9E0',
        borderBottom: '2px solid #23282A',
        padding: isMobile ? '10px 12px' : '12px 40px',
      }
    : isLinear
    ? {
        backgroundImage: 'linear-gradient(rgba(11, 11, 11, 0.88) 0%, rgba(15, 16, 17, 0.78) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        padding: isMobile ? '10px 12px' : '12px 46px',
      }
    : {
        // Stripe
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5EDF5',
        padding: isMobile ? '10px 12px' : '12px 48px',
      };

  // Main content padding
  const bodyPaddingStyle = isNeutral
    ? { padding: isMobile ? '16px 16px' : '22px 24px' }
    : isPlaidis
    ? { padding: isMobile ? '16px 20px' : '22px 40px' }
    : isLinear
    ? { padding: isMobile ? '16px 24px' : '22px 46px' }
    : { padding: isMobile ? '16px 16px' : '22px 48px' };

  // Display Headline style (calibrated so single-line desktop / two-line mobile wrapping stays aligned across the split slider)
  const headlineStyle = isNeutral
    ? {
        fontSize: isMobile ? '22px' : '28px',
        fontWeight: 600,
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
        color: '#18181B',
      }
    : isPlaidis
    ? {
        fontSize: isMobile ? '17.5px' : '22.5px',
        fontWeight: 800,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: '#23282A',
        textTransform: 'uppercase',
      }
    : isLinear
    ? {
        fontSize: isMobile ? '22px' : '29px',
        fontWeight: 510,
        lineHeight: 1.12,
        letterSpacing: '-0.022em',
        color: '#F7F8F8',
      }
    : {
        // Stripe: light weight 300 display heading with -0.02em tracking
        fontSize: isMobile ? '22px' : '29px',
        fontWeight: 300,
        lineHeight: 1.14,
        letterSpacing: '-0.02em',
        color: '#061B31',
      };

  // Lead paragraph style
  const leadStyle = isNeutral
    ? {
        fontSize: isMobile ? '12.5px' : '13.5px',
        fontWeight: 400,
        lineHeight: 1.48,
        color: '#52525B',
      }
    : isPlaidis
    ? {
        fontSize: isMobile ? '12.5px' : '13.5px',
        fontWeight: 400,
        lineHeight: 1.45,
        color: '#23282A',
      }
    : isLinear
    ? {
        fontSize: isMobile ? '12.5px' : '13.5px',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '-0.011em',
        color: '#8A8F98',
      }
    : {
        // Stripe: weight 300 subdued slate #64748D (4.54:1 AA on #F8FAFD, 4.75:1 AA on #FFFFFF)
        fontSize: isMobile ? '12.5px' : '13.5px',
        fontWeight: 300,
        lineHeight: 1.48,
        color: '#64748D',
      };

  // Primary CTA style
  const primaryCtaStyle = isNeutral
    ? {
        backgroundColor: '#27272A',
        color: '#FFFFFF',
        borderRadius: '6px',
        border: '1px solid #27272A',
        padding: isMobile ? '8px 14px' : '8px 16px',
        fontSize: '12px',
        fontWeight: 600,
      }
    : isPlaidis
    ? {
        backgroundColor: simulatingHover ? '#D9A62E' : '#23282A',
        color: simulatingHover ? '#141617' : '#EDE9E0',
        borderRadius: '0px',
        border: '2px solid #23282A',
        padding: isMobile ? '8px 14px' : '8px 18px',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        transition: reducedMotion ? 'none' : 'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
      }
    : isLinear
    ? {
        backgroundColor: simulatingHover ? '#FFFFFF' : '#E5E5E6',
        color: '#08090A',
        borderRadius: '9999px',
        border: '1px solid #E5E5E6',
        padding: isMobile ? '6px 13px' : '6px 14px',
        fontSize: '12px',
        fontWeight: 510,
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.08)',
        transition: reducedMotion ? 'none' : 'all 160ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    : {
        // Stripe: #533AFD (--hds-color-core-brand-600), 4px radius, weight 400
        backgroundColor: simulatingHover ? '#4032C8' : '#533AFD',
        color: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid transparent',
        padding: isMobile ? '8px 16px' : '9px 18px',
        fontSize: '12.5px',
        fontWeight: 400,
        transition: reducedMotion ? 'none' : 'all 300ms cubic-bezier(0.25, 1, 0.5, 1)',
      };

  // Secondary CTA style
  const secondaryCtaStyle = isNeutral
    ? {
        backgroundColor: '#FFFFFF',
        color: '#27272A',
        borderRadius: '6px',
        border: '1px solid #D4D4D8',
        padding: isMobile ? '8px 14px' : '8px 14px',
        fontSize: '12px',
        fontWeight: 500,
      }
    : isPlaidis
    ? {
        backgroundColor: 'transparent',
        color: '#23282A',
        borderRadius: '0px',
        border: '2px solid #23282A',
        padding: isMobile ? '8px 14px' : '8px 16px',
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        textDecoration: simulatingHover ? 'underline' : 'none',
      }
    : isLinear
    ? {
        backgroundColor: simulatingHover ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        color: '#D0D6E0',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: isMobile ? '6px 12px' : '6px 12px',
        fontSize: '12px',
        fontWeight: 510,
      }
    : {
        // Stripe: rgba(255,255,255,0.85), 1px solid #B9B9F9, #533AFD text, 4px radius
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        color: '#533AFD',
        borderRadius: '4px',
        border: '1px solid #B9B9F9',
        padding: isMobile ? '8px 14px' : '9px 16px',
        fontSize: '12.5px',
        fontWeight: 400,
      };

  // Metric Card style
  const getCardStyle = (idx) => {
    if (isNeutral) {
      return {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E4E7',
        borderRadius: '6px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        padding: isMobile ? '11px 13px' : '14px 16px',
      };
    }
    if (isPlaidis) {
      return {
        backgroundColor: idx === 1 ? '#DFDACE' : '#EDE9E0',
        borderTop: '2px solid #23282A',
        borderBottom: '1px solid rgba(35, 40, 42, 0.25)',
        borderLeft: 'none',
        borderRight: 'none',
        borderRadius: '0px',
        boxShadow: 'none',
        padding: isMobile ? '11px 10px' : '14px 12px',
      };
    }
    if (isLinear) {
      return {
        backgroundColor: '#0F1011',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03))',
        border: simulatingHover && idx === 1 ? '1px solid rgba(130, 143, 255, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '9px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 0px 1px',
        padding: isMobile ? '11px 13px' : '13px 15px',
      };
    }
    // Stripe: 6px radius, 1px #E5EDF5 border + navy-tinted elevation shadow
    return {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E5EDF5',
      borderRadius: '6px',
      boxShadow:
        simulatingHover && idx === 1
          ? '0px 20px 40px -10px rgba(50, 50, 93, 0.18), 0px 6px 14px rgba(0, 55, 112, 0.08)'
          : '0px 16px 32px 0px rgba(50, 50, 93, 0.10), 0px 2px 6px 0px rgba(0, 59, 137, 0.04)',
      padding: isMobile ? '11px 13px' : '14px 16px',
    };
  };

  // Status badge helper for queue rows
  const getStatusBadgeStyle = (tone) => {
    if (isNeutral) {
      return {
        backgroundColor: '#F4F4F5',
        color: '#3F3F46',
        border: '1px solid #D4D4D8',
        borderRadius: '4px',
      };
    }
    if (isPlaidis) {
      if (tone === 'warning') {
        return {
          backgroundColor: '#D9A62E',
          color: '#141617',
          border: '1px solid #23282A',
          borderRadius: '0px',
        };
      }
      if (tone === 'brand') {
        return {
          backgroundColor: '#312DFB',
          color: '#FFFFFF',
          border: '1px solid #312DFB',
          borderRadius: '0px',
        };
      }
      return {
        backgroundColor: '#17504A',
        color: '#EDE9E0',
        border: '1px solid #17504A',
        borderRadius: '0px',
      };
    }
    if (isLinear) {
      if (tone === 'positive') {
        return {
          backgroundColor: 'rgba(104, 204, 88, 0.14)',
          color: '#68CC58',
          border: '1px solid rgba(104, 204, 88, 0.35)',
          borderRadius: '9999px',
        };
      }
      if (tone === 'warning') {
        return {
          backgroundColor: 'rgba(212, 177, 68, 0.14)',
          color: '#D4B144',
          border: '1px solid rgba(212, 177, 68, 0.35)',
          borderRadius: '9999px',
        };
      }
      return {
        backgroundColor: 'rgba(94, 106, 210, 0.18)',
        color: '#828FFF',
        border: '1px solid rgba(130, 143, 255, 0.35)',
        borderRadius: '9999px',
      };
    }
    // Stripe (inside dark enterprise ledger #0D1738)
    if (tone === 'positive') {
      return {
        backgroundColor: 'rgba(0, 178, 97, 0.18)',
        color: '#B6F2C7',
        border: '1px solid rgba(0, 178, 97, 0.4)',
        borderRadius: '4px',
      };
    }
    if (tone === 'warning') {
      return {
        backgroundColor: 'rgba(255, 97, 24, 0.2)',
        color: '#FFD8C6',
        border: '1px solid rgba(255, 97, 24, 0.45)',
        borderRadius: '4px',
      };
    }
    return {
      backgroundColor: 'rgba(83, 58, 253, 0.35)',
      color: '#E8E9FF',
      border: '1px solid rgba(154, 154, 254, 0.45)',
      borderRadius: '4px',
    };
  };

  return (
    <div
      ref={wrapperRef}
      data-specimen-variant={variant}
      data-specimen-viewport={viewport}
      className="relative w-full h-full overflow-hidden select-none"
    >
      <div
        style={{
          ...canvasStyle,
          width: `${canonicalWidth}px`,
          height: `${canonicalHeight}px`,
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top left',
        }}
        className="flex flex-col justify-between overflow-hidden select-none"
      >
        {/* =================================================================
            1. SPECIMEN HEADER BAR (Identical DOM & content across all variants)
            ================================================================= */}
        <div style={headerStyle} className="flex items-center justify-between gap-1.5 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              style={{ fontSize: isMobile ? '10px' : '11px' }}
              className="flex items-center gap-1.5 font-mono font-bold tracking-wider shrink-0"
            >
              <span
                style={{
                  backgroundColor: isNeutral
                    ? '#27272A'
                    : isPlaidis
                    ? '#D9A62E'
                    : isLinear
                    ? '#5E6AD2'
                    : '#533AFD',
                  borderRadius: isPlaidis ? '0px' : isLinear ? '9999px' : '3px',
                }}
                className="inline-block h-2 w-2 shrink-0"
              />
              <span className="truncate">CM // SPECIMEN-04</span>
            </div>

            <div
              style={{
                color: isNeutral
                  ? '#52525B'
                  : isPlaidis
                  ? 'rgba(237, 233, 224, 0.78)'
                  : isLinear
                  ? '#8A8F98'
                  : '#50617A',
                fontSize: isMobile ? '9.5px' : isLinear ? '12.5px' : '13px',
              }}
              className={`flex items-center ${isMobile ? 'gap-1.5 pl-2' : 'gap-4 pl-3'} border-l border-current/15 shrink-0`}
            >
              <span>Overview</span>
              <span>Pipelines</span>
              <span>Verification</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span
              style={{
                fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", SFMono-Regular, monospace',
                fontSize: isMobile ? '9px' : '10px',
                padding: isMobile ? '1.5px 5px' : '2px 7px',
                borderRadius: isPlaidis ? '0px' : isLinear ? '9999px' : '4px',
                backgroundColor: isNeutral
                  ? '#F4F4F5'
                  : isPlaidis
                  ? '#17504A'
                  : isLinear
                  ? 'rgba(255, 255, 255, 0.05)'
                  : '#E8E9FF',
                color: isNeutral
                  ? '#3F3F46'
                  : isPlaidis
                  ? '#EDE9E0'
                  : isLinear
                  ? '#D0D6E0'
                  : '#533AFD',
                border: isLinear ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              }}
            >
              SPECIMEN · v4.2
            </span>
          </div>
        </div>

        {/* =================================================================
            2. MAIN SPECIMEN BODY (HERO + 3-CARD GRID + TELEMETRY LEDGER)
            ================================================================= */}
        <div
          style={bodyPaddingStyle}
          className="flex-1 flex flex-col justify-between gap-2.5 sm:gap-3.5 min-h-0 overflow-hidden"
        >
          {/* HERO SECTION */}
          <div className="space-y-1.5">
            {/* Eyebrow + Telemetry Mesh Pill */}
            <div
              style={{
                borderBottom: isPlaidis ? '1px solid rgba(35, 40, 42, 0.35)' : '1px solid transparent',
                paddingBottom: '4px',
              }}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <span
                style={{
                  fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                  fontSize: '10.5px',
                  fontWeight: isStripe ? 500 : 600,
                  letterSpacing: isPlaidis && !isMobile ? '0.14em' : '0.06em',
                  color: isNeutral
                    ? '#52525B'
                    : isPlaidis
                    ? '#17504A'
                    : isLinear
                    ? '#828FFF'
                    : '#533AFD',
                }}
                className="uppercase"
              >
                01 / Synthetic Interface Specimen
              </span>

              <span
                style={{
                  fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                  fontSize: '10px',
                  color: isNeutral
                    ? '#52525B'
                    : isPlaidis
                    ? '#23282A'
                    : isLinear
                    ? '#8A8F98'
                    : '#64748D',
                }}
              >
                Synthetic Demo Fixture · Mock Data
              </span>
            </div>

            {/* Headline & Lead (Identical DOM & text across all variants) */}
            <div className="space-y-1.5 max-w-4xl">
              <h3 style={headlineStyle}>
                Deterministic workflow telemetry for operational teams.
              </h3>
              <p style={leadStyle}>
                Standardizes intake routing, latency thresholds, and verification gates across distributed product environments without altering core logic.
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span style={primaryCtaStyle} className="inline-flex items-center gap-1.5">
                <span>Deploy Verification Gate</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              <span style={secondaryCtaStyle} className="inline-flex items-center gap-1.5">
                <span>Inspect Rule Graph</span>
              </span>
            </div>
          </div>

          {/* =================================================================
              3. THREE-CARD METRIC & CAPABILITY GRID (All 3 cards in both viewports)
              ================================================================= */}
          <div
            className={`grid ${
              isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3 gap-3.5'
            }`}
          >
            {METRIC_CARDS.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={card.id} style={getCardStyle(idx)} className="flex flex-col justify-between space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      style={{
                        fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                        fontSize: '10px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: isNeutral
                          ? '#52525B'
                          : isPlaidis
                          ? '#17504A'
                          : isLinear
                          ? '#8A8F98'
                          : '#64748D',
                      }}
                    >
                      {card.id} / {card.code}
                    </span>
                    <Icon
                      className="h-3.5 w-3.5 shrink-0"
                      style={{
                        color: isNeutral
                          ? '#52525B'
                          : isPlaidis
                          ? '#23282A'
                          : isLinear
                          ? '#5E6AD2'
                          : '#533AFD',
                      }}
                    />
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <div
                      style={{
                        fontSize: isMobile ? '17px' : '21px',
                        fontWeight: isNeutral ? 700 : isPlaidis ? 800 : isLinear ? 590 : 300,
                        letterSpacing: isLinear ? '-0.02em' : '-0.01em',
                        color: isNeutral
                          ? '#18181B'
                          : isPlaidis
                          ? '#23282A'
                          : isLinear
                          ? '#F7F8F8'
                          : '#061B31',
                      }}
                    >
                      {card.value}
                    </div>
                    <span
                      style={{
                        fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: isPlaidis ? '0px' : isLinear ? '9999px' : '4px',
                        backgroundColor: isNeutral
                          ? '#F4F4F5'
                          : isPlaidis
                          ? idx === 1
                            ? '#D9A62E'
                            : '#EDE9E0'
                          : isLinear
                          ? 'rgba(104, 204, 88, 0.12)'
                          : '#E8E9FF',
                        color: isNeutral
                          ? '#3F3F46'
                          : isPlaidis
                          ? '#141617'
                          : isLinear
                          ? '#68CC58'
                          : '#533AFD',
                        border: isPlaidis ? '1px solid rgba(35,40,42,0.35)' : 'none',
                      }}
                    >
                      {card.delta}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: isMobile ? '11.5px' : isLinear ? '12px' : '12.5px',
                      fontWeight: isStripe ? 300 : 400,
                      lineHeight: 1.38,
                      color: isNeutral
                        ? '#52525B'
                        : isPlaidis
                        ? 'rgba(35, 40, 42, 0.85)'
                        : isLinear
                        ? '#8A8F98'
                        : '#50617A',
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* =================================================================
              4. ACTIVE DISPATCH QUEUE / TELEMETRY LEDGER
              ================================================================= */}
          <div
            style={
              isNeutral
                ? {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E4E4E7',
                    borderRadius: '6px',
                    padding: isMobile ? '8px 10px' : '10px 14px',
                  }
                : isPlaidis
                ? {
                    backgroundColor: '#23282A',
                    color: '#EDE9E0',
                    borderTop: '2px solid #141617',
                    borderRadius: '0px',
                    padding: isMobile ? '8px 12px' : '10px 16px',
                  }
                : isLinear
                ? {
                    backgroundColor: '#141516',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: isMobile ? '8px 10px' : '10px 14px',
                  }
                : {
                    // Stripe dark infrastructure section token (--hds-color-core-neutralDark-990: #0D1738)
                    backgroundColor: '#0D1738',
                    color: '#FFFFFF',
                    border: '1px solid #23356E',
                    borderRadius: '6px',
                    boxShadow: '0px 12px 24px rgba(13, 23, 56, 0.16)',
                    padding: isMobile ? '8px 10px' : '10px 16px',
                  }
            }
            className="space-y-1.5"
          >
            <div className="flex items-center justify-between border-b border-current/10 pb-1.5">
              <span
                style={{
                  fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: isNeutral
                    ? '#52525B'
                    : isPlaidis
                    ? '#D9A62E'
                    : isLinear
                    ? '#D0D6E0'
                    : '#A3B5D6',
                }}
                className="uppercase"
              >
                Synthetic Telemetry Ledger (Demo)
              </span>
              <span
                style={{
                  fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                  fontSize: '10px',
                  color: isNeutral
                    ? '#52525B'
                    : isPlaidis
                    ? 'rgba(237, 233, 224, 0.75)'
                    : isLinear
                    ? '#8A8F98'
                    : '#839BC8',
                }}
              >
                3 Mock Rows · Synthetic Data
              </span>
            </div>

            <div className="divide-y divide-current/10">
              {QUEUE_ROWS.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-2 py-1 text-[11.5px]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      style={{
                        fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: isNeutral
                          ? '#52525B'
                          : isPlaidis
                          ? '#D9A62E'
                          : isLinear
                          ? '#8A8F98'
                          : '#92ADFF',
                      }}
                      className="shrink-0"
                    >
                      {row.id}
                    </span>
                    <span
                      style={{
                        fontWeight: isLinear ? 510 : isStripe ? 300 : 500,
                        color: isNeutral
                          ? '#18181B'
                          : isPlaidis
                          ? '#EDE9E0'
                          : isLinear
                          ? '#F7F8F8'
                          : '#FFFFFF',
                      }}
                      className="truncate"
                    >
                      {row.task}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      style={{
                        fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                        fontSize: '9.5px',
                        color: isNeutral
                          ? '#52525B'
                          : isPlaidis
                          ? 'rgba(237, 233, 224, 0.72)'
                          : isLinear
                          ? '#8A8F98'
                          : '#839BC8',
                      }}
                      className={isMobile ? 'hidden' : 'inline'}
                    >
                      {row.env} · {row.latency}
                    </span>
                    <span
                      style={{
                        ...getStatusBadgeStyle(row.tone),
                        fontFamily: 'ui-monospace, "Berkeley Mono", "SourceCodePro", monospace',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '1px 6px',
                      }}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

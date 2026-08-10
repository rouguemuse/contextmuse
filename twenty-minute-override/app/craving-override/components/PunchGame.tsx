'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Banker Trash Talk ───────────────────────────────────────────────────────
const TRASH_TALK = [
  "Per my last email...",
  "I have a hard stop at 3.", // books you for 3:45
  "Let's take this offline.", // never speaks of it again
  "I'm just playing devil's advocate.",
  "I take full responsibility.", // does absolutely nothing
  "That's interesting feedback.", // shreds your feedback
  "My door is always open.", // it is always closed
  "We offer unlimited PTO.", // you cannot take it
  "Actually, I went to Wharton.",
  "I'm very data-driven.", // makes decisions on vibes
  "You need to be more of a self-starter.",
  "This is a capacity issue.", // means: you
  "Have you considered a PIP?",
  "I'm invested in your growth.", // has not learned your name
  "Let's get on a quick 15-minute call.", // it's 2 hours
  "I don't micromanage. I just check in hourly.",
  "We need to right-size this.", // means: fire people
  "I'm protecting the team here.", // protecting himself
  "Can you get this to me by EOD?", // it is 4:58 PM
  "I feel like we're not aligned.",
  "It's not a no. It's a not right now.", // it is a no
  "My assistant will loop you in.", // she will not
  "I thought this was a growth opportunity for you.",
  "We need to move fast and break things.", // things = your weekend
  "The bonus pool is smaller this year.", // his bonus is fine
];

const EXIT_SCREAMS = [
  "MY BONUS!!",
  "PER MY LAST EMAIL!!!",
  "I'LL HAVE MY ASSISTANT CALL YOU!",
  "CALL MY GOLF BUDDY AT THE FED!",
  "MY SQUASH GAME IS AT 6!!",
  "I HAVE A TED TALK IN THE MORNING!!",
  "BUT THE BOARD LOVED MY DECK!!",
  "MY LINKEDIN CONNECTIONS!!!",
  "I WENT TO WHARTON!!",
  "BUT MY EQUITY VESTS IN MARCH!",
  "MY SECOND HOME IN THE HAMPTONS!!",
  "I'LL HAVE YOUR JOB FOR THIS!!", // he will not
  "MY PELOTON SUBSCRIPTION!!",
  "I WAS ABOUT TO DISRUPT FINTECH!!",
  "THIS GOES AGAINST MY CORE VALUES!!", // has none
  "MY ASSISTANT HANDLES MY FEELINGS!!",
  "I HAVE A CALL WITH THE VP!!", // the VP does not know his name
  "BUT I TOOK FULL RESPONSIBILITY!!", // he did not
  "MY UNLIMITED PTO IS AT STAKE!!", // ironic
  "HR WILL HEAR ABOUT THIS!!", // HR works for him
];

const ACHIEVEMENTS = [
  { threshold: 1,  title: "Verbal Warning Issued",       emoji: "📋" },
  { threshold: 5,  title: "HR Is Now Aware",             emoji: "📎" },
  { threshold: 10, title: "Hostile Work Environment",    emoji: "🏢" },
  { threshold: 20, title: "Class Action Filed",          emoji: "⚖️" },
  { threshold: 35, title: "Regulatory Investigation",    emoji: "🔍" },
  { threshold: 50, title: "CEO Resigns to Spend Time With Family", emoji: "👨‍👧" },
  { threshold: 75, title: "Congressional Hearing",       emoji: "🎤" },
  { threshold: 99, title: "Netflix Documentary",         emoji: "🎬" },
];

const COMBO_LABELS: Record<number, string> = [
  "",
  "",
  "SYNERGY!",
  "DISRUPTION!",
  "LEVERAGE THIS!",
  "UNLIMITED PTO!!",    // the cruelest joke in finance
  "PIVOT! PIVOT!",
  "WE'RE A FAMILY HERE!!",
  "SERIES A ROUND!!!",
  "CONGRESSIONAL HEARING!!!!",
].reduce((acc, v, i) => { if (v) acc[i] = v; return acc; }, {} as Record<number, string>);

// ─── Types ───────────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; color: string;
  text?: string;
}

interface FloatText {
  x: number; y: number;
  text: string;
  life: number; maxLife: number;
  color: string; size: number;
}

type FigureState = 'walking' | 'stunned' | 'flying' | 'dead';
type FigureType = 'grunt' | 'boss';

interface Figure {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  state: FigureState;
  type: FigureType;
  facingLeft: boolean;
  talkTimer: number;
  talkText: string;
  punchedAt: number;
  legPhase: number;
  tieAngle: number;
  tieVel: number;
  briefcaseX: number; briefcaseY: number;
  briefcaseVx: number; briefcaseVy: number;
  briefcaseAlive: boolean;
  screamed: boolean;
}

interface HitEffect {
  x: number; y: number;
  text: string;
  life: number; maxLife: number;
}

let _nextId = 0;
const GRAVITY = 0.45;

// ─── Factory ─────────────────────────────────────────────────────────────────
function makeFigure(W: number, H: number, isBoss = false): Figure {
  const fromLeft = Math.random() < 0.5;
  const groundY = H * 0.60;
  const x = fromLeft ? -60 : W + 60;
  const baseSpeed = isBoss ? 0.4 : 0.55 + Math.random() * 0.75;
  return {
    id: _nextId++,
    x, y: groundY,
    vx: fromLeft ? baseSpeed : -baseSpeed,
    vy: 0,
    state: 'walking',
    type: isBoss ? 'boss' : 'grunt',
    facingLeft: !fromLeft,
    talkTimer: 60 + Math.floor(Math.random() * 90),
    talkText: TRASH_TALK[Math.floor(Math.random() * TRASH_TALK.length)],
    punchedAt: 0,
    legPhase: Math.random() * Math.PI * 2,
    tieAngle: 0,
    tieVel: 0,
    briefcaseX: 0, briefcaseY: 0,
    briefcaseVx: 0, briefcaseVy: 0,
    briefcaseAlive: false,
    screamed: false,
  };
}

// ─── Canvas draw helpers ──────────────────────────────────────────────────────
function rRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawFigure(ctx: CanvasRenderingContext2D, fig: Figure, t: number) {
  const isBoss = fig.type === 'boss';
  const scale = isBoss ? 1.5 : 1;
  const { x, y, state, facingLeft, legPhase, tieAngle } = fig;

  ctx.save();
  ctx.translate(x, y);

  if (state === 'flying') {
    const elapsed = t - fig.punchedAt;
    ctx.rotate((facingLeft ? -1 : 1) * elapsed * 0.15);
  }
  ctx.scale(facingLeft ? -scale : scale, scale);

  const bodyColor = isBoss ? '#a855f7' : '#60a5fa';
  const flyColor  = '#fbbf24';
  const stroke    = (state === 'stunned' || state === 'flying') ? flyColor : bodyColor;

  ctx.strokeStyle = stroke;
  ctx.lineWidth   = isBoss ? 3 : 2.5;
  ctx.lineCap     = 'round';

  // Head
  ctx.beginPath();
  ctx.arc(0, -38, isBoss ? 13 : 10, 0, Math.PI * 2);
  ctx.stroke();

  // Sunglasses (grunt) / monocle (boss)
  if (isBoss) {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(3, -40, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(7, -40);
    ctx.lineTo(10, -38);
    ctx.stroke();
  } else {
    ctx.strokeStyle = '#0f2030';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-4, -40, 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(4, -40, 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-0.5, -40);
    ctx.lineTo(0.5, -40);
    ctx.stroke();
  }

  // Top hat (boss only)
  if (isBoss) {
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    ctx.moveTo(-10, -48);
    ctx.lineTo(10, -48);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-7, -48);
    ctx.lineTo(-7, -62);
    ctx.lineTo(7, -62);
    ctx.lineTo(7, -48);
    ctx.stroke();
  }

  ctx.strokeStyle = stroke;
  ctx.lineWidth   = isBoss ? 3 : 2.5;

  // Body
  ctx.beginPath();
  ctx.moveTo(0, -28);
  ctx.lineTo(0, -8);
  ctx.stroke();

  // TIE — draw as a little shape hanging from neck
  ctx.save();
  ctx.translate(0, -22);
  ctx.rotate(tieAngle);
  ctx.fillStyle = isBoss ? '#fbbf24' : '#ef4444';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(3, 4);
  ctx.lineTo(2, 12);
  ctx.lineTo(0, 14);
  ctx.lineTo(-2, 12);
  ctx.lineTo(-3, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Arms
  if (state === 'walking') {
    const swing = Math.sin(legPhase + t * 0.12) * 13;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-12, -22 + swing * 0.5);
    ctx.moveTo(0, -22);
    ctx.lineTo(12, -22 - swing * 0.5);
    ctx.stroke();
  } else {
    const flail = Math.abs(Math.sin(t * 0.28)) * 22;
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-16, -22 - flail);
    ctx.moveTo(0, -22);
    ctx.lineTo(16, -22 - flail * 0.6);
    ctx.stroke();
  }

  // Legs
  const legAng = state === 'walking' ? Math.sin(legPhase + t * 0.12) * 18 : 35;
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(-8, 10 + legAng);
  ctx.moveTo(0, -8);
  ctx.lineTo(8, 10 - legAng);
  ctx.stroke();

  ctx.restore();

  // Briefcase (flying separately after punch)
  if (fig.briefcaseAlive) {
    ctx.save();
    ctx.translate(fig.briefcaseX, fig.briefcaseY);
    ctx.strokeStyle = '#d97706';
    ctx.fillStyle   = '#92400e';
    ctx.lineWidth   = 1.5;
    rRect(ctx, -8, -5, 16, 11, 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-3, -5);
    ctx.arc(0, -5, 3, Math.PI, 0);
    ctx.moveTo(3, -5);
    ctx.stroke();
    ctx.restore();
  }

  // Speech bubble
  if (state === 'walking' && fig.talkTimer > 0 && fig.talkTimer < 130) {
    const opac = Math.min(1, fig.talkTimer / 25) * Math.min(1, (130 - fig.talkTimer) / 20);
    ctx.save();
    ctx.globalAlpha = opac;
    const txt = fig.talkText;
    ctx.font = `500 9px Inter, sans-serif`;
    const tw = ctx.measureText(txt).width;
    const bw = tw + 14;
    const bh = 20;
    const bx = x + (facingLeft ? -(bw + 14) * scale : 14 * scale);
    const by = y - (isBoss ? 80 : 65);
    rRect(ctx, bx, by, bw, bh, 4);
    ctx.fillStyle   = '#132237';
    ctx.fill();
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth   = 1;
    ctx.stroke();
    ctx.fillStyle   = '#e8edf2';
    ctx.fillText(txt, bx + 7, by + 14);
    ctx.restore();
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PunchGame() {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const figuresRef      = useRef<Figure[]>([]);
  const particlesRef    = useRef<Particle[]>([]);
  const floatsRef       = useRef<FloatText[]>([]);
  const hitFxRef        = useRef<HitEffect[]>([]);
  const frameRef        = useRef<number>(0);
  const tRef            = useRef<number>(0);
  const spawnRef        = useRef<number>(80);
  const bossTimerRef    = useRef<number>(400);
  const comboRef        = useRef<number>(0);
  const comboTimerRef   = useRef<number>(0);
  const nukeActiveRef   = useRef<boolean>(false);
  const nukeCoolRef     = useRef<number>(0);

  const [score, setScore]         = useState(0);
  const [comboDisplay, setCombo]  = useState('');
  const [achievement, setAch]     = useState('');
  const [nukeReady, setNukeReady] = useState(true);
  const scoreRef = useRef(0);

  const unlockAchievement = useCallback((n: number) => {
    const ach = [...ACHIEVEMENTS].reverse().find(a => n >= a.threshold);
    if (ach) setAch(`${ach.emoji} ${ach.title}`);
  }, []);

  // Nuke — server is down, everyone flies
  const triggerNuke = useCallback(() => {
    if (nukeCoolRef.current > 0) return;
    nukeActiveRef.current = true;
    nukeCoolRef.current   = 420;
    setNukeReady(false);

    figuresRef.current.forEach(fig => {
      if (fig.state !== 'walking') return;
      fig.state      = 'flying';
      fig.punchedAt  = tRef.current;
      fig.vy         = -(8 + Math.random() * 5);
      fig.vx         = (fig.facingLeft ? -1 : 1) * -(4 + Math.random() * 4);
      fig.briefcaseAlive = true;
      fig.briefcaseX = fig.x;
      fig.briefcaseY = fig.y - 15;
      fig.briefcaseVx = (Math.random() - 0.5) * 8;
      fig.briefcaseVy = -(4 + Math.random() * 4);
    });

    // Big "SERVER IS DOWN" text
    floatsRef.current.push({
      x: 280, y: 120,
      text: '🖥️ SERVER IS DOWN',
      life: 90, maxLife: 90,
      color: '#ef4444', size: 22,
    });

    setTimeout(() => {
      nukeActiveRef.current = false;
    }, 1200);
  }, []);

  const punchFigure = useCallback((fig: Figure) => {
    // Combo
    comboRef.current++;
    comboTimerRef.current = 45;
    const combo = comboRef.current;
    if (combo >= 2 && COMBO_LABELS[Math.min(combo, 5)]) {
      const label = COMBO_LABELS[Math.min(combo, 5)] + (combo > 5 ? ` x${combo}` : '');
      setCombo(label);
      floatsRef.current.push({
        x: fig.x, y: fig.y - 70,
        text: label,
        life: 55, maxLife: 55,
        color: '#fbbf24', size: 16,
      });
    }

    // Exit scream
    const scream = EXIT_SCREAMS[Math.floor(Math.random() * EXIT_SCREAMS.length)];

    hitFxRef.current.push({
      x: fig.x, y: fig.y - 55,
      text: scream,
      life: 55, maxLife: 55,
    });

    // Particles: money explosion
    for (let i = 0; i < 14; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particlesRef.current.push({
        x: fig.x, y: fig.y - 15,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 35 + Math.floor(Math.random() * 20),
        maxLife: 55,
        size: 7 + Math.random() * 5,
        color: '#fbbf24',
        text: Math.random() < 0.5 ? '$' : '💵',
      });
    }

    // Briefcase separates
    fig.briefcaseAlive = true;
    fig.briefcaseX  = fig.x + (fig.facingLeft ? -12 : 12);
    fig.briefcaseY  = fig.y - 15;
    fig.briefcaseVx = (fig.facingLeft ? -1 : 1) * -(3 + Math.random() * 3);
    fig.briefcaseVy = -(5 + Math.random() * 3);

    // Tie flails
    fig.tieVel   = (Math.random() - 0.5) * 0.5;

    fig.state     = 'stunned';
    fig.punchedAt = tRef.current;
    const dir     = fig.facingLeft ? -1 : 1;
    fig.vx        = dir * -(5 + Math.random() * 4);
    fig.vy        = -(7 + Math.random() * 4);
    fig.screamed  = true;

    setTimeout(() => { fig.state = 'flying'; }, 60);

    const newScore = scoreRef.current + (fig.type === 'boss' ? 3 : 1);
    scoreRef.current = newScore;
    setScore(newScore);
    unlockAchievement(newScore);
  }, [unlockAchievement]);

  const handleHit = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx     = (clientX - rect.left) * scaleX;
    const cy     = (clientY - rect.top)  * scaleY;

    const hitRadius = (fig: Figure) => fig.type === 'boss' ? 40 : 30;

    for (const fig of figuresRef.current) {
      if (fig.state !== 'walking') continue;
      const dx = fig.x - cx;
      const dy = (fig.y - 20) - cy;
      if (Math.sqrt(dx * dx + dy * dy) < hitRadius(fig)) {
        punchFigure(fig);
        return;
      }
    }
  }, [punchFigure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    if (!ctx)    return;
    const W = canvas.width;
    const H = canvas.height;
    const GROUND = H * 0.60;

    function loop() {
      if (!ctx || !canvas) return;
      tRef.current++;
      const t = tRef.current;
      ctx.clearRect(0, 0, W, H);

      // ── Background ──
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#080e16');
      grad.addColorStop(1, '#0d1b2a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Floor tiles
      ctx.fillStyle = '#0f2030';
      ctx.fillRect(0, GROUND, W, H - GROUND);
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.08)';
      ctx.lineWidth   = 1;
      for (let gx = 0; gx < W; gx += 50) {
        ctx.beginPath();
        ctx.moveTo(gx, GROUND);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      // Marble floor line
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, GROUND);
      ctx.lineTo(W, GROUND);
      ctx.stroke();

      // "TRADING FLOOR" sign dim
      ctx.save();
      ctx.font        = '700 11px Inter, sans-serif';
      ctx.fillStyle   = 'rgba(45, 212, 191, 0.12)';
      ctx.textAlign   = 'center';
      ctx.fillText('◆  TRADING FLOOR  ◆', W / 2, 22);
      ctx.restore();

      // ── Nuke cooldown ──
      if (nukeCoolRef.current > 0) {
        nukeCoolRef.current--;
        if (nukeCoolRef.current === 0) setNukeReady(true);
      }

      // ── Combo timer ──
      if (comboTimerRef.current > 0) {
        comboTimerRef.current--;
        if (comboTimerRef.current === 0) {
          comboRef.current = 0;
          setCombo('');
        }
      }

      // ── Spawn grunts ──
      spawnRef.current--;
      const walking = figuresRef.current.filter(f => f.state === 'walking').length;
      if (spawnRef.current <= 0 && walking < 5) {
        figuresRef.current.push(makeFigure(W, H, false));
        spawnRef.current = 90 + Math.floor(Math.random() * 70);
      }

      // ── Spawn boss ──
      bossTimerRef.current--;
      const hasBoss = figuresRef.current.some(f => f.type === 'boss' && f.state === 'walking');
      if (bossTimerRef.current <= 0 && !hasBoss) {
        figuresRef.current.push(makeFigure(W, H, true));
        bossTimerRef.current = 500 + Math.floor(Math.random() * 300);
      }

      // ── Update + draw figures ──
      figuresRef.current = figuresRef.current.filter(fig => {
        if (fig.state === 'walking') {
          fig.x       += fig.vx;
          fig.legPhase += 0.08;
          fig.talkTimer--;
          if (fig.talkTimer <= 0) {
            fig.talkText  = TRASH_TALK[Math.floor(Math.random() * TRASH_TALK.length)];
            fig.talkTimer = 160 + Math.floor(Math.random() * 120);
          }
          if (fig.x < -100 || fig.x > W + 100) return false;
        } else if (fig.state === 'stunned' || fig.state === 'flying') {
          fig.x   += fig.vx;
          fig.y   += fig.vy;
          fig.vy  += GRAVITY;
          fig.tieAngle += fig.tieVel;
          fig.tieVel   *= 0.95;
          // Briefcase physics
          if (fig.briefcaseAlive) {
            fig.briefcaseX += fig.briefcaseVx;
            fig.briefcaseY += fig.briefcaseVy;
            fig.briefcaseVy += GRAVITY;
            if (fig.briefcaseY > H + 40) fig.briefcaseAlive = false;
          }
          if (fig.y > H + 100 || fig.x < -150 || fig.x > W + 150) return false;
        }
        drawFigure(ctx, fig, t);
        return true;
      });

      // ── Particles ──
      particlesRef.current = particlesRef.current.filter(p => {
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.25;
        p.vx   *= 0.97;
        p.life--;
        const alpha = p.life / p.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        if (p.text) {
          ctx.font      = `700 ${p.size}px Inter, sans-serif`;
          ctx.fillStyle = p.color;
          ctx.textAlign = 'center';
          ctx.fillText(p.text, p.x, p.y);
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return p.life > 0;
      });

      // ── Float texts (scream / combo) ──
      floatsRef.current = floatsRef.current.filter(f => {
        f.life--;
        const alpha = f.life / f.maxLife;
        const rise  = (f.maxLife - f.life) * 0.7;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font        = `900 ${f.size}px Inter, sans-serif`;
        ctx.fillStyle   = f.color;
        ctx.strokeStyle = '#0d1b2a';
        ctx.lineWidth   = 3;
        ctx.textAlign   = 'center';
        ctx.strokeText(f.text, f.x, f.y - rise);
        ctx.fillText(f.text, f.x, f.y - rise);
        ctx.restore();
        return f.life > 0;
      });

      // ── Hit effects ──
      hitFxRef.current = hitFxRef.current.filter(e => {
        e.life--;
        const alpha = e.life / e.maxLife;
        const rise  = (e.maxLife - e.life) * 0.55;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font        = `700 13px Inter, sans-serif`;
        ctx.fillStyle   = '#ef4444';
        ctx.strokeStyle = '#0d1b2a';
        ctx.lineWidth   = 2.5;
        ctx.textAlign   = 'center';
        ctx.strokeText(e.text, e.x, e.y - rise);
        ctx.fillText(e.text, e.x, e.y - rise);
        ctx.restore();
        return e.life > 0;
      });

      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    handleHit(e.clientX, e.clientY);
  }, [handleHit]);

  return (
    <div>
      <div className="punch-game-wrapper">
        <canvas
          ref={canvasRef}
          className="punch-canvas"
          width={560}
          height={260}
          onPointerDown={onPointerDown}
          style={{ touchAction: 'none' }}
          aria-label="Punch the banker stick figures"
        />
        <div className="punch-hud">
          <div>
            <div className="punch-score">💥 {score} {score === 1 ? 'terminated' : 'terminated'}</div>
            {achievement && (
              <div style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 700, marginTop: 2 }}>
                {achievement}
              </div>
            )}
            {comboDisplay && (
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>
                {comboDisplay}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4 }}>
              ★ Big Boss = 3 pts
            </div>
            <button
              className="btn btn-danger"
              style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem' }}
              onClick={triggerNuke}
              disabled={!nukeReady}
              title="Reply-All Nuke — takes down everyone"
            >
              {nukeReady ? '🖥️ Server Down' : '⏳ Rebooting...'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
        Tap/click to punch. The big purple one has a corner office and has never sent his own email.<br />
        🖥️ crashes the whole floor. They will rebuild. Punch anyway.
      </div>

      {score >= 5 && score < 20 && (
        <div className="task-pill" style={{ marginTop: 12 }}>
          📉 {score} terminated. HR is aware and does not care.
        </div>
      )}
      {score >= 20 && score < 50 && (
        <div className="task-pill" style={{ marginTop: 12 }}>
          ⚖️ {score} down. Somewhere a lawyer is filing paperwork on your behalf.
        </div>
      )}
      {score >= 50 && (
        <div className="task-pill" style={{ marginTop: 12 }}>
          🎬 {score} punched. Netflix has greenlit the documentary. You are the protagonist.
        </div>
      )}
    </div>
  );
}

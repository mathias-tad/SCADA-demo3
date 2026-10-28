import React, { useState, useEffect, useRef } from 'react';

/* ══════════════════════════════════════════════════════════════════════
   DESIGN 3 — NEON / CYBERPUNK SCADA P&ID
   Pure React + SVG. All CSS class names prefixed d3-.
   ══════════════════════════════════════════════════════════════════════ */

/* ─── colour helpers ─────────────────────────────────────────────────── */
const CYAN   = '#00d4ff';
const GREEN  = '#00ff88';
const AMBER  = '#ffb800';
const RED    = '#ff4444';
const DARK   = '#0a0e1a';

function tankFillColor(pct) {
  if (pct > 60) return CYAN;
  if (pct >= 40) return AMBER;
  return RED;
}

/* ─── Valve symbol: two triangles meeting at a point ─────────────────── */
function ValveSymbol({ x, y, open = true, size = 12 }) {
  const color = open ? GREEN : RED;
  const s = size;
  return (
    <g style={{ cursor: 'pointer' }}>
      <polygon
        points={`${x - s},${y - s / 2} ${x},${y} ${x - s},${y + s / 2}`}
        fill={color} opacity={0.85}
        filter={`url(#neonGlow)`}
      />
      <polygon
        points={`${x + s},${y - s / 2} ${x},${y} ${x + s},${y + s / 2}`}
        fill={color} opacity={0.85}
        filter={`url(#neonGlow)`}
      />
      <circle cx={x} cy={y} r={3} fill={color} />
    </g>
  );
}

/* ─── Hexagonal symbol ───────────────────────────────────────────────── */
function HexSymbol({ cx, cy, r = 32, label, sublabel, color = CYAN }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <g>
      <polygon
        points={pts}
        fill="#0a1a2a"
        stroke={color}
        strokeWidth={2}
        filter="url(#cyanGlow)"
      />
      {/* wave lines inside */}
      <path d={`M${cx - 14},${cy - 6} Q${cx - 7},${cy - 12} ${cx},${cy - 6} Q${cx + 7},${cy} ${cx + 14},${cy - 6}`}
        fill="none" stroke={color} strokeWidth={1.5} opacity={0.9} />
      <path d={`M${cx - 14},${cy + 2} Q${cx - 7},${cy - 4} ${cx},${cy + 2} Q${cx + 7},${cy + 8} ${cx + 14},${cy + 2}`}
        fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
      <path d={`M${cx - 14},${cy + 10} Q${cx - 7},${cy + 4} ${cx},${cy + 10} Q${cx + 7},${cy + 16} ${cx + 14},${cy + 10}`}
        fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
      {label && (
        <text x={cx} y={cy - r - 8} textAnchor="middle"
          fontSize="11" fontFamily="'Courier New',monospace"
          fill={color} style={{ textShadow: `0 0 8px ${color}` }}>
          {label}
        </text>
      )}
      {sublabel && (
        <text x={cx} y={cy + r + 16} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace"
          fill={color} opacity={0.7}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

/* ─── Pump symbol ────────────────────────────────────────────────────── */
function PumpSymbol({ cx, cy, running, onClick, label }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* pulse ring when running */}
      {running && (
        <circle cx={cx} cy={cy} r={48} fill="none"
          stroke={CYAN} strokeWidth={1.5} opacity={0.4}
          filter="url(#cyanGlow)">
          <animate attributeName="r" values="42;54;42" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      {/* body */}
      <circle cx={cx} cy={cy} r={35}
        fill="#0d1929"
        stroke={running ? CYAN : '#334155'}
        strokeWidth={2.5}
        filter={running ? 'url(#cyanGlow)' : 'none'}
      />
      {/* chevron / pump arrow */}
      <polygon
        points={`${cx - 14},${cy - 14} ${cx + 16},${cy} ${cx - 14},${cy + 14}`}
        fill={running ? CYAN : '#334155'}
        opacity={running ? 1 : 0.5}
      />
      {/* label */}
      <text x={cx} y={cy + 50} textAnchor="middle"
        fontSize="10" fontFamily="'Courier New',monospace"
        fill={running ? CYAN : '#64748b'}
        filter={running ? 'url(#neonGlow)' : 'none'}>
        {label}
      </text>
      <text x={cx} y={cy + 62} textAnchor="middle"
        fontSize="9" fontFamily="'Courier New',monospace"
        fill={running ? GREEN : '#475569'}>
        {running ? '● RUNNING' : '○ STANDBY'}
      </text>
    </g>
  );
}

/* ─── Tank 3D (dark body + ellipse caps + animated fill) ─────────────── */
function Tank3D({ x, y, w = 90, h = 160, pct, label, id: tankId }) {
  const fillColor = tankFillColor(pct);
  const fillH = Math.max(4, Math.round((pct / 100) * (h - 20)));
  const fillY = y + h - 10 - fillH;
  const clipId = `tankClip${tankId}`;

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y + 10} width={w} height={h - 20} rx={3} />
        </clipPath>
      </defs>
      {/* body */}
      <rect x={x} y={y + 10} width={w} height={h - 20}
        fill="url(#tankBody)" rx={3}
        stroke={CYAN} strokeWidth={1.5}
        opacity={0.9}
      />
      {/* liquid fill */}
      <rect
        x={x} y={fillY} width={w} height={fillH + 10}
        fill={fillColor} opacity={0.35}
        clipPath={`url(#${clipId})`}
        style={{ transition: 'y 1s ease, height 1s ease' }}
      />
      {/* animated wave on surface */}
      <g clipPath={`url(#${clipId})`}>
        <path
          d={`M${x},${fillY + 6} Q${x + w / 4},${fillY} ${x + w / 2},${fillY + 6} Q${x + 3 * w / 4},${fillY + 12} ${x + w},${fillY + 6}`}
          fill="none" stroke={fillColor} strokeWidth={2} opacity={0.8}>
          <animateTransform attributeName="transform"
            type="translate" values="0,0;-10,0;0,0" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* liquid stroke border */}
      <rect
        x={x} y={fillY} width={w} height={fillH + 10}
        fill="none"
        stroke={fillColor} strokeWidth={1}
        opacity={0.5}
        clipPath={`url(#${clipId})`}
        filter={pct < 40 ? 'url(#neonGlow)' : 'none'}
      />
      {/* top ellipse cap */}
      <ellipse cx={x + w / 2} cy={y + 10} rx={w / 2} ry={8}
        fill="#1a2035" stroke={CYAN} strokeWidth={1.5} />
      {/* bottom ellipse cap */}
      <ellipse cx={x + w / 2} cy={y + h - 10} rx={w / 2} ry={8}
        fill="#1a2035" stroke={CYAN} strokeWidth={1.5} />
      {/* level indicator track on right */}
      <rect x={x + w + 6} y={y + 10} width={4} height={h - 20}
        fill="#0d1929" stroke="#1e3a5f" strokeWidth={1} rx={2} />
      {/* level indicator fill */}
      <rect
        x={x + w + 6}
        y={y + 10 + (h - 20) * (1 - pct / 100)}
        width={4}
        height={(h - 20) * (pct / 100)}
        fill={fillColor}
        rx={2}
        filter="url(#neonGlow)"
        style={{ transition: 'y 1s ease, height 1s ease' }}
      />
      {/* label panel */}
      <rect x={x - 4} y={y + h + 4} width={w + 8} height={48}
        fill="rgba(0,212,255,0.05)"
        stroke="rgba(0,212,255,0.3)"
        rx={4} />
      <text x={x + w / 2} y={y + h + 18} textAnchor="middle"
        fontSize="11" fontWeight="bold" fontFamily="'Courier New',monospace"
        fill={CYAN} filter="url(#neonGlow)">{label}</text>
      <text x={x + w / 2} y={y + h + 31} textAnchor="middle"
        fontSize="13" fontWeight="bold" fontFamily="'Courier New',monospace"
        fill={fillColor} filter="url(#neonGlow)">{pct.toFixed(0)}%</text>
      <text x={x + w / 2} y={y + h + 44} textAnchor="middle"
        fontSize="9" fontFamily="'Courier New',monospace"
        fill="#64748b">{(pct / 100 * 4.5).toFixed(2)} kL</text>
    </g>
  );
}

/* ─── Diamond / PRV symbol ───────────────────────────────────────────── */
function PRVSymbol({ cx, cy, label }) {
  const s = 28;
  return (
    <g>
      <polygon
        points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
        fill="#0d1929"
        stroke={AMBER}
        strokeWidth={2}
        filter="url(#neonGlow)"
      />
      <text x={cx} y={cy + 3} textAnchor="middle"
        fontSize="8" fontFamily="'Courier New',monospace"
        fill={AMBER} fontWeight="bold">PRV</text>
      {label && (
        <text x={cx} y={cy - s - 8} textAnchor="middle"
          fontSize="10" fontFamily="'Courier New',monospace"
          fill={AMBER} filter="url(#neonGlow)">{label}</text>
      )}
    </g>
  );
}

/* ─── Distribution Node (small hex) ─────────────────────────────────── */
function DistNode({ cx, cy, label, pressure }) {
  const r = 20;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <g>
      <polygon points={pts}
        fill="#0d1929" stroke={GREEN} strokeWidth={1.5}
        filter="url(#neonGlow)">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
      </polygon>
      <text x={cx} y={cy - r - 8} textAnchor="middle"
        fontSize="9" fontFamily="'Courier New',monospace"
        fill={GREEN}>{label}</text>
      <text x={cx} y={cy + r + 13} textAnchor="middle"
        fontSize="10" fontFamily="'Courier New',monospace"
        fill={CYAN} filter="url(#neonGlow)">{pressure} bar</text>
    </g>
  );
}

/* ─── Glassmorphism LCD readout (SVG foreignObject) ──────────────────── */
function GlassReadout({ x, y, w, h, lines }) {
  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div xmlns="http://www.w3.org/1999/xhtml" className="d3-glass-panel"
        style={{ width: '100%', height: '100%', boxSizing: 'border-box', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {lines.map((ln, i) => (
          <div key={i} className="d3-lcd-readout" style={{ fontSize: '11px', padding: '2px 5px' }}>
            <span style={{ color: '#64748b', marginRight: 4, fontSize: '9px' }}>{ln.label}</span>
            <span>{ln.value}</span>
          </div>
        ))}
      </div>
    </foreignObject>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════ */
export default function ScadaDashboard() {

  /* ── State ──────────────────────────────────────────────────────────── */
  const [tanks, setTanks] = useState([
    { id: 1, label: 'TK-001', pct: 72 },
    { id: 2, label: 'TK-002', pct: 47 },
    { id: 3, label: 'TK-003', pct: 28 },
  ]);

  const [pumps, setPumps] = useState([
    { id: 1, label: 'P-001', running: true,  flow: 312, pressure: 4.2, rpm: 2850 },
    { id: 2, label: 'P-002', running: false, flow: 0,   pressure: 0,   rpm: 0    },
  ]);

  const [prv, setPrv]         = useState({ up: 8.4, down: 3.1 });
  const [totalFlow, setFlow]  = useState(847);
  const [health, setHealth]   = useState(98.4);
  const [valves, setValves]   = useState([true, true, false, true, true]);
  const [distPressures, setDistP] = useState([3.8, 3.5, 3.2]);

  const [liveBlink, setBlink] = useState(true);

  /* ── Simulation ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      setTanks(prev => prev.map(t => ({
        ...t,
        pct: +Math.min(100, Math.max(5, t.pct + (Math.random() - 0.5) * 1.2)).toFixed(1),
      })));
      setPumps(prev => prev.map(p => p.running ? {
        ...p,
        flow:     Math.round(300 + Math.random() * 25),
        pressure: +(4.0 + Math.random() * 0.5).toFixed(2),
        rpm:      Math.round(2800 + Math.random() * 80),
      } : p));
      setPrv({
        up:   +(8.2 + Math.random() * 0.5).toFixed(2),
        down: +(3.0 + Math.random() * 0.3).toFixed(2),
      });
      setFlow(Math.round(835 + Math.random() * 20));
      setHealth(+(98.0 + Math.random() * 0.6).toFixed(1));
      setDistP(prev => prev.map(p => +(p + (Math.random() - 0.5) * 0.1).toFixed(2)));
    }, 2000);

    const blinkId = setInterval(() => setBlink(b => !b), 900);

    return () => { clearInterval(id); clearInterval(blinkId); };
  }, []);

  /* ── Pump toggle ────────────────────────────────────────────────────── */
  const togglePump = id => {
    setPumps(prev => prev.map(p => p.id === id
      ? { ...p, running: !p.running, flow: 0, pressure: 0, rpm: 0 }
      : p
    ));
  };

  /* ── Valve toggle ───────────────────────────────────────────────────── */
  const toggleValve = i => {
    setValves(prev => prev.map((v, idx) => idx === i ? !v : v));
  };

  /* ── Pipe animation tick (stroke-dashoffset) ───────────────────────── */
  // handled entirely via SVG <animate> — no JS needed

  /* ════════════════════════════════════════════════════════════════════ */
  const SVG_W = 1400;
  const SVG_H = 720;

  /* tank positions */
  const tkX = [390, 560, 730];
  const tkY = 200;
  const tkW = 80;
  const tkH = 180;

  /* pump positions */
  const p1 = { x: 220, y: 245 };
  const p2 = { x: 220, y: 390 };

  /* PRV position */
  const prvX = 1010, prvY = 310;

  /* dist nodes */
  const distNodes = [
    { cx: 1160, cy: 220, label: 'ZONE-A' },
    { cx: 1285, cy: 310, label: 'ZONE-B' },
    { cx: 1160, cy: 400, label: 'ZONE-C' },
  ];

  /* main header pipe y */
  const hPipeY = 158;

  return (
    <div className="d3-scada-screen">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ width: '100%', minWidth: 900, background: DARK, display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ══════════════════════════════════════════════════════════════
            DEFS
            ══════════════════════════════════════════════════════════════ */}
        <defs>
          {/* Neon glow */}
          <filter id="neonGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Cyan glow */}
          <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix type="matrix"
              values="0 0 0 0 0  0 1 0 0 0.83  0 0 0 0 1  0 0 0 1 0"
              in="blur" result="colorBlur" />
            <feMerge>
              <feMergeNode in="colorBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Amber glow */}
          <filter id="amberGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix type="matrix"
              values="1 0 0 0 0  0 0.72 0 0 0  0 0 0 0 0  0 0 0 1 0"
              in="blur" result="colorBlur" />
            <feMerge>
              <feMergeNode in="colorBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Green glow */}
          <filter id="greenGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feColorMatrix type="matrix"
              values="0 0 0 0 0  0 1 0 0 0.53  0 0 0 0 0.27  0 0 0 1 0"
              in="blur" result="colorBlur" />
            <feMerge>
              <feMergeNode in="colorBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Flow gradient along pipe */}
          <linearGradient id="pipeFlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={CYAN} stopOpacity="0" />
            <stop offset="50%"  stopColor={CYAN} stopOpacity="1" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
          </linearGradient>

          {/* Tank metallic gradient */}
          <linearGradient id="tankBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1a2035" />
            <stop offset="40%"  stopColor="#2a3550" />
            <stop offset="100%" stopColor="#0f1525" />
          </linearGradient>

          {/* Header panel gradient */}
          <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#060a14" />
            <stop offset="100%" stopColor="#0a0e20" />
          </linearGradient>

          {/* Pipe animation path – main horizontal */}
          <path id="mainPipePath" d={`M 80,${hPipeY} H 1200`} />
          {/* Pipe 1: source → pump 1 */}
          <path id="srcToPump1" d={`M 100,300 H ${p1.x - 35}`} />
          {/* Pipe 2: source → pump 2 */}
          <path id="srcToPump2" d={`M 100,300 V 390 H ${p2.x - 35}`} />
          {/* Pipe 3: pump1 → main */}
          <path id="pump1ToMain" d={`M ${p1.x},${p1.y - 35} V ${hPipeY}`} />
          {/* Pipe 4: pump2 → main */}
          <path id="pump2ToMain" d={`M ${p2.x},${p2.y - 35} V ${hPipeY}`} />
          {/* PRV to zones */}
          <path id="prvToZones" d={`M ${prvX + 28},${prvY} H ${distNodes[1].cx - 20}`} />
          {/* Zone A-B-C connectors */}
          <path id="zone1to2" d={`M ${distNodes[0].cx + 20},${distNodes[0].cy} L ${distNodes[1].cx - 20},${distNodes[1].cy}`} />
          <path id="zone2to3" d={`M ${distNodes[1].cx},${distNodes[1].cy + 20} L ${distNodes[2].cx + 20},${distNodes[2].cy}`} />
        </defs>

        {/* ══════════════════════════════════════════════════════════════
            BACKGROUND GRID
            ══════════════════════════════════════════════════════════════ */}
        <g opacity={0.07}>
          {Array.from({ length: Math.ceil(SVG_W / 50) + 1 }, (_, i) => (
            <line key={`vg${i}`}
              x1={i * 50} y1={60} x2={i * 50} y2={SVG_H}
              stroke="#ffffff" strokeWidth={0.5} />
          ))}
          {Array.from({ length: Math.ceil((SVG_H - 60) / 50) + 1 }, (_, i) => (
            <line key={`hg${i}`}
              x1={0} y1={60 + i * 50} x2={SVG_W} y2={60 + i * 50}
              stroke="#ffffff" strokeWidth={0.5} />
          ))}
        </g>
        {/* Coordinate labels */}
        {[200, 400, 600, 800, 1000, 1200].map(xv => (
          <text key={`xl${xv}`} x={xv} y={76}
            fontSize="8" fontFamily="'Courier New',monospace"
            fill="#ffffff18" textAnchor="middle">{xv}</text>
        ))}
        {[100, 200, 300, 400, 500, 600].map(yv => (
          <text key={`yl${yv}`} x={12} y={60 + yv}
            fontSize="8" fontFamily="'Courier New',monospace"
            fill="#ffffff18" textAnchor="start">{yv}</text>
        ))}

        {/* ══════════════════════════════════════════════════════════════
            HEADER BAR
            ══════════════════════════════════════════════════════════════ */}
        <rect x={0} y={0} width={SVG_W} height={60} fill="url(#headerGrad)" />
        {/* Left accent line */}
        <rect x={0} y={0} width={4} height={60} fill="#FF385C" />

        {/* Brand text */}
        <text x={20} y={24}
          fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif"
          fill="#ffffff" letterSpacing="1">EEMACS</text>
        <text x={20} y={42}
          fontSize="11" fontFamily="Arial, sans-serif"
          fill="#64748b" letterSpacing="2">WATER SCADA</text>

        {/* Live indicator */}
        <circle cx={SVG_W / 2 - 38} cy={30} r={5}
          fill={CYAN} opacity={liveBlink ? 1 : 0.1}
          filter="url(#cyanGlow)" />
        <text x={SVG_W / 2 - 28} y={26}
          fontSize="13" fontFamily="'Courier New',monospace"
          fill={CYAN} filter="url(#cyanGlow)">● LIVE</text>
        <text x={SVG_W / 2 - 28} y={42}
          fontSize="10" fontFamily="'Courier New',monospace"
          fill="#64748b">System Online</text>

        {/* KPI pills */}
        {[
          { val: `${prv.up.toFixed(1)} bar`, lbl: 'Pressure' },
          { val: `${totalFlow} L/m`,          lbl: 'Flow'     },
          { val: `${health}%`,                lbl: 'Health'   },
        ].map((k, i) => {
          const px = SVG_W - 320 + i * 108;
          return (
            <g key={i}>
              <rect x={px} y={10} width={100} height={40}
                fill="rgba(0,212,255,0.06)"
                stroke="rgba(0,212,255,0.4)"
                rx={20} />
              <text x={px + 50} y={27} textAnchor="middle"
                fontSize="14" fontWeight="bold" fontFamily="'Courier New',monospace"
                fill={CYAN} filter="url(#neonGlow)">{k.val}</text>
              <text x={px + 50} y={42} textAnchor="middle"
                fontSize="9" fontFamily="'Courier New',monospace"
                fill="#64748b">{k.lbl}</text>
            </g>
          );
        })}

        {/* ══════════════════════════════════════════════════════════════
            MAIN HORIZONTAL PIPE (header pipe y=158)
            ══════════════════════════════════════════════════════════════ */}
        {/* Shadow/glow pipe */}
        <path d={`M 80,${hPipeY} H 1060`}
          fill="none" stroke={CYAN} strokeWidth={10} opacity={0.15}
          filter="url(#cyanGlow)" />
        {/* Solid pipe */}
        <path d={`M 80,${hPipeY} H 1060`}
          fill="none" stroke={CYAN} strokeWidth={4}
          filter="url(#cyanGlow)" />
        {/* Animated flow markers */}
        {[0, 0.33, 0.66].map((offset, i) => (
          <circle key={i} r={5} fill={CYAN} opacity={0.9} filter="url(#cyanGlow)">
            <animateMotion dur="4s" repeatCount="indefinite" begin={`${-i * 1.33}s`}>
              <mpath href="#mainPipePath" />
            </animateMotion>
          </circle>
        ))}
        {/* Dashed flow animation overlay */}
        <path d={`M 80,${hPipeY} H 1060`}
          fill="none" stroke={CYAN} strokeWidth={4}
          strokeDasharray="20 30" opacity={0.5}>
          <animate attributeName="stroke-dashoffset"
            values="0;-50" dur="1.5s" repeatCount="indefinite" />
        </path>

        {/* ══════════════════════════════════════════════════════════════
            WATER SOURCE
            ══════════════════════════════════════════════════════════════ */}
        <HexSymbol cx={80} cy={300} r={34} label="SRC-001" sublabel="WATER SOURCE" />

        {/* Source → pump vertical & horizontal pipes */}
        {/* src up to header */}
        <path d={`M 80,266 V ${hPipeY}`}
          fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />
        <path d={`M 80,266 V ${hPipeY}`}
          fill="none" stroke={CYAN} strokeWidth={4}
          strokeDasharray="12 18" opacity={0.5}>
          <animate attributeName="stroke-dashoffset" values="0;-30" dur="1.2s" repeatCount="indefinite" />
        </path>

        {/* Source → pump 1 horizontal */}
        <path d={`M 114,300 H ${p1.x - 35}`}
          fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />
        <path d={`M 114,300 H ${p1.x - 35}`}
          fill="none" stroke={CYAN} strokeWidth={4}
          strokeDasharray="12 18" opacity={0.5}>
          <animate attributeName="stroke-dashoffset" values="0;-30" dur="1.2s" repeatCount="indefinite" />
        </path>

        {/* Source → pump 2 */}
        <path d={`M 80,334 V 390 H ${p2.x - 35}`}
          fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />
        <path d={`M 80,334 V 390 H ${p2.x - 35}`}
          fill="none" stroke={CYAN} strokeWidth={4}
          strokeDasharray="12 18" opacity={0.5}>
          <animate attributeName="stroke-dashoffset" values="0;-30" dur="1.4s" repeatCount="indefinite" />
        </path>

        {/* Pump 1 → up to header pipe */}
        <path d={`M ${p1.x},${p1.y - 35} V ${hPipeY}`}
          fill="none"
          stroke={pumps[0].running ? CYAN : '#1e3a5f'}
          strokeWidth={4}
          filter={pumps[0].running ? 'url(#cyanGlow)' : 'none'}
        />
        {pumps[0].running && (
          <path d={`M ${p1.x},${p1.y - 35} V ${hPipeY}`}
            fill="none" stroke={CYAN} strokeWidth={4}
            strokeDasharray="12 18" opacity={0.5}>
            <animate attributeName="stroke-dashoffset" values="0;-30" dur="1s" repeatCount="indefinite" />
          </path>
        )}

        {/* Pump 2 → up to header pipe */}
        <path d={`M ${p2.x},${p2.y - 35} V ${hPipeY}`}
          fill="none"
          stroke={pumps[1].running ? CYAN : '#1e3a5f'}
          strokeWidth={4}
          filter={pumps[1].running ? 'url(#cyanGlow)' : 'none'}
        />

        {/* ══════════════════════════════════════════════════════════════
            PUMPS
            ══════════════════════════════════════════════════════════════ */}
        {pumps.map((p, i) => {
          const pos = i === 0 ? p1 : p2;
          return (
            <PumpSymbol key={p.id}
              cx={pos.x} cy={pos.y}
              running={p.running}
              label={p.label}
              onClick={() => togglePump(p.id)}
            />
          );
        })}

        {/* Pump readout panels */}
        <GlassReadout x={140} y={520} w={170} h={84} lines={[
          { label: 'P-001 FLOW',  value: pumps[0].running ? `${pumps[0].flow} L/min` : '—' },
          { label: 'PRESSURE',   value: pumps[0].running ? `${pumps[0].pressure} bar` : '—' },
          { label: 'RPM',        value: pumps[0].running ? `${pumps[0].rpm}` : '—' },
        ]} />
        <GlassReadout x={140} y={614} w={170} h={66} lines={[
          { label: 'P-002 FLOW',  value: pumps[1].running ? `${pumps[1].flow} L/min` : 'STANDBY' },
          { label: 'PRESSURE',   value: pumps[1].running ? `${pumps[1].pressure} bar` : '—' },
        ]} />

        {/* ══════════════════════════════════════════════════════════════
            VERTICAL DROP PIPES: header → each tank top
            ══════════════════════════════════════════════════════════════ */}
        {tkX.map((tx, i) => {
          const tankCx = tx + tkW / 2;
          return (
            <g key={i}>
              {/* drop pipe */}
              <path d={`M ${tankCx},${hPipeY} V ${tkY + 10}`}
                fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />
              <path d={`M ${tankCx},${hPipeY} V ${tkY + 10}`}
                fill="none" stroke={CYAN} strokeWidth={4}
                strokeDasharray="10 15" opacity={0.5}>
                <animate attributeName="stroke-dashoffset"
                  values="0;25" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
              </path>
              {/* valve on drop pipe */}
              <ValveSymbol x={tankCx} y={hPipeY + 40} open={valves[i]}
                size={10} />
              {/* click area for valve */}
              <rect
                x={tankCx - 16} y={hPipeY + 28}
                width={32} height={26}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onClick={() => toggleValve(i)}
              />
            </g>
          );
        })}

        {/* ══════════════════════════════════════════════════════════════
            TANKS
            ══════════════════════════════════════════════════════════════ */}
        {tkX.map((tx, i) => (
          <Tank3D key={i}
            x={tx} y={tkY}
            w={tkW} h={tkH}
            pct={tanks[i].pct}
            label={tanks[i].label}
            id={tanks[i].id}
          />
        ))}

        {/* ══════════════════════════════════════════════════════════════
            OUTLET PIPES: tank bottom → right collector pipe
            ══════════════════════════════════════════════════════════════ */}
        {/* Collector pipe (vertical) */}
        <path d={`M 870,${tkY + tkH - 10} V 520`}
          fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />

        {tkX.map((tx, i) => {
          const tankCx = tx + tkW / 2;
          const outY   = tkY + tkH - 10;
          return (
            <g key={i}>
              <path d={`M ${tankCx},${outY} H 870`}
                fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />
              <path d={`M ${tankCx},${outY} H 870`}
                fill="none" stroke={CYAN} strokeWidth={4}
                strokeDasharray="10 15" opacity={0.5}>
                <animate attributeName="stroke-dashoffset"
                  values="0;-25" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
              </path>
              {/* valve on outlet */}
              <ValveSymbol x={tankCx + 30} y={outY} open={valves[i + 2 < 5 ? i + 2 : i]}
                size={9} />
              <rect x={tankCx + 14} y={outY - 14} width={30} height={28}
                fill="transparent" style={{ cursor: 'pointer' }}
                onClick={() => toggleValve(Math.min(i + 2, 4))} />
            </g>
          );
        })}

        {/* Collector → right horizontal to PRV */}
        <path d={`M 870,${tkY + tkH - 10} V 310 H ${prvX - 28}`}
          fill="none" stroke={CYAN} strokeWidth={4} filter="url(#cyanGlow)" />
        <path d={`M 870,310 H ${prvX - 28}`}
          fill="none" stroke={CYAN} strokeWidth={4}
          strokeDasharray="15 20" opacity={0.5}>
          <animate attributeName="stroke-dashoffset" values="0;-35" dur="2s" repeatCount="indefinite" />
        </path>
        {/* animated particle on collector→PRV */}
        {[0, 0.5].map((offset, i) => (
          <circle key={i} r={4} fill={GREEN} opacity={0.9} filter="url(#greenGlow)">
            <animateMotion dur="3s" repeatCount="indefinite" begin={`${-i * 1.5}s`}
              path={`M 870,310 H ${prvX - 28}`} />
          </circle>
        ))}

        {/* ══════════════════════════════════════════════════════════════
            PRV STATION
            ══════════════════════════════════════════════════════════════ */}
        <PRVSymbol cx={prvX} cy={prvY} label="PRV-001" />

        {/* Upstream / downstream pressure panels */}
        {/* Upstream */}
        <rect x={prvX - 110} y={prvY - 55} width={80} height={44}
          fill="rgba(0,212,255,0.06)" stroke="rgba(0,212,255,0.3)" rx={4} />
        <text x={prvX - 70} y={prvY - 38} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace" fill="#64748b">UPSTREAM</text>
        <text x={prvX - 70} y={prvY - 20} textAnchor="middle"
          fontSize="18" fontWeight="bold" fontFamily="'Courier New',monospace"
          fill={AMBER} filter="url(#amberGlow)">{prv.up.toFixed(1)}</text>
        <text x={prvX - 70} y={prvY - 9} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace" fill="#64748b">bar</text>

        {/* Arrow */}
        <path d={`M ${prvX - 26},${prvY - 32} H ${prvX + 26}`}
          fill="none" stroke="#334155" strokeWidth={1.5} />
        <polygon points={`${prvX + 22},${prvY - 36} ${prvX + 30},${prvY - 32} ${prvX + 22},${prvY - 28}`}
          fill="#334155" />

        {/* Downstream */}
        <rect x={prvX + 30} y={prvY - 55} width={80} height={44}
          fill="rgba(0,255,136,0.06)" stroke="rgba(0,255,136,0.3)" rx={4} />
        <text x={prvX + 70} y={prvY - 38} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace" fill="#64748b">DOWNSTREAM</text>
        <text x={prvX + 70} y={prvY - 20} textAnchor="middle"
          fontSize="18" fontWeight="bold" fontFamily="'Courier New',monospace"
          fill={GREEN} filter="url(#greenGlow)">{prv.down.toFixed(1)}</text>
        <text x={prvX + 70} y={prvY - 9} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace" fill="#64748b">bar</text>

        {/* PRV → distribution pipe */}
        <path d={`M ${prvX + 28},${prvY} H ${distNodes[1].cx - 22}`}
          fill="none" stroke={GREEN} strokeWidth={4} filter="url(#greenGlow)" />
        <path d={`M ${prvX + 28},${prvY} H ${distNodes[1].cx - 22}`}
          fill="none" stroke={GREEN} strokeWidth={4}
          strokeDasharray="12 16" opacity={0.5}>
          <animate attributeName="stroke-dashoffset" values="0;-28" dur="1.8s" repeatCount="indefinite" />
        </path>

        {/* ══════════════════════════════════════════════════════════════
            DISTRIBUTION NODES
            ══════════════════════════════════════════════════════════════ */}
        {/* Connecting pipes */}
        <path
          d={`M ${distNodes[0].cx + 20},${distNodes[0].cy} L ${distNodes[1].cx - 20},${distNodes[1].cy}`}
          fill="none" stroke={GREEN} strokeWidth={3} filter="url(#greenGlow)" />
        <path
          d={`M ${distNodes[1].cx},${distNodes[1].cy + 20} L ${distNodes[2].cx + 20},${distNodes[2].cy}`}
          fill="none" stroke={GREEN} strokeWidth={3} filter="url(#greenGlow)" />
        {/* vertical from PRV level to Zone A */}
        <path d={`M ${distNodes[1].cx - 22},${prvY} V ${distNodes[0].cy} H ${distNodes[0].cx + 20}`}
          fill="none" stroke={GREEN} strokeWidth={3} filter="url(#greenGlow)" />
        {/* vertical from PRV level to Zone C */}
        <path d={`M ${distNodes[1].cx - 22},${prvY} V ${distNodes[2].cy} H ${distNodes[2].cx + 20}`}
          fill="none" stroke={GREEN} strokeWidth={3} filter="url(#greenGlow)" />

        {distNodes.map((n, i) => (
          <DistNode key={i}
            cx={n.cx} cy={n.cy}
            label={n.label}
            pressure={distPressures[i].toFixed(2)}
          />
        ))}

        {/* ══════════════════════════════════════════════════════════════
            CONTROL PANEL (bottom-left)
            ══════════════════════════════════════════════════════════════ */}
        {/* Glass panel background */}
        <rect x={30} y={505} width={250} height={195}
          fill="rgba(0,212,255,0.04)"
          stroke="rgba(0,212,255,0.25)"
          rx={8} />
        {/* Title */}
        <text x={155} y={525} textAnchor="middle"
          fontSize="11" fontWeight="bold" fontFamily="'Courier New',monospace"
          fill={CYAN} filter="url(#neonGlow)" letterSpacing="2">CONTROL PANEL</text>
        <line x1={45} y1={530} x2={265} y2={530}
          stroke="rgba(0,212,255,0.2)" strokeWidth={1} />

        {/* LCD readouts */}
        <GlassReadout x={40} y={536} w={228} h={90} lines={[
          { label: 'SYS FLOW',    value: `${totalFlow} L/min` },
          { label: 'SYS HEALTH',  value: `${health}%` },
          { label: 'PRV UP',      value: `${prv.up.toFixed(2)} bar` },
          { label: 'PRV DN',      value: `${prv.down.toFixed(2)} bar` },
        ]} />

        {/* Status indicator lights */}
        {[
          { label: 'TELEMETRY',  ok: true  },
          { label: 'COMMS LINK', ok: true  },
          { label: 'P-001',      ok: pumps[0].running },
          { label: 'P-002',      ok: pumps[1].running },
        ].map((s, i) => {
          const lx = 48 + (i % 2) * 112;
          const ly = 637 + Math.floor(i / 2) * 28;
          const color = s.ok ? GREEN : RED;
          return (
            <g key={i}>
              <circle cx={lx} cy={ly} r={5} fill={color} filter="url(#neonGlow)">
                {s.ok && (
                  <animate attributeName="opacity"
                    values="1;0.4;1" dur="2s" repeatCount="indefinite" />
                )}
              </circle>
              <text x={lx + 10} y={ly + 4}
                fontSize="10" fontFamily="'Courier New',monospace"
                fill={s.ok ? '#94a3b8' : RED}>{s.label}</text>
            </g>
          );
        })}

        {/* ══════════════════════════════════════════════════════════════
            PIPE LABELS / TAGS
            ══════════════════════════════════════════════════════════════ */}
        {/* Main pipe tag */}
        <rect x={540} y={140} width={80} height={16} fill="#060a14" stroke="rgba(0,212,255,0.2)" rx={3} />
        <text x={580} y={152} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace"
          fill="#64748b">MAIN-XMSSN-01</text>

        {/* Collector pipe tag */}
        <rect x={876} y={280} width={72} height={16} fill="#060a14" stroke="rgba(0,212,255,0.2)" rx={3} />
        <text x={912} y={292} textAnchor="middle"
          fontSize="9" fontFamily="'Courier New',monospace"
          fill="#64748b">COLL-LINE-02</text>

        {/* ══════════════════════════════════════════════════════════════
            TITLE / WATERMARK
            ══════════════════════════════════════════════════════════════ */}
        <text x={SVG_W - 16} y={SVG_H - 10} textAnchor="end"
          fontSize="9" fontFamily="'Courier New',monospace"
          fill="#ffffff08" letterSpacing="3">
          EEMACS SCADA P&ID REV-3 • {new Date().getFullYear()}
        </text>

      </svg>

      {/* ── Pump control buttons (HTML overlay) ────────────────────────── */}
      <div style={{
        display: 'flex', gap: 12, padding: '10px 20px',
        background: '#060a14',
        borderTop: '1px solid rgba(0,212,255,0.1)',
      }}>
        {pumps.map(p => (
          <button key={p.id}
            onClick={() => togglePump(p.id)}
            className={`d3-pump-neon-btn ${p.running ? 'd3-pump-neon-btn--stop' : 'd3-pump-neon-btn--start'}`}>
            {p.running ? `■ Stop ${p.label}` : `▶ Start ${p.label}`}
          </button>
        ))}
        <span style={{
          marginLeft: 'auto', fontFamily: "'Courier New',monospace",
          fontSize: 11, color: '#334155', alignSelf: 'center'
        }}>
          Click pump circles in diagram or use buttons · Click valve symbols to toggle
        </span>
      </div>
    </div>
  );
}

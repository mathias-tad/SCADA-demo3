import React, { useState, useEffect } from 'react';

/* ─── SVG Circular Progress Ring ─────────────────────────────────── */
function CircleRing({ pct, size = 120, stroke = 10, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (Math.min(Math.max(pct, 0), 100) / 100) * circ;
  return (
    <svg width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      {/* track */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#F0F0F0" strokeWidth={stroke}
      />
      {/* filled arc */}
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

/* ─── Semi-circle Gauge (180°) ───────────────────────────────────── */
function SemiGauge({ value, max, color, label, unit }) {
  const W = 130, H = 74;
  const cx = W / 2, cy = H - 4;
  const r = 56;
  // arc from 180° to 0° (left to right)
  const pct = Math.min(Math.max(value / max, 0), 1);
  const angle = Math.PI * pct; // 0 → π
  // track: left semicircle arc
  const trackStart = { x: cx - r, y: cy };
  const trackEnd   = { x: cx + r, y: cy };
  // fill endpoint
  const fillEndX = cx - r * Math.cos(angle);
  const fillEndY = cy - r * Math.sin(angle);
  const largeArc = angle > Math.PI / 2 ? 1 : 0; // adjust for > 90°
  // For track we always draw the full half
  const trackD = `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 0 1 ${trackEnd.x} ${trackEnd.y}`;
  const fillD  = pct > 0
    ? `M ${trackStart.x} ${trackStart.y} A ${r} ${r} 0 ${pct > 0.5 ? 1 : 0} 1 ${fillEndX} ${fillEndY}`
    : '';
  return (
    <div className="d3-semi-gauge">
      <svg width={W} height={H} style={{ overflow: 'visible' }}>
        <path d={trackD} fill="none" stroke="#EBEBEB" strokeWidth="9" strokeLinecap="round" />
        {fillD && (
          <path d={fillD} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            style={{ transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
        )}
        <text x={cx} y={cy - 14} textAnchor="middle" fontSize="18" fontWeight="800" fill="#222">
          {value}
        </text>
        <text x={cx} y={cy - 1} textAnchor="middle" fontSize="10" fill="#717171">
          {unit}
        </text>
      </svg>
      <div className="d3-semi-gauge-label">{label}</div>
    </div>
  );
}

/* ─── Animated Wave SVG Background ──────────────────────────────── */
function HeroWaves() {
  return (
    <svg className="d3-hero-waves" viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path
        d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
        fill="rgba(255,255,255,0.06)"
        className="d3-wave-path"
      />
      <path
        d="M0,80 C150,20 350,100 600,50 C850,0 1050,90 1200,80 L1200,120 L0,120 Z"
        fill="rgba(255,255,255,0.04)"
        className="d3-wave-path d3-wave-path--slow"
      />
    </svg>
  );
}

/* ─── Tank ring color helper ─────────────────────────────────────── */
function tankColor(pct) {
  if (pct >= 70) return '#10B981'; // green
  if (pct >= 40) return '#F59E0B'; // amber
  return '#EF4444';                // red
}

/* ─── ALERTS DATA ────────────────────────────────────────────────── */
const INITIAL_ALERTS = [
  { id: 1, dot: '#EF4444', icon: '🔴', text: 'High-pressure alarm: Zone 4 PRV upstream >120 PSI', time: '2 min ago' },
  { id: 2, dot: '#F59E0B', icon: '🟡', text: 'Tank 3 – Raw Water Storage below 40% threshold', time: '9 min ago' },
  { id: 3, dot: '#3B82F6', icon: '🔵', text: 'Pump 2 switched to STANDBY (auto rotation cycle)', time: '18 min ago' },
  { id: 4, dot: '#10B981', icon: '🟢', text: 'System chlorine residual verified – all zones nominal', time: '31 min ago' },
];

/* ══════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                     */
/* ══════════════════════════════════════════════════════════════════ */
export default function ScadaDashboard() {
  /* --- Tank levels (%) ------------------------------------------ */
  const [tanks, setTanks] = useState([
    { id: 1, name: 'High Tank #2',          zone: 'Booster Zone 4',     pct: 72, vol: 1.84, ht: 8.6 },
    { id: 2, name: 'Elevated Reservoir #1', zone: 'North Distribution',  pct: 47, vol: 2.21, ht: 11.4 },
    { id: 3, name: 'Raw Water Storage',     zone: 'Treatment Intake',    pct: 28, vol: 0.96, ht: 4.2 },
  ]);

  /* --- Pumps ----------------------------------------------------- */
  const [pumps, setPumps] = useState([
    { id: 1, name: 'Pump Station Alpha', loc: 'Main Transmission Line', running: true,  flow: 312, pressure: 86.5, rpm: 2850, load: 78, runtime: '14h 22m' },
    { id: 2, name: 'Pump Station Beta',  loc: 'South Distribution Grid', running: false, flow:   0, pressure:  0,   rpm:    0, load:  0, runtime: '—' },
  ]);

  /* --- PRV ------------------------------------------------------- */
  const [prv, setPrv] = useState({ upstream: 114, downstream: 48 });

  /* --- Derived KPIs --------------------------------------------- */
  const [totalFlow, setTotalFlow]   = useState(847);
  const [sysHealth, setSysHealth]   = useState(98.4);

  /* ── Live fluctuation ──────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      // tanks: tiny drift
      setTanks(prev => prev.map(t => ({
        ...t,
        pct: +(Math.min(100, Math.max(5, t.pct + (Math.random() - 0.5) * 0.6))).toFixed(1),
      })));
      // running pump metrics
      setPumps(prev => prev.map(p => p.running ? {
        ...p,
        flow:     Math.round(305 + Math.random() * 20),
        pressure: +(85.5 + Math.random() * 2.2).toFixed(1),
        rpm:      Math.round(2820 + Math.random() * 60),
        load:     Math.round(74 + Math.random() * 8),
      } : p));
      // PRV
      setPrv({
        upstream:   Math.round(112 + Math.random() * 5),
        downstream: Math.round(46  + Math.random() * 4),
      });
      // global KPIs
      setTotalFlow(Math.round(840 + Math.random() * 14));
      setSysHealth(+(98.0 + Math.random() * 0.6).toFixed(1));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  /* ── Tank ± buttons ─────────────────────────────────────────────── */
  const adjustTank = (idx, delta) => {
    setTanks(prev => prev.map((t, i) => i === idx
      ? { ...t, pct: Math.min(100, Math.max(0, +(t.pct + delta).toFixed(1))) }
      : t
    ));
  };

  /* ── Pump toggle ─────────────────────────────────────────────────── */
  const togglePump = (id) => {
    setPumps(prev => prev.map(p => p.id === id
      ? { ...p, running: !p.running, flow: 0, pressure: 0, rpm: 0, load: 0, runtime: p.running ? '—' : '0m' }
      : p
    ));
  };

  /* ════════════════════════════════════════════════════════════════ */
  return (
    <div className="d3-dashboard">

      {/* ═══ HERO BANNER ══════════════════════════════════════════ */}
      <div className="d3-hero">
        <HeroWaves />
        <div className="d3-hero-left">
          <div className="d3-hero-eyebrow">
            <span className="d3-live-dot" /> LIVE · Water Infrastructure
          </div>
          <h1 className="d3-hero-title">Water Infrastructure</h1>
          <p className="d3-hero-sub">Live System Overview · Updated every 2 s</p>
        </div>
        <div className="d3-hero-kpis">
          <div className="d3-hero-kpi">
            <span className="d3-hero-kpi-val">{totalFlow}</span>
            <span className="d3-hero-kpi-unit">L/min</span>
            <span className="d3-hero-kpi-lbl">Total Flow</span>
          </div>
          <div className="d3-hero-kpi-divider" />
          <div className="d3-hero-kpi">
            <span className="d3-hero-kpi-val">{sysHealth}%</span>
            <span className="d3-hero-kpi-unit">&nbsp;</span>
            <span className="d3-hero-kpi-lbl">System Health</span>
          </div>
          <div className="d3-hero-kpi-divider" />
          <div className="d3-hero-kpi">
            <span className="d3-hero-kpi-val d3-hero-kpi-val--alert">2</span>
            <span className="d3-hero-kpi-unit">&nbsp;</span>
            <span className="d3-hero-kpi-lbl">Active Alerts</span>
          </div>
        </div>
      </div>

      {/* ═══ STORAGE CAPACITY ══════════════════════════════════════ */}
      <section className="d3-section">
        <h2 className="d3-section-title">Storage Capacity</h2>
        <div className="d3-tanks-grid">
          {tanks.map((tank, idx) => {
            const color = tankColor(tank.pct);
            const statusLabel = tank.pct >= 70 ? 'Optimal' : tank.pct >= 40 ? 'Normal' : 'Low';
            return (
              <div key={tank.id} className="d3-tank-card">
                {/* Header */}
                <div className="d3-tank-card-header">
                  <span className="d3-tank-name">{tank.name}</span>
                  <span className="d3-zone-pill">{tank.zone}</span>
                </div>

                {/* Ring */}
                <div className="d3-ring-wrap">
                  <CircleRing pct={tank.pct} size={130} stroke={11} color={color} />
                  <div className="d3-ring-inner">
                    <span className="d3-ring-pct">{tank.pct.toFixed(0)}%</span>
                    <span className="d3-ring-sub">capacity</span>
                  </div>
                </div>

                {/* Min/Max bar */}
                <div className="d3-minmax-bar">
                  <div className="d3-minmax-fill" style={{ width: `${tank.pct}%`, background: color }} />
                  <div className="d3-minmax-markers">
                    <span>0%</span><span>50%</span><span>100%</span>
                  </div>
                </div>

                {/* Mini stats */}
                <div className="d3-tank-stats">
                  <div className="d3-tank-stat">
                    <span className="d3-stat-val">{tank.vol.toFixed(2)}</span>
                    <span className="d3-stat-lbl">Vol ML</span>
                  </div>
                  <div className="d3-tank-stat-div" />
                  <div className="d3-tank-stat">
                    <span className="d3-stat-val">{tank.ht.toFixed(1)}</span>
                    <span className="d3-stat-lbl">Height m</span>
                  </div>
                  <div className="d3-tank-stat-div" />
                  <div className="d3-tank-stat">
                    <span className="d3-stat-val" style={{ color }}>{statusLabel}</span>
                    <span className="d3-stat-lbl">Status</span>
                  </div>
                </div>

                {/* +/- controls */}
                <div className="d3-tank-controls">
                  <button className="d3-tank-btn" onClick={() => adjustTank(idx, -5)}>−</button>
                  <span className="d3-tank-ctrl-label">Adjust Level</span>
                  <button className="d3-tank-btn d3-tank-btn--plus" onClick={() => adjustTank(idx, 5)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ OPERATIONS GRID ═══════════════════════════════════════ */}
      <section className="d3-section">
        <h2 className="d3-section-title">Operations</h2>
        <div className="d3-ops-grid">

          {/* LEFT — Pump Stations */}
          <div className="d3-pumps-col">
            {pumps.map(pump => (
              <div key={pump.id} className={`d3-pump-card ${pump.running ? 'd3-pump-card--running' : ''}`}>
                <div className="d3-pump-header">
                  <div className="d3-pump-icon-wrap">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </div>
                  <div className="d3-pump-title-block">
                    <span className="d3-pump-name">{pump.name}</span>
                    <span className="d3-pump-loc">{pump.loc}</span>
                  </div>
                </div>

                <div className="d3-pump-status-row">
                  <span className={`d3-status-pill ${pump.running ? 'd3-pill--green' : 'd3-pill--grey'}`}>
                    {pump.running ? '● RUNNING' : '○ STANDBY'}
                  </span>
                  <span className="d3-pump-runtime">⏱ {pump.runtime}</span>
                </div>

                <div className="d3-pump-metrics">
                  <div className="d3-pump-metric">
                    <span className="d3-pm-val">{pump.running ? pump.flow : '—'}</span>
                    <span className="d3-pm-lbl">Flow L/min</span>
                  </div>
                  <div className="d3-pump-metric">
                    <span className="d3-pm-val">{pump.running ? pump.pressure : '—'}</span>
                    <span className="d3-pm-lbl">Pressure PSI</span>
                  </div>
                  <div className="d3-pump-metric">
                    <span className="d3-pm-val">{pump.running ? pump.rpm : '—'}</span>
                    <span className="d3-pm-lbl">RPM</span>
                  </div>
                </div>

                {/* Load bar */}
                <div className="d3-load-bar-wrap">
                  <div className="d3-load-bar-label">
                    <span>Load</span>
                    <span>{pump.running ? `${pump.load}%` : '0%'}</span>
                  </div>
                  <div className="d3-load-bar-track">
                    <div
                      className="d3-load-bar-fill"
                      style={{
                        width: `${pump.running ? pump.load : 0}%`,
                        background: pump.load > 85 ? '#EF4444' : '#FF385C',
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      }}
                    />
                  </div>
                </div>

                <button
                  className={`d3-pump-toggle-btn ${pump.running ? 'd3-pump-toggle-btn--stop' : 'd3-pump-toggle-btn--start'}`}
                  onClick={() => togglePump(pump.id)}
                >
                  {pump.running ? 'Stop Pump' : 'Start Pump'}
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT — PRV + Alerts */}
          <div className="d3-right-col">

            {/* PRV Card */}
            <div className="d3-prv-card">
              <div className="d3-prv-header">
                <div>
                  <span className="d3-prv-title">PRV Station Alpha</span>
                  <span className="d3-prv-sub">Valley Pressure Reduction</span>
                </div>
                <span className="d3-status-pill d3-pill--green">ACTIVE</span>
              </div>
              <div className="d3-prv-gauges">
                <SemiGauge
                  value={prv.upstream}
                  max={160}
                  color="#FF385C"
                  label="Upstream"
                  unit="PSI"
                />
                <div className="d3-prv-arrow">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <path d="M8 16 L24 16 M18 10 L24 16 L18 22" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span className="d3-prv-valve-pct">65% open</span>
                </div>
                <SemiGauge
                  value={prv.downstream}
                  max={80}
                  color="#10B981"
                  label="Downstream"
                  unit="PSI"
                />
              </div>
              <div className="d3-prv-footer">
                <span>RTU #7 · IP 192.168.10.42</span>
                <span>Signal: −68 dBm · Batt: 13.8 V</span>
              </div>
            </div>

            {/* Alerts Feed */}
            <div className="d3-alerts-card">
              <div className="d3-alerts-header">
                <span className="d3-alerts-title">Alert Feed</span>
                <span className="d3-alerts-badge">2 active</span>
              </div>
              <ul className="d3-alerts-list">
                {INITIAL_ALERTS.map((a, i) => (
                  <li key={a.id} className="d3-alert-item">
                    <span className="d3-alert-dot" style={{ background: a.dot }} />
                    <div className="d3-alert-body">
                      <span className="d3-alert-text">{a.text}</span>
                      <span className="d3-alert-time">{a.time}</span>
                    </div>
                    {i < INITIAL_ALERTS.length - 1 && <div className="d3-alert-divider" />}
                  </li>
                ))}
              </ul>
            </div>

          </div>{/* end right col */}
        </div>{/* end ops-grid */}
      </section>

    </div>/* end d3-dashboard */
  );
}

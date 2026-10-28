import React from 'react';

export default function TechCard({ user, onEdit, onTestAlert }) {
  const isWater = user.category === 'water';

  return (
    <div className={`tech-card ${isWater ? 'tech-card-water' : 'tech-card-tech'}`}>
      {/* Glow highlight bar */}
      <div className="card-ambient-glow"></div>

      {/* Top Header Badge */}
      <div className="tech-card-header">
        <div className="specialty-indicator">
          <span className="tech-icon">{isWater ? '💧' : '⚡'}</span>
          <div>
            <span className="domain-text">{isWater ? 'Water Operations' : 'SCADA Systems & Executive'}</span>
            <span className="duty-badge">{user.dutyStatus}</span>
          </div>
        </div>

        <button className="telemetry-edit-btn" onClick={() => onEdit(user)} title="Configure Alert Channels">
          <span>Edit ⚙️</span>
        </button>
      </div>

      {/* Hero Avatar & Identity */}
      <div className="tech-hero">
        <div className="tech-avatar-box">
          <img src={user.avatar} alt={user.firstName} className="tech-avatar-img" />
          <span className={`pulse-beacon ${user.activeNow ? 'beacon-online' : 'beacon-idle'}`}></span>
        </div>

        <div className="tech-user-meta">
          <h3 className="tech-name">{user.firstName} {user.lastName}</h3>
          <p className="tech-title">{user.position}</p>
          <span className="tech-facility">📍 {user.facility}</span>
        </div>
      </div>

      {/* SCADA Zone & Focus */}
      <div className="scada-zone-tag">
        <span className="zone-label">Supervised Hardware Zone</span>
        <span className="zone-value">{user.stationZone}</span>
      </div>

      {/* Alert Routing Pill Strip */}
      <div className="alert-routing-strip">
        <span className="strip-title">Active Alert Links:</span>
        <div className="strip-tags">
          <span className={`pill-tag ${user.notifications.alarmText ? 'pill-on' : 'pill-off'}`}>SMS Text</span>
          <span className={`pill-tag ${user.notifications.alarmEmail ? 'pill-on' : 'pill-off'}`}>Email</span>
          <span className={`pill-tag ${user.notifications.alarmScreen ? 'pill-on' : 'pill-off'}`}>Screen Display</span>
          <span className={`pill-tag ${user.notifications.nodeText ? 'pill-on' : 'pill-off'}`}>Smart Node</span>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="tech-contact-bar">
        <div className="contact-unit">
          <span className="unit-label">SMS Alert Phone</span>
          <span className="unit-value">{user.phoneNumber}</span>
        </div>
        <div className="contact-unit text-right">
          <span className="unit-label">Emergency Email</span>
          <span className="unit-value" title={user.email}>{user.email}</span>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="tech-card-footer">
        <span className="heartbeat-text">{user.lastHeartbeat}</span>
        <button
          className="btn-quick-ping"
          onClick={() => onTestAlert(user)}
          title="Simulate sending a test SCADA alarm to this operator"
        >
          <span>Send Test Ping</span>
        </button>
      </div>
    </div>
  );
}

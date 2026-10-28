import React, { useState, useEffect } from 'react';

export default function TechModal({ isOpen, onClose, onSave, user, isNew }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData({
        id: "usr-" + Date.now(),
        firstName: "",
        lastName: "",
        position: "",
        category: "water",
        organization: "Extreme Endeavors",
        facility: "Central Treatment Plant",
        stationZone: "High Tank #1 & Pumps",
        email: "",
        phoneNumber: "",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
        specialty: "",
        dutyStatus: "ON-DUTY",
        lastHeartbeat: "Active just now",
        activeNow: true,
        role: "Operator",
        notifications: {
          nodeScreen: true,
          nodeText: false,
          nodeEmail: false,
          eemacsScreen: true,
          eemacsText: false,
          eemacsEmail: false,
          alarmScreen: true,
          alarmText: true,
          alarmEmail: true
        }
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !formData) return null;

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("Please provide both First and Last names.");
      return;
    }
    onSave(formData);
    onClose();
  };

  const isWater = formData.category === 'water';

  return (
    <div className="telemetry-modal-backdrop" onClick={onClose}>
      <div className="telemetry-modal-box" onClick={e => e.stopPropagation()}>
        {/* Top telemetry bar */}
        <div className={`telemetry-modal-header ${isWater ? 'header-water' : 'header-tech'}`}>
          <div>
            <span className="telemetry-tag">
              {isWater ? '💧 WATER OPERATIONS TERMINAL' : '⚡ SCADA ARCHITECTURE CONSOLE'}
            </span>
            <h2>{isNew ? 'New Operator Enlistment' : `Profile Configuration: ${formData.firstName} ${formData.lastName}`}</h2>
          </div>
          <button className="telemetry-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="telemetry-form">
          {/* Category Toggle */}
          <div className="form-row">
            <label className="telemetry-label">Operational Classification</label>
            <div className="classification-selector">
              <button
                type="button"
                className={`class-chip ${isWater ? 'selected-water-chip' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, category: 'water' }))}
              >
                <span>💧 Water Utility Operator</span>
              </button>
              <button
                type="button"
                className={`class-chip ${!isWater ? 'selected-tech-chip' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, category: 'tech' }))}
              >
                <span>⚡ SCADA Technology / Exec</span>
              </button>
            </div>
          </div>

          {/* Names */}
          <div className="grid-2">
            <div>
              <label className="telemetry-label">First Name</label>
              <input
                className="telemetry-input"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleTextChange}
                required
              />
            </div>
            <div>
              <label className="telemetry-label">Last Name</label>
              <input
                className="telemetry-input"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>

          {/* Position & Role */}
          <div className="grid-2">
            <div>
              <label className="telemetry-label">Position / Duty Role</label>
              <input
                className="telemetry-input"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleTextChange}
              />
            </div>
            <div>
              <label className="telemetry-label">Access Control Role</label>
              <select
                className="telemetry-input"
                name="role"
                value={formData.role}
                onChange={handleTextChange}
              >
                <option value="Administrator">Administrator (Root)</option>
                <option value="Operator">Operator (Field Actions)</option>
                <option value="Control">Control (Setpoints)</option>
                <option value="Monitor">Monitor (Read-only)</option>
                <option value="Audit">Audit (Compliance)</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid-2">
            <div>
              <label className="telemetry-label">SMS Alert Phone (Twilio)</label>
              <input
                className="telemetry-input"
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleTextChange}
                placeholder="304-555-1818"
              />
            </div>
            <div>
              <label className="telemetry-label">Emergency Email (MailKit)</label>
              <input
                className="telemetry-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleTextChange}
                required
              />
            </div>
          </div>

          {/* Hardware Zone */}
          <div className="grid-2">
            <div>
              <label className="telemetry-label">Assigned Facility / Plant</label>
              <input
                className="telemetry-input"
                type="text"
                name="facility"
                value={formData.facility}
                onChange={handleTextChange}
              />
            </div>
            <div>
              <label className="telemetry-label">Supervised Hardware Zone</label>
              <input
                className="telemetry-input"
                type="text"
                name="stationZone"
                value={formData.stationZone}
                onChange={handleTextChange}
                placeholder="High Tank #2 & Booster #4"
              />
            </div>
          </div>

          {/* SCADA Notification Routing Matrix */}
          <div className="telemetry-matrix-panel">
            <span className="telemetry-label" style={{ color: '#0EA5E9' }}>
              SCADA ALERT DISPATCH MATRIX
            </span>
            <div className="matrix-grid">
              <div className="matrix-row matrix-header-row">
                <span>Alert Category</span>
                <span>Screen GUI</span>
                <span>SMS Carrier</span>
                <span>Email SMTP</span>
              </div>

              <div className="matrix-row">
                <span>Smart Node RTU</span>
                <input type="checkbox" checked={formData.notifications.nodeScreen} onChange={() => handleNotifToggle('nodeScreen')} />
                <input type="checkbox" checked={formData.notifications.nodeText} onChange={() => handleNotifToggle('nodeText')} />
                <input type="checkbox" checked={formData.notifications.nodeEmail} onChange={() => handleNotifToggle('nodeEmail')} />
              </div>

              <div className="matrix-row">
                <span>EEMACS Core System</span>
                <input type="checkbox" checked={formData.notifications.eemacsScreen} onChange={() => handleNotifToggle('eemacsScreen')} />
                <input type="checkbox" checked={formData.notifications.eemacsText} onChange={() => handleNotifToggle('eemacsText')} />
                <input type="checkbox" checked={formData.notifications.eemacsEmail} onChange={() => handleNotifToggle('eemacsEmail')} />
              </div>

              <div className="matrix-row matrix-row-critical">
                <span style={{ color: '#F43F5E', fontWeight: 'bold' }}>Critical Tank/Pump Alarms</span>
                <input type="checkbox" checked={formData.notifications.alarmScreen} onChange={() => handleNotifToggle('alarmScreen')} />
                <input type="checkbox" checked={formData.notifications.alarmText} onChange={() => handleNotifToggle('alarmText')} />
                <input type="checkbox" checked={formData.notifications.alarmEmail} onChange={() => handleNotifToggle('alarmEmail')} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="telemetry-modal-actions">
            <button type="button" className="telemetry-btn-cancel" onClick={onClose}>
              Abort
            </button>
            <button type="submit" className="telemetry-btn-save">
              Commit Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

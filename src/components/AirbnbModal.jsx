import React, { useState, useEffect } from 'react';
import { ORIGINAL_ROLES, isWaterRole, isActiveLast20Mins } from '../mockData';

export default function AirbnbModal({
  isOpen,
  onClose,
  user,
  onSave,
  onDelete,
  onSendLink,
  onResetPassword,
  isNew = false
}) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: 'Extreme Endeavors',
    phoneNumber: '',
    selectedRole: 'Operator',
    lastActivity: new Date().toISOString(),
    nodeMessagesScreen: true,
    nodeMessagesText: true,
    nodeMessagesEmail: false,
    eemacsMessagesScreen: true,
    eemacsMessagesText: true,
    eemacsMessagesEmail: false,
    alarmMessagesScreen: true,
    alarmMessagesText: true,
    alarmMessagesEmail: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
        confirmPassword: ''
      });
      setIsEditing(isNew);
    } else if (isNew) {
      setFormData({
        userId: `usr-${Math.random().toString(36).substr(2, 9)}`,
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        organization: 'Extreme Endeavors',
        phoneNumber: '',
        selectedRole: 'Operator',
        lastActivity: new Date().toISOString(),
        nodeMessagesScreen: true,
        nodeMessagesText: true,
        nodeMessagesEmail: false,
        eemacsMessagesScreen: true,
        eemacsMessagesText: true,
        eemacsMessagesEmail: false,
        alarmMessagesScreen: true,
        alarmMessagesText: true,
        alarmMessagesEmail: true,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
      });
      setIsEditing(true);
    }
  }, [user, isNew]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.organization) {
      alert('Please fill out all required fields.');
      return;
    }
    if (isNew && formData.password && formData.password !== formData.confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }
    onSave(formData);
    setIsEditing(false);
    onClose();
  };

  const isWater = isWaterRole(formData.selectedRole);
  const activeNow = isActiveLast20Mins(formData.lastActivity);

  return (
    <div className="airbnb-modal-overlay" onClick={onClose}>
      <div className="airbnb-modal-window" onClick={e => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="airbnb-modal-header">
          <button className="airbnb-modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
          
          <div className="modal-header-titles">
            <h2>{isNew ? 'Create New User' : `${formData.firstName} ${formData.lastName}`}</h2>
            <p className="modal-sub">
              User ID: <code>{formData.userId}</code> • Organization: <strong>{formData.organization}</strong>
            </p>
          </div>

          {!isNew && (
            <div className="modal-mode-toggle">
              <button
                type="button"
                className={`mode-btn ${!isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(false)}
              >
                View
              </button>
              <button
                type="button"
                className={`mode-btn ${isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="airbnb-modal-body">
          {!isEditing ? (
            /* VIEW PROFILE MODE */
            <div className="airbnb-view-grid">
              {/* Left Column: Avatar & Quick Stats */}
              <div className="view-col-left">
                <div className="view-avatar-box">
                  <img src={formData.avatar} alt={formData.firstName} className="view-avatar-img" />
                  {activeNow && (
                    <span className="view-online-beacon" title="Active in last 20 mins"></span>
                  )}
                </div>

                <h3 className="view-full-name">{formData.firstName} {formData.lastName}</h3>
                <span className="view-role-tag">
                  {formData.selectedRole} Role
                </span>

                <div className="view-contact-box" style={{ marginTop: '16px' }}>
                  <div className="contact-item">
                    <span className="contact-icon">📞</span>
                    <div>
                      <span className="contact-lbl">Mobile Phone</span>
                      <strong className="contact-val">{formData.phoneNumber || 'None'}</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">✉️</span>
                    <div>
                      <span className="contact-lbl">Email Address</span>
                      <strong className="contact-val">{formData.email}</strong>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">🏢</span>
                    <div>
                      <span className="contact-lbl">Organization</span>
                      <strong className="contact-val">{formData.organization}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="airbnb-test-btn"
                    onClick={() => onSendLink && onSendLink(formData)}
                  >
                    <i className="fas fa-share-square"></i> Send Magic Link
                  </button>

                  <button
                    type="button"
                    className="airbnb-test-btn"
                    style={{ background: '#F59E0B' }}
                    onClick={() => onResetPassword && onResetPassword(formData)}
                  >
                    <i className="fas fa-undo"></i> Reset Password
                  </button>
                </div>
              </div>

              {/* Right Column: Routing Matrix & Details */}
              <div className="view-col-right">
                <div className="section-block">
                  <div className="routing-header">
                    <h4 className="section-title">SCADA Notification Channel Routing</h4>
                    <span className="routing-desc">Original 9-channel message routing configuration</span>
                  </div>

                  <div className="routing-table-wrap">
                    <table className="routing-table">
                      <thead>
                        <tr>
                          <th>Telemetry System</th>
                          <th>Screen</th>
                          <th>SMS Text</th>
                          <th>Email</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Smart Node Messages</strong></td>
                          <td>
                            <span className={`channel-status ${formData.nodeMessagesScreen ? 'on' : 'off'}`}>
                              {formData.nodeMessagesScreen ? 'ON' : 'OFF'}
                            </span>
                          </td>
                          <td>
                            <span className={`channel-status ${formData.nodeMessagesText ? 'on' : 'off'}`}>
                              {formData.nodeMessagesText ? 'ON' : 'OFF'}
                            </span>
                          </td>
                          <td>
                            <span className={`channel-status ${formData.nodeMessagesEmail ? 'on' : 'off'}`}>
                              {formData.nodeMessagesEmail ? 'ON' : 'OFF'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>EEMACS Messages</strong></td>
                          <td>
                            <span className={`channel-status ${formData.eemacsMessagesScreen ? 'on' : 'off'}`}>
                              {formData.eemacsMessagesScreen ? 'ON' : 'OFF'}
                            </span>
                          </td>
                          <td>
                            <span className={`channel-status ${formData.eemacsMessagesText ? 'on' : 'off'}`}>
                              {formData.eemacsMessagesText ? 'ON' : 'OFF'}
                            </span>
                          </td>
                          <td>
                            <span className={`channel-status ${formData.eemacsMessagesEmail ? 'on' : 'off'}`}>
                              {formData.eemacsMessagesEmail ? 'ON' : 'OFF'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Alarm Messages</strong></td>
                          <td>
                            <span className={`channel-status ${formData.alarmMessagesScreen ? 'on' : 'off'}`}>
                              {formData.alarmMessagesScreen ? 'ON' : 'OFF'}
                            </span>
                          </td>
                          <td>
                            <span className={`channel-status ${formData.alarmMessagesText ? 'on' : 'off'}`}>
                              {formData.alarmMessagesText ? 'ON' : 'OFF'}
                            </span>
                          </td>
                          <td>
                            <span className={`channel-status ${formData.alarmMessagesEmail ? 'on' : 'off'}`}>
                              {formData.alarmMessagesEmail ? 'ON' : 'OFF'}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="view-footer-actions">
                  <button type="button" className="edit-cta-btn" onClick={() => setIsEditing(true)}>
                    <i className="fas fa-edit"></i> Edit User Profile & Channels
                  </button>
                  {onDelete && (
                    <button
                      type="button"
                      className="delete-cta-btn"
                      onClick={() => {
                        if (confirm(`Delete user ${formData.firstName} ${formData.lastName}?`)) {
                          onDelete(formData.userId);
                          onClose();
                        }
                      }}
                    >
                      <i className="fas fa-ban"></i> Delete User
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* EDIT / CREATE MODE - EXACT SCADA FIELDS */
            <form onSubmit={handleSubmit} className="airbnb-edit-form">
              <input type="hidden" value={formData.userId} />

              <div className="form-grid-two">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="First Name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group">
                  <label>Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Organization"
                  />
                </div>
              </div>

              <div className="form-grid-two">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phoneNumber}
                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="Mobile Number"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.selectedRole}
                    onChange={e => setFormData({ ...formData, selectedRole: e.target.value })}
                  >
                    {ORIGINAL_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isNew && (
                <div className="form-grid-two">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>
              )}

              {/* Exact SCADA Notification Fieldsets */}
              <div className="form-notification-section">
                <h4>Smart Node, EEMACS & Alarm Channel Routing</h4>

                <div className="toggle-matrix-grid">
                  <div className="toggle-card">
                    <h5>Smart Node Messages</h5>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.nodeMessagesScreen}
                        onChange={e => setFormData({ ...formData, nodeMessagesScreen: e.target.checked })}
                      />
                      <span>Screen</span>
                    </label>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.nodeMessagesText}
                        onChange={e => setFormData({ ...formData, nodeMessagesText: e.target.checked })}
                      />
                      <span>SMS Text</span>
                    </label>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.nodeMessagesEmail}
                        onChange={e => setFormData({ ...formData, nodeMessagesEmail: e.target.checked })}
                      />
                      <span>Email</span>
                    </label>
                  </div>

                  <div className="toggle-card">
                    <h5>EEMACS Messages</h5>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.eemacsMessagesScreen}
                        onChange={e => setFormData({ ...formData, eemacsMessagesScreen: e.target.checked })}
                      />
                      <span>Screen</span>
                    </label>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.eemacsMessagesText}
                        onChange={e => setFormData({ ...formData, eemacsMessagesText: e.target.checked })}
                      />
                      <span>SMS Text</span>
                    </label>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.eemacsMessagesEmail}
                        onChange={e => setFormData({ ...formData, eemacsMessagesEmail: e.target.checked })}
                      />
                      <span>Email</span>
                    </label>
                  </div>

                  <div className="toggle-card">
                    <h5>Alarm Messages</h5>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.alarmMessagesScreen}
                        onChange={e => setFormData({ ...formData, alarmMessagesScreen: e.target.checked })}
                      />
                      <span>Screen</span>
                    </label>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.alarmMessagesText}
                        onChange={e => setFormData({ ...formData, alarmMessagesText: e.target.checked })}
                      />
                      <span>SMS Text</span>
                    </label>
                    <label className="toggle-row">
                      <input
                        type="checkbox"
                        checked={formData.alarmMessagesEmail}
                        onChange={e => setFormData({ ...formData, alarmMessagesEmail: e.target.checked })}
                      />
                      <span>Email</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="edit-form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    if (isNew) onClose();
                    else setIsEditing(false);
                  }}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button type="submit" className="save-btn">
                  <i className="fas fa-check"></i> {isNew ? 'Register User' : 'Update User'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

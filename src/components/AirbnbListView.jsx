import React from 'react';
import { isWaterRole, isActiveLast20Mins } from '../mockData';

export default function AirbnbListView({
  users,
  onOpenDetail,
  onSendLink,
  onResetPassword,
  onDelete,
  onToggleFavorite,
  favorites = {}
}) {
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Administrator': return { bg: '#FDF2F8', color: '#BE185D', border: '#FBCFE8' };
      case 'Operator':      return { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' };
      case 'Control':       return { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
      case 'Monitor':       return { bg: '#F8FAFC', color: '#475569', border: '#E2E8F0' };
      case 'Auditor':       return { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A' };
      default:              return { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0' };
    }
  };

  const renderChannelBadges = (screen, text, email) => {
    return (
      <div className="airbnb-channel-badges">
        <span className={`airbnb-ch-pill ${screen ? 'active' : 'inactive'}`} title={screen ? "Screen: On" : "Screen: Off"}>
          🖥️ Screen
        </span>
        <span className={`airbnb-ch-pill ${text ? 'active' : 'inactive'}`} title={text ? "SMS: On" : "SMS: Off"}>
          💬 SMS
        </span>
        <span className={`airbnb-ch-pill ${email ? 'active' : 'inactive'}`} title={email ? "Email: On" : "Email: Off"}>
          ✉️ Email
        </span>
      </div>
    );
  };

  return (
    <div className="airbnb-table-container">
      <table className="airbnb-list-table">
        <thead>
          <tr>
            <th style={{ width: '40px', textAlign: 'center' }}>Fav</th>
            <th style={{ width: '50px' }}>Status</th>
            <th>Operator Profile</th>
            <th>Organization</th>
            <th>Contact Details</th>
            <th>SCADA Role</th>
            <th>Smart Node</th>
            <th>EEMACS</th>
            <th>Alarms</th>
            <th style={{ width: '160px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const isFav = !!favorites[user.userId];
            const activeNow = isActiveLast20Mins(user.lastActivity);
            const roleStyle = getRoleBadgeStyle(user.selectedRole);

            return (
              <tr key={user.userId} className="airbnb-table-row">
                {/* Favorite Star / Heart */}
                <td style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className={`airbnb-table-heart ${isFav ? 'favorited' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(user.userId);
                    }}
                    title={isFav ? "Remove from starred team" : "Star user for priority dispatch"}
                  >
                    <svg viewBox="0 0 32 32" width="16" height="16" fill={isFav ? "#FF385C" : "rgba(0,0,0,0.25)"} stroke="#FFFFFF" strokeWidth="2">
                      <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-3.6 0-5.7 2.3-7 4.1C14.7 6.3 12.6 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
                    </svg>
                  </button>
                </td>

                {/* Status Dot */}
                <td style={{ textAlign: 'center' }}>
                  <span
                    className={`airbnb-status-dot ${activeNow ? 'dot-active' : 'dot-standby'}`}
                    title={activeNow ? "Active on SCADA within last 20 mins" : "Standby / Idle"}
                  ></span>
                </td>

                {/* Operator Profile */}
                <td>
                  <div className="airbnb-profile-cell" onClick={() => onOpenDetail(user)}>
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="airbnb-row-avatar"
                    />
                    <div className="airbnb-profile-meta">
                      <span className="airbnb-row-name">{user.firstName} {user.lastName}</span>
                      <span className="airbnb-row-sub">ID: {user.userId.slice(0, 8)}</span>
                    </div>
                  </div>
                </td>

                {/* Organization */}
                <td>
                  <span className="airbnb-org-text">{user.organization || 'Extreme SCADA'}</span>
                </td>

                {/* Contact (Phone & Email) */}
                <td>
                  <div className="airbnb-contact-group">
                    <a href={`tel:${user.phoneNumber}`} className="airbnb-row-phone" onClick={e => e.stopPropagation()}>
                      <i className="fas fa-phone-alt"></i> {user.phoneNumber}
                    </a>
                    <a href={`mailto:${user.email}`} className="airbnb-row-email" onClick={e => e.stopPropagation()}>
                      <i className="fas fa-envelope"></i> {user.email}
                    </a>
                  </div>
                </td>

                {/* Role */}
                <td>
                  <span
                    className="airbnb-role-pill-badge"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}
                  >
                    {user.selectedRole}
                  </span>
                </td>

                {/* Smart Node Messages */}
                <td>
                  {renderChannelBadges(user.nodeMessagesScreen, user.nodeMessagesText, user.nodeMessagesEmail)}
                </td>

                {/* EEMACS Messages */}
                <td>
                  {renderChannelBadges(user.eemacsMessagesScreen, user.eemacsMessagesText, user.eemacsMessagesEmail)}
                </td>

                {/* Alarm Messages */}
                <td>
                  {renderChannelBadges(user.alarmMessagesScreen, user.alarmMessagesText, user.alarmMessagesEmail)}
                </td>

                {/* Actions */}
                <td>
                  <div className="airbnb-actions-cluster">
                    <button
                      type="button"
                      className="airbnb-pill-btn btn-edit-user"
                      onClick={() => onOpenDetail(user)}
                      title="Edit Configuration"
                    >
                      <i className="fas fa-sliders-h"></i> Edit
                    </button>

                    <button
                      type="button"
                      className="airbnb-pill-btn btn-send-link"
                      onClick={() => onSendLink(user)}
                      title="Send Magic Login Link"
                    >
                      <i className="fas fa-magic"></i>
                    </button>

                    <button
                      type="button"
                      className="airbnb-pill-btn btn-reset-token"
                      onClick={() => onResetPassword(user)}
                      title="Reset Password"
                    >
                      <i className="fas fa-key"></i>
                    </button>

                    <button
                      type="button"
                      className="airbnb-pill-btn btn-delete-record"
                      onClick={() => onDelete(user.userId)}
                      title="Delete User Account"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

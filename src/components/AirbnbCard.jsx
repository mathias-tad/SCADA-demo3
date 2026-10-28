import React from 'react';
import { isWaterRole, isActiveLast20Mins } from '../mockData';

export default function AirbnbCard({ user, onOpenDetail, onToggleFavorite, isFavorite }) {
  const isWater = isWaterRole(user.selectedRole);
  const activeNow = isActiveLast20Mins(user.lastActivity);

  // Active notification summary
  const activeChannels = [];
  if (user.nodeMessagesText || user.eemacsMessagesText || user.alarmMessagesText) activeChannels.push('SMS');
  if (user.nodeMessagesEmail || user.eemacsMessagesEmail || user.alarmMessagesEmail) activeChannels.push('Email');
  if (user.nodeMessagesScreen || user.eemacsMessagesScreen || user.alarmMessagesScreen) activeChannels.push('Screen');

  return (
    <div
      className="airbnb-operator-card"
      onClick={() => onOpenDetail(user)}
      role="button"
      tabIndex={0}
      title="Click to view user details & edit SCADA routing"
    >
      {/* Photo Frame Container */}
      <div className="airbnb-image-frame">
        <img
          src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
          alt={`${user.firstName} ${user.lastName}`}
          className="airbnb-cover-photo"
          loading="lazy"
        />

        {/* Favorite / Quick Dispatch Heart Button */}
        <button
          type="button"
          className={`airbnb-heart-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(user.userId);
          }}
          title={isFavorite ? "Remove from starred team" : "Star user for priority dispatch"}
          aria-label="Favorite user"
        >
          <svg viewBox="0 0 32 32" width="18" height="18" fill={isFavorite ? "#FF385C" : "rgba(0,0,0,0.5)"} stroke="#FFFFFF" strokeWidth="2.5">
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-3.6 0-5.7 2.3-7 4.1C14.7 6.3 12.6 4 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
          </svg>
        </button>

        {/* Category & Status Pill */}
        <div className="airbnb-floating-pill">
          <span className="pill-category-icon">{isWater ? '💧' : '⚡'}</span>
          <span>{isWater ? 'Water Operations' : 'Tech & Leadership'}</span>
        </div>

        {/* Floating Operator Inset Portrait */}
        <div className="airbnb-avatar-inset">
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
            alt={`${user.firstName} ${user.lastName}`}
            className="airbnb-avatar-circle"
          />
          {activeNow && (
            <span className="airbnb-online-dot" title="Active on SCADA within last 20 minutes"></span>
          )}
        </div>
      </div>

      {/* Card Content (Airbnb Listing Typography) */}
      <div className="airbnb-card-body">
        {/* Row 1: Name + Certified Tag */}
        <div className="airbnb-row-header">
          <h3 className="airbnb-operator-name">
            {user.firstName} {user.lastName}
            <span className="airbnb-verified-badge" title="SCADA Certified Personnel">✓</span>
          </h3>
          <div className="airbnb-rating-badge">
            <span className="star-icon">★</span>
            <span className="rating-score">5.0</span>
          </div>
        </div>

        {/* Row 2: Organization */}
        <p className="airbnb-position-text">{user.organization}</p>

        {/* Row 3: Role Badge & Active Status */}
        <div className="airbnb-role-response-row">
          <span className="airbnb-role-tag">
            {user.selectedRole}
          </span>
          <span className="airbnb-response-time">
            {activeNow ? '🟢 Active Now' : 'Standby'}
          </span>
        </div>

        {/* Row 4: Phone & Dispatch Routes */}
        <div className="airbnb-dispatch-footer">
          <span className="dispatch-label">📞 {user.phoneNumber || 'None'}</span>
          <span className="dispatch-channels">
            {activeChannels.length > 0 ? activeChannels.join(' • ') : 'No relays'}
          </span>
        </div>
      </div>
    </div>
  );
}

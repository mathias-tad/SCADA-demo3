import React, { useState } from 'react';

export default function ScadaTopBar({ activeTab, setActiveTab, currentUser = "Pete" }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const handleConfirmLogout = () => {
    setLoggedOut(true);
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="scada-original-navbar">
        <div className="scada-nav-container">
          {/* Left Brand: Water-Control-Icon.png */}
          <div
            className={`scada-brand-link ${activeTab === 'dashboard' ? 'nav-active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
            title="Dashboard - Extreme SCADA"
            role="button"
            tabIndex={0}
          >
            <img
              src="/images/Water-Control-Icon.png"
              alt="Dashboard Icon"
              className="scada-menu-img"
            />
            <span className="brand-label">Extreme SCADA</span>
          </div>

          {/* Navigation Links */}
          <nav className="scada-nav-links">
            <button
              type="button"
              className={`scada-nav-btn ${activeTab === 'dashboard' ? 'btn-active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              title="View SCADA Telemetry Dashboard"
            >
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`scada-nav-btn ${activeTab === 'users' ? 'btn-active' : ''}`}
              onClick={() => setActiveTab('users')}
              title="Manage SCADA Users"
            >
              <i className="fas fa-user"></i>
              <span>Users</span>
            </button>
          </nav>

          {/* Right Side: User Greeting & Logout */}
          <div className="scada-nav-right">
            {!loggedOut ? (
              <>
                <span className="scada-user-greeting">
                  <b>Hi</b> <i>{currentUser}</i>!
                </span>
                <button
                  type="button"
                  className="scada-logout-btn"
                  onClick={() => setShowLogoutModal(true)}
                  title="Log out of SCADA session"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                className="scada-login-btn"
                onClick={() => setLoggedOut(false)}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Original SCADA Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="scada-modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="scada-logout-modal-dialog" onClick={e => e.stopPropagation()}>
            <h2 className="logout-modal-title">Log out</h2>
            <p className="logout-modal-message">
              Are you sure you want to log out?
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="btn-logout-yes"
                onClick={handleConfirmLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Yes
              </button>
              <button
                type="button"
                className="btn-logout-no"
                onClick={() => setShowLogoutModal(false)}
              >
                <i className="fas fa-ban"></i> No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

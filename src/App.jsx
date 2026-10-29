import React, { useState } from 'react';
import { initialScadaUsers, ORIGINAL_ROLES, isActiveLast20Mins } from './mockData';
import ScadaTopBar from './components/ScadaTopBar';
import ScadaDashboard from './components/ScadaDashboard';
import AirbnbCard from './components/AirbnbCard';
import AirbnbListView from './components/AirbnbListView';
import AirbnbModal from './components/AirbnbModal';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('users'); // 'dashboard' | 'users'
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'list' (default card)
  const [users, setUsers] = useState(initialScadaUsers);
  const [searchName, setSearchName] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [favorites, setFavorites] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      showToast(updated[id] ? "Added user to starred dispatch team!" : "Removed user from starred dispatch.");
      return updated;
    });
  };

  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setIsNew(false);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsNew(true);
    setIsModalOpen(true);
  };

  const handleSave = (savedData) => {
    if (isNew) {
      setUsers([savedData, ...users]);
      showToast(`SUCCESS: Registered user ${savedData.firstName} ${savedData.lastName} to SCADA.`);
    } else {
      setUsers(users.map(u => u.userId === savedData.userId ? savedData : u));
      showToast(`SUCCESS: Saved configuration for ${savedData.firstName} ${savedData.lastName}.`);
    }
  };

  const handleDelete = (id) => {
    const target = users.find(u => u.userId === id);
    setUsers(users.filter(u => u.userId !== id));
    showToast(`REMOVED: User ${target?.firstName || ''} ${target?.lastName || ''} deleted.`);
  };

  const handleSendLink = (user) => {
    showToast(`LINK SENT: Magic login link transmitted to ${user.email}.`);
  };

  const handleResetPassword = (user) => {
    showToast(`PASSWORD RESET: Reset token transmitted to ${user.email}.`);
  };

  // Filter logic — role select + free-text search only
  const filteredUsers = users.filter(u => {
    const query = searchName.toLowerCase();
    const queryMatch =
      `${u.firstName} ${u.lastName} ${u.organization} ${u.phoneNumber} ${u.email} ${u.selectedRole}`
        .toLowerCase()
        .includes(query);

    if (!queryMatch) return false;
    if (selectedRole !== 'all' && u.selectedRole !== selectedRole) return false;

    return true;
  });

  const onDutyCount = users.filter(u => isActiveLast20Mins(u.lastActivity)).length;


  return (
    <div className="airbnb-app-root">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="airbnb-toast-banner">
          <i className="fas fa-check toast-icon"></i>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Original SCADA Navigation Topbar */}
      <ScadaTopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser="Pete"
      />

      {/* Main View Router: Dashboard or Users */}
      {activeTab === 'dashboard' ? (
        <main className="airbnb-main-content">
          <ScadaDashboard />
        </main>
      ) : (
        <>
          {/* Active in last 20 minutes banner */}
          <div style={{ padding: '20px 40px 0 40px' }}>
            <div className="active-users-banner" style={{ margin: 0 }}>
              <div className="active-banner-left">
                <span className="live-ping-dot"></span>
                <strong>Users Active in the last 20 Minutes:</strong>
                <div className="active-names-list">
                  {users.filter(u => isActiveLast20Mins(u.lastActivity)).map(u => (
                    <span key={u.userId} className="active-user-badge">
                      {u.firstName} {u.lastName}
                    </span>
                  ))}
                </div>
              </div>
              <span className="active-count-tag">{onDutyCount} Online Now</span>
            </div>
          </div>

          {/* Controls Bar: Capsule Search + Role + Add User */}
          <section style={{ padding: '16px 40px 0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            {/* Airbnb 2-Segment Capsule Search Bar */}
            <div className="airbnb-search-capsule" style={{ maxWidth: '540px' }}>
              <div className="capsule-segment">
                <span className="capsule-label">Who</span>
                <input
                  type="text"
                  placeholder="Search user name..."
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  className="capsule-input"
                />
              </div>

              <div className="capsule-divider"></div>

              <div className="capsule-segment">
                <span className="capsule-label">Role</span>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                  className="capsule-select"
                >
                  <option value="all">All Roles</option>
                  {ORIGINAL_ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <button className="capsule-search-btn" aria-label="Search">
                <i className="fas fa-search" style={{ color: 'white', fontSize: '13px' }}></i>
              </button>
            </div>

            {/* Right side controls: View Mode Toggle & Add User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* View Mode Toggle: Cards vs List */}
              <div className="airbnb-view-toggle">
                <button
                  type="button"
                  className={`airbnb-view-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                  title="Card Grid View (Default)"
                >
                  <i className="fas fa-grip-horizontal"></i> Cards
                </button>
                <button
                  type="button"
                  className={`airbnb-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Table List View"
                >
                  <i className="fas fa-list-ul"></i> List
                </button>
              </div>

              <button className="add-operator-pill-btn" onClick={handleAddNew}>
                <i className="fas fa-user-plus btn-plus" style={{ fontSize: '14px' }}></i>
                <span>Add User</span>
              </button>
            </div>
          </section>

          {/* Main Content Area */}
          <main className="airbnb-main-content">
            <div className="results-header-row">
              <div className="results-count-text">
                <span>Displaying </span>
                <strong>{filteredUsers.length} SCADA user accounts</strong>
              </div>

              {(searchName || selectedRole !== 'all') && (
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchName('');
                    setSelectedRole('all');
                  }}
                >
                  Reset all filters ✕
                </button>
              )}
            </div>

            {/* Conditional Display: 4-Column Card Grid vs List Table */}
            {filteredUsers.length > 0 ? (
              viewMode === 'card' ? (
                <div className="airbnb-cards-grid">
                  {filteredUsers.map(u => (
                    <AirbnbCard
                      key={u.userId}
                      user={u}
                      onOpenDetail={handleOpenDetail}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={!!favorites[u.userId]}
                    />
                  ))}
                </div>
              ) : (
                <AirbnbListView
                  users={filteredUsers}
                  onOpenDetail={handleOpenDetail}
                  onSendLink={handleSendLink}
                  onResetPassword={handleResetPassword}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  favorites={favorites}
                />
              )
            ) : (
              <div className="airbnb-empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No SCADA users match your criteria</h3>
                <p>Try resetting search filters.</p>
                <button
                  className="reset-btn"
                  onClick={() => {
                    setSearchName('');
                    setSelectedRole('all');
                  }}
                >
                  View All Users
                </button>
              </div>
            )}
          </main>
        </>
      )}

      {/* Detail & Edit Modal */}
      <AirbnbModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSave}
        onDelete={handleDelete}
        onSendLink={handleSendLink}
        onResetPassword={handleResetPassword}
        isNew={isNew}
      />
    </div>
  );
}

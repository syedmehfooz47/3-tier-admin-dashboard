import { useState } from 'react';
import { LogOut, LayoutDashboard, Users, Activity, CreditCard, Box } from 'lucide-react';
import UserManagement from '../components/UserManagement';
import { removeToken } from '../utils/storage';

function Dashboard({ user, setAuth, setUser }) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    removeToken();
    setAuth(false);
    setUser(null);
  };

  // Mock stats
  const stats = [
    { label: 'Total Revenue', value: '$45,231', icon: <CreditCard />, colorClass: 'purple' },
    { label: 'Active Users', value: '+2,350', icon: <Users />, colorClass: 'blue' },
    { label: 'System Health', value: '99.9%', icon: <Activity />, colorClass: 'green' },
    { label: 'Active Tasks', value: '142', icon: <Box />, colorClass: 'orange' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>AdminDash</h2>
        <ul className="nav-links">
          <li>
            <a 
              href="#" 
              className={activeTab === 'overview' ? 'active' : ''} 
              onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
            >
              <LayoutDashboard size={20} /> Overview
            </a>
          </li>
          {user.role === 'superadmin' && (
            <li>
              <a 
                href="#" 
                className={activeTab === 'users' ? 'active' : ''} 
                onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}
              >
                <Users size={20} /> Manage Users
              </a>
            </li>
          )}
        </ul>
        <button className="btn-primary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'none' }}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              Welcome back, {user.username}!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              You are currently logged in as a <span className={`user-badge ${user.role}`}>{user.role}</span>
            </p>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="fade-in">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card glass-panel">
                  <div className="stat-info">
                    <p>{stat.label}</p>
                    <h3>{stat.value}</h3>
                  </div>
                  <div className={`stat-icon ${stat.colorClass}`}>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)' }}>
              <Activity size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <h3>Activity Overview</h3>
              <p>Select a different tab or role to see more features.</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && user.role === 'superadmin' && (
          <div className="fade-in">
            <UserManagement currentUser={user} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

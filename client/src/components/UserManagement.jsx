import { useState, useEffect } from 'react';
import { Users, UserCog, User, AlertCircle, Check } from 'lucide-react';
import { getToken } from '../utils/storage';

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingRoles, setPendingRoles] = useState({});

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectChange = (userId, newRole) => {
    setPendingRoles({ ...pendingRoles, [userId]: newRole });
  };

  const handleSaveRole = async (userId) => {
    const newRole = pendingRoles[userId];
    if (!newRole) return;

    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      const updated = { ...pendingRoles };
      delete updated[userId];
      setPendingRoles(updated);
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        const updated = { ...pendingRoles };
        delete updated[userId];
        setPendingRoles(updated);
      } else {
        alert(data.message || 'Failed to update role');
      }
    } catch (err) {
      alert('An error occurred while updating role');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <UserCog size={24} color="var(--primary-color)" />
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>User Management</h3>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Current Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td style={{ fontWeight: '500' }}>{u.username}</td>
                <td>
                  <span className={`user-badge ${u.role}`}>{u.role}</span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u._id === currentUser.id ? (
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>(You)</span>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <select 
                        className="action-select"
                        value={pendingRoles[u._id] || u.role} 
                        onChange={(e) => handleSelectChange(u._id, e.target.value)}
                      >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                      {pendingRoles[u._id] && pendingRoles[u._id] !== u.role && (
                        <button 
                          onClick={() => handleSaveRole(u._id)}
                          style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                          title="Confirm Role Change"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;

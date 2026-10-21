import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Bell, LogOut, CheckCircle, 
  XCircle, PlusCircle, Trash2, Shield, User as UserIcon 
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('staffsync_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Auth form states
  const [loginEmail, setLoginEmail] = useState('admin@staffsync.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [authError, setAuthError] = useState('');

  // Forms
  const [leaveForm, setLeaveForm] = useState({ type: 'Casual', startDate: '', endDate: '', reason: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  useEffect(() => {
    if (user) {
      fetchEmployees();
      fetchLeaves();
      fetchAnnouncements();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('staffsync_token', data.token);
      localStorage.setItem('staffsync_user', JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffsync_token');
    localStorage.removeItem('staffsync_user');
    setUser(null);
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE}/leaves`);
      const data = await res.json();
      setLeaves(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;
    await fetch(`${API_BASE}/employees/${id}`, { method: 'DELETE' });
    fetchEmployees();
  };

  const updateLeaveStatus = async (id, status) => {
    await fetch(`${API_BASE}/leaves/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchLeaves();
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...leaveForm, employeeId: user.id })
    });
    setLeaveForm({ type: 'Casual', startDate: '', endDate: '', reason: '' });
    fetchLeaves();
  };

  const submitAnnouncement = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...announcementForm, author: user.name })
    });
    setAnnouncementForm({ title: '', content: '' });
    fetchAnnouncements();
  };

  // --- LOGIN SCREEN --- //
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>StaffSync HRMS</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Modern Workforce Management</p>
          </div>

          {authError && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>{authError}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Email Address</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#475569' }}>Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
            </div>

            <button type="submit" style={{ padding: '12px', background: '#2563eb', color: 'white', marginTop: '8px' }}>
              Sign In
            </button>
          </form>

          <div style={{ marginTop: '24px', padding: '12px', background: '#f8fafc', borderRadius: '6px', fontSize: '12px', color: '#64748b' }}>
            <p><strong>Quick Demo Logins:</strong></p>
            <p style={{ marginTop: '4px' }}>👑 Admin: <code>admin@staffsync.com</code> / <code>password123</code></p>
            <p style={{ marginTop: '2px' }}>👤 Staff: <code>alex@staffsync.com</code> / <code>password123</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Filter leaves for employee view
  const displayLeaves = user.role === 'Admin' ? leaves : leaves.filter(l => l.employee?._id === user.id || l.employee === user.id);
  const pendingCount = leaves.filter(l => l.status === 'Pending').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: '#2563eb', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
          <span style={{ fontWeight: '700', fontSize: '18px', color: '#0f172a' }}>StaffSync</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            {user.role === 'Admin' ? <Shield size={16} color="#4338ca" /> : <UserIcon size={16} color="#64748b" />}
            <span style={{ fontWeight: '600' }}>{user.name}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
          <button onClick={handleLogout} style={{ background: '#f1f5f9', color: '#475569', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar Navigation */}
        <aside style={{ width: '240px', background: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '20px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: activeTab === 'dashboard' ? '#eff6ff' : 'transparent', color: activeTab === 'dashboard' ? '#2563eb' : '#64748b', textAlign: 'left', width: '100%' }}>
              <Users size={18} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('leaves')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: activeTab === 'leaves' ? '#eff6ff' : 'transparent', color: activeTab === 'leaves' ? '#2563eb' : '#64748b', textAlign: 'left', width: '100%' }}>
              <Calendar size={18} /> Leave Desk
            </button>
            <button 
              onClick={() => setActiveTab('announcements')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: activeTab === 'announcements' ? '#eff6ff' : 'transparent', color: activeTab === 'announcements' ? '#2563eb' : '#64748b', textAlign: 'left', width: '100%' }}>
              <Bell size={18} /> Bulletins
            </button>
          </nav>
        </aside>

        {/* Dynamic Center Panel */}
        <main style={{ flex: 1, padding: '32px', maxWidth: '1200px' }}>
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              {/* Metrics Header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>Total Workforce</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginTop: '6px' }}>{employees.length}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>Pending Approvals</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', marginTop: '6px' }}>{pendingCount}</div>
                </div>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>Company Bulletins</div>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb', marginTop: '6px' }}>{announcements.length}</div>
                </div>
              </div>

              {/* Employee Table */}
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '14px' }}>Workforce Directory</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      {user.role === 'Admin' && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp._id}>
                        <td><strong>{emp.name}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{emp.position}</span></td>
                        <td>{emp.email}</td>
                        <td>{emp.department}</td>
                        <td><span className={`badge badge-${emp.role}`}>{emp.role}</span></td>
                        {user.role === 'Admin' && (
                          <td>
                            {emp.role !== 'Admin' && (
                              <button onClick={() => deleteEmployee(emp._id)} style={{ color: '#dc2626', background: 'transparent', padding: '4px' }}>
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: LEAVES */}
          {activeTab === 'leaves' && (
            <div style={{ display: 'grid', gridTemplateColumns: user.role === 'Admin' ? '1fr' : '320px 1fr', gap: '24px' }}>
              {/* Employee Apply Form */}
              {user.role !== 'Admin' && (
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Request Time Off</h3>
                  <form onSubmit={submitLeave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Leave Category</label>
                      <select value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}>
                        <option value="Casual">Casual Leave</option>
                        <option value="Sick">Sick Leave</option>
                        <option value="Earned">Earned Leave</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Start Date</label>
                      <input type="date" value={leaveForm.startDate} onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>End Date</label>
                      <input type="date" value={leaveForm.endDate} onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Reason</label>
                      <textarea rows={3} value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} required />
                    </div>
                    <button type="submit" style={{ padding: '10px', background: '#2563eb', color: 'white', marginTop: '6px' }}>
                      Submit Request
                    </button>
                  </form>
                </div>
              )}

              {/* Leave Records Table */}
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Reason</th>
                      <th>Status</th>
                      {user.role === 'Admin' && <th>Review</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {displayLeaves.map(leave => (
                      <tr key={leave._id}>
                        <td>{leave.employee?.name || 'Self'}</td>
                        <td>{leave.type}</td>
                        <td>{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</td>
                        <td>{leave.reason}</td>
                        <td><span className={`badge badge-${leave.status}`}>{leave.status}</span></td>
                        {user.role === 'Admin' && (
                          <td>
                            {leave.status === 'Pending' ? (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => updateLeaveStatus(leave._id, 'Approved')} style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircle size={14} /> Approve
                                </button>
                                <button onClick={() => updateLeaveStatus(leave._id, 'Rejected')} style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <XCircle size={14} /> Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Resolved</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div style={{ display: 'grid', gridTemplateColumns: user.role === 'Admin' ? '340px 1fr' : '1fr', gap: '24px' }}>
              {/* Admin Announcement Creator */}
              {user.role === 'Admin' && (
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Create Company Bulletin</h3>
                  <form onSubmit={submitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Headline</label>
                      <input type="text" placeholder="e.g. Townhall Schedule" value={announcementForm.title} onChange={e => setAnnouncementForm({ ...announcementForm, title: e.target.value })} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#64748b' }}>Details</label>
                      <textarea rows={4} placeholder="Type announcement content here..." value={announcementForm.content} onChange={e => setAnnouncementForm({ ...announcementForm, content: e.target.value })} required />
                    </div>
                    <button type="submit" style={{ padding: '10px', background: '#2563eb', color: 'white', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <PlusCircle size={16} /> Publish Bulletin
                    </button>
                  </form>
                </div>
              )}

              {/* Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {announcements.map(item => (
                  <div key={item._id} style={{ background: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{item.title}</h4>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>{item.content}</p>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>Posted by: <strong>{item.author}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
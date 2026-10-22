import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import AddEmployeeModal from './components/AddEmployeeModal';
import AttendanceWidget from './components/AttendanceWidget';
import LeaveBalanceCard from './components/LeaveBalanceCard';
import LeaveDesk from './components/LeaveDesk';
import EmployeeTable from './components/EmployeeTable';
import Bulletins from './components/Bulletins';
import AnalyticsCharts from './components/AnalyticsCharts';
import LoginScreen from './components/LoginScreen';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  // Current user state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('staffsync_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Application data
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [attendanceState, setAttendanceState] = useState({
    clockedIn: false,
    clockedOut: false,
    attendance: null,
  });
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // UI state
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [punchLoading, setPunchLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: false,
  });

  // Toast dispatch helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial data when user logs in
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    fetchEmployees();
    fetchLeaves();
    fetchAnnouncements();
    fetchAttendance();
    fetchLeaveBalance();
    fetchAnalytics();
  };

  // ----------------- API CALLS ----------------- //

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE}/leaves`);
      if (res.ok) {
        const data = await res.json();
        setLeaves(data);
      }
    } catch (err) {
      console.error('Failed to load leaves:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(`${API_BASE}/announcements`);
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Failed to load bulletins:', err);
    }
  };

  const fetchAttendance = async () => {
    if (!user) return;
    try {
      const userId = user.id || user._id;
      // Get today's state
      const res = await fetch(`${API_BASE}/attendance/today?employeeId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setAttendanceState(data);
      }

      // Get user's punch logs
      const logRes = await fetch(`${API_BASE}/attendance?employeeId=${userId}`);
      if (logRes.ok) {
        const logs = await logRes.json();
        setAttendanceLogs(logs);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    }
  };

  const fetchLeaveBalance = async () => {
    if (!user) return;
    try {
      const userId = user.id || user._id;
      const res = await fetch(`${API_BASE}/leaves/balance/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setLeaveBalance(data);
      }
    } catch (err) {
      console.error('Failed to load leave balance:', err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  // ----------------- AUTH HANDLERS ----------------- //

  const handleLogin = async (email, password) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('staffsync_token', data.token);
      localStorage.setItem('staffsync_user', JSON.stringify(data.user));
      setUser(data.user);
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${data.user.name}. Session authenticated.`,
      });
    } catch (err) {
      setAuthError(err.message);
      addToast({
        type: 'error',
        title: 'Authentication Failed',
        message: err.message,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staffsync_token');
    localStorage.removeItem('staffsync_user');
    setUser(null);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been securely signed out of StaffSync.',
    });
  };

  const handleSwitchDemoAccount = () => {
    const isAdmin = user?.role === 'Admin';
    if (isAdmin) {
      // Switch to Alex Rivera (Employee)
      handleLogin('alex@staffsync.com', 'password123');
    } else {
      // Switch to Sarah Connor (Admin)
      handleLogin('admin@staffsync.com', 'password123');
    }
  };

  // ----------------- ATTENDANCE HANDLERS ----------------- //

  const handleClockIn = async () => {
    setPunchLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await fetch(`${API_BASE}/attendance/clock-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to punch in');

      setAttendanceState({
        clockedIn: true,
        clockedOut: false,
        attendance: data,
      });

      addToast({
        type: 'success',
        title: 'Punch In Recorded',
        message: `Biometric clock-in logged at ${new Date(data.checkIn).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}. Status: ${data.status}`,
      });

      fetchAttendance();
      fetchAnalytics();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Punch Failed',
        message: err.message,
      });
    } finally {
      setPunchLoading(false);
    }
  };

  const handleClockOut = async () => {
    setPunchLoading(true);
    try {
      const userId = user.id || user._id;
      const res = await fetch(`${API_BASE}/attendance/clock-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to clock out');

      setAttendanceState({
        clockedIn: true,
        clockedOut: true,
        attendance: data,
      });

      addToast({
        type: 'success',
        title: 'Shift Completed',
        message: `Clocked out successfully. Total shift duration: ${data.workHours} hrs.`,
      });

      fetchAttendance();
      fetchAnalytics();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Clock Out Error',
        message: err.message,
      });
    } finally {
      setPunchLoading(false);
    }
  };

  // ----------------- EMPLOYEE HANDLERS ----------------- //

  const handleAddEmployee = async (formData) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add employee');

    setEmployees((prev) => [data, ...prev]);
    addToast({
      type: 'success',
      title: 'Employee Provisioned',
      message: `${data.name} added to ${data.department} with active credentials.`,
    });
    fetchAnalytics();
  };

  const handleDeleteEmployee = (emp) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Workforce Member',
      message: `Are you sure you want to deactivate and remove ${emp.name} (${emp.email})? This action will archive all associated leave records and attendance logs.`,
      confirmText: 'Remove Employee',
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/employees/${emp._id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete employee');

          setEmployees((prev) => prev.filter((e) => e._id !== emp._id));
          addToast({
            type: 'info',
            title: 'Employee Removed',
            message: `${emp.name} has been successfully deleted from directory.`,
          });
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
          fetchAnalytics();
        } catch (err) {
          addToast({ type: 'error', title: 'Action Failed', message: err.message });
        }
      },
    });
  };

  // ----------------- LEAVE HANDLERS ----------------- //

  const handleSubmitLeave = async (form) => {
    const userId = user.id || user._id;
    const res = await fetch(`${API_BASE}/leaves`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, employeeId: userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit leave');

    setLeaves((prev) => [data, ...prev]);
    addToast({
      type: 'success',
      title: 'Leave Request Submitted',
      message: `Your ${form.type} leave application has been routed to HR for review.`,
    });
    fetchLeaveBalance();
    fetchAnalytics();
  };

  const handleUpdateLeaveStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update leave');

      setLeaves((prev) => prev.map((l) => (l._id === id ? data : l)));
      addToast({
        type: status === 'Approved' ? 'success' : 'info',
        title: `Leave ${status}`,
        message: `Leave application for ${data.employee?.name || 'Staff'} marked as ${status}.`,
      });
      fetchLeaveBalance();
      fetchAnalytics();
    } catch (err) {
      addToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  // ----------------- BULLETIN HANDLERS ----------------- //

  const handleSubmitAnnouncement = async (postData) => {
    const res = await fetch(`${API_BASE}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to post bulletin');

    setAnnouncements((prev) => [data, ...prev]);
    addToast({
      type: 'success',
      title: 'Bulletin Broadcasted',
      message: `"${data.title}" is now visible to all workforce members.`,
    });
  };

  const handleDeleteAnnouncement = (id) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Bulletin',
      message: 'Are you sure you want to delete this company announcement from all feeds?',
      confirmText: 'Delete Bulletin',
      isDanger: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}/announcements/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Failed to delete announcement');

          setAnnouncements((prev) => prev.filter((a) => a._id !== id));
          addToast({
            type: 'info',
            title: 'Bulletin Removed',
            message: 'Announcement deleted successfully.',
          });
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        } catch (err) {
          addToast({ type: 'error', title: 'Delete Failed', message: err.message });
        }
      },
    });
  };

  // --- RENDER LOGIN IF NOT LOGGED IN --- //
  if (!user) {
    return (
      <>
        <Toast toasts={toasts} removeToast={removeToast} />
        <LoginScreen onLogin={handleLogin} authError={authError} loading={authLoading} />
      </>
    );
  }

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-app)' }}>
      {/* Toast Notification Container */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        isDanger={confirmDialog.isDanger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      {/* Modern Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        pendingLeavesCount={pendingCount}
        onLogout={handleLogout}
        onSwitchDemoAccount={handleSwitchDemoAccount}
      />

      {/* Main Workspace Frame */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          user={user}
          pendingLeavesCount={pendingCount}
          onOpenMobileMenu={() => {}}
        />

        {/* Dynamic Center Panel */}
        <main style={{ flex: 1, padding: '28px 32px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          
          {/* TAB 1: EXECUTIVE OVERVIEW / DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* If Admin: show full analytics cards & charts */}
              {user.role === 'Admin' ? (
                <>
                  <AnalyticsCharts
                    analyticsData={analyticsData}
                    totalEmployees={employees.length}
                    pendingLeaves={pendingCount}
                    bulletinsCount={announcements.length}
                  />

                  {/* Quick Attendance Widget & Directory Preview */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 400px) 1fr', gap: '24px', alignItems: 'start' }}>
                    <AttendanceWidget
                      user={user}
                      attendanceState={attendanceState}
                      onClockIn={handleClockIn}
                      onClockOut={handleClockOut}
                      attendanceLogs={attendanceLogs}
                      loading={punchLoading}
                    />

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Workforce Roster</h3>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>Quick member directory & actions</p>
                        </div>
                        <button onClick={() => setActiveTab('directory')} className="btn btn-secondary btn-sm">
                          View All ({employees.length})
                        </button>
                      </div>
                      <EmployeeTable
                        employees={employees.slice(0, 5)}
                        currentUser={user}
                        onDeleteEmployee={handleDeleteEmployee}
                        onOpenAddModal={() => setIsAddEmployeeOpen(true)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* If Employee: show Clock-In Widget + Leave Balances + Bulletins */
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 420px) 1fr', gap: '24px', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <AttendanceWidget
                      user={user}
                      attendanceState={attendanceState}
                      onClockIn={handleClockIn}
                      onClockOut={handleClockOut}
                      attendanceLogs={attendanceLogs}
                      loading={punchLoading}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <LeaveBalanceCard
                      leaveBalance={leaveBalance}
                      onApplyClick={() => setActiveTab('leaves')}
                    />

                    <Bulletins
                      user={user}
                      announcements={announcements.slice(0, 2)}
                      onSubmitAnnouncement={handleSubmitAnnouncement}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WORKFORCE DIRECTORY */}
          {activeTab === 'directory' && (
            <div>
              <EmployeeTable
                employees={employees}
                currentUser={user}
                onDeleteEmployee={handleDeleteEmployee}
                onOpenAddModal={() => setIsAddEmployeeOpen(true)}
              />
            </div>
          )}

          {/* TAB 3: ATTENDANCE & PUNCH DESK */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 440px) 1fr', gap: '24px', alignItems: 'start' }}>
              <AttendanceWidget
                user={user}
                attendanceState={attendanceState}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                attendanceLogs={attendanceLogs}
                loading={punchLoading}
              />

              <div className="card" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Punch Log History</h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Audited biometric check-in & check-out ledger</p>
                </div>

                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Total Hours</th>
                        <th>Shift Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                            No attendance logs recorded yet.
                          </td>
                        </tr>
                      ) : (
                        attendanceLogs.map((log) => (
                          <tr key={log._id}>
                            <td style={{ fontWeight: '500', color: '#0f172a' }}>{log.date}</td>
                            <td>
                              {log.checkIn
                                ? new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '--:--'}
                            </td>
                            <td>
                              {log.checkOut
                                ? new Date(log.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : '--:--'}
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#0f172a' }}>
                              {log.workHours > 0 ? `${log.workHours} hrs` : 'In Progress'}
                            </td>
                            <td>
                              <span className={`badge badge-${log.status}`}>
                                <span className="badge-dot" /> {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LEAVE DESK */}
          {activeTab === 'leaves' && (
            <LeaveDesk
              user={user}
              leaves={leaves}
              leaveBalance={leaveBalance}
              onSubmitLeave={handleSubmitLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
            />
          )}

          {/* TAB 5: BULLETINS */}
          {activeTab === 'bulletins' && (
            <Bulletins
              user={user}
              announcements={announcements}
              onSubmitAnnouncement={handleSubmitAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
            />
          )}

          {/* TAB 6: ANALYTICS (ADMIN) */}
          {activeTab === 'analytics' && user.role === 'Admin' && (
            <AnalyticsCharts
              analyticsData={analyticsData}
              totalEmployees={employees.length}
              pendingLeaves={pendingCount}
              bulletinsCount={announcements.length}
            />
          )}

        </main>
      </div>
    </div>
  );
}

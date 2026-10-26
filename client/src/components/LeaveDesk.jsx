import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  User,
  Filter,
  AlertCircle,
} from 'lucide-react';
import LeaveBalanceCard from './LeaveBalanceCard';

export default function LeaveDesk({
  user,
  leaves = [],
  leaveBalance,
  onSubmitLeave,
  onUpdateLeaveStatus,
  loading = false,
}) {
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitLeave(leaveForm);
      setLeaveForm({ type: 'Casual', startDate: '', endDate: '', reason: '' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter leaves
  const displayLeaves = leaves.filter((l) => {
    // If not admin, only show user's leaves
    const isOwner =
      l.employee?._id === user?.id ||
      l.employee?._id === user?._id ||
      l.employee === user?.id ||
      l.employee === user?._id;

    const matchesUser = user?.role === 'Admin' ? true : isOwner;
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesUser && matchesStatus;
  });

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) ? 1 : Math.max(1, diff);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Leave Balance Tracker (Top Section) */}
      <LeaveBalanceCard leaveBalance={leaveBalance} />

      {/* Main Grid: Form + Leaves Table */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: user?.role === 'Admin' ? '1fr' : '340px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Request Time Off Form (For Employees) */}
        {user?.role !== 'Admin' && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: '#eef2ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Request Time-Off</h3>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Submit vacation or sick leave request</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label>Leave Category</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                >
                  <option value="Casual">Casual Leave (Personal & Family)</option>
                  <option value="Sick">Sick / Medical Leave</option>
                  <option value="Earned">Earned / Annual Vacation</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label>End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label>Reason / Justification</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide brief context for the manager..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              >
                <Send size={15} /> {submitting ? 'Submitting...' : 'Submit Leave Request'}
              </button>
            </form>
          </div>
        )}

        {/* Leaves Records Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                background: '#f1f5f9',
                padding: '3px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  style={{
                    background: statusFilter === status ? '#ffffff' : 'transparent',
                    color: statusFilter === status ? '#0f172a' : '#64748b',
                    boxShadow: statusFilter === status ? 'var(--shadow-xs)' : 'none',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: statusFilter === status ? '600' : '500',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '12.5px', color: '#64748b' }}>
              Showing {displayLeaves.length} records
            </span>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Workforce Member</th>
                    <th>Category</th>
                    <th>Duration & Dates</th>
                    <th>Reason</th>
                    <th>Status</th>
                    {user?.role === 'Admin' && <th style={{ textAlign: 'right' }}>Review Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayLeaves.length === 0 ? (
                    <tr>
                      <td colSpan={user?.role === 'Admin' ? 6 : 5} style={{ textAlign: 'center', padding: '36px' }}>
                        <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                          No leave applications recorded under this filter.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayLeaves.map((l) => {
                      const daysCount = calculateDays(l.startDate, l.endDate);
                      const empName = l.employee?.name || user?.name || 'Self';
                      const empDept = l.employee?.department || user?.department || 'General';

                      return (
                        <tr key={l._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  background: '#eef2ff',
                                  color: '#4f46e5',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                }}
                              >
                                {empName[0]}
                              </div>
                              <div>
                                <strong style={{ color: '#0f172a' }}>{empName}</strong>
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>{empDept}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                color: '#334155',
                                fontWeight: '500',
                              }}
                            >
                              {l.type} Leave
                            </span>
                          </td>

                          <td>
                            <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>
                              {new Date(l.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} -{' '}
                              {new Date(l.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                              {daysCount} {daysCount === 1 ? 'day' : 'days'}
                            </div>
                          </td>

                          <td style={{ maxWidth: '240px' }}>
                            <span style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                              {l.reason}
                            </span>
                          </td>

                          <td>
                            <span className={`badge badge-${l.status}`}>
                              <span className="badge-dot" /> {l.status}
                            </span>
                          </td>

                          {user?.role === 'Admin' && (
                            <td style={{ textAlign: 'right' }}>
                              {l.status === 'Pending' ? (
                                <div style={{ display: 'inline-flex', gap: '6px' }}>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateLeaveStatus(l._id, 'Approved')}
                                    className="btn btn-success btn-sm"
                                    title="Approve leave"
                                  >
                                    <CheckCircle2 size={13} /> Approve
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateLeaveStatus(l._id, 'Rejected')}
                                    className="btn btn-danger btn-sm"
                                    title="Reject leave"
                                  >
                                    <XCircle size={13} /> Reject
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                  Reviewed
                                </span>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
} from 'lucide-react';

const DEPARTMENTS = ['All', 'Engineering', 'Design', 'Human Resources', 'Marketing', 'Sales', 'Customer Success'];

export default function EmployeeTable({
  employees = [],
  currentUser,
  onDeleteEmployee,
  onOpenAddModal,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        !searchTerm.trim() ||
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchRole = selectedRole === 'All' || emp.role === selectedRole;

      return matchSearch && matchDept && matchRole;
    });
  }, [employees, searchTerm, selectedDept, selectedRole]);

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredEmployees, sortField, sortOrder]);

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={12} color="var(--text-muted)" />;
    return sortOrder === 'asc' ? <ArrowUp size={12} color="#2C666E" /> : <ArrowDown size={12} color="#2C666E" />;
  };

  const formatCurrency = (val) => {
    if (!val) return '$60,000';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const getInitials = (name = '') => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'U').toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
          {/* Live Search Input */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '34px', fontSize: '13px' }}
            />
          </div>

          {/* Department Filter Dropdown */}
          <div style={{ width: '180px' }}>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ fontSize: '13px' }}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter Pills */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-subtle)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            {['All', 'Admin', 'Employee'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                style={{
                  background: selectedRole === role ? '#ffffff' : 'transparent',
                  color: selectedRole === role ? '#07393C' : 'var(--text-secondary)',
                  boxShadow: selectedRole === role ? 'var(--shadow-xs)' : 'none',
                  padding: '5px 10px',
                  fontSize: '12px',
                  fontWeight: selectedRole === role ? '700' : '500',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button: Add Employee */}
        {currentUser?.role === 'Admin' && (
          <button onClick={onOpenAddModal} className="btn btn-primary" style={{ gap: '6px' }}>
            <UserPlus size={15} /> Add Employee
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="table-wrapper">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Team Member {getSortIcon('name')}
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('email')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Email {getSortIcon('email')}
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('department')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Department {getSortIcon('department')}
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('position')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Designation {getSortIcon('position')}
                  </div>
                </th>
                {currentUser?.role === 'Admin' && (
                  <th className="sortable" onClick={() => handleSort('salary')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Compensation {getSortIcon('salary')}
                    </div>
                  </th>
                )}
                <th>Status</th>
                <th>Role</th>
                {currentUser?.role === 'Admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={currentUser?.role === 'Admin' ? 8 : 6} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
                      No workforce members found matching the specified search criteria.
                    </div>
                    {(searchTerm || selectedDept !== 'All' || selectedRole !== 'All') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedDept('All');
                          setSelectedRole('All');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '12px' }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((emp) => {
                  const initials = getInitials(emp.name);
                  const isCurrentAuthUser = emp._id === currentUser?.id || emp._id === currentUser?._id;

                  return (
                    <tr key={emp._id}>
                      {/* Name & Avatar */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              background: '#EAF2F3',
                              color: '#2C666E',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '700',
                              fontSize: '12.5px',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '13.5px' }}>
                              {emp.name} {isCurrentAuthUser && <span style={{ color: '#2C666E', fontSize: '11px' }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{emp.position || 'Staff'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Mail size={13} color="var(--text-muted)" />
                          <span>{emp.email}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td>
                        <span
                          style={{
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: 'var(--text-primary)',
                            fontWeight: '600',
                          }}
                        >
                          {emp.department || 'General'}
                        </span>
                      </td>

                      {/* Designation */}
                      <td>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{emp.position}</span>
                      </td>

                      {/* Compensation (Admin only) */}
                      {currentUser?.role === 'Admin' && (
                        <td>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {formatCurrency(emp.salary)}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      <td>
                        <span className="badge badge-Active">
                          <span className="badge-dot"></span> Active
                        </span>
                      </td>

                      {/* Role Badge */}
                      <td>
                        <span className={`badge badge-${emp.role}`}>
                          {emp.role}
                        </span>
                      </td>

                      {/* Actions */}
                      {currentUser?.role === 'Admin' && (
                        <td style={{ textAlign: 'right' }}>
                          {!isCurrentAuthUser && emp.role !== 'Admin' ? (
                            <button
                              type="button"
                              onClick={() => onDeleteEmployee(emp)}
                              className="btn btn-ghost"
                              style={{ color: '#dc2626', padding: '6px' }}
                              title="Remove Employee"
                            >
                              <Trash2 size={15} />
                            </button>
                          ) : (
                            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Protected</span>
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

        {/* Table Footer Count */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            Showing <strong>{sortedEmployees.length}</strong> of <strong>{employees.length}</strong> workforce members
          </span>
          <span style={{ fontSize: '11.5px' }}>StaffSync Directory Engine v2.4</span>
        </div>
      </div>
    </div>
  );
}

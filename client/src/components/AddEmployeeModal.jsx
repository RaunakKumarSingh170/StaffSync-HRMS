import React, { useState } from 'react';
import { UserPlus, X, Briefcase, Mail, User, DollarSign, Shield } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Design', 'Human Resources', 'Marketing', 'Sales', 'Customer Success'];
const ROLES = ['Employee', 'Admin'];

export default function AddEmployeeModal({ isOpen, onClose, onAddEmployee }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    position: '',
    salary: '',
    role: 'Employee',
    password: 'password123',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.position.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onAddEmployee(formData);
      onClose();
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        position: '',
        salary: '',
        role: 'Employee',
        password: 'password123',
      });
    } catch (err) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        style={{ maxWidth: '500px', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#EAF2F3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2C666E',
              }}
            >
              <UserPlus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>Add Team Member</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Provision a new employee profile in StaffSync</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fff1f2',
              color: '#be123c',
              border: '1px solid #fecdd3',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#2C666E" /> Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Maya Lin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="#2C666E" /> Corporate Email *
            </label>
            <input
              type="email"
              required
              placeholder="maya.lin@staffsync.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={14} color="#2C666E" /> Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="#2C666E" /> Access Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div>
              <label>Job Title / Position *</label>
              <input
                type="text"
                required
                placeholder="Senior Architect"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={14} color="#2C666E" /> Base Salary ($)
              </label>
              <input
                type="number"
                placeholder="85000"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>

          <div
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              padding: '10px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Default temporary password will be <code>password123</code>. The employee can update it upon initial login.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

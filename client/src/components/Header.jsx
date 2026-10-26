import React from 'react';
import { Menu, Bell, Shield, User as UserIcon, Sparkles } from 'lucide-react';

const TAB_TITLES = {
  dashboard: { title: 'Executive Overview', desc: 'Real-time metrics, workforce KPIs and attendance' },
  directory: { title: 'Workforce Directory', desc: 'Manage departments, positions, compensation, and access' },
  attendance: { title: 'Attendance & Punch Tracker', desc: 'Biometric time records, daily shifts, and logs' },
  leaves: { title: 'Time-Off & Leave Desk', desc: 'Manage vacation quotas, sick leaves, and approvals' },
  bulletins: { title: 'Company Bulletins', desc: 'Official broadcasts, townhall notes, and announcements' },
  analytics: { title: 'Workforce Analytics', desc: 'Deep-dive charts, department distributions, and trends' },
};

export default function Header({
  activeTab,
  user,
  onOpenMobileMenu,
  pendingLeavesCount = 0,
}) {
  const current = TAB_TITLES[activeTab] || { title: 'Workspace', desc: 'Enterprise management' };

  return (
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="btn btn-ghost hide-on-desktop"
          style={{ padding: '6px', display: 'none' }}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
              {current.title}
            </h1>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '1px' }}>
            {current.desc}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick notification bell */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              background: '#f8fafc',
            }}
          >
            <Bell size={16} />
          </div>
          {pendingLeavesCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f59e0b',
                border: '2px solid #ffffff',
              }}
            />
          )}
        </div>

        {/* User quick badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 10px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            fontSize: '12.5px',
          }}
        >
          {user?.role === 'Admin' ? (
            <Shield size={14} color="#4f46e5" />
          ) : (
            <UserIcon size={14} color="#0284c7" />
          )}
          <span style={{ fontWeight: '600', color: '#1e293b' }}>{user?.name}</span>
          <span className={`badge badge-${user?.role}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
            {user?.role}
          </span>
        </div>
      </div>
    </header>
  );
}

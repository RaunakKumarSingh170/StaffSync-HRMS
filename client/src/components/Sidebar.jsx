import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  Megaphone,
  BarChart3,
  LogOut,
  Shield,
  User as UserIcon,
  ChevronRight,
  Sparkles,
  Building2,
  RefreshCw,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  pendingLeavesCount = 0,
  onLogout,
  onSwitchDemoAccount,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'directory', label: 'Workforce Directory', icon: Users },
    { id: 'attendance', label: 'Attendance & Punch', icon: Clock },
    {
      id: 'leaves',
      label: 'Leave Desk',
      icon: Calendar,
      badge: pendingLeavesCount > 0 ? pendingLeavesCount : null,
      badgeType: 'amber',
    },
    { id: 'bulletins', label: 'Bulletins & Notices', icon: Megaphone },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 });
  }

  const getInitials = (name = '') => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || 'U').toUpperCase();
  };

  return (
    <aside
      style={{
        width: '264px',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid #1e293b',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Top Brand Header */}
      <div>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 10px rgba(79, 70, 229, 0.4)',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.02em', color: '#ffffff' }}>
                  StaffSync
                </span>
                <span
                  style={{
                    background: '#1e293b',
                    color: '#93c5fd',
                    fontSize: '9.5px',
                    fontWeight: '700',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    border: '1px solid #334155',
                    letterSpacing: '0.04em',
                  }}
                >
                  ENTERPRISE
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                <Building2 size={11} /> Acme Global Corp
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: '16px 12px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px 8px' }}>
            Workforce Platform
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#1e293b' : 'transparent',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? '600' : '500',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '0px',
                          width: '3px',
                          height: '18px',
                          borderRadius: '0 4px 4px 0',
                          background: '#4f46e5',
                        }}
                      />
                    )}
                    <Icon size={16} color={isActive ? '#818cf8' : '#64748b'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      style={{
                        background: '#f59e0b',
                        color: '#0f172a',
                        fontWeight: '700',
                        fontSize: '10.5px',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        lineHeight: '1.2',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Session Card */}
      <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
        {/* Quick Demo Switcher */}
        {onSwitchDemoAccount && (
          <button
            type="button"
            onClick={onSwitchDemoAccount}
            style={{
              width: '100%',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '6px 10px',
              color: '#93c5fd',
              fontSize: '11.5px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '12px',
              transition: 'background 0.15s ease',
            }}
            title="Switch between Admin (Sarah) and Staff (Alex Rivera)"
          >
            <RefreshCw size={12} />
            Switch to {user?.role === 'Admin' ? 'Staff View' : 'Admin View'}
          </button>
        )}

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(30, 41, 59, 0.6)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: user?.role === 'Admin' ? '#4f46e5' : '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              {getInitials(user?.name)}
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {user?.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
                <span
                  style={{
                    background: user?.role === 'Admin' ? '#3730a3' : '#1e293b',
                    color: user?.role === 'Admin' ? '#c7d2fe' : '#94a3b8',
                    padding: '0 4px',
                    borderRadius: '3px',
                    fontSize: '9.5px',
                    fontWeight: '600',
                  }}
                >
                  {user?.role}
                </span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.department}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s',
            }}
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

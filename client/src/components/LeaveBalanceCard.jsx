import React from 'react';
import { Calendar, Palmtree, Stethoscope, Compass, Plus } from 'lucide-react';

// Circular Progress Ring component
function ProgressRing({ radius = 28, stroke = 4, progress = 0, strokeColor = '#4f46e5' }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        stroke="#f1f5f9"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={strokeColor}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
}

export default function LeaveBalanceCard({ leaveBalance, onApplyClick }) {
  const balance = leaveBalance || {
    casual: { total: 12, used: 2, pending: 1, remaining: 10 },
    sick: { total: 10, used: 2, pending: 0, remaining: 8 },
    earned: { total: 15, used: 1, pending: 0, remaining: 14 },
  };

  const categories = [
    {
      key: 'casual',
      name: 'Casual Leave',
      icon: Palmtree,
      color: '#4f46e5',
      lightBg: '#eef2ff',
      data: balance.casual,
    },
    {
      key: 'sick',
      name: 'Sick & Medical',
      icon: Stethoscope,
      color: '#10b981',
      lightBg: '#ecfdf5',
      data: balance.sick,
    },
    {
      key: 'earned',
      name: 'Earned / Vacation',
      icon: Compass,
      color: '#f59e0b',
      lightBg: '#fffbeb',
      data: balance.earned,
    },
  ];

  return (
    <div className="card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#f0fdf4',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Leave Balance Allocation</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Current fiscal year time-off quotas</p>
          </div>
        </div>

        {onApplyClick && (
          <button onClick={onApplyClick} className="btn btn-secondary btn-sm" style={{ gap: '4px' }}>
            <Plus size={14} /> Request Leave
          </button>
        )}
      </div>

      {/* Progress Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const total = cat.data?.total || 12;
          const remaining = cat.data?.remaining !== undefined ? cat.data.remaining : total;
          const used = cat.data?.used || 0;
          const percentRemaining = total > 0 ? Math.round((remaining / total) * 100) : 0;

          return (
            <div
              key={cat.key}
              style={{
                background: '#fafbfc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: cat.lightBg,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{cat.name}</span>
                </div>

                {/* Progress Ring */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ProgressRing radius={20} stroke={3.5} progress={percentRemaining} strokeColor={cat.color} />
                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '9px',
                      fontWeight: '700',
                      color: '#475569',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {percentRemaining}%
                  </span>
                </div>
              </div>

              {/* Big metric */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>
                    {remaining}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>/ {total} days left</span>
                </div>

                {/* Meter track */}
                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    background: '#e2e8f0',
                    borderRadius: '999px',
                    marginTop: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentRemaining}%`,
                      background: cat.color,
                      borderRadius: '999px',
                      transition: 'width 0.4s ease-out',
                    }}
                  ></div>
                </div>
              </div>

              {/* Breakdown details */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: '#64748b',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '8px',
                }}
              >
                <span>Used: <strong>{used}d</strong></span>
                {cat.data?.pending > 0 && (
                  <span style={{ color: '#d97706' }}>Pending: <strong>{cat.data.pending}d</strong></span>
                )}
                <span>Total: <strong>{total}d</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

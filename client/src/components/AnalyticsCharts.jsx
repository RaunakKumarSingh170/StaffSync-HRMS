import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Users, UserCheck, CalendarClock, Megaphone, TrendingUp, ArrowUpRight } from 'lucide-react';

const DEPARTMENT_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

// Custom Tooltip for Charts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#0f172a',
          color: '#ffffff',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '12px',
          border: '1px solid #334155',
        }}
      >
        <p style={{ fontWeight: '600', marginBottom: '2px' }}>{label || payload[0].name}</p>
        <p style={{ color: '#93c5fd' }}>
          {payload[0].name || 'Value'}: <strong>{payload[0].value}</strong>
        </p>
      </div>
    );
  }
  return null;
}

export default function AnalyticsCharts({ analyticsData, totalEmployees = 0, pendingLeaves = 0, bulletinsCount = 0 }) {
  const defaultDeptData = [
    { name: 'Engineering', count: 3 },
    { name: 'Design', count: 1 },
    { name: 'Marketing', count: 2 },
    { name: 'Human Resources', count: 1 },
    { name: 'Sales', count: 1 },
    { name: 'Customer Success', count: 1 },
  ];

  const defaultTrends = [
    { month: 'Jun', applications: 2 },
    { month: 'Jul', applications: 4 },
    { month: 'Aug', applications: 3 },
    { month: 'Sep', applications: 6 },
    { month: 'Oct', applications: 5 },
    { month: 'Nov', applications: 8 },
  ];

  const deptData =
    analyticsData?.departmentDistribution && analyticsData.departmentDistribution.length > 0
      ? analyticsData.departmentDistribution
      : defaultDeptData;

  const trendsData =
    analyticsData?.leaveTrends && analyticsData.leaveTrends.length > 0
      ? analyticsData.leaveTrends
      : defaultTrends;

  const attendanceRate = analyticsData?.attendanceRate || 88;
  const activeToday = analyticsData?.activeToday || 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dynamic Metric Cards with Trend Badges */}
      <div className="grid-cols-auto-fit">
        {/* Metric 1 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Total Workforce</span>
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
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginTop: '10px', letterSpacing: '-0.02em' }}>
            {totalEmployees || analyticsData?.totalEmployees || 9}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                background: '#ecfdf5',
                color: '#059669',
                fontSize: '11.5px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <ArrowUpRight size={13} /> +12.5%
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>vs last quarter</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Punch-In Attendance</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginTop: '10px', letterSpacing: '-0.02em' }}>
            {attendanceRate}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                background: '#ecfdf5',
                color: '#059669',
                fontSize: '11.5px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <ArrowUpRight size={13} /> {activeToday} Present
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>checked in today</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Pending Leave Approvals</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarClock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', marginTop: '10px', letterSpacing: '-0.02em' }}>
            {pendingLeaves}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span
              style={{
                background: pendingLeaves > 0 ? '#fef3c7' : '#f1f5f9',
                color: pendingLeaves > 0 ? '#b45309' : '#64748b',
                fontSize: '11.5px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {pendingLeaves > 0 ? 'Requires Action' : 'All clear'}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>awaiting manager review</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748b' }}>Active Bulletins</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Megaphone size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginTop: '10px', letterSpacing: '-0.02em' }}>
            {bulletinsCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span
              style={{
                background: '#f1f5f9',
                color: '#475569',
                fontSize: '11.5px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Company-wide
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>broadcasted notice</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Department Distribution Donut */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
              Workforce Department Distribution
            </h4>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>Headcount allocation across business units</p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Leave Application Trends Area Chart */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
              Leave Application Volume Trends
            </h4>
            <p style={{ fontSize: '12.5px', color: '#64748b' }}>Monthly distribution of employee time-off requests</p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11.5} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11.5} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

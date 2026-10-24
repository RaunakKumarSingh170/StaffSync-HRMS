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
import { Users, UserCheck, CalendarClock, Megaphone, ArrowUpRight } from 'lucide-react';

const DEPARTMENT_COLORS = ['#2C666E', '#07393C', '#90DDF0', '#56949F', '#10b981', '#f59e0b', '#e11d48'];

// Custom Tooltip for Charts
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#07393C',
          color: '#F0EDEE',
          padding: '8px 12px',
          borderRadius: '6px',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '12px',
          border: '1px solid #144D50',
        }}
      >
        <p style={{ fontWeight: '700', marginBottom: '2px' }}>{label || payload[0].name}</p>
        <p style={{ color: '#90DDF0' }}>
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
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Workforce</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#EAF2F3',
                color: '#2C666E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '10px', letterSpacing: '-0.02em' }}>
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
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <ArrowUpRight size={13} /> +12.5%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>vs last quarter</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Punch-In Attendance</span>
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
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '10px', letterSpacing: '-0.02em' }}>
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
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              <ArrowUpRight size={13} /> {activeToday} Present
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>checked in today</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Pending Leave Approvals</span>
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
                background: pendingLeaves > 0 ? '#fef3c7' : 'var(--bg-subtle)',
                color: pendingLeaves > 0 ? '#b45309' : 'var(--text-secondary)',
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {pendingLeaves > 0 ? 'Requires Action' : 'All clear'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>awaiting manager review</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Active Bulletins</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#EAF2F3',
                color: '#2C666E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Megaphone size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '10px', letterSpacing: '-0.02em' }}>
            {bulletinsCount}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
            <span
              style={{
                background: 'var(--bg-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '11.5px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Company-wide
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>broadcasted notice</span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Department Distribution Donut */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Workforce Department Distribution
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Headcount allocation across business units</p>
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
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Leave Application Volume Trends
            </h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Monthly distribution of employee time-off requests</p>
          </div>

          <div style={{ height: '260px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2C666E" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2C666E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11.5} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11.5} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  name="Applications"
                  stroke="#2C666E"
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

import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, CheckCircle, Calendar, History, ArrowRight } from 'lucide-react';

export default function AttendanceWidget({
  user,
  attendanceState,
  onClockIn,
  onClockOut,
  attendanceLogs = [],
  loading = false,
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedDuration, setElapsedDuration] = useState('00h 00m 00s');

  // Update real-time clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live elapsed duration if currently clocked in and not clocked out
  useEffect(() => {
    if (!attendanceState?.clockedIn || attendanceState?.clockedOut || !attendanceState?.attendance?.checkIn) {
      if (attendanceState?.attendance?.workHours) {
        setElapsedDuration(`${attendanceState.attendance.workHours} hrs`);
      }
      return;
    }

    const updateElapsed = () => {
      const checkInTime = new Date(attendanceState.attendance.checkIn).getTime();
      const now = Date.now();
      const diffMs = Math.max(0, now - checkInTime);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');
      setElapsedDuration(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [attendanceState]);

  const formatTime = (dateObj) => {
    if (!dateObj) return '--:--';
    return new Date(dateObj).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isClockedIn = attendanceState?.clockedIn;
  const isClockedOut = attendanceState?.clockedOut;
  const currentRecord = attendanceState?.attendance;

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header with live clock */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <Clock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Attendance Punch Desk</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Daily biometric time tracking & shifts
              </p>
            </div>
          </div>
        </div>

        {/* Live Digital Clock Badge */}
        <div
          style={{
            background: '#0f172a',
            color: '#f8fafc',
            padding: '6px 14px',
            borderRadius: '8px',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.05em' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-sans)', marginTop: '1px' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Status Center Banner */}
      <div
        style={{
          background: isClockedIn && !isClockedOut ? '#f0fdf4' : isClockedOut ? '#f8fafc' : '#f8fafc',
          border: `1px solid ${isClockedIn && !isClockedOut ? '#bbf7d0' : '#e2e8f0'}`,
          borderRadius: '10px',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px' }}>
            CURRENT SHIFT STATUS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isClockedIn && !isClockedOut && (
              <span className={`badge badge-${currentRecord?.status || 'Present'}`}>
                <span className="badge-dot" style={{ animation: 'pulse 1.5s infinite' }}></span>
                Shift In Progress ({currentRecord?.status || 'Present'})
              </span>
            )}
            {isClockedIn && isClockedOut && (
              <span className="badge badge-Approved">
                <CheckCircle size={12} /> Shift Completed ({currentRecord?.status})
              </span>
            )}
            {!isClockedIn && (
              <span className="badge badge-Pending">
                <span className="badge-dot"></span> Not Clocked In Today
              </span>
            )}
          </div>
        </div>

        {/* Live Duration Counter */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>
            {isClockedOut ? 'TOTAL LOGGED' : 'ACTIVE SESSION'}
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              color: isClockedIn && !isClockedOut ? '#16a34a' : '#0f172a',
            }}
          >
            {isClockedIn ? elapsedDuration : '00h 00m 00s'}
          </div>
        </div>
      </div>

      {/* Metrics Row: In / Out / Shift Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ background: '#fafbfc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>FIRST IN</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>
            {currentRecord?.checkIn ? formatTime(currentRecord.checkIn) : '--:--'}
          </div>
        </div>

        <div style={{ background: '#fafbfc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>LAST OUT</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>
            {currentRecord?.checkOut ? formatTime(currentRecord.checkOut) : '--:--'}
          </div>
        </div>

        <div style={{ background: '#fafbfc', border: '1px solid #f1f5f9', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>EXPECTED</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>
            8.0 hrs / Day
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {!isClockedIn ? (
          <button
            onClick={onClockIn}
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Play size={16} fill="currentColor" /> {loading ? 'Logging Punch...' : 'Punch In Now'}
          </button>
        ) : !isClockedOut ? (
          <button
            onClick={onClockOut}
            disabled={loading}
            className="btn btn-danger btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <Square size={16} fill="currentColor" /> {loading ? 'Clocking Out...' : 'Punch Out & End Shift'}
          </button>
        ) : (
          <div
            style={{
              width: '100%',
              padding: '12px',
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '13px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle size={16} color="#10b981" />
            Today's workday punch has been successfully recorded and closed.
          </div>
        )}
      </div>

      {/* Attendance History Preview */}
      {attendanceLogs && attendanceLogs.length > 0 && (
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={14} /> Recent Work Logs
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {attendanceLogs.slice(0, 3).map((log) => (
              <div
                key={log._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  background: '#fafbfc',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={13} color="#94a3b8" />
                  <span style={{ fontWeight: '500', color: '#1e293b' }}>{log.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#64748b' }}>
                    {formatTime(log.checkIn)} - {formatTime(log.checkOut)}
                  </span>
                  <span style={{ fontWeight: '600', color: '#0f172a' }}>
                    {log.workHours > 0 ? `${log.workHours}h` : 'Active'}
                  </span>
                  <span className={`badge badge-${log.status}`} style={{ fontSize: '10.5px', padding: '2px 6px' }}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

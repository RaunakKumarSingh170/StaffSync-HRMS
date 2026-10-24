import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, CheckCircle, Calendar, History } from 'lucide-react';

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
                background: '#EAF2F3',
                color: '#2C666E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Attendance Punch Desk</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Daily biometric time tracking & shifts
              </p>
            </div>
          </div>
        </div>

        {/* Live Digital Clock Badge */}
        <div
          style={{
            background: '#07393C',
            color: '#F0EDEE',
            padding: '6px 14px',
            borderRadius: '8px',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #144D50',
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.05em' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div style={{ fontSize: '11px', color: '#A6C9CD', fontFamily: 'var(--font-sans)', marginTop: '1px' }}>
            {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Status Center Banner */}
      <div
        style={{
          background: isClockedIn && !isClockedOut ? '#EAF2F3' : isClockedOut ? 'var(--bg-subtle)' : 'var(--bg-subtle)',
          border: `1px solid ${isClockedIn && !isClockedOut ? '#A6C9CD' : 'var(--border)'}`,
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
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>
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
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>
            {isClockedOut ? 'TOTAL LOGGED' : 'ACTIVE SESSION'}
          </div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              color: isClockedIn && !isClockedOut ? '#2C666E' : 'var(--text-primary)',
            }}
          >
            {isClockedIn ? elapsedDuration : '00h 00m 00s'}
          </div>
        </div>
      </div>

      {/* Metrics Row: In / Out / Shift Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>FIRST IN</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            {currentRecord?.checkIn ? formatTime(currentRecord.checkIn) : '--:--'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>LAST OUT</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
            {currentRecord?.checkOut ? formatTime(currentRecord.checkOut) : '--:--'}
          </div>
        </div>

        <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>EXPECTED</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>
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
              background: 'var(--bg-subtle)',
              border: '1px dashed var(--border-strong)',
              borderRadius: '8px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-secondary)',
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
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                  background: 'var(--bg-subtle)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={13} color="var(--text-muted)" />
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{log.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {formatTime(log.checkIn)} - {formatTime(log.checkOut)}
                  </span>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
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

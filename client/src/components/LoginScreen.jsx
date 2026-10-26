import React, { useState } from 'react';
import { Sparkles, Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginScreen({ onLogin, authError, loading = false }) {
  const [email, setEmail] = useState('admin@staffsync.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    onLogin(demoEmail, demoPass);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090d16',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.18) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          zIndex: 10,
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              margin: '0 auto 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.5)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            StaffSync HRMS
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>
            Enterprise Workforce Management Platform
          </p>
        </div>

        {authError && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: '#cbd5e1', fontSize: '12.5px', marginBottom: '6px' }}>
              Corporate Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#090d16',
                  borderColor: '#334155',
                  color: '#ffffff',
                  paddingLeft: '36px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#cbd5e1', fontSize: '12.5px', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: '#090d16',
                  borderColor: '#334155',
                  color: '#ffffff',
                  paddingLeft: '36px',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Instant One-Click Demo Personas */}
        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
              textAlign: 'center',
            }}
          >
            Instant Demo Profiles
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@staffsync.com', 'password123')}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#4f46e5')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={12} color="#818cf8" />
                <span style={{ fontWeight: '600' }}>Sarah Connor</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Admin (HR VP)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('alex@staffsync.com', 'password123')}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                color: '#e2e8f0',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#38bdf8" />
                <span style={{ fontWeight: '600' }}>Alex Rivera</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Staff (Engineering)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

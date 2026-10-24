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
        background: '#07393C',
        backgroundImage:
          'radial-gradient(circle at 50% 0%, rgba(44, 102, 110, 0.4) 0%, transparent 65%), radial-gradient(circle at 100% 100%, rgba(14, 71, 75, 0.35) 0%, transparent 50%)',
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
            'linear-gradient(rgba(240, 237, 238, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(240, 237, 238, 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(7, 57, 60, 0.88)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #144D50',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(240, 237, 238, 0.08)',
          zIndex: 10,
        }}
      >
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              margin: '0 auto 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2C666E 0%, #16565B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#F0EDEE',
              boxShadow: '0 4px 20px rgba(44, 102, 110, 0.5)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#F0EDEE',
              letterSpacing: '-0.02em',
            }}
          >
            StaffSync HRMS
          </h1>
          <p style={{ color: '#A6C9CD', fontSize: '13px', marginTop: '4px' }}>
            Enterprise Workforce Management Platform
          </p>
        </div>

        {authError && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
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
            <label style={{ color: '#F0EDEE', fontSize: '12.5px', marginBottom: '6px' }}>
              Corporate Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="#7A8D90"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: '#042528',
                  borderColor: '#144D50',
                  color: '#F0EDEE',
                  paddingLeft: '36px',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#F0EDEE', fontSize: '12.5px', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                color="#7A8D90"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: '#042528',
                  borderColor: '#144D50',
                  color: '#F0EDEE',
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
            borderTop: '1px solid #144D50',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: '700',
              color: '#A6C9CD',
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
                background: '#0E474B',
                border: '1px solid #1E5C60',
                color: '#F0EDEE',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2C666E')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E5C60')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={12} color="#90DDF0" />
                <span style={{ fontWeight: '700' }}>Sarah Connor</span>
              </div>
              <span style={{ fontSize: '11px', color: '#A6C9CD' }}>Admin (HR VP)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('alex@staffsync.com', 'password123')}
              style={{
                background: '#0E474B',
                border: '1px solid #1E5C60',
                color: '#F0EDEE',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#90DDF0')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#1E5C60')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#90DDF0" />
                <span style={{ fontWeight: '700' }}>Alex Rivera</span>
              </div>
              <span style={{ fontSize: '11px', color: '#A6C9CD' }}>Staff (Engineering)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

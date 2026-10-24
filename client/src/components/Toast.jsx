import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
            <div style={{ flexShrink: 0, marginTop: '1px' }}>
              {isSuccess && <CheckCircle2 size={18} color="#10b981" />}
              {isError && <AlertCircle size={18} color="#f43f5e" />}
              {!isSuccess && !isError && <Info size={18} color="#90DDF0" />}
            </div>
            <div style={{ flex: 1 }}>
              {toast.title && (
                <div style={{ fontWeight: '700', color: '#F0EDEE', marginBottom: '2px', fontSize: '13px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ color: '#D5DFE1', fontSize: '12.5px', lineHeight: '1.4' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A6C9CD',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.15s',
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

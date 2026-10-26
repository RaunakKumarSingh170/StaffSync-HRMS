import React, { useState } from 'react';
import { Megaphone, PlusCircle, Trash2, Calendar, User, Sparkles } from 'lucide-react';

export default function Bulletins({
  user,
  announcements = [],
  onSubmitAnnouncement,
  onDeleteAnnouncement,
}) {
  const [form, setForm] = useState({ title: '', content: '' });
  const [publishing, setPublishing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    setPublishing(true);
    try {
      await onSubmitAnnouncement({
        title: form.title,
        content: form.content,
        author: `${user.name} (${user.department})`,
      });
      setForm({ title: '', content: '' });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: user?.role === 'Admin' ? '360px 1fr' : '1fr',
        gap: '24px',
        alignItems: 'start',
      }}
    >
      {/* Admin Creator Panel */}
      {user?.role === 'Admin' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
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
              <Megaphone size={17} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Publish Bulletin</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Broadcast official announcements</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label>Headline / Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Townhall & Benefits Renewal"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label>Notice Content</label>
              <textarea
                rows={5}
                required
                placeholder="Detail the policies, schedules, or announcements..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <PlusCircle size={15} /> {publishing ? 'Publishing...' : 'Publish to All Staff'}
            </button>
          </form>
        </div>
      )}

      {/* Announcements Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
            Company Bulletins & Notices ({announcements.length})
          </h3>
          <span style={{ fontSize: '12.5px', color: '#64748b' }}>Latest internal dispatches</span>
        </div>

        {announcements.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No bulletins published yet.
          </div>
        ) : (
          announcements.map((item) => (
            <div key={item._id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    Broadcast
                  </span>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>{item.title}</h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Calendar size={13} />
                    {new Date(item.createdAt || Date.now()).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>

                  {user?.role === 'Admin' && onDeleteAnnouncement && (
                    <button
                      type="button"
                      onClick={() => onDeleteAnnouncement(item._id)}
                      className="btn btn-ghost"
                      style={{ padding: '4px', color: '#dc2626' }}
                      title="Delete announcement"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              <p style={{ color: '#334155', fontSize: '13.5px', lineHeight: '1.6', marginTop: '12px' }}>
                {item.content}
              </p>

              <div
                style={{
                  marginTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#64748b',
                }}
              >
                <User size={13} color="#94a3b8" />
                <span>Posted by:</span>
                <strong style={{ color: '#0f172a' }}>{item.author || 'HR Operations'}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

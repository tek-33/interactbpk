import { useState, useEffect } from 'react';
import { EDGE_FUNCTION_URL, supabase } from '@/lib/supabase';
import type { ClubMessage, ClubAnnouncement } from '@/lib/types';

export default function AdminPortal() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [messages, setMessages] = useState<ClubMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [makePublic, setMakePublic] = useState(false);
  const [actionError, setActionError] = useState('');

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changePwMsg, setChangePwMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'messages' | 'announcements'>('messages');

  // Announcements
  const [announcements, setAnnouncements] = useState<ClubAnnouncement[]>([]);
  const [loadingAnn, setLoadingAnn] = useState(false);
  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annForm, setAnnForm] = useState({ title: '', body: '', isPinned: false });
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  useEffect(() => {
    const refreshPendingCount = () => {
      fetch(`${EDGE_FUNCTION_URL}/pending-count`, { method: 'GET' })
        .then((res) => res.json())
        .then((data) => { if (data.count !== undefined) setPendingCount(data.count); })
        .catch(() => {});
    };

    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 30000);

    // Keep the notification badge current without waiting for the 30-second poll.
    const channel = supabase
      .channel('admin-message-notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'club_messages' }, refreshPendingCount)
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) { setLoginError('กรุณากรอกรหัสผ่าน'); return; }
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
        setLoggingIn(false);
        return;
      }
      setToken(data.token);
      setPassword('');
      setLoggingIn(false);
      fetchMessages(data.token);
      fetchAnnouncementsAdmin(data.token);
    } catch {
      setLoginError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setLoggingIn(false);
    }
  };

  const fetchMessages = async (tk: string) => {
    setLoadingMessages(true);
    setActionError('');
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tk }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'ดึงข้อมูลไม่สำเร็จ'); setLoadingMessages(false); return; }
      setMessages(data.messages || []);
      setLoadingMessages(false);
    } catch {
      setActionError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setLoadingMessages(false);
    }
  };

  const fetchAnnouncementsAdmin = async (tk: string) => {
    setLoadingAnn(true);
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/announcements`, { method: 'GET' });
      const data = await res.json();
      if (data.announcements) setAnnouncements(data.announcements);
      setLoadingAnn(false);
    } catch {
      setLoadingAnn(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) { setActionError('กรุณากรอกคำตอบ'); return; }
    setActionError('');
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, messageId, replyText: replyText.trim(), makePublic }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'ส่งคำตอบไม่สำเร็จ'); return; }
      setReplyingTo(null);
      setReplyText('');
      setMakePublic(false);
      fetchMessages(token);
    } catch {
      setActionError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('ต้องการลบข้อความนี้ใช่หรือไม่?')) return;
    setActionError('');
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/delete-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, messageId }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'ลบไม่สำเร็จ'); return; }
      fetchMessages(token);
    } catch {
      setActionError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePwMsg('');
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setChangePwMsg(data.error || 'เปลี่ยนรหัสผ่านไม่สำเร็จ'); return; }
      setChangePwMsg('เปลี่ยนรหัสผ่านสำเร็จ');
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => { setShowChangePassword(false); setChangePwMsg(''); }, 2000);
    } catch {
      setChangePwMsg('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleSaveAnnouncement = async () => {
    if (!annForm.title.trim() || !annForm.body.trim()) {
      setActionError('กรุณากรอกหัวข้อและเนื้อหา');
      return;
    }
    setActionError('');

    try {
      if (editingAnnId) {
        const res = await fetch(`${EDGE_FUNCTION_URL}/announcements/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token, annId: editingAnnId,
            title: annForm.title.trim(),
            body: annForm.body.trim(),
            isPinned: annForm.isPinned,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setActionError(data.error || 'แก้ไขไม่สำเร็จ'); return; }
      } else {
        const res = await fetch(`${EDGE_FUNCTION_URL}/announcements/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            title: annForm.title.trim(),
            body: annForm.body.trim(),
            isPinned: annForm.isPinned,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setActionError(data.error || 'สร้างไม่สำเร็จ'); return; }
      }
      setShowAnnForm(false);
      setAnnForm({ title: '', body: '', isPinned: false });
      setEditingAnnId(null);
      fetchAnnouncementsAdmin(token);
    } catch {
      setActionError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleEditAnnouncement = (ann: ClubAnnouncement) => {
    setEditingAnnId(ann.id);
    setAnnForm({ title: ann.title, body: ann.body, isPinned: ann.is_pinned });
    setShowAnnForm(true);
  };

  const handleDeleteAnnouncement = async (annId: string) => {
    if (!confirm('ต้องการลบประกาศนี้ใช่หรือไม่?')) return;
    setActionError('');
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/announcements/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, annId }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'ลบไม่สำเร็จ'); return; }
      fetchAnnouncementsAdmin(token);
    } catch {
      setActionError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleTogglePin = async (ann: ClubAnnouncement) => {
    setActionError('');
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/announcements/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, annId: ann.id, isPinned: !ann.is_pinned }),
      });
      const data = await res.json();
      if (!res.ok) { setActionError(data.error || 'แก้ไขไม่สำเร็จ'); return; }
      fetchAnnouncementsAdmin(token);
    } catch {
      setActionError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleLogout = () => {
    setToken('');
    setMessages([]);
    setAnnouncements([]);
    setOpen(false);
    setPassword('');
    setActiveTab('messages');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (!open && !token) {
    return (
      <button
        className="admin-fab"
        onClick={() => setOpen(true)}
        title="สำหรับนายกสโมสร"
        aria-label="เข้าสู่ระบบนายกสโมสร"
        style={{ position: 'relative' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {pendingCount > 0 && (
          <span className="admin-badge">{pendingCount}</span>
        )}
      </button>
    );
  }

  if (!open) return null;

  return (
    <>
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(15, 26, 48, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', opacity: open ? 1 : 0, transition: 'opacity 0.3s ease' }}
        onClick={() => !token && setOpen(false)}
      >
        <div
          style={{ background: 'var(--surface)', width: '100%', maxWidth: '700px', maxHeight: '90vh', borderRadius: '16px', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '2px solid var(--gold-light)', display: 'flex', flexDirection: 'column' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid var(--gold-light)' }}>
            <h3 style={{ color: '#fff', fontSize: '18px', fontFamily: 'Kanit, sans-serif', fontWeight: 600 }}>
              {token ? 'แผงควบคุมนายกสโมสร' : 'เข้าสู่ระบบนายกสโมสร'}
            </h3>
            <button
              style={{ background: 'var(--rose)', color: '#fff', border: 'none', fontSize: '14px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Kanit, sans-serif' }}
              onClick={() => { if (token) handleLogout(); else setOpen(false); }}
            >
              {token ? 'ออกจากระบบ ✕' : 'ปิด ✕'}
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            {!token ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(15, 26, 48, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                {pendingCount > 0 && (
                  <p style={{ fontFamily: 'Kanit, sans-serif', fontSize: '14px', fontWeight: 600, color: 'var(--rose)', marginBottom: '12px' }}>
                    มีข้อความรอตอบ {pendingCount} รายการ
                  </p>
                )}
                <p style={{ color: 'var(--text-mute)', fontSize: '14px', marginBottom: '24px' }}>
                  สำหรับนายกสโมสรเท่านั้น กรุณากรอกรหัสผ่านเพื่อเข้าถึงระบบ
                </p>

                <form onSubmit={handleLogin} style={{ maxWidth: '320px', margin: '0 auto' }}>
                  <div className="msg-field">
                    <label>รหัสผ่าน</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน" autoFocus />
                  </div>
                  {loginError && <div className="msg-error">{loginError}</div>}
                  <button type="submit" className="msg-btn msg-btn-primary" disabled={loggingIn} style={{ width: '100%', opacity: loggingIn ? 0.5 : 1 }}>
                    {loggingIn ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </button>
                </form>

                <p style={{ fontSize: '12px', color: 'var(--text-mute-2)', marginTop: '20px' }}>
                  รหัสผ่านเริ่มต้น: interact2025 (แนะนำให้เปลี่ยนหลังเข้าสู่ระบบ)
                </p>
              </div>
            ) : (
              <div>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid var(--line)' }}>
                  <button
                    onClick={() => setActiveTab('messages')}
                    style={{
                      padding: '10px 20px', fontFamily: 'Kanit, sans-serif', fontSize: '15px', fontWeight: 600,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: activeTab === 'messages' ? 'var(--ink)' : 'var(--text-mute)',
                      borderBottom: activeTab === 'messages' ? '3px solid var(--gold)' : '3px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    ข้อความ {messages.filter((m) => m.status === 'pending').length > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px', height: '18px', borderRadius: '9px', background: 'var(--rose)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '0 5px', marginLeft: '4px', verticalAlign: 'middle' }}>
                        {messages.filter((m) => m.status === 'pending').length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    style={{
                      padding: '10px 20px', fontFamily: 'Kanit, sans-serif', fontSize: '15px', fontWeight: 600,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: activeTab === 'announcements' ? 'var(--ink)' : 'var(--text-mute)',
                      borderBottom: activeTab === 'announcements' ? '3px solid var(--gold)' : '3px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    ประกาศ
                  </button>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      style={{ fontSize: '13px', color: 'var(--ink)', background: 'var(--paper-2)', border: '1px solid var(--line-strong)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Prompt, sans-serif' }}
                    >
                      เปลี่ยนรหัสผ่าน
                    </button>
                  </div>
                </div>

                {/* Change password */}
                {showChangePassword && (
                  <div style={{ marginBottom: '16px', background: 'var(--paper)', borderRadius: '8px', padding: '16px', border: '1px solid var(--line)' }}>
                    <form onSubmit={handleChangePassword} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                      <div className="msg-field" style={{ margin: 0 }}>
                        <label>รหัสผ่านเดิม</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                      </div>
                      <div className="msg-field" style={{ margin: 0 }}>
                        <label>รหัสผ่านใหม่</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                      </div>
                      <button type="submit" className="msg-btn msg-btn-primary" style={{ height: '42px' }}>บันทึก</button>
                    </form>
                    {changePwMsg && (
                      <p style={{ fontSize: '13px', marginTop: '8px', color: changePwMsg.includes('สำเร็จ') ? 'var(--moss)' : 'var(--rose)' }}>
                        {changePwMsg}
                      </p>
                    )}
                  </div>
                )}

                {actionError && <div className="msg-error">{actionError}</div>}

                {/* Messages tab */}
                {activeTab === 'messages' && (
                  <>
                    {loadingMessages ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mute)' }}>กำลังโหลด...</div>
                    ) : messages.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mute-2)' }}>ยังไม่มีข้อความ</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {messages.map((msg) => (
                          <div key={msg.id} style={{ background: 'var(--paper)', borderRadius: '8px', padding: '16px', border: `1px solid ${msg.status === 'answered' ? 'rgba(59, 110, 71, 0.2)' : 'var(--line)'}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                              <span className={`msg-status-badge ${msg.status === 'answered' ? 'msg-status-answered' : 'msg-status-pending'}`}>
                                {msg.status === 'answered' ? '✓ ตอบแล้ว' : '⏳ รอตอบ'}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--text-mute-2)' }}>{formatDate(msg.created_at)}</span>
                            </div>

                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '6px' }}>
                                <span style={{ fontFamily: 'Kanit, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{msg.sender_name}</span>
                                {msg.sender_contact && <span style={{ fontSize: '13px', color: 'var(--text-mute)' }}>ติดต่อ: {msg.sender_contact}</span>}
                              </div>
                              <span style={{ fontFamily: "'IBM Plex Mono', sans-serif", fontSize: '10px', fontWeight: 600, color: 'var(--gold)', background: 'rgba(212, 175, 55, 0.1)', padding: '3px 8px', borderRadius: '20px', letterSpacing: '.03em', textTransform: 'uppercase' }}>
                                {msg.subject}
                              </span>
                              <p style={{ fontSize: '14px', color: 'var(--text-mute)', background: 'var(--surface)', borderRadius: '6px', padding: '10px', lineHeight: '1.6', marginTop: '8px' }}>{msg.body}</p>
                            </div>

                            {msg.status === 'answered' && msg.reply ? (
                              <div className="msg-reply-box">
                                <p style={{ fontFamily: 'Kanit, sans-serif', fontSize: '13px', fontWeight: 600, color: 'var(--moss)', marginBottom: '6px' }}>★ คำตอบ:</p>
                                <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.7' }}>{msg.reply}</p>
                                {msg.replied_at && <p style={{ fontSize: '12px', color: 'var(--text-mute-2)', marginTop: '8px' }}>ตอบเมื่อ: {formatDate(msg.replied_at)}</p>}
                              </div>
                            ) : replyingTo === msg.id ? (
                              <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '12px' }}>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={3}
                                  placeholder="พิมพ์คำตอบ..."
                                  autoFocus
                                  style={{ width: '100%', fontFamily: 'Prompt, sans-serif', fontSize: '15px', padding: '10px 14px', border: '1px solid var(--line-strong)', borderRadius: '8px', background: 'var(--surface)', resize: 'vertical' }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-mute)', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={makePublic} onChange={(e) => setMakePublic(e.target.checked)} style={{ accentColor: 'var(--ink)' }} />
                                    แสดงคำตอบให้เจ้าของเห็น
                                  </label>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => { setReplyingTo(null); setReplyText(''); setMakePublic(false); }} style={{ fontSize: '13px', color: 'var(--text-mute)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', fontFamily: 'Prompt, sans-serif' }}>ยกเลิก</button>
                                    <button onClick={() => handleReply(msg.id)} style={{ fontSize: '13px', color: '#fff', background: 'var(--ink)', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontWeight: 600 }}>ส่งคำตอบ</button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '8px', borderTop: '1px dashed var(--line)', paddingTop: '12px' }}>
                                <button onClick={() => setReplyingTo(msg.id)} style={{ fontSize: '13px', color: '#fff', background: 'var(--ink)', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontWeight: 600 }}>ตอบกลับ</button>
                                <button onClick={() => handleDelete(msg.id)} style={{ fontSize: '13px', color: 'var(--rose)', background: 'rgba(158, 59, 84, 0.08)', border: '1px solid rgba(158, 59, 84, 0.2)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Prompt, sans-serif' }}>ลบ</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Announcements tab */}
                {activeTab === 'announcements' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontFamily: 'Kanit, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                        ประกาศทั้งหมด {announcements.length} รายการ
                      </span>
                      <button
                        onClick={() => { setShowAnnForm(!showAnnForm); setEditingAnnId(null); setAnnForm({ title: '', body: '', isPinned: false }); }}
                        style={{ fontSize: '13px', color: '#fff', background: 'var(--ink)', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Kanit, sans-serif', fontWeight: 600 }}
                      >
                        {showAnnForm ? 'ยกเลิก' : '+ สร้างประกาศ'}
                      </button>
                    </div>

                    {showAnnForm && (
                      <div style={{ marginBottom: '20px', background: 'var(--paper)', borderRadius: '8px', padding: '16px', border: '1px solid var(--line)' }}>
                        <div className="msg-field">
                          <label>หัวข้อประกาศ</label>
                          <input type="text" value={annForm.title} onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} placeholder="กรอกหัวข้อประกาศ" maxLength={200} />
                        </div>
                        <div className="msg-field">
                          <label>เนื้อหา</label>
                          <textarea value={annForm.body} onChange={(e) => setAnnForm({ ...annForm, body: e.target.value })} rows={4} placeholder="กรอกเนื้อหาประกาศ..." maxLength={2000} />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-mute)', cursor: 'pointer', marginBottom: '12px' }}>
                          <input type="checkbox" checked={annForm.isPinned} onChange={(e) => setAnnForm({ ...annForm, isPinned: e.target.checked })} style={{ accentColor: 'var(--ink)' }} />
                          ปักหมุดประกาศนี้ไว้ด้านบน
                        </label>
                        <button onClick={handleSaveAnnouncement} className="msg-btn msg-btn-primary">
                          {editingAnnId ? 'บันทึกการแก้ไข' : 'เผยแพร่ประกาศ'}
                        </button>
                      </div>
                    )}

                    {loadingAnn ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mute)' }}>กำลังโหลด...</div>
                    ) : announcements.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-mute-2)' }}>ยังไม่มีประกาศ</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {announcements.map((ann) => (
                          <div key={ann.id} className={`ann-card ${ann.is_pinned ? 'pinned' : ''}`} style={{ margin: 0 }}>
                            {ann.is_pinned && <span className="ann-pin-badge">★ ปักหมุด</span>}
                            <div className="ann-title" style={{ fontSize: '16px' }}>{ann.title}</div>
                            <div className="ann-body" style={{ fontSize: '14px' }}>{ann.body}</div>
                            <div className="ann-date">โพสต์เมื่อ {formatDateShort(ann.created_at)}</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed var(--line)' }}>
                              <button onClick={() => handleEditAnnouncement(ann)} style={{ fontSize: '12px', color: 'var(--ink)', background: 'var(--paper-2)', border: '1px solid var(--line-strong)', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Prompt, sans-serif' }}>แก้ไข</button>
                              <button onClick={() => handleTogglePin(ann)} style={{ fontSize: '12px', color: 'var(--gold)', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Prompt, sans-serif' }}>
                                {ann.is_pinned ? 'ยกเลิกปักหมุด' : 'ปักหมุด'}
                              </button>
                              <button onClick={() => handleDeleteAnnouncement(ann.id)} style={{ fontSize: '12px', color: 'var(--rose)', background: 'rgba(158, 59, 84, 0.08)', border: '1px solid rgba(158, 59, 84, 0.2)', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Prompt, sans-serif' }}>ลบ</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

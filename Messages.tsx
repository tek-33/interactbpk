import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { ClubMessage } from '@/lib/types';

const subjects = [
  'สอบถามข้อมูลทั่วไป',
  'สอบถามเรื่องการสมัครสมาชิก',
  'สอบถามเรื่องกิจกรรม',
  'ข้อเสนอแนะ',
  'ร้องเรียน / ปัญหา',
  'เรื่องอื่นๆ',
];

export default function Messages() {
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_contact: '',
    subject: subjects[0],
    body: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const [checkId, setCheckId] = useState('');
  const [foundMessage, setFoundMessage] = useState<ClubMessage | null>(null);
  const [checkError, setCheckError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sender_name.trim() || !formData.body.trim()) {
      setError('กรุณากรอกชื่อและข้อความ');
      return;
    }
    setSubmitting(true);
    setError('');

    const { data, error: insertError } = await supabase
      .from('club_messages')
      .insert({
        sender_name: formData.sender_name.trim(),
        sender_contact: formData.sender_contact.trim(),
        subject: formData.subject,
        body: formData.body.trim(),
      })
      .select()
      .maybeSingle();

    setSubmitting(false);

    if (insertError || !data) {
      setError('เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
      return;
    }

    setTrackingId(data.id);
    setSubmitted(true);
    setFormData({ sender_name: '', sender_contact: '', subject: subjects[0], body: '' });
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkId.trim()) {
      setCheckError('กรุณากรอกรหัสติดตามข้อความ');
      return;
    }
    setChecking(true);
    setCheckError('');
    setFoundMessage(null);

    const { data, error: queryError } = await supabase
      .from('club_messages')
      .select('*')
      .eq('id', checkId.trim())
      .maybeSingle();

    setChecking(false);

    if (queryError || !data) {
      setCheckError('ไม่พบข้อความที่ตรงกับรหัสที่คุณกรอก');
      return;
    }
    setFoundMessage(data as ClubMessage);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <section className="block reveal" id="messages">
      <div className="msg-wrap">
        <div className="section-head">
          <div className="eyebrow"><span className="rn">IV.</span> ระบบฝากข้อความ</div>
        </div>
        <h2 className="title">ฝากข้อความถึงสโมสร</h2>
        <p className="desc">
          หากมีเรื่องสอบถาม ข้อเสนอแนะ หรือปัญหาที่ต้องการแจ้งให้สโมสรทราบ
          สามารถฝากข้อความทิ้งไว้ได้ที่นี่ นายกสโมสรจะเป็นผู้ตอบข้อความของท่าน
        </p>

        <div className="msg-grid">
          {/* Form */}
          <div className="msg-panel">
            <div className="msg-panel-head">★ ฝากข้อความใหม่</div>

            {submitted ? (
              <div className="msg-success">
                <div className="msg-success-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--moss)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'Kanit, sans-serif', fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>ส่งข้อความสำเร็จ</h3>
                <p style={{ color: 'var(--text-mute)', fontSize: '14px', marginBottom: '12px' }}>
                  ข้อความของท่านได้รับการบันทึกเรียบร้อยแล้ว นายกสโมสรจะตอบกลับโดยเร็วที่สุด
                </p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--text-mute)', textTransform: 'uppercase', letterSpacing: '.03em' }}>
                  รหัสติดตามข้อความของท่าน:
                </p>
                <div className="msg-tracking-id">{trackingId}</div>
                <p style={{ fontSize: '13px', color: 'var(--gold)', marginTop: '8px' }}>
                  โปรดจดรหัสนี้ไว้เพื่อตรวจสอบสถานะคำตอบ
                </p>
                <button
                  className="msg-btn msg-btn-secondary"
                  style={{ marginTop: '20px' }}
                  onClick={() => { setSubmitted(false); setTrackingId(''); }}
                >
                  ส่งข้อความใหม่
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="msg-field">
                  <label>ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    placeholder="กรอกชื่อของท่าน"
                    maxLength={100}
                  />
                </div>

                <div className="msg-field">
                  <label>ช่องทางติดต่อกลับ (ไม่บังคับ)</label>
                  <input
                    type="text"
                    value={formData.sender_contact}
                    onChange={(e) => setFormData({ ...formData, sender_contact: e.target.value })}
                    placeholder="เบอร์โทร หรือ อีเมล (ถ้ามี)"
                    maxLength={200}
                  />
                </div>

                <div className="msg-field">
                  <label>หัวข้อเรื่อง</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="msg-field">
                  <label>ข้อความ *</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    rows={5}
                    placeholder="กรอกข้อความที่ท่านต้องการสอบถามหรือแจ้ง..."
                    maxLength={2000}
                  />
                </div>

                {error && <div className="msg-error">{error}</div>}

                <button
                  type="submit"
                  className="msg-btn msg-btn-primary"
                  disabled={submitting}
                  style={{ opacity: submitting ? 0.5 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                </button>
              </form>
            )}
          </div>

          {/* Check status */}
          <div className="msg-panel">
            <div className="msg-panel-head">★ ตรวจสอบสถานะข้อความ</div>

            <p style={{ color: 'var(--text-mute)', fontSize: '14px', marginBottom: '16px' }}>
              กรอกรหัสติดตามข้อความที่ท่านได้รับหลังจากส่งข้อความ เพื่อตรวจสอบว่า
              นายกสโมสรได้ตอบกลับแล้วหรือไม่
            </p>

            <form onSubmit={handleCheck}>
              <div className="msg-field">
                <label>รหัสติดตามข้อความ</label>
                <input
                  type="text"
                  value={checkId}
                  onChange={(e) => setCheckId(e.target.value)}
                  placeholder="วางรหัสติดตามข้อความที่นี่"
                  style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px' }}
                />
              </div>

              {checkError && <div className="msg-error">{checkError}</div>}

              <button
                type="submit"
                className="msg-btn msg-btn-secondary"
                disabled={checking}
                style={{ opacity: checking ? 0.5 : 1 }}
              >
                {checking ? 'กำลังค้นหา...' : 'ตรวจสอบสถานะ'}
              </button>
            </form>

            {foundMessage && (
              <div style={{ marginTop: '20px', background: 'var(--paper)', borderRadius: '8px', border: '1px solid var(--line)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className={`msg-status-badge ${foundMessage.status === 'answered' ? 'msg-status-answered' : 'msg-status-pending'}`}>
                    {foundMessage.status === 'answered' ? '✓ ได้รับคำตอบแล้ว' : '⏳ รอตอบกลับ'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-mute-2)' }}>{formatDate(foundMessage.created_at)}</span>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <p style={{ fontFamily: "'IBM Plex Mono', sans-serif", fontSize: '11px', color: 'var(--text-mute)', textTransform: 'uppercase', marginBottom: '2px' }}>หัวข้อ:</p>
                  <p style={{ fontFamily: 'Kanit, sans-serif', fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{foundMessage.subject}</p>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontFamily: "'IBM Plex Mono', sans-serif", fontSize: '11px', color: 'var(--text-mute)', textTransform: 'uppercase', marginBottom: '2px' }}>ข้อความของท่าน:</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-mute)', background: 'var(--surface)', borderRadius: '6px', padding: '10px', lineHeight: '1.6' }}>{foundMessage.body}</p>
                </div>

                {foundMessage.status === 'answered' && foundMessage.reply && (
                  <div className="msg-reply-box">
                    <p style={{ fontFamily: 'Kanit, sans-serif', fontSize: '13px', fontWeight: 600, color: 'var(--moss)', marginBottom: '6px' }}>
                      ★ คำตอบจากนายกสโมสร
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: '1.7' }}>{foundMessage.reply}</p>
                    {foundMessage.replied_at && (
                      <p style={{ fontSize: '12px', color: 'var(--text-mute-2)', marginTop: '8px' }}>
                        ตอบกลับเมื่อ: {formatDate(foundMessage.replied_at)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="msg-info-note">
          ข้อความของท่านจะถูกส่งถึงนายกสโมสรโดยตรง และจะได้รับคำตอบโดยเร็วที่สุด
          หากเร่งด่วน กรุณาติดต่อผ่านช่องทางอื่นในส่วนติดต่อ
        </div>
      </div>
    </section>
  );
}

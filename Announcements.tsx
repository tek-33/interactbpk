import { useState, useEffect } from 'react';
import { EDGE_FUNCTION_URL, supabase } from '@/lib/supabase';
import type { ClubAnnouncement } from '@/lib/types';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<ClubAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAnnouncements = async () => {
      try {
        const res = await fetch(`${EDGE_FUNCTION_URL}/announcements`, { method: 'GET' });
        const data = await res.json();
        if (mounted && data.announcements) setAnnouncements(data.announcements);
      } catch {
        // Keep the existing list visible if a refresh fails.
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadAnnouncements();

    // Update the public announcement board immediately when the president
    // creates/edits/deletes a post in the admin portal.
    const channel = supabase
      .channel('public-announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'club_announcements' }, loadAnnouncements)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <section className="block reveal" id="announcements">
      <div className="wrap" style={{ maxWidth: 'var(--wrap)', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="section-head">
          <div className="eyebrow"><span className="rn">★</span> ประกาศจากสโมสร</div>
        </div>
        <h2 className="title">ข่าวสารและประกาศ</h2>
        <p className="desc">
          ประกาศและข่าวสารล่าสุดจากคณะกรรมการบริหารสโมสร
          <br />
          <a
            href="https://www.instagram.com/int_bpk/"
            target="_blank"
            rel="noopener noreferrer"
            className="ann-instagram-link"
          >
            ดูข่าวประชาสัมพันธ์และโพสต์ล่าสุดของสโมสรบน Instagram @int_bpk ↗
          </a>
        </p>

        <div className="ann-list">
          {loading ? (
            <div className="ann-empty">กำลังโหลด...</div>
          ) : announcements.length === 0 ? (
            <div className="ann-empty">ยังไม่มีประกาศในขณะนี้</div>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className={`ann-card ${ann.is_pinned ? 'pinned' : ''}`}>
                {ann.is_pinned && (
                  <span className="ann-pin-badge">★ ปักหมุด</span>
                )}
                <div className="ann-title">{ann.title}</div>
                <div className="ann-body">{ann.body}</div>
                <div className="ann-date">โพสต์เมื่อ {formatDate(ann.created_at)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

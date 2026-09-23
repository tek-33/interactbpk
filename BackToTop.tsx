import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(() => window.scrollY > 400);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`back-to-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="กลับขึ้นบน"
      title="กลับขึ้นบน"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}

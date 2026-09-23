import { useState, useEffect } from 'react';

const navItems = [
  { label: 'ทำเนียบคณะกรรมการ', href: '#committee' },
  { label: 'โครงการและกิจกรรม', href: '#projects' },
  { label: 'ข่าวสาร', href: '#announcements' },
  { label: 'เกี่ยวกับสโมสร', href: '#about' },
  { label: 'ฝากข้อความ', href: '#messages' },
  { label: 'FAQ', href: '#faq' },
  { label: 'ติดต่อ', href: '#contact' },
];

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -5% 0px' }
  );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    const onLoad = () => {
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => el.classList.add('is-in'));
      }, 1200);
    };
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      io.disconnect();
    };
  }, []);

  return (
    <header className="site-top-container">
      <div className="site-bar">
        <div className="brand-group">
          <div className="top-left-seal" title="ตราโรงเรียนบางปะกอกวิทยาคม">
            <img src="/images/branding/logoschool.jpg" alt="ตราโรงเรียนบางปะกอกวิทยาคม" />
          </div>
          <a className="brand" href="#top">
            <img src="/images/branding/logo.png" className="seal" alt="ตราสโมสรอินเทอร์แรคท์" />
            <span className="brand-text">
              <span className="en">Interact Club of BPK</span>
              <span className="th">ทำเนียบคณะกรรมการบริหาร</span>
            </span>
          </a>
        </div>
        <button
          className="nav-toggle"
          aria-label="เปิดเมนู"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(!navOpen)}
        >
          <span></span><span></span><span></span>
        </button>
        <nav className={`site-nav ${navOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function Footer() {
  return (
    <footer className="site" id="contact">
      <div className="footer-grid">
        <div className="brand-text">
          <div className="th">สโมสรอินเทอร์แรคท์โรงเรียนบางปะกอกวิทยาคม</div>
          <p>
            51 ซ.สุขสวัสดิ์ 19 แขวงบางปะกอก เขตราษฎร์บูรณะ กรุงเทพฯ 10140
            ในอุปถัมภ์สโมสรโรตารีราษฎร์บูรณะ ภาค 3350 โรตารีสากล
          </p>
        </div>

        {/* Contact cards */}
        <div className="contact-cards">
          <a
            href="mailto:interactclubbpk@gmail.com"
            className="contact-card"
          >
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div>
              <div className="contact-label">อีเมล</div>
              <div className="contact-value">interactclubbpk@gmail.com</div>
            </div>
          </a>

          <a
            href="https://instagram.com/int_bpk"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <div className="contact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <div>
              <div className="contact-label">อินสตาแกรม</div>
              <div className="contact-value">@int_bpk</div>
            </div>
          </a>
        </div>
      </div>

      <div className="footer-grid" style={{ marginTop: '0' }}>
        <div className="footer-bottom">
          <span>INTERACT CLUB OF BANGPAKOKWITTAYAKOM SCHOOL · GEN. IX</span>
          <span>ข้อมูลปรับปรุงล่าสุด: กันยายน 2568</span>
        </div>
      </div>
    </footer>
  );
}

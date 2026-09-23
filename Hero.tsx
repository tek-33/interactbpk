export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-inner" style={{ maxWidth: 'var(--wrap)', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="hero-num" aria-hidden="true">09</div>
        <div className="kicker">Rotary Year 2025–2026 · ปีบริหาร 2568–2569</div>
        <h1>
          ทำเนียบคณะกรรมการบริหาร<br />
          และผลการดำเนินโครงการ<br />
          สโมสรอินเทอร์แรคท์โรงเรียนบางปะกอกวิทยาคม
        </h1>
        <div className="sub">
          IN SPONSORSHIP OF ROTARY CLUB OF RAT BURANA · DISTRICT 3350, ROTARY INTERNATIONAL
        </div>
        <p className="lede">
          ทำเนียบรายนามคณะกรรมการบริหาร รุ่นที่ 9
          พร้อมสรุปผลการดำเนินโครงการและกิจกรรมบำเพ็ญประโยชน์ประจำปีบริหาร 2568–2569
          จัดทำขึ้นเพื่อการอ้างอิงและเผยแพร่ต่อหน่วยงาน สถานศึกษา และผู้มีเกียรติที่เกี่ยวข้อง
        </p>

        <div className="stat-strip">
          <div className="cell">
            <div className="num">รุ่นที่ 9</div>
            <div className="label">ก่อตั้งปี 2560</div>
          </div>
          <div className="cell">
            <div className="num">19 คน</div>
            <div className="label">คณะกรรมการฯ</div>
          </div>
          <div className="cell">
            <div className="num">ราษฎร์บูรณะ</div>
            <div className="label">โรตารีอุปถัมภ์</div>
          </div>
          <div className="cell">
            <div className="num">ภาค 3350</div>
            <div className="label">โรตารีสากล</div>
          </div>
        </div>
      </div>
    </section>
  );
}

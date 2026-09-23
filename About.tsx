export default function About() {
  return (
    <section className="block reveal" id="about">
      <div className="wrap" style={{ maxWidth: 'var(--wrap)', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="section-head">
          <div className="eyebrow"><span className="rn">I.</span> เกี่ยวกับสโมสร</div>
        </div>
        <h2 className="title">สโมสรอินเทอร์แรคท์โรงเรียนบางปะกอกวิทยาคม</h2>
        <div className="about-grid">
          <div className="copy">
            <span className="quote-mark">"</span>
            <p>
              สโมสรอินเทอร์แรคท์โรงเรียนบางปะกอกวิทยาคม ก่อตั้งขึ้นเมื่อวันจันทร์ที่ 6 กุมภาพันธ์ พ.ศ. 2560
              ภายใต้การอุปถัมภ์ของสโมสรโรตารีราษฎร์บูรณะ สังกัดภาค 3350 โรตารีสากล
              เป็นสโมสรบำเพ็ญประโยชน์สำหรับเยาวชนอายุ 12–18 ปี มีวัตถุประสงค์เพื่อพัฒนาความเป็นผู้นำ คุณธรรมจริยธรรม
              จิตสำนึกสาธารณะ และการบำเพ็ญประโยชน์ต่อชุมชนและสังคม
            </p>
            <p>
              ตลอดระยะเวลา 9 รุ่นที่ผ่านมา สโมสรได้ดำเนินโครงการทั้งภายในและภายนอกโรงเรียนอย่างต่อเนื่อง
              ร่วมมือกับสโมสรอินเทอร์แรคท์จากโรงเรียนต่าง ๆ ในภาค 3350
              เพื่อส่งเสริมการบริการชุมชนและการทำงานเป็นทีมของเยาวชน
            </p>
          </div>
          <div className="info-panel">
            <div className="info-head">ข้อมูลจดทะเบียนสโมสร (Official Registration)</div>
            <dl className="info-list">
              <div className="info-item">
                <dt>ชื่อสโมสรภาษาอังกฤษ</dt>
                <dd>Interact Club of Bangpakokwittayakom School</dd>
              </div>
              <div className="info-item">
                <dt>สโมสรอุปถัมภ์</dt>
                <dd>สโมสรโรตารีราษฎร์บูรณะ</dd>
              </div>
              <div className="info-item">
                <dt>สังกัดภาค</dt>
                <dd>ภาค 3350 โรตารีสากล</dd>
              </div>
              <div className="info-item">
                <dt>วันก่อตั้งสโมสร</dt>
                <dd>6 กุมภาพันธ์ 2560</dd>
              </div>
              <div className="info-item">
                <dt>อาจารย์ที่ปรึกษา</dt>
                <dd>คุณครูอนันตชัย จงสมจิตต์</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

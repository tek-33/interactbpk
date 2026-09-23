import { useState } from 'react';

const allMembers = [
  { role: 'นายกสโมสร', name: 'ปภินวิทย์ สงเสด', nick: 'ป้อง' },
  { role: 'อุปนายกสโมสร', name: 'ภัทรภร โก๊ะเจริญ', nick: 'ไลลา' },
  { role: 'เลขานุการ', name: 'สมิตา ปันตา', nick: 'คะน้า' },
  { role: 'ผู้ช่วยเลขานุการ', name: 'กาญจนา คชศิลา', nick: 'หนูดี' },
  { role: 'ฝ่ายประชาสัมพันธ์', name: 'อิศราภา แสงคร้าม', nick: 'จูน' },
  { role: 'เหรัญญิก', name: 'พลอยปภัส พิศวิลัย', nick: 'เนเน่' },
  { role: 'ผู้ช่วยเหรัญญิก', name: 'ภีมพล ขวัญมีชัยชนะ', nick: 'ภีมเมอร์' },
  { role: 'ฝ่ายการงานหาทุน', name: 'จุฑามาศ เนตร์ทอง', nick: 'น้ำผึ้ง' },
  { role: 'ฝ่ายเทคโนโลยีสารสนเทศ', name: 'พลอย เกตุไชยศรี', nick: 'พลอย' },
  { role: 'ผู้ช่วยฝ่ายเทคโนโลยีสารสนเทศ', name: 'กัญญาภัค มาโยธา', nick: 'กัลย์' },
  { role: 'ฝ่ายบำเพ็ญประโยชน์', name: 'ภูธเนศ แม่นหมาย', nick: 'ภู' },
  { role: 'ฝ่ายบริหารจัดการสโมสร', name: 'บุรินทร์ รักท้วม', nick: 'ปูน' },
  { role: 'หัวหน้าสมาชิกภาพ', name: 'มณฑาทิพย์ มุขพรม', nick: 'แบม' },
  { role: 'สมาชิกภาพ', name: 'นันท์นภัส พันธ์ผลไร่', nick: 'อิงเอย' },
  { role: 'สมาชิกภาพ', name: 'พัฑฒิดา เทวาวงศ์', nick: 'อุ๊งอิ๊ง' },
  { role: 'สมาชิกภาพ', name: 'คณาธิป ชื่นอุทัย', nick: 'ไล้' },
  { role: 'สมาชิกภาพ', name: 'ณัฐธิดา กิจถาวรวุฒิกุล', nick: 'สายป่าน' },
  { role: 'สมาชิกภาพ', name: 'ลักษมล เมียดขุนทด', nick: 'ไอซ์' },
  { role: 'สมาชิกภาพ', name: 'กิตติญารัตน์ ปุริโส', nick: 'เกรซ' },
];

const ropePath = 'M8 8 C14 8 19 9 25 12 C38 18 61 18 75 12 C82 10 88 13 90 18 C92 28 86 38 78 43 C75 46 75 52 75 58 C75 65 69 69 61 68 C48 66 37 61 25 58 C18 56 12 60 10 66';

export default function Committee() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);

  const photos = [
    { thumb: '/images/committee/ALL2.JPG', full: '/images/committee/ALL1.JPG', caption: '2025 - 2026', cls: 'cb-1' },
    { thumb: '/images/committee/ALL3.JPG', full: '/images/committee/ALL2.JPG', caption: '2025 - 2026', cls: 'cb-2' },
    { thumb: '/images/committee/ALL1.JPG', full: '/images/committee/ALL3.JPG', caption: '2026 - 2027', cls: 'cb-3' },
    { thumb: '/images/committee/ALL4.JPG', full: '/images/committee/ALL4.JPG', caption: '2026 - 2027', cls: 'cb-4' },
  ];

  return (
    <section className="block reveal" id="committee">
      <div className="wrap" style={{ maxWidth: 'var(--wrap)', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="section-head">
          <div className="eyebrow"><span className="rn">II.</span> คณะกรรมการบริหารสโมสร</div>
        </div>
        <h2 className="title">ทำเนียบคณะกรรมการบริหาร ประจำปี 2568–2569</h2>
        <p className="desc">รายนาม ชื่อเล่น และช่องทางติดต่อของคณะกรรมการบริหารสโมสร รุ่นที่ 9</p>

        <div className="advisor-plate">
          <span className="badge">ที่ปรึกษาสโมสร</span>
          <div>
            <div className="nm">คุณครูอนันตชัย จงสมจิตต์</div>
            <div className="role">อาจารย์ที่ปรึกษาสโมสรอินเทอร์แรคท์โรงเรียนบางปะกอกวิทยาคม</div>
          </div>
        </div>

        <div className="member-grid">
          {allMembers.map((m, index) => {
            const imgSrc = `/img${index + 1}.jpg`;
            const idx = String(index + 1).padStart(2, '0');
            return (
              <div key={index} className="m-card">
                <div className="m-plate">
                  <span className="m-idx">NO. {idx}</span>
                  <img
                    src={imgSrc}
                    alt={m.name}
                    loading="lazy"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.classList.add('no-img');
                        e.currentTarget.remove();
                      }
                    }}
                  />
                  <span className="m-initial">{m.nick ? m.nick.charAt(0) : m.name.charAt(0)}</span>
                </div>
                <div className="m-body">
                  <div className="m-role">{m.role}</div>
                  <div className="m-name">{m.name}</div>
                  <div className="m-nick">ชื่อเล่น {m.nick}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Photo chain */}
        <div className="photo-chain-wrap reveal">
          <div className="photo-chain-kicker">ภาพความทรงจำตลอดปีบริหาร</div>
          <div className="photo-chain" aria-label="ภาพความทรงจำตลอดปีบริหาร">
            <span className="chain-label lbl-start">start</span>

            <svg className="chain-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path className="rope-shadow" d={ropePath} />
              <path className="rope-main" d={ropePath} />
              <path className="rope-highlight" d={ropePath} />
            </svg>

            {photos.map((photo, i) => (
              <button
                key={i}
                className={`chain-box ${photo.cls}`}
                type="button"
                onClick={() => setLightbox({ src: photo.full, caption: photo.caption })}
                aria-label={`เปิดรูป ${photo.caption}`}
              >
                <img src={photo.thumb} alt={`ภาพความทรงจำ ${photo.caption}`} loading="lazy" />
                <span className="polaroid-caption">{photo.caption}</span>
              </button>
            ))}

            <span className="chain-label lbl-end">end</span>
          </div>
        </div>
      </div>

      {/* Photo lightbox */}
      {lightbox && (
        <div className="photo-lightbox active" onClick={() => setLightbox(null)}>
          <div className="photo-lightbox-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <button
              className="photo-lightbox-close"
              type="button"
              aria-label="ปิด"
              onClick={() => setLightbox(null)}
            >
              ×
            </button>
            <img src={lightbox.src} alt={lightbox.caption} />
            <div className="photo-lightbox-caption">{lightbox.caption}</div>
          </div>
        </div>
      )}
    </section>
  );
}

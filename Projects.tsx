import { useState } from 'react';

interface Project {
  img: string;
  date: string;
  title: string;
  desc: string;
  highlight: string;
}

const mainProjects: Project[] = [
  {
    img: '/images/projects/โครงการ1.jpg',
    date: 'เสาร์ 19 ก.ค. 2568',
    title: 'โครงการที่ 1: หมอยาไทยใกล้ชิดชุมชน',
    desc: 'ร่วมกับสโมสรโรตารีราษฎร์บูรณะ สโมสรโรตารีในภาค 3350 และคณะแพทย์แผนไทยจากบูรณเวชอะคาเดมี่ จัดกิจกรรม ณ วัดราษฎร์บูรณะ ให้บริการตรวจสุขภาพ นวดบำบัด ตรวจสายตา และแจกแว่นตาฟรี สโมสรรับหน้าที่ดูแลคิวงานและแจกอุปกรณ์',
    highlight: '🏆 รางวัลชนะเลิศอันดับที่ 1 Inspire Impact 3350',
  },
  {
    img: '/images/projects/โครงการ2.JPG',
    date: 'อาทิตย์ 2 พ.ย. 2568',
    title: 'โครงการที่ 2: อาหารพระราชทาน',
    desc: 'รับมอบหมายจากสโมสรโรตารีราษฎร์บูรณะ ให้เข้าร่วมแจกอาหารภายใต้โครงการอาหารพระราชทาน ณ สนามหลวง เนื่องในโอกาสวันเฉลิมพระชนมพรรษา 4 รอบ ของสมเด็จพระนางเจ้าฯ พระบรมราชินี',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ3.JPG',
    date: 'เสาร์ 8 พ.ย. 2568',
    title: 'โครงการที่ 3: สุขใจวัยเกษียณ',
    desc: 'ระดมทุนและสนับสนุนศูนย์พัฒนาการจัดสวัสดิการสังคมผู้สูงอายุ บ้านบางแค โดยมอบเงินบริจาคสมทบทุน พร้อมบริจาคสิ่งของจำเป็น เช่น ผ้าอ้อมสำหรับผู้ใหญ่ เครื่องปรุงรส และข้าวสารอาหารแห้ง',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ4.JPG',
    date: 'เสาร์ 15 พ.ย. 2568',
    title: 'โครงการที่ 4: Reforest For Future',
    desc: 'ร่วมกับสโมสรอินเทอร์แรคท์โรงเรียนเทพศิรินทร์ร่มเกล้า จัดโครงการปลูกป่าชายเลน ณ สถานตากอากาศบางปู จ.สมุทรปราการ เพื่อเพิ่มพื้นที่สีเขียว ฟื้นฟูผืนป่าชายเลน และสร้างสมดุลให้ระบบนิเวศชายฝั่ง',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ5.JPG',
    date: 'อังคาร 20 ม.ค. 2569',
    title: 'โครงการที่ 5: Until I Found You',
    desc: 'ร่วมกับโรงเรียนสตรีวิทยา, กรุงเทพคริสเตียนวิทยาลัย และนวมินทราชินูทิศ บดินทรเดชา จัดทำกิจกรรมจิตอาสาผลิต ECO PRODUCT เพื่อช่วยเหลือน้องๆ ในโรงเรียนต่างจังหวัด',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ6.jpg',
    date: 'เสาร์ 20 ธ.ค. 2568',
    title: 'โครงการที่ 6: CAP4EARTH',
    desc: 'ร่วมกับโรงเรียนศรีพฤฒา เปิดรับบริจาคฝาขวดน้ำมอบให้กับโครงการกรีนโรด จ.ลำพูน เพื่อนำไปแปรรูปให้เกิดประโยชน์และส่งเสริมจิตอาสาด้านสิ่งแวดล้อม',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ7.JPG',
    date: 'อาทิตย์ 22 มี.ค. 2569',
    title: 'โครงการที่ 8: เลิกกั๊กแล้วรักเต่า',
    desc: 'ร่วมกับโรงเรียนสตรีวัดมหาพฤฒาราม ร่วมกันขัดบ่อเต่าทะเล ณ ศูนย์อนุรักษ์พันธุ์เต่าทะเล กองทัพเรือ อ.สัตหีบ จ.ชลบุรี เพื่อทำความสะอาด ลดการสะสมของเชื้อโรค และอนุรักษ์เต่าทะเล',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ8.jpg',
    date: 'จันทร์ 3 ส.ค. 2569',
    title: 'โครงการที่ 9: ปันมื้ออิ่มให้น้องจิ๋ว',
    desc: 'ระดมทุนช่วยเหลือและสมทบทุนมื้ออาหารให้แก่บ้านเด็กอ่อนเสือใหญ่ มูลนิธิเด็กอ่อนในสลัมฯ พร้อมมอบสิ่งของจำเป็น เช่น นมผงสำหรับเด็กแรกเกิดถึง 1 ขวบ และน้ำยาฆ่าเชื้อโรคเดทตอล',
    highlight: '',
  },
];

const joinedProjects: Project[] = [
  {
    img: '/images/projects/โครงการ11.JPG',
    date: 'เสาร์ 21 มิ.ย. 2568',
    title: 'งานประชุมใหญ่สโมสรอินเทอร์แรคท์ (ICD)',
    desc: 'Interact District Conference (ICD) ภาค 3350 โรตารีสากล ประจำปี 2567-2568',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ12.JPG',
    date: 'เสาร์ 7 มี.ค. 2569',
    title: 'One day trips จ.ฉะเชิงเทรา',
    desc: 'กิจกรรมทำประโยชน์ ณ โรงพยาบาลคลองเขื่อน อำเภอคลองเขื่อน จังหวัดฉะเชิงเทรา',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ13.jpg',
    date: 'พุธ 5 พ.ย. 2568',
    title: 'กิจกรรมวันอินเทอร์แรคท์โลก',
    desc: 'เข้าร่วมกิจกรรมเนื่องในวันอินเทอร์แรคท์โลก (World Interact Week) ร่วมกับสโมสรอินเทอร์แรคท์ภาค 3350',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ14.JPG',
    date: 'เสาร์ 23 ส.ค. 2568',
    title: 'ICLLS Interact Club Leadership Learning Seminar',
    desc: 'เข้าร่วมงานสัมมนาการเรียนรู้ผู้นำสโมสรอินเทอร์แรคท์ ภาค 3350 โรตารีสากล ประจำปี 2568–2569',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ15.JPG',
    date: 'อังคาร 13 ส.ค. 2568',
    title: 'งาน "Memory lane 60 ปีรอยยิ้มเดิม เติมวันวาน"',
    desc: 'เข้าร่วมงานเฉลิมฉลองการก่อตั้งครบรอบ 60 ปี สโมสรอินเทอร์แรคท์โรงเรียนกรุงเทพคริสเตียนวิทยาลัย',
    highlight: '',
  },
  {
    img: '/images/projects/โครงการ16.JPG',
    date: 'อาทิตย์ 16 พ.ย. 2568',
    title: 'World day of remembrance for road traffic victims',
    desc: 'เข้าร่วมกิจกรรมรำลึกถึงผู้สูญเสียจากอุบัติเหตุทางถนน ณ องค์การสหประชาชาติ (United Nations)',
    highlight: '',
  },
];

function ProjectCard({ p, onClick }: { p: Project; onClick: () => void }) {
  return (
    <div className="p-card" onClick={onClick}>
      <img
        src={p.img}
        alt={p.title}
        className="p-img"
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
      <div className="p-content">
        <span className="p-date">{p.date}</span>
        <div className="p-title">{p.title}</div>
        <div className="p-desc">{p.desc}</div>
        {p.highlight && <div className="p-highlight">{p.highlight}</div>}
      </div>
    </div>
  );
}

export default function Projects() {
  const [modal, setModal] = useState<Project | null>(null);

  return (
    <section className="block reveal" id="projects">
      <div className="wrap" style={{ maxWidth: 'var(--wrap)', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="section-head">
          <div className="eyebrow"><span className="rn">III.</span> โครงการและกิจกรรม</div>
        </div>
        <h2 className="title">สรุปผลการดำเนินโครงการประจำปี 2568–2569</h2>
        <p className="desc">
          รวบรวมโครงการหลักและกิจกรรมที่สโมสรเข้าร่วมตลอดปีบริหาร รุ่นที่ 9 มุ่งเน้นการบริการชุมชน สังคม
          และสิ่งแวดล้อม (คลิกการ์ดโครงการใดก็ได้เพื่อดูรูปและรายละเอียดขนาดใหญ่)
        </p>

        <h3 className="p-group-title">โครงการหลักประจำปี</h3>
        <div className="p-grid">
          {mainProjects.map((p, i) => (
            <ProjectCard key={i} p={p} onClick={() => setModal(p)} />
          ))}
        </div>

        <h3 className="p-group-title">โครงการและกิจกรรมที่เข้าร่วม</h3>
        <div className="p-grid">
          {joinedProjects.map((p, i) => (
            <ProjectCard key={i} p={p} onClick={() => setModal(p)} />
          ))}
        </div>
      </div>

      {/* Project modal */}
      {modal && (
        <div className="modal-overlay active" onClick={() => setModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>รายละเอียดโครงการ</h3>
              <button className="modal-close" onClick={() => setModal(null)}>ปิดหน้าต่าง ✕</button>
            </div>
            <div className="modal-body">
              <img
                src={modal.img}
                alt={modal.title}
                className="modal-img"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="modal-date">{modal.date}</div>
              <div className="modal-title-text">{modal.title}</div>
              <div className="modal-desc-text">{modal.desc}</div>
              {modal.highlight && (
                <div className="modal-highlight-text">{modal.highlight}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

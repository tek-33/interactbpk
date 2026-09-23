import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Committee from '@/components/Committee';
import Projects from '@/components/Projects';
import Announcements from '@/components/Announcements';
import Messages from '@/components/Messages';
import FAQ from '@/components/FAQ';
import AdminPortal from '@/components/AdminPortal';
import BackToTop from '@/components/BackToTop';
import Footer from '@/components/Footer';

function App() {
  return (
    <div>
      <Header />
      <main id="top">
        <Hero />
        <About />
        <Committee />
        <Projects />
        <Announcements />
        <Messages />
        <FAQ />
      </main>
      <Footer />
      <AdminPortal />
      <BackToTop />
    </div>
  );
}

export default App;

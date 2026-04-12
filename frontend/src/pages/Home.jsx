import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { FiMapPin } from 'react-icons/fi';
import ActivityGrid from '../components/ActivityGrid';

const Home = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="landing-auth">
      <div className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-tag">
            <FiMapPin aria-hidden /> Thailand
          </p>
          <h1 className="landing-title">
            <span className="landing-title-line">SMART</span>
            <span className="landing-title-line">GYM</span>
          </h1>
          <p className="landing-desc">
            จัดการสมาชิก คลาส และการจองในที่เดียว พร้อมบันทึกผลการฝึก
            โทนเขียวอ่อนสบายตา เข้าใช้งานได้ทุกบทบาท
          </p>
          <div className="landing-cta">
            <Link to="/register" className="btn btn-primary">เริ่มต้นใช้งาน</Link>
            <Link to="/login" className="btn btn-outline landing-cta-outline">เข้าสู่ระบบ</Link>
          </div>
        </div>
        <div className="landing-hero-visual">
          <ActivityGrid />
        </div>
      </div>
      <div className="landing-brand-mark" aria-hidden>
        <GiWeightLiftingUp />
      </div>
    </div>
  );
};

export default Home;

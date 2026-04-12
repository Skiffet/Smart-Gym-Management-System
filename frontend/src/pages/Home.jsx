import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { FiMapPin } from 'react-icons/fi';
import PublicVisualPanel from '../components/PublicVisualPanel';

const Home = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="split-public split-public--home">
      <PublicVisualPanel />
      <div className="split-public__panel split-public__panel--home">
        <div className="home-panel-inner">
          <Link to="/" className="auth-panel-logo">
            <GiWeightLiftingUp className="auth-panel-logo__icon" aria-hidden />
            <span>Smart Gym</span>
          </Link>
          <div className="auth-panel-switch" role="navigation" aria-label="เข้าใช้งาน">
            <Link to="/login">Login</Link>
            <span className="auth-panel-switch__sep" aria-hidden>|</span>
            <Link to="/register">Register</Link>
          </div>
          <p className="landing-tag home-panel-tag">
            <FiMapPin aria-hidden /> Thailand
          </p>
          <h1 className="home-panel-title">
            <span className="landing-title-line">SMART</span>
            <span className="landing-title-line">GYM</span>
          </h1>
          <p className="home-panel-desc">
            Manage members, classes, and bookings in one place — with full training record tracking.
          </p>
          <div className="landing-cta">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline home-panel-btn-outline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import { GiWeightLiftingUp } from 'react-icons/gi';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <button className="menu-btn" onClick={onToggleSidebar}>
            <FiMenu />
          </button>
        )}
        <Link to="/" className="navbar-brand">
          <GiWeightLiftingUp className="brand-icon" />
          <span>Smart Gym</span>
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-info">
              <FiUser />
              <span>{user.name}</span>
              <span className={`role-badge role-${user.role}`}>{user.role}</span>
            </div>
            <button className="btn btn-outline" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

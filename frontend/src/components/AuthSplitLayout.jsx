import { Link, useLocation } from 'react-router-dom';
import { GiWeightLiftingUp } from 'react-icons/gi';
import PublicVisualPanel from './PublicVisualPanel';

const AuthSplitLayout = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <div className="split-public">
      <PublicVisualPanel />
      <div className="split-public__panel split-public__panel--auth">
        <div className="auth-panel-inner">
          <Link to="/" className="auth-panel-logo">
            <GiWeightLiftingUp className="auth-panel-logo__icon" aria-hidden />
            <span>Smart Gym</span>
          </Link>
          <div
            className="auth-panel-switch auth-panel-switch--segmented"
            role="navigation"
            aria-label="สลับหน้า"
          >
            <Link
              to="/login"
              className={pathname === '/login' ? 'is-active' : undefined}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={pathname === '/register' ? 'is-active' : undefined}
            >
              Register
            </Link>
          </div>
          <div className="auth-panel-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;

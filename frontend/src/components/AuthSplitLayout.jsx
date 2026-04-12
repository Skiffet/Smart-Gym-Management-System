import ActivityGrid from './ActivityGrid';

const AuthSplitLayout = ({ children }) => (
  <div className="landing-auth">
    <div className="auth-split">
      <aside className="auth-split-visual" aria-label="กิจกรรม">
        <ActivityGrid />
      </aside>
      <div className="auth-split-form">{children}</div>
    </div>
  </div>
);

export default AuthSplitLayout;

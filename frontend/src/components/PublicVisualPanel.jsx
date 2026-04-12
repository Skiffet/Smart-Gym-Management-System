import ActivityGrid from './ActivityGrid';

const FEATURES = [
  {
    title: 'Admin',
    text: 'Manage members, classes, and your gym in one place.',
  },
  {
    title: 'Trainer',
    text: 'Run classes, see attendees, and log member workouts.',
  },
  {
    title: 'Member',
    text: 'Book sessions, follow your schedule, and track training history.',
  },
];

const PublicVisualPanel = () => (
  <aside className="split-public__visual" aria-label="App features and activities">
    <div className="public-visual__scrim" aria-hidden />
    <div className="public-visual">
      <header className="public-visual__intro">
        <p className="public-visual__eyebrow">All-in-one gym management</p>
        <h2 className="public-visual__title">What Smart Gym can do</h2>
        <p className="public-visual__lead">
          One platform for modern gyms — bookings, training logs, and clear roles for your whole team.
        </p>
        <ul className="public-visual__features">
          {FEATURES.map((item) => (
            <li key={item.title} className="public-visual__feature">
              <span className="public-visual__feature-role">{item.title}</span>
              <span className="public-visual__feature-text">{item.text}</span>
            </li>
          ))}
        </ul>
      </header>
      <div className="public-visual__activities">
        <p className="public-visual__activities-label">Facility zones</p>
        <ActivityGrid />
      </div>
    </div>
  </aside>
);

export default PublicVisualPanel;

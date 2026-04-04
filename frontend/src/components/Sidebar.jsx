import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiCalendar, FiBookOpen, FiClipboard, FiUser,
} from 'react-icons/fi';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();

  const adminLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FiUsers />, label: 'Manage Users' },
    { to: '/admin/classes', icon: <FiCalendar />, label: 'Manage Classes' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const trainerLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/trainer/classes', icon: <FiCalendar />, label: 'My Classes' },
    { to: '/trainer/records', icon: <FiClipboard />, label: 'Training Records' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const memberLinks = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/member/classes', icon: <FiCalendar />, label: 'Available Classes' },
    { to: '/member/bookings', icon: <FiBookOpen />, label: 'My Bookings' },
    { to: '/member/history', icon: <FiClipboard />, label: 'Training History' },
    { to: '/profile', icon: <FiUser />, label: 'Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'trainer' ? trainerLinks
    : memberLinks;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

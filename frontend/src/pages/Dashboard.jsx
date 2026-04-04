import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { FiUsers, FiCalendar, FiBookOpen, FiClipboard, FiTrendingUp } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user.role === 'admin') {
          const [users, classes, bookings] = await Promise.all([
            API.get('/users'),
            API.get('/classes'),
            API.get('/bookings/all'),
          ]);
          setStats({
            totalUsers: users.data.length,
            totalClasses: classes.data.length,
            totalBookings: bookings.data.length,
            trainers: users.data.filter(u => u.role === 'trainer').length,
            members: users.data.filter(u => u.role === 'member').length,
          });
        } else if (user.role === 'trainer') {
          const [classes, records] = await Promise.all([
            API.get('/classes/my-classes'),
            API.get('/training-records/trainer'),
          ]);
          setStats({
            myClasses: classes.data.length,
            totalRecords: records.data.length,
            activeClasses: classes.data.filter(c => c.status === 'active').length,
          });
        } else {
          const [bookings, records] = await Promise.all([
            API.get('/bookings/my-bookings'),
            API.get('/training-records/member'),
          ]);
          setStats({
            myBookings: bookings.data.filter(b => b.status === 'confirmed').length,
            totalRecords: records.data.length,
            cancelledBookings: bookings.data.filter(b => b.status === 'cancelled').length,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.role]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Welcome, {user.name}!</h1>
        <p className="subtitle">Here's your overview for today</p>
      </div>

      {user.role === 'admin' && (
        <>
          <div className="stats-grid">
            <div className="stat-card purple">
              <FiUsers className="stat-icon" />
              <div>
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card blue">
              <FiCalendar className="stat-icon" />
              <div>
                <h3>{stats.totalClasses}</h3>
                <p>Total Classes</p>
              </div>
            </div>
            <div className="stat-card green">
              <FiBookOpen className="stat-icon" />
              <div>
                <h3>{stats.totalBookings}</h3>
                <p>Total Bookings</p>
              </div>
            </div>
            <div className="stat-card orange">
              <FiTrendingUp className="stat-icon" />
              <div>
                <h3>{stats.trainers}</h3>
                <p>Trainers</p>
              </div>
            </div>
          </div>
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <Link to="/admin/users" className="action-card">
                <FiUsers /> Manage Users
              </Link>
              <Link to="/admin/classes" className="action-card">
                <FiCalendar /> Manage Classes
              </Link>
            </div>
          </div>
        </>
      )}

      {user.role === 'trainer' && (
        <>
          <div className="stats-grid">
            <div className="stat-card blue">
              <FiCalendar className="stat-icon" />
              <div>
                <h3>{stats.myClasses}</h3>
                <p>My Classes</p>
              </div>
            </div>
            <div className="stat-card green">
              <FiClipboard className="stat-icon" />
              <div>
                <h3>{stats.totalRecords}</h3>
                <p>Training Records</p>
              </div>
            </div>
            <div className="stat-card purple">
              <FiTrendingUp className="stat-icon" />
              <div>
                <h3>{stats.activeClasses}</h3>
                <p>Active Classes</p>
              </div>
            </div>
          </div>
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <Link to="/trainer/classes" className="action-card">
                <FiCalendar /> View My Classes
              </Link>
              <Link to="/trainer/records" className="action-card">
                <FiClipboard /> Training Records
              </Link>
            </div>
          </div>
        </>
      )}

      {user.role === 'member' && (
        <>
          <div className="stats-grid">
            <div className="stat-card blue">
              <FiBookOpen className="stat-icon" />
              <div>
                <h3>{stats.myBookings}</h3>
                <p>Active Bookings</p>
              </div>
            </div>
            <div className="stat-card green">
              <FiClipboard className="stat-icon" />
              <div>
                <h3>{stats.totalRecords}</h3>
                <p>Training Records</p>
              </div>
            </div>
            <div className="stat-card orange">
              <FiTrendingUp className="stat-icon" />
              <div>
                <h3>{stats.cancelledBookings}</h3>
                <p>Cancelled</p>
              </div>
            </div>
          </div>
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <Link to="/member/classes" className="action-card">
                <FiCalendar /> Browse Classes
              </Link>
              <Link to="/member/bookings" className="action-card">
                <FiBookOpen /> My Bookings
              </Link>
              <Link to="/member/history" className="action-card">
                <FiClipboard /> Training History
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

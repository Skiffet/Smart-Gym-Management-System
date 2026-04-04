import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiUsers, FiBookOpen } from 'react-icons/fi';

const AvailableClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingIds, setBookingIds] = useState([]);

  const fetchData = async () => {
    try {
      const [classRes, bookingRes] = await Promise.all([
        API.get('/classes'),
        API.get('/bookings/my-bookings'),
      ]);
      setClasses(classRes.data.filter(c => c.status === 'active'));
      setBookingIds(
        bookingRes.data
          .filter(b => b.status === 'confirmed')
          .map(b => b.classId?._id)
      );
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleBook = async (classId) => {
    try {
      await API.post('/bookings', { classId });
      toast.success('Class booked successfully!');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const categoryColors = {
    Yoga: '#8b5cf6', Cardio: '#ef4444', Strength: '#f59e0b',
    HIIT: '#ec4899', Pilates: '#06b6d4', Boxing: '#f97316',
    Dance: '#10b981', Other: '#6b7280',
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Classes</h1>
        <p className="subtitle">Browse and book classes</p>
      </div>

      <div className="class-grid">
        {classes.map((cls) => {
          const isBooked = bookingIds.includes(cls._id);
          const isFull = cls.currentEnrollment >= cls.capacity;
          return (
            <div key={cls._id} className="class-card">
              <div className="class-card-header">
                <span className="category-badge" style={{ backgroundColor: categoryColors[cls.category] }}>
                  {cls.category}
                </span>
                {isBooked && <span className="status-badge status-confirmed">Booked</span>}
                {isFull && !isBooked && <span className="status-badge status-cancelled">Full</span>}
              </div>
              <h3>{cls.name}</h3>
              <p className="class-desc">{cls.description}</p>
              <div className="class-info">
                <span><FiCalendar /> {cls.schedule.day}</span>
                <span><FiClock /> {cls.schedule.startTime} - {cls.schedule.endTime}</span>
                <span><FiUsers /> {cls.currentEnrollment}/{cls.capacity}</span>
              </div>
              <p className="trainer-name">Trainer: {cls.trainer?.name}</p>
              <button
                className={`btn btn-full ${isBooked ? 'btn-disabled' : isFull ? 'btn-disabled' : 'btn-primary'}`}
                onClick={() => handleBook(cls._id)}
                disabled={isBooked || isFull}
              >
                <FiBookOpen /> {isBooked ? 'Already Booked' : isFull ? 'Class Full' : 'Book Now'}
              </button>
            </div>
          );
        })}
        {classes.length === 0 && <p className="no-data">No classes available at the moment</p>}
      </div>
    </div>
  );
};

export default AvailableClasses;

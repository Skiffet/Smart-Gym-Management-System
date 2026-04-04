import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiXCircle } from 'react-icons/fi';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings/my-bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled!');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p className="subtitle">{confirmed.length} active booking(s)</p>
      </div>

      {confirmed.length > 0 && (
        <>
          <h2 className="section-title">Active Bookings</h2>
          <div className="class-grid">
            {confirmed.map((booking) => (
              <div key={booking._id} className="class-card">
                <div className="class-card-header">
                  <span className="category-badge">{booking.classId?.category}</span>
                  <span className="status-badge status-confirmed">Confirmed</span>
                </div>
                <h3>{booking.classId?.name}</h3>
                <div className="class-info">
                  <span><FiCalendar /> {booking.classId?.schedule?.day}</span>
                  <span><FiClock /> {booking.classId?.schedule?.startTime} - {booking.classId?.schedule?.endTime}</span>
                </div>
                <p className="trainer-name">Trainer: {booking.classId?.trainer?.name}</p>
                <p className="booked-date">Booked: {new Date(booking.bookedAt).toLocaleDateString()}</p>
                <button className="btn btn-danger btn-full" onClick={() => handleCancel(booking._id)}>
                  <FiXCircle /> Cancel Booking
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {cancelled.length > 0 && (
        <>
          <h2 className="section-title" style={{ marginTop: '2rem' }}>Cancelled Bookings</h2>
          <div className="class-grid">
            {cancelled.map((booking) => (
              <div key={booking._id} className="class-card class-card-muted">
                <div className="class-card-header">
                  <span className="category-badge">{booking.classId?.category}</span>
                  <span className="status-badge status-cancelled">Cancelled</span>
                </div>
                <h3>{booking.classId?.name}</h3>
                <div className="class-info">
                  <span><FiCalendar /> {booking.classId?.schedule?.day}</span>
                  <span><FiClock /> {booking.classId?.schedule?.startTime} - {booking.classId?.schedule?.endTime}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {bookings.length === 0 && <p className="no-data">No bookings yet. Browse available classes to get started!</p>}
    </div>
  );
};

export default MyBookings;

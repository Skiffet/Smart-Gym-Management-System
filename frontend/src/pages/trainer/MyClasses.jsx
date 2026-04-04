import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiUsers, FiEdit2, FiX, FiClock, FiCalendar } from 'react-icons/fi';

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMembers, setShowMembers] = useState(null);
  const [members, setMembers] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', status: '' });

  const fetchClasses = async () => {
    try {
      const { data } = await API.get('/classes/my-classes');
      setClasses(data);
    } catch (error) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClasses(); }, []);

  const viewMembers = async (classId) => {
    try {
      const { data } = await API.get(`/bookings/class/${classId}`);
      setMembers(data);
      setShowMembers(classId);
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  };

  const openEdit = (cls) => {
    setEditingClass(cls);
    setEditForm({ description: cls.description, status: cls.status });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/classes/${editingClass._id}`, editForm);
      toast.success('Class updated!');
      setEditingClass(null);
      fetchClasses();
    } catch (error) {
      toast.error('Failed to update class');
    }
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Classes</h1>
        <p className="subtitle">Manage your assigned classes</p>
      </div>

      <div className="class-grid">
        {classes.map((cls) => (
          <div key={cls._id} className="class-card">
            <div className="class-card-header">
              <span className="category-badge">{cls.category}</span>
              <span className={`status-badge status-${cls.status}`}>{cls.status}</span>
            </div>
            <h3>{cls.name}</h3>
            <p className="class-desc">{cls.description}</p>
            <div className="class-info">
              <span><FiCalendar /> {cls.schedule.day}</span>
              <span><FiClock /> {cls.schedule.startTime} - {cls.schedule.endTime}</span>
              <span><FiUsers /> {cls.currentEnrollment}/{cls.capacity} enrolled</span>
            </div>
            <div className="class-actions">
              <button className="btn btn-outline btn-sm" onClick={() => viewMembers(cls._id)}>
                <FiUsers /> View Members
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => openEdit(cls)}>
                <FiEdit2 /> Edit
              </button>
            </div>
          </div>
        ))}
        {classes.length === 0 && <p className="no-data">No classes assigned to you yet</p>}
      </div>

      {showMembers && (
        <div className="modal-overlay" onClick={() => setShowMembers(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enrolled Members</h2>
              <button className="btn-icon" onClick={() => setShowMembers(null)}><FiX /></button>
            </div>
            {members.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                  <tbody>
                    {members.map((b) => (
                      <tr key={b._id}>
                        <td>{b.member?.name}</td>
                        <td>{b.member?.email}</td>
                        <td>{b.member?.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No members enrolled yet</p>
            )}
          </div>
        </div>
      )}

      {editingClass && (
        <div className="modal-overlay" onClick={() => setEditingClass(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Class: {editingClass.name}</h2>
              <button className="btn-icon" onClick={() => setEditingClass(null)}><FiX /></button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setEditingClass(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClasses;

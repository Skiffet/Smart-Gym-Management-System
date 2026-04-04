import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', trainer: '', capacity: 20, category: 'Other',
    schedule: { day: 'Monday', startTime: '09:00', endTime: '10:00' },
  });

  const categories = ['Yoga', 'Cardio', 'Strength', 'HIIT', 'Pilates', 'Boxing', 'Dance', 'Other'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const fetchData = async () => {
    try {
      const [classRes, trainerRes] = await Promise.all([
        API.get('/classes'),
        API.get('/users/trainers'),
      ]);
      setClasses(classRes.data);
      setTrainers(trainerRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('schedule.')) {
      const key = name.split('.')[1];
      setForm({ ...form, schedule: { ...form.schedule, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const openCreate = () => {
    setEditingClass(null);
    setForm({
      name: '', description: '', trainer: trainers[0]?._id || '', capacity: 20, category: 'Other',
      schedule: { day: 'Monday', startTime: '09:00', endTime: '10:00' },
    });
    setShowModal(true);
  };

  const openEdit = (cls) => {
    setEditingClass(cls);
    setForm({
      name: cls.name,
      description: cls.description,
      trainer: cls.trainer?._id || '',
      capacity: cls.capacity,
      category: cls.category,
      schedule: cls.schedule,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClass) {
        await API.put(`/classes/${editingClass._id}`, form);
        toast.success('Class updated!');
      } else {
        await API.post('/classes', form);
        toast.success('Class created!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await API.delete(`/classes/${id}`);
      toast.success('Class deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete class');
    }
  };

  const filtered = classes.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    c.trainer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Manage Classes</h1>
          <p className="subtitle">{classes.length} total classes</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Class</button>
      </div>

      <div className="search-bar">
        <FiSearch />
        <input type="text" placeholder="Search classes..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Trainer</th>
              <th>Schedule</th>
              <th>Capacity</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cls) => (
              <tr key={cls._id}>
                <td><strong>{cls.name}</strong></td>
                <td><span className="category-badge">{cls.category}</span></td>
                <td>{cls.trainer?.name || 'N/A'}</td>
                <td>{cls.schedule.day} {cls.schedule.startTime}-{cls.schedule.endTime}</td>
                <td>{cls.capacity}</td>
                <td>
                  <span className={cls.currentEnrollment >= cls.capacity ? 'text-danger' : 'text-success'}>
                    {cls.currentEnrollment}/{cls.capacity}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon btn-edit" onClick={() => openEdit(cls)} title="Edit"><FiEdit2 /></button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(cls._id)} title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="no-data">No classes found</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClass ? 'Edit Class' : 'Create Class'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Class Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Trainer</label>
                  <select name="trainer" value={form.trainer} onChange={handleChange} required>
                    <option value="">Select Trainer</option>
                    {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Day</label>
                  <select name="schedule.day" value={form.schedule.day} onChange={handleChange}>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" name="schedule.startTime" value={form.schedule.startTime} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" name="schedule.endTime" value={form.schedule.endTime} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} min={1} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingClass ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClasses;

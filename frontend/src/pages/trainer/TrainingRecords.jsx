import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const TrainingRecords = () => {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState({
    member: '', classId: '', date: new Date().toISOString().split('T')[0],
    notes: '', performance: 'good',
    exercises: [{ name: '', sets: '', reps: '', weight: '', duration: '' }],
  });

  const fetchData = async () => {
    try {
      const [recRes, memRes, clsRes] = await Promise.all([
        API.get('/training-records/trainer'),
        API.get('/users/members'),
        API.get('/classes/my-classes'),
      ]);
      setRecords(recRes.data);
      setMembers(memRes.data);
      setClasses(clsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleExerciseChange = (index, field, value) => {
    const updated = [...form.exercises];
    updated[index][field] = value;
    setForm({ ...form, exercises: updated });
  };

  const addExercise = () => {
    setForm({ ...form, exercises: [...form.exercises, { name: '', sets: '', reps: '', weight: '', duration: '' }] });
  };

  const removeExercise = (index) => {
    if (form.exercises.length <= 1) return;
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== index) });
  };

  const openCreate = () => {
    setEditingRecord(null);
    setForm({
      member: members[0]?._id || '', classId: '', date: new Date().toISOString().split('T')[0],
      notes: '', performance: 'good',
      exercises: [{ name: '', sets: '', reps: '', weight: '', duration: '' }],
    });
    setShowModal(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setForm({
      member: record.member?._id || '',
      classId: record.classId?._id || '',
      date: new Date(record.date).toISOString().split('T')[0],
      notes: record.notes,
      performance: record.performance,
      exercises: record.exercises.length > 0 ? record.exercises : [{ name: '', sets: '', reps: '', weight: '', duration: '' }],
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      exercises: form.exercises.filter(ex => ex.name).map(ex => ({
        name: ex.name,
        sets: ex.sets ? Number(ex.sets) : undefined,
        reps: ex.reps ? Number(ex.reps) : undefined,
        weight: ex.weight ? Number(ex.weight) : undefined,
        duration: ex.duration ? Number(ex.duration) : undefined,
      })),
    };

    try {
      if (editingRecord) {
        await API.put(`/training-records/${editingRecord._id}`, payload);
        toast.success('Record updated!');
      } else {
        await API.post('/training-records', payload);
        toast.success('Record created!');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training record?')) return;
    try {
      await API.delete(`/training-records/${id}`);
      toast.success('Record deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const performanceColors = { excellent: '#10b981', good: '#3b82f6', average: '#f59e0b', needs_improvement: '#ef4444' };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Training Records</h1>
          <p className="subtitle">Record and manage training sessions</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> New Record</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Member</th>
              <th>Class</th>
              <th>Performance</th>
              <th>Exercises</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td>{new Date(rec.date).toLocaleDateString()}</td>
                <td>{rec.member?.name}</td>
                <td>{rec.classId?.name || '-'}</td>
                <td>
                  <span className="performance-badge" style={{ backgroundColor: performanceColors[rec.performance] }}>
                    {rec.performance.replace('_', ' ')}
                  </span>
                </td>
                <td>{rec.exercises.length} exercise(s)</td>
                <td className="truncate">{rec.notes || '-'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon btn-edit" onClick={() => openEdit(rec)}><FiEdit2 /></button>
                    <button className="btn-icon btn-delete" onClick={() => handleDelete(rec._id)}><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <p className="no-data">No training records yet</p>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRecord ? 'Edit Record' : 'New Training Record'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Member</label>
                  <select name="member" value={form.member} onChange={handleChange} required>
                    <option value="">Select Member</option>
                    {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Class (optional)</label>
                  <select name="classId" value={form.classId} onChange={handleChange}>
                    <option value="">No class</option>
                    {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Performance</label>
                  <select name="performance" value={form.performance} onChange={handleChange}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="needs_improvement">Needs Improvement</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Exercises</label>
                {form.exercises.map((ex, i) => (
                  <div key={i} className="exercise-row">
                    <input placeholder="Exercise name" value={ex.name} onChange={(e) => handleExerciseChange(i, 'name', e.target.value)} required />
                    <input placeholder="Sets" type="number" value={ex.sets} onChange={(e) => handleExerciseChange(i, 'sets', e.target.value)} className="input-sm" />
                    <input placeholder="Reps" type="number" value={ex.reps} onChange={(e) => handleExerciseChange(i, 'reps', e.target.value)} className="input-sm" />
                    <input placeholder="Weight(kg)" type="number" value={ex.weight} onChange={(e) => handleExerciseChange(i, 'weight', e.target.value)} className="input-sm" />
                    <input placeholder="Dur(min)" type="number" value={ex.duration} onChange={(e) => handleExerciseChange(i, 'duration', e.target.value)} className="input-sm" />
                    <button type="button" className="btn-icon btn-delete" onClick={() => removeExercise(i)}>
                      <FiX />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline btn-sm" onClick={addExercise}>
                  <FiPlus /> Add Exercise
                </button>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingRecord ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingRecords;

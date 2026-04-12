import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiCalendar, FiUser, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TrainingHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data } = await API.get('/training-records/member');
        setRecords(data);
      } catch (error) {
        toast.error('Failed to fetch training history');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const performanceColors = {
    excellent: '#10b981', good: '#3b82f6',
    average: '#f59e0b', needs_improvement: '#ef4444',
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Training History</h1>
        <p className="subtitle">{records.length} session(s) recorded</p>
      </div>

      {records.length > 0 ? (
        <div className="record-list">
          {records.map((rec) => (
            <div key={rec._id} className="record-card">
              <div className="record-header" onClick={() => setExpandedId(expandedId === rec._id ? null : rec._id)}>
                <div className="record-info">
                  <div className="record-date">
                    <FiCalendar />
                    <span>{new Date(rec.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="record-meta">
                    <span><FiUser /> {rec.trainer?.name}</span>
                    {rec.classId && <span className="category-badge">{rec.classId.name}</span>}
                    <span className="performance-badge" style={{ backgroundColor: performanceColors[rec.performance] }}>
                      {rec.performance.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                {expandedId === rec._id ? <FiChevronUp /> : <FiChevronDown />}
              </div>

              {expandedId === rec._id && (
                <div className="record-details">
                  {rec.notes && <p className="record-notes">{rec.notes}</p>}
                  {rec.exercises.length > 0 && (
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>Exercise</th>
                            <th>Sets</th>
                            <th>Reps</th>
                            <th>Weight (kg)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rec.exercises.map((ex, i) => (
                            <tr key={i}>
                              <td><strong>{ex.name}</strong></td>
                              <td>{ex.sets || '-'}</td>
                              <td>{ex.reps || '-'}</td>
                              <td>{ex.weight || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No training records yet. Your trainer will record your sessions here.</p>
      )}
    </div>
  );
};

export default TrainingHistory;

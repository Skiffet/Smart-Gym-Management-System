import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="subtitle">Update your personal information</p>
      </div>
      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FiUser /> Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label><FiPhone /> Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input type="text" value={user?.role} disabled className="input-disabled" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            <FiSave /> {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

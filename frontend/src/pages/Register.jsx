import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import AuthSplitLayout from '../components/AuthSplitLayout';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="auth-form auth-form--dark">
        <div className="auth-header auth-header--compact">
          <h1>Join Smart Gym</h1>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FiUser /> Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label><FiMail /> Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label><FiPhone /> Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your phone number" />
          </div>
          <div className="form-group">
            <label><FiLock /> Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" required />
          </div>
          <div className="form-group">
            <label><FiLock /> Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm your password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
};

export default Register;

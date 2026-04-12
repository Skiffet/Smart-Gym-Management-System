import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ManageUsers from './pages/admin/ManageUsers';
import ManageClasses from './pages/admin/ManageClasses';
import MyClasses from './pages/trainer/MyClasses';
import TrainingRecords from './pages/trainer/TrainingRecords';
import AvailableClasses from './pages/member/AvailableClasses';
import MyBookings from './pages/member/MyBookings';
import TrainingHistory from './pages/member/TrainingHistory';

const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-body">
        {user && <Sidebar isOpen={sidebarOpen} />}
        <main className={`main-content ${user && sidebarOpen ? 'with-sidebar' : ''}`}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/classes" element={<ProtectedRoute roles={['admin']}><ManageClasses /></ProtectedRoute>} />

            {/* Trainer Routes */}
            <Route path="/trainer/classes" element={<ProtectedRoute roles={['trainer']}><MyClasses /></ProtectedRoute>} />
            <Route path="/trainer/records" element={<ProtectedRoute roles={['trainer']}><TrainingRecords /></ProtectedRoute>} />

            {/* Member Routes */}
            <Route path="/member/classes" element={<ProtectedRoute roles={['member']}><AvailableClasses /></ProtectedRoute>} />
            <Route path="/member/bookings" element={<ProtectedRoute roles={['member']}><MyBookings /></ProtectedRoute>} />
            <Route path="/member/history" element={<ProtectedRoute roles={['member']}><TrainingHistory /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <AppLayout />
    </Router>
  </AuthProvider>
);

export default App;

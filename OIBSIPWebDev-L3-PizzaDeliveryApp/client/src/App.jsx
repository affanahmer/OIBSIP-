import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import CustomPizzaBuilder from './pages/CustomPizzaBuilder';
import OrderSummary from './pages/OrderSummary';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="nav">
      <div className="logo"><h2>PizzaApp</h2></div>
      <div className="nav-links">
        {user ? (
          <>
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>Dashboard</Link>
            <button onClick={logout} style={{ width: 'auto', marginLeft: '15px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          <Route path="/dashboard" element={<PrivateRoute role="user"><UserDashboard /></PrivateRoute>} />
          <Route path="/build-pizza" element={<PrivateRoute role="user"><CustomPizzaBuilder /></PrivateRoute>} />
          <Route path="/order-summary" element={<PrivateRoute role="user"><OrderSummary /></PrivateRoute>} />
          
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

// client/src/App.jsx
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import SalesDashboard from './pages/sales/SalesDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Settings from './pages/settings/Settings';
import LeadManagement from './pages/leads/LeadManagement';
import PrivateRoute from './PrivateRoute';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminDashboard.DashboardContent />} />
            <Route path="settings" element={<Settings />} />
            <Route path="leads" element={<LeadManagement />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute allowedRoles={['hr', 'admin']} />}>
          <Route path="/hr" element={<HRDashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['sales']} />}>
          <Route path="/sales" element={<SalesDashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['employee']} />}>
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

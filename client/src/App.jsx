// client/src/App.jsx
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import AdminDashboard from './pages/admin/AdminDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import SalesDashboard from './pages/sales/SalesDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Settings from './pages/settings/Settings';
import LeadManagement from './pages/leads/LeadManagement';
import Invoices from './pages/invoices/Invoices';
import CreateInvoice from './pages/invoices/CreateInvoice';
import EditInvoice from './pages/invoices/EditInvoice';
import InvoiceView from './pages/invoices/InvoiceView';
import TaskManagement from './pages/tasks/TaskManagement';
import HelpSupport from './pages/help/HelpSupport';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';
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
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/create" element={<CreateInvoice />} />
            <Route path="invoices/:id" element={<InvoiceView />} />
            <Route path="invoices/:id/edit" element={<EditInvoice />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute allowedRoles={['admin', 'hr', 'employee', 'sales']} />}>
          <Route path="/help" element={<HelpSupport />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['admin', 'hr', 'sales']} />}>
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['admin', 'hr', 'employee']} />}>
          <Route path="/tasks" element={<TaskManagement />} />
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/api';

const roles = [
  { label: 'Admin', path: '/admin', color: 'bg-gray-800' },
  { label: 'HR', path: '/hr', color: 'bg-blue-500' },
  { label: 'Sales', path: '/sales', color: 'bg-green-500' },
  { label: 'Employee', path: '/employee', color: 'bg-yellow-500' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const data = await login({ email, password });
    if (data.token && data.user) {
      switch (data.user.role) {
        case 'admin': navigate('/admin'); break;
        case 'hr': navigate('/hr'); break;
        case 'sales': navigate('/sales'); break;
        case 'employee': navigate('/employee'); break;
        default: navigate('/'); break;
      }
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NexusERP</h1>
          <p className="text-gray-500 text-sm">Enterprise Resource Planning</p>
          <div className="flex items-center mt-2">
            <svg className="w-4 h-4 text-teal-500 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 11v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="text-teal-500 text-xs font-medium">Secure Login</span>
          </div>
        </div>
        <form className="w-full" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Email Address</label>
            <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" checked={remember} onChange={e => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className="text-teal-500 text-sm hover:underline">Forgot password?</a>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition mb-2">Sign In</button>
        </form>
        <div className="text-sm text-gray-500 mb-4">Don't have an account? <a href="/signup" className="text-teal-500 hover:underline">Register as...</a></div>
        <div className="flex w-full gap-3 mt-2">
          {roles.map(role => (
            <button
              key={role.label}
              className={`flex-1 py-2 rounded-lg text-white font-semibold ${role.color}`}
              onClick={() => navigate(role.path)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../services/api';

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'HR', value: 'hr' },
  { label: 'Sales', value: 'sales' },
  { label: 'Employee', value: 'employee' },
];

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const data = await signup({ name, email, password, role });
    if (data.message && !data.error) {
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 1200);
    } else {
      setError(data.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Register</h1>
          <p className="text-gray-500 text-sm">Create your NexusERP account</p>
        </div>
        <form className="w-full" onSubmit={handleSignup}>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <div className="mb-3">
            <label className="block text-gray-700 text-sm mb-1">Full Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm mb-1">Email Address</label>
            <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm mb-1">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-sm mb-1">Confirm Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" placeholder="********" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm mb-1">Role</label>
            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200" value={role} onChange={e => setRole(e.target.value)}>
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition mb-2">Sign Up</button>
        </form>
        <div className="text-sm text-gray-500 mt-2">Already have an account? <a href="/login" className="text-teal-500 hover:underline">Login</a></div>
      </div>
    </div>
  );
} 
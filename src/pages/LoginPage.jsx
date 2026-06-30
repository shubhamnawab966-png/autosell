import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Logo.jsx';

const API_BASE_URL = 'http://localhost:5000';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validate inputs
      if (!email || !password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }

      console.log('Attempting login with:', email);

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      console.log('Login response:', data);

      // Check if login was successful
      if (!res.ok) {
        throw new Error(data.error || data.detail || 'Login failed');
      }

      // Check if response has token
      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Save token and redirect
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      
      console.log('Login successful, redirecting to dashboard');
      
      // Small delay to ensure token is saved
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Connection error. Make sure backend is running on port 5000');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="bg-surface-900 p-8 rounded-2xl w-full max-w-md">
        <Logo />
        <h2 className="text-white text-2xl font-bold mt-4 mb-6">Welcome back</h2>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700 p-3 rounded-lg mb-4">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            className="w-full mb-3 p-3 rounded-lg bg-surface-800 text-white placeholder-gray-500 focus:outline-none focus:border focus:border-cyan-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            className="w-full mb-4 p-3 rounded-lg bg-surface-800 text-white placeholder-gray-500 focus:outline-none focus:border focus:border-cyan-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-700 text-white p-3 rounded-lg font-bold transition-colors"
          >
            {loading ? '⏳ Signing in...' : '✓ Sign in'}
          </button>
        </form>

        <p className="text-slate-400 mt-4 text-center">
          New? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300">Create account</Link>
        </p>

        <p className="text-gray-500 text-xs mt-6 text-center">
          Backend: http://localhost:5000 ✓
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/Logo.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="bg-surface-900 p-8 rounded-2xl w-full max-w-md">
        <Logo />
        <h2 className="text-white text-2xl font-bold mt-4 mb-6">Welcome back</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input className="w-full mb-3 p-3 rounded-lg bg-surface-800 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full mb-3 p-3 rounded-lg bg-surface-800 text-white" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} disabled={loading} className="w-full bg-cyan-500 text-white p-3 rounded-lg font-bold">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-slate-400 mt-4 text-center">New? <Link to="/signup" className="text-cyan-400">Create account</Link></p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://autosell-production-b292.up.railway.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="bg-surface-900 p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-6">Create account</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <input className="w-full mb-3 p-3 rounded-lg bg-surface-800 text-white" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full mb-3 p-3 rounded-lg bg-surface-800 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full mb-6 p-3 rounded-lg bg-surface-800 text-white" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleSignup} disabled={loading} className="w-full bg-cyan-500 text-white p-3 rounded-lg font-bold">
          {loading ? 'Creating...' : 'Create account'}
        </button>
        <p className="text-slate-400 mt-4 text-center">Already have account? <Link to="/login" className="text-cyan-400">Sign in</Link></p>
      </div>
    </div>
  );
}

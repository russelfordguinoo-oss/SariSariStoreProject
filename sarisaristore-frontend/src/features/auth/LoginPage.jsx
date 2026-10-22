import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { preferences } = usePreferences();
  const navigate = useNavigate();
  const { branding } = preferences;

  async function handleSubmit(e) {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(email, password); navigate('/dashboard'); }
    catch { setError('Invalid email or password'); }
    finally { setLoading(false); }
  }

  return <div data-store-theme="mono" className="relative min-h-screen overflow-hidden bg-black p-4 sm:p-8">
    <div className="pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-white/10 blur-3xl" /><div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
    <div className="relative mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-[1.1fr_.9fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-neutral-700 p-10 text-white lg:flex lg:flex-col">
        {branding.banner && <img src={branding.banner} alt="Store banner" className="absolute inset-0 h-full w-full object-cover opacity-20" />}
        <div className="relative flex items-center gap-3">{branding.logo ? <img src={branding.logo} alt="Store logo" className="h-12 w-12 rounded-2xl object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl font-black text-black">S</span>}<div><p className="text-xs font-bold tracking-[.2em] text-white">STORE MANAGER</p><h1 className="text-xl font-extrabold">{branding.name}</h1></div></div>
        <div className="relative my-auto"><p className="text-sm font-bold uppercase tracking-[.16em] text-white">Simple. Local. Ready.</p><h2 className="mt-4 max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight">Your store, beautifully organized.</h2><p className="mt-6 max-w-sm text-lg leading-relaxed text-slate-200">Manage products, sales, and inventory in one friendly workspace designed for everyday store owners.</p></div>
        <div className="relative flex gap-3 text-sm text-slate-200"><span className="rounded-full bg-white/10 px-3 py-2">Easy sales</span><span className="rounded-full bg-white/10 px-3 py-2">Live stock</span><span className="rounded-full bg-white/10 px-3 py-2">Clear reports</span></div>
      </aside>
      <main className="flex items-center justify-center bg-white p-6 sm:p-10"><form onSubmit={handleSubmit} className="w-full max-w-md"><div className="mb-9 text-center lg:text-left"><div className="mb-5 flex justify-center lg:hidden">{branding.logo ? <img src={branding.logo} alt="Store logo" className="h-14 w-14 rounded-2xl object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl font-black text-white">S</span>}</div><p className="text-xs font-bold tracking-[.18em] text-black">WELCOME BACK</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Sign in to your store</h2><p className="mt-2 text-slate-500">Enter your details to continue managing {branding.name}.</p></div>
        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        <label className="mb-5 block text-sm font-bold text-slate-700">Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 font-normal outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-100" required autoComplete="email" /></label>
        <label className="mb-6 block text-sm font-bold text-slate-700">Password<div className="relative mt-2"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3.5 pr-20 font-normal outline-none transition focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-100" required autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-red-700 hover:bg-red-50">{showPassword ? 'Hide' : 'Show'}</button></div></label>
        <button type="submit" disabled={loading} className="w-full rounded-xl bg-black py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button><Link to="/about" className="mt-3 block w-full rounded-xl border border-slate-300 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">View Tindahan features</Link><p className="mt-6 text-center text-xs text-slate-400">Secure access for authorized store staff only.</p>
      </form></main>
    </div>
  </div>;
}
export default LoginPage;

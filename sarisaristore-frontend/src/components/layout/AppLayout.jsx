import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import AssistantWidget from '../assistant/AssistantWidget';

const allNavigation = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', id: 'dashboard' }, { to: '/products', label: 'Products', icon: 'products', id: 'products' },
  { to: '/inventory', label: 'Inventory', icon: 'inventory', id: 'inventory' }, { to: '/sales', label: 'Sales / POS', icon: 'sales', id: 'sales' },
  { to: '/transactions', label: 'Transactions', icon: 'transactions', id: 'transactions' }, { to: '/reports', label: 'Reports', icon: 'reports', id: 'reports' },
  { to: '/settings', label: 'Settings', icon: 'settings', id: 'settings' },
];
function NavIcon({ name }) { const paths = { dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>, products: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9" /></>, inventory: <><path d="M4 7h16v13H4zM7 3h10v4H7z" /><path d="M8 12h8M8 16h5" /></>, sales: <><path d="M4 5h16l-1 14H5L4 5Z" /><path d="M8 9h8M9 5l1-2h4l1 2M9 13h6" /></>, transactions: <><path d="M20 7h-9a4 4 0 0 0-4 4v6" /><path d="m3 14 4 4 4-4M4 17h9a4 4 0 0 0 4-4V7" /><path d="m21 10-4-4-4 4" /></>, reports: <><path d="M5 3h10l4 4v14H5z" /><path d="M15 3v5h5M8 17v-3M12 17v-6M16 17v-9" /></>, settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.2 2.2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3.2v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.2-2.2.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1h-.2v-3.2h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.2-2.2.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3.2v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.2 2.2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v3.2h-.2a1.7 1.7 0 0 0-1.5 1Z" /></> }; return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">{paths[name]}</svg>; }

function AppLayout() {
  const { user, logout } = useAuth(); const { preferences, updateSection } = usePreferences(); const navigate = useNavigate(); const location = useLocation();
  const { branding, theme, navigation } = preferences; const collapsed = theme.sidebar === 'collapsed';
  const navigationItems = [...navigation.order.map((id) => allNavigation.find((item) => item.id === id)).filter(Boolean), allNavigation.find((item) => item.id === 'settings')];
  useEffect(() => { const current = allNavigation.find((item) => item.to === location.pathname); if (current && current.id !== 'settings') updateSection('navigation', { recent: [current.id, ...navigation.recent.filter((id) => id !== current.id)].slice(0, 3) }); }, [location.pathname]);
  function handleLogout() { logout(); navigate('/login'); }
  return <div style={{ '--store-primary': theme.primary, '--store-secondary': theme.secondary, '--store-accent': theme.accent }} className={`${theme.mode === 'dark' ? 'dark bg-slate-950' : 'bg-[#f8f8f7]'} min-h-screen text-slate-800 dark:text-slate-100 lg:flex`}>
    <aside style={{ backgroundColor: 'var(--store-primary)' }} className={`${collapsed ? 'lg:w-20' : 'lg:w-64'} text-white transition-all duration-200 lg:fixed lg:inset-y-0 lg:flex lg:flex-col`}>
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-7"><div className="flex items-center gap-3">{branding.logo ? <img src={branding.logo} alt="Store logo" className="h-9 w-9 rounded-xl object-cover" /> : <span style={{ backgroundColor: 'var(--store-secondary)' }} className="flex h-9 w-9 items-center justify-center rounded-xl font-black text-red-950">S</span>}<div className={collapsed ? 'lg:hidden' : ''}><p className="text-xs font-bold tracking-[0.2em] text-yellow-200">STORE MANAGER</p><h1 className="mt-1 truncate text-xl font-extrabold tracking-tight">{branding.name}</h1></div></div><button onClick={handleLogout} className="rounded-xl border border-white/30 px-3 py-2 text-sm font-semibold lg:hidden">Log out</button></div>
      <nav className="flex gap-1 overflow-x-auto border-t border-white/15 px-3 py-3 lg:block lg:space-y-1 lg:border-0 lg:px-4">{navigationItems.map((item) => <NavLink title={collapsed ? item.label : undefined} key={item.to} to={item.to} style={({ isActive }) => isActive ? { backgroundColor: 'var(--store-secondary)', color: '#450a0a' } : {}} className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'shadow-lg' : 'text-red-100 hover:bg-white/10 hover:text-white'}`}><NavIcon name={item.icon} /><span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>{navigation.favorites.includes(item.id) && <span className={`${collapsed ? 'hidden' : ''} ml-auto text-yellow-200`}>★</span>}</NavLink>)}</nav>
      <div className={`mt-auto hidden border-t border-white/15 px-6 py-5 lg:block ${collapsed ? 'lg:px-4' : ''}`}><p className={`${collapsed ? 'lg:hidden' : ''} truncate text-sm font-semibold`}>{user?.name || user?.email || 'Store owner'}</p><button onClick={handleLogout} className="mt-3 text-sm font-semibold text-yellow-200 hover:text-white">{collapsed ? 'Exit' : 'Log out'}</button></div>
    </aside><main className={`${collapsed ? 'lg:ml-20' : 'lg:ml-64'} min-w-0 flex-1 transition-all duration-200 dark:bg-slate-950`}><Outlet /></main><AssistantWidget />
  </div>;
}
export default AppLayout;

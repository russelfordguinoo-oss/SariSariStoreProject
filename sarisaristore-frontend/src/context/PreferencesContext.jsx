import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sari-sari-preferences';
const defaults = {
  branding: { name: 'Sari-Sari Store', logo: '', banner: '', address: '', phone: '', email: '', hours: '', description: '' },
  theme: { primary: '#b91c1c', secondary: '#facc15', accent: '#fef3c7', mode: 'light', sidebar: 'expanded', density: 'comfortable' },
  dashboard: { cards: ['today', 'month', 'products', 'lowStock'], visible: { today: true, month: true, products: true, lowStock: true, chart: true, transactions: true }, pinned: ['sale', 'product'] },
  navigation: { order: ['dashboard', 'products', 'inventory', 'sales', 'transactions', 'credits', 'reports'], favorites: [], recent: [] },
  inventory: { sort: 'name', view: 'detailed', pageSize: '25', filters: '', alertThreshold: '5' },
  notifications: { lowStock: true, outOfStock: true, newSales: true, orders: false, announcements: true },
};

function readPreferences() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)), branding: { ...defaults.branding, ...JSON.parse(localStorage.getItem(STORAGE_KEY))?.branding }, theme: { ...defaults.theme, ...JSON.parse(localStorage.getItem(STORAGE_KEY))?.theme }, dashboard: { ...defaults.dashboard, ...JSON.parse(localStorage.getItem(STORAGE_KEY))?.dashboard }, navigation: { ...defaults.navigation, ...JSON.parse(localStorage.getItem(STORAGE_KEY))?.navigation }, inventory: { ...defaults.inventory, ...JSON.parse(localStorage.getItem(STORAGE_KEY))?.inventory }, notifications: { ...defaults.notifications, ...JSON.parse(localStorage.getItem(STORAGE_KEY))?.notifications } }; } catch { return defaults; }
}

const PreferencesContext = createContext(null);
export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(readPreferences);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); document.documentElement.style.colorScheme = preferences.theme.mode; }, [preferences]);
  const value = useMemo(() => ({ preferences, updateSection: (section, values) => setPreferences((current) => ({ ...current, [section]: { ...current[section], ...values } })), resetPreferences: () => setPreferences(defaults) }), [preferences]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
export function usePreferences() { return useContext(PreferencesContext); }

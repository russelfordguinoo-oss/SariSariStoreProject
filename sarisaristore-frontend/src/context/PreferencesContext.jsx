import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'sari-sari-preferences';
const defaults = {
  branding: { name: 'Sari-Sari Store', logo: '', banner: '', address: '', phone: '', email: '', hours: '', description: '' },
  theme: { mode: 'light', sidebar: 'expanded', density: 'comfortable' },
  dashboard: { cards: ['today', 'month', 'products', 'lowStock'], visible: { today: true, month: true, products: true, lowStock: true, chart: true, transactions: true }, pinned: ['sale', 'product'] },
  navigation: { order: ['dashboard', 'products', 'inventory', 'sales', 'transactions', 'credits', 'reports'], favorites: [], recent: [] },
  inventory: { sort: 'name', view: 'detailed', pageSize: '25', filters: '', alertThreshold: '5' },
  notifications: { lowStock: true, outOfStock: true, newSales: true, orders: false, announcements: true },
};

function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const savedTheme = { ...saved.theme };
    delete savedTheme.primary;
    delete savedTheme.secondary;
    delete savedTheme.accent;
    return {
      ...defaults,
      ...saved,
      branding: { ...defaults.branding, ...saved.branding },
      theme: { ...defaults.theme, ...savedTheme },
      dashboard: { ...defaults.dashboard, ...saved.dashboard },
      navigation: { ...defaults.navigation, ...saved.navigation },
      inventory: { ...defaults.inventory, ...saved.inventory },
      notifications: { ...defaults.notifications, ...saved.notifications },
    };
  } catch { return defaults; }
}

const PreferencesContext = createContext(null);
export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(readPreferences);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); document.documentElement.style.colorScheme = preferences.theme.mode; }, [preferences]);
  const value = useMemo(() => ({ preferences, updateSection: (section, values) => setPreferences((current) => ({ ...current, [section]: { ...current[section], ...values } })), resetPreferences: () => setPreferences(defaults) }), [preferences]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
export function usePreferences() { return useContext(PreferencesContext); }

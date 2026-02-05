export type Theme = 'light' | 'dark';

export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const setTheme = (theme: Theme): void => {
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
};

export const toggleTheme = (): Theme => {
  const current = getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

// Initialize theme on load
if (typeof window !== 'undefined') {
  const theme = getTheme();
  setTheme(theme);

  // Watch for system theme changes (only if no manual preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

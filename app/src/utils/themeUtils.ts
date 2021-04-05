export const getColorScheme = (): Theme => {
  const osTheme: Theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const selectedTheme: Theme = localStorage.getItem('theme') as Theme;
  return selectedTheme ?? osTheme;
};

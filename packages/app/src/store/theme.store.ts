import createStore from './createStore';
import { getColorScheme } from '../utils';

const useThemeStore = createStore(
  {
    theme: getColorScheme()
  },
  (set) => ({
    setTheme: (theme: Theme) => {
      set(() => ({ theme }));
      localStorage.setItem('theme', theme);
    }
  })
);

export default useThemeStore;

import { defineStore } from 'pinia';

interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    theme: getStorageItem<Theme>('todo-theme', {
      primary: 'purple',
      secondary: 'violet',
      accent: 'indigo',
      background: 'purple-50'
    }),
    animations: getStorageItem('todo-animations', true),
    compactMode: getStorageItem('todo-compact-mode', false),
    showDescriptions: getStorageItem('todo-show-descriptions', true),
    defaultView: getStorageItem('todo-default-view', 'list'),
    sidebarOpen: getStorageItem('todo-sidebar-open', true)
  }),

  actions: {
    updateTheme(newTheme: Partial<Theme>) {
      this.theme = { ...this.theme, ...newTheme };
      setStorageItem('todo-theme', this.theme);
      document.documentElement.className = `theme-${this.theme.primary}`;
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      setStorageItem('todo-sidebar-open', this.sidebarOpen);
    },

    resetPreferences() {
      this.theme = {
        primary: 'purple',
        secondary: 'violet',
        accent: 'indigo',
        background: 'purple-50'
      };
      this.animations = true;
      this.compactMode = false;
      this.showDescriptions = true;
      this.defaultView = 'list';

      // Save all reset values to localStorage
      setStorageItem('todo-theme', this.theme);
      setStorageItem('todo-animations', this.animations);
      setStorageItem('todo-compact-mode', this.compactMode);
      setStorageItem('todo-show-descriptions', this.showDescriptions);
      setStorageItem('todo-default-view', this.defaultView);

      // Update CSS variables
      document.documentElement.className = `theme-${this.theme.primary}`;
    }
  }
});

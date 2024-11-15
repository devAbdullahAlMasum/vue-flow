<template>
  <div
    class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 shadow-lg transition-transform duration-300"
    :class="[preferences.sidebarOpen ? 'translate-x-0' : '-translate-x-full']"
  >
    <div class="h-full overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Settings</h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <!-- Theme Settings -->
        <div class="mb-8">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Theme</h3>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="color in themeColors"
              :key="color.value"
              @click="updateTheme(color.value)"
              class="p-2 rounded-lg border transition-all hover:shadow-sm"
              :class="getButtonClasses(color.value)"
            >
              <div class="w-full h-6 rounded" :class="getColorClasses(color.value)">
                <div class="w-full h-full rounded bg-gradient-to-r" :class="getGradientClasses(color.value)"></div>
              </div>
              <span class="text-xs mt-1 block text-center">{{ color.label }}</span>
            </button>
          </div>
        </div>

        <!-- Reset Button -->
        <button
          @click="resetSettings"
          class="w-full px-4 py-2 text-sm text-red-600 rounded-lg border border-red-200 hover:bg-red-50"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  </div>

  <!-- Backdrop -->
  <div
    v-if="preferences.sidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();

const themeColors = [
  { value: 'purple', label: 'Lavender', from: 'from-purple-500', to: 'to-purple-600' },
  { value: 'indigo', label: 'Twilight', from: 'from-indigo-500', to: 'to-indigo-600' },
  { value: 'blue', label: 'Ocean', from: 'from-blue-500', to: 'to-blue-600' },
  { value: 'rose', label: 'Coral', from: 'from-rose-500', to: 'to-rose-600' },
  { value: 'amber', label: 'Sunset', from: 'from-amber-500', to: 'to-amber-600' },
  { value: 'green', label: 'Mint', from: 'from-green-500', to: 'to-green-600' }
];

const getButtonClasses = (color: string) => {
  const isSelected = preferences.theme.primary === color;
  return {
    [`border-${color}-200`]: isSelected,
    [`bg-${color}-50`]: isSelected,
    'border-gray-200': !isSelected,
    'hover:border-gray-300': !isSelected
  };
};

const getColorClasses = (color: string) => {
  return `bg-${color}-100 overflow-hidden`;
};

const getGradientClasses = (color: string) => {
  const colorInfo = themeColors.find(c => c.value === color);
  return [colorInfo?.from, colorInfo?.to];
};

const updateTheme = (color: string) => {
  preferences.updateTheme({ primary: color });
  document.documentElement.className = `theme-${color}`;
};

const resetSettings = () => {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    preferences.resetPreferences();
    document.documentElement.className = 'theme-green';
  }
};

defineEmits(['close']);
</script>

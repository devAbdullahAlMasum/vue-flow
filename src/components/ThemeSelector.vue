<template>
  <Menu as="div" class="relative">
    <MenuButton
      :class="[
        'flex items-center gap-2 px-3 py-2 rounded-lg bg-white border transition-colors',
        `border-${preferences.theme.primary}-200`,
        `hover:bg-${preferences.theme.primary}-50`
      ]"
    >
      <SwatchIcon :class="`h-5 w-5 text-${preferences.theme.primary}-600`" />
      <span class="text-sm font-medium">Theme</span>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="p-2 space-y-1">
          <MenuItem v-slot="{ active }">
            <button
              v-for="color in themeColors"
              :key="color.value"
              @click="preferences.updateTheme({ primary: color.value })"
              :class="[
                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                active ? `bg-${color.value}-50 text-${color.value}-700` : 'text-gray-700',
                'transition-colors'
              ]"
            >
              <div :class="`w-4 h-4 rounded-full bg-${color.value}-500 mr-2`"></div>
              {{ color.label }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import { SwatchIcon } from '@heroicons/vue/24/outline';
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();

const themeColors = [
  { value: 'purple', label: 'Lavender' },
  { value: 'indigo', label: 'Twilight' },
  { value: 'blue', label: 'Ocean' },
  { value: 'rose', label: 'Coral' },
  { value: 'amber', label: 'Sunset' },
  { value: 'green', label: 'Mint' }
];
</script>

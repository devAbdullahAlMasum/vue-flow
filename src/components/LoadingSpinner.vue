<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="relative">
      <div class="w-20 h-20 border-4 rounded-full" :class="`border-${preferences.theme.primary}-200`"></div>
      <div
        class="absolute top-0 w-20 h-20 border-4 rounded-full border-t-transparent animate-spin"
        :class="`border-${preferences.theme.primary}-500`"
      ></div>
      <div class="mt-4 text-center text-white font-medium">Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();
</script>

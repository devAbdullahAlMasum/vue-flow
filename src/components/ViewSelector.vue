<template>
  <div class="flex items-center gap-1 bg-white rounded-lg p-1 border border-gray-200">
    <button
      v-for="view in views"
      :key="view.value"
      @click="$emit('update:modelValue', view.value)"
      :class="[
        'p-2 rounded-md transition-colors',
        modelValue === view.value
          ? `bg-${preferences.theme.primary}-100 text-${preferences.theme.primary}-700`
          : `text-${preferences.theme.primary}-400 hover:bg-${preferences.theme.primary}-50`
      ]"
    >
      <component :is="view.icon" class="h-5 w-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ListBulletIcon, Squares2X2Icon, CalendarIcon } from '@heroicons/vue/24/outline';
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();

const views = [
  { value: 'list', icon: ListBulletIcon },
  { value: 'grid', icon: Squares2X2Icon },
  { value: 'calendar', icon: CalendarIcon }
];

defineProps<{
  modelValue: 'list' | 'grid' | 'calendar';
}>();

defineEmits(['update:modelValue']);
</script>

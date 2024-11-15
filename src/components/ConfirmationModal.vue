<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{{ title }}</h3>
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors',
            type === 'danger'
              ? 'bg-red-500 hover:bg-red-600'
              : `bg-${preferences.theme.primary}-500 hover:bg-${preferences.theme.primary}-600`
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();

defineProps({
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String as () => 'default' | 'danger',
    default: 'default'
  }
});

defineEmits(['confirm', 'cancel']);
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Delete Task</h2>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <p class="text-gray-600 mb-6">Are you sure you want to delete this task?</p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            `text-${preferences.theme.primary}-700 bg-${preferences.theme.primary}-50`,
            `hover:bg-${preferences.theme.primary}-100`
          ]"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'px-4 py-2 text-white rounded-lg transition-colors',
            `bg-${preferences.theme.primary}-500 hover:bg-${preferences.theme.primary}-600`
          ]"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();

defineEmits(['confirm', 'cancel']);
</script>

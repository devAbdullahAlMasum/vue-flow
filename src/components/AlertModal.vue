<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
      <!-- Content -->
      <div class="text-gray-800 mb-6">
        {{ message }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          v-if="showCancel"
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
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
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePreferencesStore } from '@/stores/preferences';

const preferences = usePreferencesStore();

defineProps({
  message: {
    type: String,
    required: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  type: {
    type: String as () => 'default' | 'danger',
    default: 'default'
  }
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.transform {
  animation: modal-pop 0.2s ease-out;
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

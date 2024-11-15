<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
      active
        ? 'bg-green-100 text-green-700'
        : 'bg-white text-gray-600 hover:bg-green-50'
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean;
}>();

defineEmits(['click']);
</script>

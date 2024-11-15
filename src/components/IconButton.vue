<template>
  <button
    :class="[
      'p-1.5 rounded-lg transition-colors',
      variant === 'danger'
        ? 'text-red-500 hover:bg-red-50'
        : 'text-gray-500 hover:bg-gray-50'
    ]"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'danger';
}>();
</script>

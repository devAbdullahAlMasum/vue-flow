<template>
  <span
    :class="[
      'px-2 py-1 text-xs font-medium rounded-full',
      priority === 'high' ? 'bg-red-100 text-red-700' :
      priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
      'bg-blue-100 text-blue-700'
    ]"
  >
    {{ priority }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  priority: 'low' | 'medium' | 'high';
}>();
</script>

<template>
  <div
    :class="[
      'group relative rounded-xl shadow-sm hover:shadow-md transition-all duration-300',
      'border overflow-hidden',
      `border-${preferences.theme.primary}-100`,
      compact ? 'p-3' : 'p-4',
      todo.completed ? `bg-${preferences.theme.primary}-50/50` : 'bg-white',
      `hover:border-${preferences.theme.primary}-300`
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <div
        class="relative flex-shrink-0 w-6 h-6 mt-1 cursor-pointer"
        @click="$emit('toggle', todo)"
      >
        <div
          :class="[
            'absolute inset-0 rounded-full border-2 transition-colors',
            todo.completed ? `border-${preferences.theme.primary}-500 bg-${preferences.theme.primary}-500` : 'border-gray-300'
          ]"
        >
          <CheckIcon
            v-if="todo.completed"
            class="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <h3
            :class="[
              'font-medium truncate',
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            ]"
          >
            {{ todo.title }}
          </h3>
          <PriorityBadge :priority="todo.priority" />
        </div>

        <div v-if="showDescription && todo.description" class="mt-1">
          <p class="text-sm text-gray-600 line-clamp-2">{{ todo.description }}</p>
        </div>

        <div class="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span v-if="todo.dueDate" class="flex items-center gap-1">
            <CalendarIcon class="h-4 w-4" />
            {{ formatDate(todo.dueDate) }}
          </span>
          <span class="flex items-center gap-1">
            <ClockIcon class="h-4 w-4" />
            {{ formatRelativeTime(todo.createdAt) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div
      class="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <IconButton @click="handleEdit">
        <PencilIcon class="h-4 w-4" />
      </IconButton>
      <IconButton
        variant="danger"
        @click.prevent.stop="handleDelete"
      >
        <TrashIcon class="h-4 w-4" />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckIcon, CalendarIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { usePreferencesStore } from '@/stores/preferences';
import PriorityBadge from './PriorityBadge.vue';
import IconButton from './IconButton.vue';
import { formatDate, formatRelativeTime } from '@/utils/date';

const preferences = usePreferencesStore();

const props = defineProps({
  todo: {
    type: Object,
    required: true
  },
  compact: Boolean,
  showDescription: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['toggle', 'edit', 'delete']);

const handleEdit = () => {
  emit('edit', props.todo);
};

const handleDelete = (event: Event) => {
  // Prevent default browser confirmation
  event.preventDefault();
  // Emit delete event to parent
  emit('delete', props.todo.id);
};
</script>

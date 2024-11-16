<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">
          {{ editingTodo ? 'Edit Task' : 'Add New Task' }}
        </h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            :class="[
              'w-full px-4 py-2 rounded-lg border transition-all',
              `border-${preferences.theme.primary}-300`,
              `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`
            ]"
            placeholder="What needs to be done?"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            :class="[
              'w-full px-4 py-2 rounded-lg border transition-all',
              `border-${preferences.theme.primary}-300`,
              `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`
            ]"
            placeholder="Add more details..."
          ></textarea>
        </div>

        <!-- Priority & Due Date -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              v-model="form.priority"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all',
                `border-${preferences.theme.primary}-300`,
                `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`
              ]"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Due Date (optional)
            </label>
            <input
              v-model="form.dueDate"
              type="date"
              :class="[
                'w-full px-4 py-2 rounded-lg border transition-all',
                `border-${preferences.theme.primary}-300`,
                `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`
              ]"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :class="[
              'px-4 py-2 text-white rounded-lg transition-colors',
              `bg-${preferences.theme.primary}-600`,
              `hover:bg-${preferences.theme.primary}-700`,
              `focus:ring-2 focus:ring-${preferences.theme.primary}-500`
            ]"
            :disabled="!form.title.trim()"
          >
            {{ editingTodo ? 'Save Changes' : 'Add Task' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { usePreferencesStore } from '@/stores/preferences';
import type { Todo } from '@/stores/todo';

const preferences = usePreferencesStore();

interface Props {
  editingTodo: Record<string, any> | undefined;
}

const props = withDefaults(defineProps<Props>(), {
  editingTodo: undefined
});

interface FormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const form = ref<FormData>({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: ''
});

// Initialize form with editing todo data
const initializeForm = () => {
  if (props.editingTodo) {
    form.value = {
      title: props.editingTodo.title,
      description: props.editingTodo.description || '',
      priority: props.editingTodo.priority || 'medium',
      dueDate: props.editingTodo.dueDate
        ? new Date(props.editingTodo.dueDate).toISOString().split('T')[0]
        : ''
    };
  } else {
    // Reset form for new todo
    form.value = {
      title: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    };
  }
};

// Watch for changes in editingTodo
watch(() => props.editingTodo, () => {
  initializeForm();
}, { immediate: true });

const handleSubmit = () => {
  if (!form.value.title.trim()) return;

  const taskData = {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    priority: form.value.priority,
    // Only include dueDate if it has a value
    ...(form.value.dueDate ? { dueDate: new Date(form.value.dueDate) } : {})
  };

  emit('add', taskData);
  emit('close');
};

const emit = defineEmits<{
  (e: 'add', task: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
  }): void;
  (e: 'close'): void;
}>();
</script>

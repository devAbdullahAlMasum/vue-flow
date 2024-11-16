<template>
  <div
    :class="[
      'transition-all duration-300',
      preferences.sidebarOpen ? 'ml-64' : 'ml-0'
    ]"
  >
    <div class="max-w-6xl mx-auto p-6">
      <!-- Header Section -->
      <header class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="preferences.toggleSidebar"
              :class="[
                'p-2 rounded-lg transition-colors',
                `hover:bg-${preferences.theme.primary}-100`,
                `text-${preferences.theme.primary}-600`
              ]"
            >
              <Bars3Icon class="h-6 w-6" />
            </button>
            <h1 class="text-4xl font-bold">
              <span :class="`text-${preferences.theme.primary}-600`">My Tasks</span>
            </h1>
          </div>
          <div class="flex items-center gap-4">
            <ViewSelector v-model="preferences.defaultView" />
            <ThemeSelector />
          </div>
        </div>
      </header>

      <!-- Quick Add Task -->
      <div class="mb-6">
        <form @submit.prevent="quickAddTodo" class="flex gap-3">
          <input
            v-model="quickAdd"
            type="text"
            placeholder="Quick add task... (Press Enter)"
            :class="[
              'flex-1 px-4 py-3 rounded-xl border transition-all',
              `border-${preferences.theme.primary}-200`,
              `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`,
              `placeholder-${preferences.theme.primary}-300`
            ]"
          />
        </form>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-wrap gap-4">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="store.filter = filter.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            store.filter === filter.value
              ? `bg-${preferences.theme.primary}-100 text-${preferences.theme.primary}-700`
              : `bg-white text-gray-600 hover:bg-${preferences.theme.primary}-50`
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Tasks Grid/List -->
      <TransitionGroup
        :name="preferences.animations ? 'tasks' : ''"
        tag="div"
        :class="[
          preferences.defaultView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'
        ]"
      >
        <TaskCard
          v-for="todo in store.filteredTodos"
          :key="todo.id"
          :todo="todo"
          :compact="preferences.compactMode"
          :show-description="preferences.showDescriptions"
          @toggle="toggleTodo"
          @edit="editTodo"
          @delete="deleteTodo"
        />
      </TransitionGroup>
    </div>
  </div>

  <!-- Sidebar -->
  <Sidebar
    v-if="preferences.sidebarOpen"
    @close="preferences.toggleSidebar"
  />

  <!-- Add Task Modal -->
  <AddTaskModal
    v-if="showAddModal"
    :editing-todo="editingTodo || undefined"
    @close="closeModal"
    @add="addTodo"
  />

  <!-- Loading State -->
  <LoadingSpinner v-if="store.loading" />

  <!-- Confirmation Modal -->
  <DeleteTaskModal
    v-if="showConfirmDelete"
    @confirm="handleDeleteConfirm"
    @cancel="showConfirmDelete = false"
  />

  <AlertModal
    v-if="showConfirmComplete"
    message="Are you sure you want to mark this task as complete?"
    @confirm="handleCompleteConfirm"
    @cancel="showConfirmComplete = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTodoStore } from '@/stores/todo';
import { usePreferencesStore } from '@/stores/preferences';
import { Bars3Icon } from '@heroicons/vue/24/outline';
import TaskCard from './TaskCard.vue';
import Sidebar from './Sidebar.vue';
import FilterButton from './FilterButton.vue';
import ViewSelector from './ViewSelector.vue';
import ThemeSelector from './ThemeSelector.vue';
import AddTaskModal from './AddTaskModal.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import AlertModal from './AlertModal.vue';
import DeleteTaskModal from './DeleteTaskModal.vue';
import { useToast } from 'vue-toastification'
import type { Todo, TodoInput } from '@/stores/todo';

const store = useTodoStore();
const preferences = usePreferencesStore();
const showAddModal = ref(false);
const quickAdd = ref('');
const editingTodo = ref<Todo | null>(null);
const toast = useToast()
const showConfirmDelete = ref(false);
const todoToDelete = ref<string | null>(null);
const showConfirmComplete = ref(false);
const todoToToggle = ref<Todo | null>(null);

const filters: Array<{ label: string; value: 'all' | 'active' | 'completed' | 'important' | 'bookmarked' }> = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Important', value: 'important' },
  { label: 'Bookmarked', value: 'bookmarked' }
];

interface TodoData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

const toggleTodo = async (todo: Todo) => {
  if (!todo.completed) {
    todoToToggle.value = todo;
    showConfirmComplete.value = true;
    return;
  }

  try {
    await store.updateTodo(todo.id, { completed: !todo.completed });
    toast.success(todo.completed ? "Task marked as incomplete" : "Task completed");
  } catch (error) {
    toast.error("Failed to update task status");
    console.error('Error updating todo:', error);
  }
};

const closeModal = () => {
  showAddModal.value = false;
  editingTodo.value = null;
};

const editTodo = (todo: Todo) => {
  editingTodo.value = todo;
  showAddModal.value = true;
};

const deleteTodo = async (todoId: string) => {
  todoToDelete.value = todoId;
  showConfirmDelete.value = true;
};

const handleDeleteConfirm = async () => {
  if (!todoToDelete.value) return;

  try {
    await store.deleteTodo(todoToDelete.value);
    toast.success("Task deleted successfully");
  } catch (error) {
    toast.error("Failed to delete task");
    console.error('Error deleting todo:', error);
  } finally {
    showConfirmDelete.value = false;
    todoToDelete.value = null;
  }
};

const handleCompleteConfirm = async () => {
  if (!todoToToggle.value) return;

  try {
    await store.updateTodo(todoToToggle.value.id, { completed: true });
    toast.success("Task completed");
  } catch (error) {
    toast.error("Failed to update task status");
    console.error('Error updating todo:', error);
  } finally {
    showConfirmComplete.value = false;
    todoToToggle.value = null;
  }
};

const addTodo = async (todoData: TodoData) => {
  try {
    if (editingTodo.value) {
      const updates: Partial<Todo> = {
        title: todoData.title,
        description: todoData.description || '',
        priority: todoData.priority,
        dueDate: todoData.dueDate
      };

      await store.updateTodo(editingTodo.value.id, updates);
      toast.success("Task updated successfully");
      editingTodo.value = null;
    } else {
      const newTodo: TodoInput = {
        title: todoData.title,
        description: todoData.description,
        priority: todoData.priority,
        dueDate: todoData.dueDate
      };
      await store.addTodo(newTodo);
      toast.success("New task added successfully");
    }
    showAddModal.value = false;
  } catch (error) {
    toast.error("Failed to save task");
    console.error('Error saving todo:', error);
  }
};

// Quick add functionality
const quickAddTodo = async () => {
  if (!quickAdd.value.trim()) {
    toast.warning("Please enter a task title");
    return;
  }

  try {
    const todoData: TodoInput = {
      title: quickAdd.value.trim(),
      priority: 'medium',
      description: ''
    };

    await store.addTodo(todoData);
    toast.success("Task added successfully");
    quickAdd.value = '';
  } catch (error) {
    toast.error("Failed to add task");
    console.error('Error adding todo:', error);
  }
};
</script>

<style scoped>
.tasks-enter-active,
.tasks-leave-active {
  transition: all 0.5s ease;
}

.tasks-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.tasks-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.tasks-move {
  transition: transform 0.5s ease;
}
</style>

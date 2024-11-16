import { defineStore } from 'pinia';
import { db, auth } from '@/services/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useToast } from 'vue-toastification'

interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

interface Tag {
  id: string;
  name: string;
  userId: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  description?: string;
  categoryId?: string | null;
  tags: string[];
  reminder?: Date;
  isImportant: boolean;
  isBookmarked: boolean;
}

interface TodoInput {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    categories: [] as Category[],
    tags: [] as Tag[],
    loading: false,
    filter: 'all' as 'all' | 'active' | 'completed' | 'important' | 'bookmarked',
    sortBy: 'createdAt' as 'createdAt' | 'dueDate' | 'priority',
    selectedCategory: null as string | null,
    selectedTags: [] as string[],
    unsubscribe: null as (() => void) | null,
    isInitialized: false,
  }),

  getters: {
    filteredTodos: (state) => {
      let filtered = [...state.todos];

      // Apply category filter
      if (state.selectedCategory) {
        filtered = filtered.filter(todo => todo.categoryId === state.selectedCategory);
      }

      // Apply tag filter
      if (state.selectedTags.length > 0) {
        filtered = filtered.filter(todo =>
          state.selectedTags.every(tag => todo.tags.includes(tag))
        );
      }

      // Apply status filter
      switch (state.filter) {
        case 'active':
          filtered = filtered.filter(todo => !todo.completed);
          break;
        case 'completed':
          filtered = filtered.filter(todo => todo.completed);
          break;
        case 'important':
          filtered = filtered.filter(todo => todo.isImportant);
          break;
        case 'bookmarked':
          filtered = filtered.filter(todo => todo.isBookmarked);
          break;
      }

      // Sort todos
      filtered.sort((a, b) => {
        if (a.isImportant !== b.isImportant) {
          return a.isImportant ? -1 : 1;
        }

        if (state.sortBy === 'dueDate' && a.dueDate && b.dueDate) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        if (state.sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      return filtered;
    },

    categoriesWithCount: (state) => {
      return state.categories.map(category => ({
        ...category,
        count: state.todos.filter(todo => todo.categoryId === category.id).length
      }));
    },

    tagsWithCount: (state) => {
      return state.tags.map(tag => ({
        ...tag,
        count: state.todos.filter(todo => todo.tags.includes(tag.id)).length
      }));
    }
  },

  actions: {
    async initializeStore() {
      const toast = useToast()
      if (!auth.currentUser || this.isInitialized) return;

      if (this.unsubscribe) {
        this.unsubscribe();
      }

      this.loading = true;
      try {
        const q = query(
          collection(db, 'todos'),
          where('userId', '==', auth.currentUser.uid),
          orderBy('createdAt', 'desc')
        );

        this.unsubscribe = onSnapshot(q, (snapshot) => {
          if (!this.isInitialized) {
            this.todos = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                title: data.title || '',
                userId: data.userId || '',
                priority: data.priority || 'medium',
                createdAt: data.createdAt?.toDate() || new Date(),
                dueDate: data.dueDate?.toDate() || undefined,
                completed: data.completed || false,
                tags: data.tags || [],
                isImportant: data.isImportant || false,
                isBookmarked: data.isBookmarked || false,
                description: data.description || '',
                categoryId: data.categoryId || null
              } as Todo;
            });
            this.isInitialized = true;
          } else {
            snapshot.docChanges().forEach((change) => {
              const data = change.doc.data();
              const todo: Todo = {
                id: change.doc.id,
                title: data.title || '',
                userId: data.userId || '',
                priority: data.priority || 'medium',
                createdAt: data.createdAt?.toDate() || new Date(),
                dueDate: data.dueDate?.toDate() || undefined,
                completed: data.completed || false,
                tags: data.tags || [],
                isImportant: data.isImportant || false,
                isBookmarked: data.isBookmarked || false,
                description: data.description || '',
                categoryId: data.categoryId || null
              };

              if (change.type === 'added' && !this.todos.some(t => t.id === todo.id)) {
                this.todos.unshift(todo);
              } else if (change.type === 'modified') {
                const index = this.todos.findIndex(t => t.id === todo.id);
                if (index !== -1) {
                  this.todos[index] = todo;
                }
              } else if (change.type === 'removed') {
                this.todos = this.todos.filter(t => t.id !== todo.id);
              }
            });
          }
        });
      } catch (error) {
        console.error('Error initializing store:', error);
        toast.error("Failed to load tasks");
      } finally {
        this.loading = false;
      }
    },

    async addTodo(todoInput: TodoInput) {
      const toast = useToast()
      if (!auth.currentUser) {
        toast.error("Please login to add tasks");
        return;
      }

      try {
        const newTodo = {
          title: todoInput.title,
          description: todoInput.description || '',
          priority: todoInput.priority || 'medium',
          dueDate: todoInput.dueDate || null,
          completed: false,
          userId: auth.currentUser.uid,
          createdAt: new Date(),
          tags: [],
          isImportant: false,
          isBookmarked: false,
          categoryId: null
        };

        // Only add to Firestore, let the listener handle local state
        await addDoc(collection(db, 'todos'), newTodo);
      } catch (error) {
        console.error('Error adding todo:', error);
        toast.error("Failed to add task");
        throw error;
      }
    },

    async updateTodo(todoId: string, updates: Partial<Todo>) {
      const toast = useToast()
      if (!auth.currentUser) {
        toast.error("Please login to update tasks");
        return;
      }

      try {
        const todoRef = doc(db, 'todos', todoId);

        // Clean up updates and ensure userId isn't changed
        const cleanUpdates = {
          ...updates,
          updatedAt: new Date(),
          userId: auth.currentUser.uid // Ensure userId stays the same
        };

        // Update in Firestore
        await updateDoc(todoRef, cleanUpdates);

        // Update in local state
        const index = this.todos.findIndex(t => t.id === todoId);
        if (index !== -1) {
          this.todos[index] = {
            ...this.todos[index],
            ...cleanUpdates
          };
        }
      } catch (error) {
        console.error('Error updating todo:', error);
        toast.error("Failed to update task");
        throw error;
      }
    },

    async deleteTodo(todoId: string) {
      const toast = useToast()
      if (!auth.currentUser) {
        toast.error("Please login to delete tasks");
        return;
      }

      try {
        // Only delete from Firestore, let the listener handle local state
        await deleteDoc(doc(db, 'todos', todoId));
      } catch (error) {
        console.error('Error deleting todo:', error);
        toast.error("Failed to delete task");
        throw error;
      }
    },

    async addCategory(name: string, color: string) {
      if (!auth.currentUser) return;

      try {
        const newCategory = {
          name,
          color,
          userId: auth.currentUser.uid
        };

        const docRef = await addDoc(collection(db, 'categories'), newCategory);
        this.categories.push({
          id: docRef.id,
          ...newCategory
        });
      } catch (error) {
        console.error('Error adding category:', error);
        throw error;
      }
    },

    async addTag(name: string) {
      if (!auth.currentUser) return;

      try {
        const newTag = {
          name,
          userId: auth.currentUser.uid
        };

        const docRef = await addDoc(collection(db, 'tags'), newTag);
        this.tags.push({
          id: docRef.id,
          ...newTag
        });
      } catch (error) {
        console.error('Error adding tag:', error);
        throw error;
      }
    },

    async toggleImportant(todoId: string) {
      const todo = this.todos.find(t => t.id === todoId);
      if (todo) {
        await this.updateTodo(todoId, { isImportant: !todo.isImportant });
      }
    },

    async toggleBookmark(todoId: string) {
      const todo = this.todos.find(t => t.id === todoId);
      if (todo) {
        await this.updateTodo(todoId, { isBookmarked: !todo.isBookmarked });
      }
    },

    // Cleanup method
    cleanup() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
      this.todos = [];
      this.categories = [];
      this.tags = [];
      this.loading = false;
      this.filter = 'all';
      this.sortBy = 'createdAt';
      this.selectedCategory = null;
      this.selectedTags = [];
      this.isInitialized = false;
    }
  }
});

<template>
  <div
    class="min-h-screen transition-colors duration-300"
    :class="[`theme-${preferences.theme.primary}`]"
  >
    <nav class="text-white p-4 backdrop-blur-lg bg-opacity-95 sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <img src="/logo.svg" alt="Vue Flow Logo" class="w-8 h-8" />
              <span class="text-2xl font-bold tracking-tight">Vue Flow</span>
            </div>
          </div>

          <div class="flex items-center gap-6">
            <div v-if="auth.currentUser" class="flex items-center gap-4">
              <div class="flex items-center gap-3">
                <span class="text-sm font-medium opacity-90">
                  {{ auth.currentUser.email }}
                </span>
                <div class="h-4 w-px bg-white/20"></div>
                <button
                  @click="handleSignOut"
                  class="px-4 py-2 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="container mx-auto py-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { auth } from '@/services/firebase';
import { useRouter } from 'vue-router';
import { usePreferencesStore } from '@/stores/preferences';
import { useTodoStore } from '@/stores/todo';
import { onMounted, onUnmounted } from 'vue';
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

const router = useRouter();
const preferences = usePreferencesStore();
const todoStore = useTodoStore();

// Set persistence to LOCAL (persists even after browser restart)
setPersistence(auth, browserLocalPersistence);

// Initialize store when auth state changes
onMounted(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      todoStore.initializeStore();
      // Redirect to home if on login/register page
      if (['/login', '/register'].includes(router.currentRoute.value.path)) {
        router.push('/');
      }
    } else {
      todoStore.cleanup();
      // Only redirect to login if not already there
      if (!['/login', '/register'].includes(router.currentRoute.value.path)) {
        router.push('/login');
      }
    }
  });

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribe();
    todoStore.cleanup();
  });
});

const handleSignOut = async () => {
  try {
    await auth.signOut();
    todoStore.cleanup();
    router.push('/login');
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
</script>

<style>
/* Modern Theme System */
.theme-green {
  --color-primary-50: 240 253 244;
  --color-primary-500: 34 197 94;
  --color-primary-600: 22 163 74;
  --color-gradient: linear-gradient(135deg, #10b981, #059669);
  background-color: rgb(var(--color-primary-50));
}

.theme-green nav {
  background: var(--color-gradient);
}

.theme-blue {
  --color-primary-50: 239 246 255;
  --color-primary-500: 59 130 246;
  --color-primary-600: 37 99 235;
  --color-gradient: linear-gradient(135deg, #3b82f6, #2563eb);
  background-color: rgb(var(--color-primary-50));
}

.theme-blue nav {
  background: var(--color-gradient);
}

.theme-purple {
  --color-primary-50: 250 245 255;
  --color-primary-500: 147 51 234;
  --color-primary-600: 126 34 206;
  --color-gradient: linear-gradient(135deg, #8b5cf6, #7c3aed);
  background-color: rgb(var(--color-primary-50));
}

.theme-purple nav {
  background: var(--color-gradient);
}

.theme-indigo {
  --color-primary-50: 238 242 255;
  --color-primary-500: 99 102 241;
  --color-primary-600: 79 70 229;
  --color-gradient: linear-gradient(135deg, #6366f1, #4f46e5);
  background-color: rgb(var(--color-primary-50));
}

.theme-indigo nav {
  background: var(--color-gradient);
}

.theme-rose {
  --color-primary-50: 255 241 242;
  --color-primary-500: 244 63 94;
  --color-primary-600: 225 29 72;
  --color-gradient: linear-gradient(135deg, #f43f5e, #e11d48);
  background-color: rgb(var(--color-primary-50));
}

.theme-rose nav {
  background: var(--color-gradient);
}

.theme-amber {
  --color-primary-50: 255 251 235;
  --color-primary-500: 245 158 11;
  --color-primary-600: 217 119 6;
  --color-gradient: linear-gradient(135deg, #f59e0b, #d97706);
  background-color: rgb(var(--color-primary-50));
}

.theme-amber nav {
  background: var(--color-gradient);
}

/* Global Animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
    <h2 :class="`text-2xl font-bold text-${preferences.theme.primary}-700 mb-6`">Login to TodoFlow</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="email"
          type="email"
          required
          :class="[
            'mt-1 w-full px-4 py-2 rounded-lg border transition-all',
            `border-${preferences.theme.primary}-300`,
            `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`
          ]"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input
          v-model="password"
          type="password"
          required
          :class="[
            'mt-1 w-full px-4 py-2 rounded-lg border transition-all',
            `border-${preferences.theme.primary}-300`,
            `focus:ring-2 focus:ring-${preferences.theme.primary}-500 focus:border-transparent`
          ]"
        />
      </div>

      <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

      <div class="mt-4 flex items-center">
        <input
          type="checkbox"
          id="remember-me"
          v-model="rememberMe"
          :class="[
            'rounded border-gray-300',
            `text-${preferences.theme.primary}-600`,
            `focus:ring-${preferences.theme.primary}-500`
          ]"
        />
        <label for="remember-me" class="ml-2 text-sm text-gray-600">
          Remember me
        </label>
      </div>

      <button
        type="submit"
        :class="[
          'w-full px-4 py-2 text-white rounded-lg transition-colors',
          `bg-${preferences.theme.primary}-600`,
          `hover:bg-${preferences.theme.primary}-700`,
          `focus:ring-2 focus:ring-${preferences.theme.primary}-500`
        ]"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>

    <div class="mt-4 text-center">
      <router-link
        to="/register"
        :class="[
          `text-${preferences.theme.primary}-600`,
          `hover:text-${preferences.theme.primary}-700`
        ]"
      >
        Don't have an account? Register
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/services/firebase';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { usePreferencesStore } from '@/stores/preferences';

const router = useRouter();
const preferences = usePreferencesStore();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const rememberMe = ref(true);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (rememberMe.value) {
      await setPersistence(auth, browserLocalPersistence);
    }

    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/');
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

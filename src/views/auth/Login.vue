<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">登入系統</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">電子郵件</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email" 
                  required
                >
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">密碼</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password" 
                  required
                >
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                {{ loading ? '登入中...' : '登入' }}
              </button>
              <div class="mt-3 text-center">
                <p>還沒有帳號？ <router-link to="/register">註冊新帳號</router-link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const loading = ref(false);
    const router = useRouter();

    const login = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/dashboard');
      } catch (e) {
        console.error(e);
        error.value = '登入失敗，請檢查您的電子郵件和密碼';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      error,
      loading,
      login
    };
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn-primary {
  padding: 0.5rem 1rem;
  font-weight: 500;
}
</style>
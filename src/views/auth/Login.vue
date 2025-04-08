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
            <div v-if="loginSuccess" class="alert alert-success">登入成功！正在轉跳...</div>
            
            <!-- LINE 登入按鈕 -->
            <LineLogin @login-error="setError" @login-success="handleLoginSuccess" />
            
            <div class="mt-3 mb-3 text-center">
              <div class="divider d-flex align-items-center justify-content-center">
                <span class="divider-text">或使用電子郵件登入</span>
              </div>
            </div>
            
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
import LineLogin from '@/components/auth/LineLogin.vue';

export default {
  name: 'LoginView',
  components: {
    LineLogin
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref(null);
    const loading = ref(false);
    const loginSuccess = ref(false);
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

    const setError = (errorMessage) => {
      error.value = errorMessage;
    };

    const handleLoginSuccess = () => {
      loginSuccess.value = true;
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    };

    return {
      email,
      password,
      error,
      loading,
      loginSuccess,
      login,
      setError,
      handleLoginSuccess
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

.divider {
  position: relative;
  text-align: center;
  margin: 15px 0;
}

.divider::before, .divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background-color: #dee2e6;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider-text {
  padding: 0 10px;
  background: white;
  color: #6c757d;
  font-size: 0.9rem;
}
</style>
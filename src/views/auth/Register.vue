<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-success text-white">
            <h3 class="mb-0">註冊帳號</h3>
          </div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="name" class="form-label">姓名</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model="name" 
                  required
                >
              </div>
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
                <label for="phone" class="form-label">電話號碼</label>
                <input 
                  type="tel" 
                  class="form-control" 
                  id="phone" 
                  v-model="phone" 
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
                <div class="form-text">密碼至少需要6個字元</div>
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">確認密碼</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  required
                >
              </div>
              <button type="submit" class="btn btn-success w-100" :disabled="loading">
                {{ loading ? '註冊中...' : '註冊' }}
              </button>
              <div class="mt-3 text-center">
                <p>已有帳號？ <router-link to="/login">登入</router-link></p>
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export default {
  name: 'RegisterView',
  setup() {
    const name = ref('');
    const email = ref('');
    const phone = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref(null);
    const loading = ref(false);
    const router = useRouter();

    const register = async () => {
      loading.value = true;
      error.value = null;
      
      // 驗證密碼
      if (password.value !== confirmPassword.value) {
        error.value = '密碼不一致';
        loading.value = false;
        return;
      }
      
      if (password.value.length < 6) {
        error.value = '密碼至少需要6個字元';
        loading.value = false;
        return;
      }
      
      try {
        // 創建Firebase認證用戶
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          email.value, 
          password.value
        );
        
        // 將用戶資料存儲到Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: name.value,
          email: email.value,
          phone: phone.value,
          role: 'user', // 默認為普通用戶
          isBlacklisted: false,
          createdAt: new Date()
        });
        
        // 註冊成功後導向儀表板
        router.push('/dashboard');
      } catch (e) {
        console.error(e);
        if (e.code === 'auth/email-already-in-use') {
          error.value = '此電子郵件已被使用';
        } else {
          error.value = '註冊失敗，請稍後再試';
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      email,
      phone,
      password,
      confirmPassword,
      error,
      loading,
      register
    };
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.btn-success {
  padding: 0.5rem 1rem;
  font-weight: 500;
}
</style>
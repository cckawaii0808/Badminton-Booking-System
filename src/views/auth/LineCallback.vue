<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">LINE 登入處理中</h3>
          </div>
          <div class="card-body text-center">
            <div v-if="loading" class="my-5">
              <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>正在處理您的登入請求，請稍候...</p>
            </div>
            <div v-else-if="error" class="alert alert-danger my-4">
              <p>{{ error }}</p>
              <button class="btn btn-outline-primary mt-2" @click="goToLogin">返回登入頁面</button>
            </div>
            <div v-else-if="success" class="alert alert-success my-4">
              <p>登入成功！正在將您轉至主頁...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth, getRedirectResult } from '@/firebase';
// import { OAuthProvider } from 'firebase/auth'; // 暫時不使用 OAuthProvider
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  name: 'LineCallback',
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const success = ref(false);
    const router = useRouter();

    const goToLogin = () => {
      router.push('/login');
    };

    onMounted(async () => {
      try {
        console.log('正在處理 LINE 登入重定向結果...');
        const result = await getRedirectResult(auth);
        
        console.log('重定向結果:', result ? '已獲取結果' : '無結果');
        
        if (result) {
          // 登入成功
          const user = result.user;
          
          // 檢查用戶是否已存在
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (!userDoc.exists()) {
            // 創建新用戶
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              provider: 'line',
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
          } else {
            // 更新用戶最後登入時間
            await setDoc(doc(db, "users", user.uid), {
              lastLogin: serverTimestamp()
            }, { merge: true });
          }
          
          success.value = true;
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        } else {
          // 沒有登入結果，可能是直接訪問此頁面
          console.log('沒有登入結果，將返回登入頁面');
          router.push('/login');
        }
      } catch (e) {
        console.error('LINE 回調處理錯誤:', e);
        console.error('錯誤詳情:', JSON.stringify(e, null, 2));
        error.value = `登入處理失敗: ${e.message || '未知錯誤'}`;
      } finally {
        loading.value = false;
      }
    });

    return {
      loading,
      error,
      success,
      goToLogin
    };
  }
};
</script>

<style scoped>
.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
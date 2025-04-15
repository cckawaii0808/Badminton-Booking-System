<template>
  <button 
    @click="loginWithLine" 
    class="btn w-100 mt-3" 
    :class="{ 'btn-success': !isOutlined, 'btn-outline-success': isOutlined }"
    :disabled="loading"
    style="background-color: #06C755; border-color: #06C755;"
  >
    <span class="d-flex align-items-center justify-content-center">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg" 
        alt="LINE Logo" 
        style="height: 24px; margin-right: 8px;" 
      />
      {{ loading ? '登入中...' : '使用 LINE 登入' }}
    </span>
  </button>
</template>

<script>
import { ref } from 'vue';
import { auth, lineProvider, signInWithRedirect } from '@/firebase';

export default {
  name: 'LineLogin',
  props: {
    isOutlined: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const error = ref(null);

    const loginWithLine = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        console.log('開始 LINE 登入重定向過程...');
        // 使用 signInWithRedirect 而非 signInWithPopup
        await signInWithRedirect(auth, lineProvider);
        
        console.log('LINE 重定向已發起，但這行程式碼不應該被執行');
        // 注意：使用 redirect 方式登入，頁面會重新導向到 LINE
        // 回到應用後需要在 onMounted 中捕獲結果
      } catch (e) {
        console.error('LINE 登入失敗:', e);
        console.error('錯誤詳情:', JSON.stringify(e, null, 2));
        error.value = `LINE 登入失敗: ${e.message || '未知錯誤'}`;
        emit('login-error', error.value);
        loading.value = false;
      }
    };

    return {
      loading,
      error,
      loginWithLine
    };
  }
};
</script>

<style scoped>
button {
  position: relative;
  color: white !important;
}

button:hover {
  background-color: #05b44c !important;
  border-color: #05b44c !important;
}

button img {
  filter: brightness(0) invert(1);
}
</style>
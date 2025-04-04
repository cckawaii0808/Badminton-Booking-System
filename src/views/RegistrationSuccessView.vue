<template>
  <div class="registration-success">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-success text-white text-center">
              <h3 class="mb-0">報名成功！</h3>
            </div>
            <div class="card-body text-center py-5">
              <div class="mb-4">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
              </div>
              
              <h4 class="mb-3">您已成功報名「{{ sessionTitle }}」</h4>
              <p class="mb-4">共 {{ participantsCount }} 位參加者</p>
              
              <div class="alert alert-info mb-4">
                <p class="mb-0">
                  <strong>請注意：</strong> 請於活動前完成繳費，您可以在個人儀表板查看報名狀態與繳費資訊。
                </p>
              </div>
              
              <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                <router-link to="/dashboard" class="btn btn-primary btn-lg me-md-2">
                  <i class="bi bi-speedometer2"></i> 前往儀表板
                </router-link>
                <router-link to="/sessions" class="btn btn-outline-primary btn-lg">
                  <i class="bi bi-calendar-event"></i> 查看更多場次
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'RegistrationSuccessView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const sessionTitle = ref('');
    const participantsCount = ref(0);
    
    onMounted(() => {
      // 從路由查詢參數獲取資料
      if (route.query.session) {
        sessionTitle.value = route.query.session;
      }
      
      if (route.query.participants) {
        participantsCount.value = parseInt(route.query.participants) || 0;
      }
      
      // 如果沒有查詢參數，表示用戶直接訪問此頁面，應該導回主頁
      if (!route.query.session) {
        router.push('/');
      }
    });
    
    return {
      sessionTitle,
      participantsCount
    };
  }
};
</script>

<style scoped>
.registration-success {
  padding: 3rem 0;
}

.card {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-header {
  padding: 1.25rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
}
</style>
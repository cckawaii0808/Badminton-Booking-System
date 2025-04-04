<template>
  <div class="home">
    <header class="bg-primary text-white py-5 text-center">
      <div class="container">
        <h1 class="display-4">羽球場地報名系統</h1>
        <p class="lead">輕鬆報名、管理羽球場地和活動</p>
        <div class="mt-4">
          <router-link v-if="!currentUser" to="/login" class="btn btn-light btn-lg me-2">登入</router-link>
          <router-link v-if="!currentUser" to="/register" class="btn btn-outline-light btn-lg">註冊</router-link>
          <router-link v-if="currentUser" to="/dashboard" class="btn btn-light btn-lg">進入儀表板</router-link>
        </div>
      </div>
    </header>

    <section class="py-5">
      <div class="container">
        <h2 class="text-center mb-4">最新開放場次</h2>
        <div class="row">
          <div v-if="loading" class="col-12 text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
          </div>
          <div v-else-if="sessions.length === 0" class="col-12 text-center">
            <p>目前沒有開放的場次</p>
          </div>
          <div v-for="session in sessions" :key="session.id" class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ session.title }}</h5>
                <h6 class="card-subtitle mb-2 text-muted">{{ formatDate(session.date) }}</h6>
                <p class="card-text">
                  <i class="bi bi-geo-alt"></i> {{ session.location }}<br>
                  <i class="bi bi-people"></i> {{ session.currentParticipants }}/{{ session.maxParticipants }} 人
                </p>
                <router-link :to="`/registration/${session.id}`" class="btn btn-primary">
                  立即報名
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-4">系統功能</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-calendar-check display-4 text-primary"></i>
                <h3 class="mt-3">簡易報名</h3>
                <p>快速瀏覽開放場次，一鍵報名參加</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-people display-4 text-primary"></i>
                <h3 class="mt-3">群組報名</h3>
                <p>支援一次為多人報名，方便團體參加</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="bi bi-clock-history display-4 text-primary"></i>
                <h3 class="mt-3">歷史記錄</h3>
                <p>查看個人報名歷史，追蹤繳費狀態</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { ref, onMounted } from 'vue';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';

export default {
  name: 'HomeView',
  setup() {
    const sessions = ref([]);
    const loading = ref(true);
    const currentUser = ref(null);

    onMounted(async () => {
      // 監聽用戶認證狀態
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user;
      });

      // 獲取最新開放場次
      try {
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('status', '==', '開放'),
          where('date', '>=', new Date()),
          orderBy('date'),
          limit(6)
        );
        
        const querySnapshot = await getDocs(sessionsQuery);
        sessions.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));
      } catch (e) {
        console.error('Error fetching sessions:', e);
      } finally {
        loading.value = false;
      }
    });

    const formatDate = (date) => {
      return new Date(date).toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return {
      sessions,
      loading,
      currentUser,
      formatDate
    };
  }
};
</script>

<style scoped>
.home header {
  background-color: #3f51b5;
  padding: 4rem 0;
}

.card {
  transition: transform 0.2s;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.display-4 {
  color: #3f51b5;
}

.btn-primary {
  background-color: #3f51b5;
  border-color: #3f51b5;
}

.btn-primary:hover {
  background-color: #303f9f;
  border-color: #303f9f;
}
</style>

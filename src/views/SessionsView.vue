<template>
  <div class="sessions">
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>開放場次列表</h1>
        <div class="d-flex">
          <div class="form-check form-switch me-3">
            <input class="form-check-input" type="checkbox" id="showPastEvents" v-model="showPastEvents">
            <label class="form-check-label" for="showPastEvents">顯示過期場次</label>
          </div>
          <select class="form-select" v-model="sortOrder">
            <option value="dateAsc">日期 (近 -> 遠)</option>
            <option value="dateDesc">日期 (遠 -> 近)</option>
            <option value="priceAsc">費用 (低 -> 高)</option>
            <option value="priceDesc">費用 (高 -> 低)</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">載入中...</span>
        </div>
        <p class="mt-2">載入場次資料...</p>
      </div>
      
      <div v-else-if="filteredSessions.length === 0" class="text-center py-5">
        <div class="alert alert-info">
          <i class="bi bi-info-circle-fill me-2"></i>
          {{ showPastEvents ? '目前沒有任何場次' : '目前沒有開放的場次' }}
        </div>
      </div>
      
      <div v-else class="row">
        <div v-for="session in filteredSessions" :key="session.id" class="col-md-4 mb-4">
          <div class="card h-100" :class="{ 'border-warning': isPastEvent(session.date) }">
            <div class="card-header" :class="{ 
              'bg-success text-white': session.status === '開放' && !isPastEvent(session.date), 
              'bg-danger text-white': session.status === '關閉',
              'bg-warning text-dark': isPastEvent(session.date)
            }">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="mb-0">{{ session.title }}</h5>
                <span class="badge" :class="{
                  'bg-light text-dark': session.status === '開放' && !isPastEvent(session.date),
                  'bg-danger': session.status === '關閉',
                  'bg-secondary': isPastEvent(session.date)
                }">
                  {{ isPastEvent(session.date) ? '已過期' : session.status }}
                </span>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="mb-2">
                  <i class="bi bi-calendar me-2"></i> <strong>時間：</strong> {{ formatDate(session.date) }}
                </div>
                <div class="mb-2">
                  <i class="bi bi-geo-alt me-2"></i> <strong>地點：</strong> {{ session.location }}
                </div>
                <div class="mb-2">
                  <i class="bi bi-people me-2"></i> <strong>人數：</strong> 
                  <span :class="{'text-danger': session.currentParticipants >= session.maxParticipants}">
                    {{ session.currentParticipants }}/{{ session.maxParticipants }}
                  </span>
                </div>
                <div class="mb-2">
                  <i class="bi bi-currency-dollar me-2"></i> <strong>費用：</strong> {{ session.price }} 元
                </div>
              </div>
              
              <div v-if="session.details" class="mb-3">
                <div class="text-muted small">{{ truncateText(session.details, 100) }}</div>
              </div>
            </div>
            <div class="card-footer bg-white border-top-0">
              <router-link 
                :to="`/registration/${session.id}`" 
                class="btn btn-primary w-100"
                :class="{ disabled: shouldDisableRegistration(session) }"
              >
                {{ getRegistrationButtonText(session) }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, computed, onMounted } from 'vue';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  name: 'SessionsView',
  setup() {
    const sessions = ref([]);
    const loading = ref(true);
    const showPastEvents = ref(false);
    const sortOrder = ref('dateAsc');
    
    onMounted(async () => {
      await fetchSessions();
    });
    
    const fetchSessions = async () => {
      try {
        loading.value = true;
        
        // 基本查詢 - 獲取所有場次
        let sessionsQuery = query(
          collection(db, 'sessions'),
          orderBy('date', 'asc')
        );
        
        const querySnapshot = await getDocs(sessionsQuery);
        sessions.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));
      } catch (e) {
        console.error('Error fetching sessions:', e);
        alert('載入場次資料失敗，請稍後再試');
      } finally {
        loading.value = false;
      }
    };
    
    // 過濾和排序後的場次列表
    const filteredSessions = computed(() => {
      let filtered = [...sessions.value];
      
      // 如果不顯示過期場次，則過濾掉
      if (!showPastEvents.value) {
        const now = new Date();
        filtered = filtered.filter(session => new Date(session.date) >= now);
      }
      
      // 根據選擇的排序方式進行排序
      switch (sortOrder.value) {
        case 'dateAsc':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'dateDesc':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'priceAsc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'priceDesc':
          filtered.sort((a, b) => b.price - a.price);
          break;
      }
      
      return filtered;
    });
    
    // 判斷場次是否已過期
    const isPastEvent = (date) => {
      return new Date(date) < new Date();
    };
    
    // 顯示有限的文字內容
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    };
    
    // 判斷是否應該禁用報名按鈕
    const shouldDisableRegistration = (session) => {
      return session.status === '關閉' || 
             isPastEvent(session.date) || 
             session.currentParticipants >= session.maxParticipants;
    };
    
    // 獲取報名按鈕文字
    const getRegistrationButtonText = (session) => {
      if (session.status === '關閉') return '已關閉報名';
      if (isPastEvent(session.date)) return '已過期';
      if (session.currentParticipants >= session.maxParticipants) return '已額滿';
      return '立即報名';
    };
    
    // 格式化日期
    const formatDate = (date) => {
      return new Date(date).toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
      });
    };
    
    return {
      sessions,
      loading,
      showPastEvents,
      sortOrder,
      filteredSessions,
      isPastEvent,
      truncateText,
      shouldDisableRegistration,
      getRegistrationButtonText,
      formatDate
    };
  }
};
</script>

<style scoped>
.sessions {
  padding-bottom: 2rem;
}

.card {
  transition: transform 0.2s;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 0.75rem 1.25rem;
}

.card-body {
  padding: 1.25rem;
}

.card-footer {
  padding: 1rem 1.25rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}
</style>
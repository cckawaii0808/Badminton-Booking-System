<template>
  <div class="admin-dashboard">
    <div class="container py-4">
      <h1 class="mb-4">管理員儀表板</h1>
      
      <div class="row">
        <!-- 功能卡片 -->
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center p-4">
              <div class="icon-wrapper bg-primary text-white mb-3">
                <i class="bi bi-calendar-event"></i>
              </div>
              <h3>場次管理</h3>
              <p>管理羽球場地的開放場次、修改場次資訊、控制報名狀態</p>
              <router-link to="/admin/sessions" class="btn btn-primary w-100">
                進入管理
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center p-4">
              <div class="icon-wrapper bg-success text-white mb-3">
                <i class="bi bi-people"></i>
              </div>
              <h3>報名管理</h3>
              <p>管理用戶報名記錄、查看詳情、處理付款狀態、移除報名</p>
              <router-link to="/admin/registrations" class="btn btn-success w-100">
                進入管理
              </router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="card h-100">
            <div class="card-body text-center p-4">
              <div class="icon-wrapper bg-danger text-white mb-3">
                <i class="bi bi-shield-exclamation"></i>
              </div>
              <h3>黑名單管理</h3>
              <p>管理系統黑名單，禁止不良用戶報名參加場次</p>
              <router-link to="/admin/blacklist" class="btn btn-danger w-100">
                進入管理
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 系統摘要 -->
      <div class="row mt-2">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">系統摘要</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3 mb-md-0">
                  <div class="stat-card">
                    <div class="stat-title">總場次數</div>
                    <div class="stat-value">{{ loading ? '載入中...' : stats.totalSessions }}</div>
                  </div>
                </div>
                <div class="col-md-3 mb-3 mb-md-0">
                  <div class="stat-card">
                    <div class="stat-title">開放場次</div>
                    <div class="stat-value">{{ loading ? '載入中...' : stats.openSessions }}</div>
                  </div>
                </div>
                <div class="col-md-3 mb-3 mb-md-0">
                  <div class="stat-card">
                    <div class="stat-title">總報名數</div>
                    <div class="stat-value">{{ loading ? '載入中...' : stats.totalRegistrations }}</div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-card">
                    <div class="stat-title">總用戶數</div>
                    <div class="stat-value">{{ loading ? '載入中...' : stats.totalUsers }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 近期活動 -->
      <div class="row mt-4">
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">近期報名</h5>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">載入中...</span>
                </div>
              </div>
              <div v-else-if="recentRegistrations.length === 0" class="text-center py-4">
                <p class="mb-0">暫無報名記錄</p>
              </div>
              <div v-else class="list-group list-group-flush">
                <div v-for="reg in recentRegistrations" :key="reg.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ reg.participants[0].name }}</strong> 報名了 
                      <router-link :to="`/registration/${reg.sessionId}`">{{ reg.sessionTitle }}</router-link>
                    </div>
                    <span class="text-muted small">{{ formatDate(reg.timestamp) }}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-1">
                    <span>參加人數: {{ reg.participants.length }} 人</span>
                    <span :class="reg.paymentStatus === '已付款' ? 'badge bg-success' : 'badge bg-warning'">
                      {{ reg.paymentStatus }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer bg-white border-top">
              <router-link to="/admin/registrations" class="btn btn-sm btn-outline-primary">查看所有報名</router-link>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card h-100">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">即將開始的場次</h5>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">載入中...</span>
                </div>
              </div>
              <div v-else-if="upcomingSessions.length === 0" class="text-center py-4">
                <p class="mb-0">暫無即將開始的場次</p>
              </div>
              <div v-else class="list-group list-group-flush">
                <div v-for="session in upcomingSessions" :key="session.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ session.title }}</strong>
                    </div>
                    <span :class="session.status === '開放' ? 'badge bg-success' : 'badge bg-danger'">
                      {{ session.status }}
                    </span>
                  </div>
                  <div class="mt-1">
                    <div><i class="bi bi-calendar me-1"></i> {{ formatDate(session.date) }}</div>
                    <div><i class="bi bi-geo-alt me-1"></i> {{ session.location }}</div>
                    <div><i class="bi bi-people me-1"></i> 報名人數: {{ session.currentParticipants }}/{{ session.maxParticipants }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer bg-white border-top">
              <router-link to="/admin/sessions" class="btn btn-sm btn-outline-success">管理所有場次</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { ref, reactive, onMounted } from 'vue';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  doc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const currentUser = ref(null);
    
    const stats = reactive({
      totalSessions: 0,
      openSessions: 0,
      totalRegistrations: 0,
      totalUsers: 0
    });
    
    const recentRegistrations = ref([]);
    const upcomingSessions = ref([]);
    
    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          // 檢查是否為管理員
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            fetchStats();
            fetchRecentRegistrations();
            fetchUpcomingSessions();
          } else {
            // 非管理員導回儀表板
            alert('您沒有管理員權限');
            router.push('/dashboard');
          }
        } else {
          router.push('/login');
        }
      });
    });
    
    const fetchStats = async () => {
      try {
        // 獲取場次統計
        const sessionsQuery = query(collection(db, 'sessions'));
        const sessionsSnapshot = await getDocs(sessionsQuery);
        stats.totalSessions = sessionsSnapshot.size;
        
        // 獲取開放場次統計
        const openSessionsQuery = query(
          collection(db, 'sessions'),
          where('status', '==', '開放')
        );
        const openSessionsSnapshot = await getDocs(openSessionsQuery);
        stats.openSessions = openSessionsSnapshot.size;
        
        // 獲取報名統計
        const registrationsQuery = query(collection(db, 'registrations'));
        const registrationsSnapshot = await getDocs(registrationsQuery);
        stats.totalRegistrations = registrationsSnapshot.size;
        
        // 獲取用戶統計
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        stats.totalUsers = usersSnapshot.size;
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
    };
    
    const fetchRecentRegistrations = async () => {
      try {
        const registrationsQuery = query(
          collection(db, 'registrations'),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(registrationsQuery);
        const registrationDocs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        // 獲取相關場次資料
        for (const reg of registrationDocs) {
          const sessionDoc = await getDoc(doc(db, 'sessions', reg.sessionId));
          if (sessionDoc.exists()) {
            reg.sessionTitle = sessionDoc.data().title;
          } else {
            reg.sessionTitle = '未知場次';
          }
        }
        
        recentRegistrations.value = registrationDocs;
      } catch (e) {
        console.error('Error fetching recent registrations:', e);
      }
    };
    
    const fetchUpcomingSessions = async () => {
      try {
        const now = new Date();
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('date', '>=', now),
          orderBy('date'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(sessionsQuery);
        upcomingSessions.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate()
        }));
        
        loading.value = false;
      } catch (e) {
        console.error('Error fetching upcoming sessions:', e);
      } finally {
        loading.value = false;
      }
    };
    
    const formatDate = (date) => {
      if (!date) return '未知時間';
      
      return new Date(date).toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    return {
      loading,
      stats,
      recentRegistrations,
      upcomingSessions,
      formatDate
    };
  }
};
</script>

<style scoped>
.admin-dashboard {
  padding-bottom: 2rem;
}

.card {
  margin-bottom: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 2rem;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  height: 100%;
}

.stat-title {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #212529;
}

.list-group-item {
  padding: 1rem 1.25rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}
</style>
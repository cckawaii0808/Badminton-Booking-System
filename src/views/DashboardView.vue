<template>
  <div class="dashboard">
    <div class="container py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h1>個人儀表板</h1>
          <p class="lead">歡迎回來，{{ userData.name || '用戶' }}</p>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6 mb-4 mb-md-0">
          <div class="card h-100">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">我的報名</h5>
            </div>
            <div class="card-body">
              <div v-if="loadingRegistrations" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">載入中...</span>
                </div>
                <p>載入報名記錄...</p>
              </div>
              <div v-else-if="registrations.length === 0" class="text-center py-4">
                <p class="mb-3">您尚未報名任何場次</p>
                <router-link to="/sessions" class="btn btn-primary">瀏覽開放場次</router-link>
              </div>
              <div v-else>
                <div v-for="reg in registrations" :key="reg.id" class="mb-3 pb-3 border-bottom">
                  <h5>{{ reg.sessionData.title }}</h5>
                  <p class="mb-1">
                    <i class="bi bi-calendar me-1"></i> <strong>時間：</strong> {{ formatDate(reg.sessionData.date) }}<br>
                    <i class="bi bi-geo-alt me-1"></i> <strong>地點：</strong> {{ reg.sessionData.location }}<br>
                    <i class="bi bi-people me-1"></i> <strong>參加者：</strong> {{ reg.participants.length }} 人<br>
                    <i class="bi bi-credit-card me-1"></i> <strong>繳費：</strong> 
                    <span :class="reg.paymentStatus === '已付款' ? 'text-success' : 'text-warning'">
                      {{ reg.paymentStatus }}
                    </span>
                  </p>
                  <div class="mt-2">
                    <button 
                      class="btn btn-sm btn-outline-info me-2"
                      @click="viewRegistrationDetails(reg)"
                    >
                      詳情
                    </button>
                    <button 
                      v-if="isUpcoming(reg.sessionData.date) && reg.paymentStatus !== '已付款'"
                      class="btn btn-sm btn-outline-danger"
                      @click="cancelRegistration(reg.id, reg.sessionId, reg.participants.length)"
                    >
                      取消報名
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">近期場次</h5>
            </div>
            <div class="card-body">
              <div v-if="loadingSessions" class="text-center py-4">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">載入中...</span>
                </div>
                <p>載入場次資料...</p>
              </div>
              <div v-else-if="upcomingSessions.length === 0" class="text-center py-4">
                <p>目前沒有即將開放的場次</p>
              </div>
              <div v-else>
                <div v-for="session in upcomingSessions" :key="session.id" class="mb-3 pb-3 border-bottom">
                  <div class="d-flex justify-content-between align-items-start">
                    <h5 class="mb-1">{{ session.title }}</h5>
                    <span 
                      class="badge"
                      :class="session.status === '開放' ? 'bg-success' : 'bg-danger'"
                    >
                      {{ session.status }}
                    </span>
                  </div>
                  <p class="mb-1">
                    <i class="bi bi-calendar me-1"></i> <strong>時間：</strong> {{ formatDate(session.date) }}<br>
                    <i class="bi bi-geo-alt me-1"></i> <strong>地點：</strong> {{ session.location }}<br>
                    <i class="bi bi-people me-1"></i> <strong>人數：</strong> {{ session.currentParticipants }}/{{ session.maxParticipants }}<br>
                    <i class="bi bi-currency-dollar me-1"></i> <strong>費用：</strong> {{ session.price }} 元
                  </p>
                  <div class="mt-2">
                    <router-link 
                      :to="`/registration/${session.id}`" 
                      class="btn btn-sm btn-primary"
                      v-if="session.status === '開放' && session.currentParticipants < session.maxParticipants && !isRegistered(session.id)"
                    >
                      立即報名
                    </router-link>
                    <span v-else-if="isRegistered(session.id)" class="badge bg-info">已報名</span>
                  </div>
                </div>
                <div class="text-end mt-3">
                  <router-link to="/sessions" class="btn btn-outline-success">查看更多場次</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">個人資料</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>姓名：</strong> {{ userData.name || '未設定' }}</p>
                  <p><strong>電子郵件：</strong> {{ userData.email || '未設定' }}</p>
                  <p><strong>電話：</strong> {{ userData.phone || '未設定' }}</p>
                </div>
                <div class="col-md-6 text-md-end">
                  <button class="btn btn-outline-primary" @click="editProfile">
                    編輯個人資料
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 報名詳情彈窗 -->
    <div class="modal fade" id="registrationDetailModal" tabindex="-1" aria-labelledby="registrationDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registrationDetailModalLabel">報名詳情</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedRegistration">
            <div class="mb-4">
              <h5>場次資訊</h5>
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th width="120">場次名稱</th>
                    <td>{{ selectedRegistration.sessionData?.title }}</td>
                  </tr>
                  <tr>
                    <th>時間</th>
                    <td>{{ formatDate(selectedRegistration.sessionData?.date) }}</td>
                  </tr>
                  <tr>
                    <th>地點</th>
                    <td>{{ selectedRegistration.sessionData?.location }}</td>
                  </tr>
                  <tr>
                    <th>報名時間</th>
                    <td>{{ formatDate(selectedRegistration.timestamp) }}</td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <span :class="selectedRegistration.paymentStatus === '已付款' ? 'badge bg-success' : 'badge bg-warning'">
                        {{ selectedRegistration.paymentStatus }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="selectedRegistration.notes">
                    <th>備註</th>
                    <td>{{ selectedRegistration.notes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="mb-4">
              <h5>參加者清單 (共 {{ selectedRegistration.participants?.length }} 人)</h5>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>姓名</th>
                    <th>電話</th>
                    <th>電子郵件</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(participant, index) in selectedRegistration.participants" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ participant.name }}</td>
                    <td>{{ participant.phone }}</td>
                    <td>{{ participant.email }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 編輯個人資料彈窗 -->
    <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProfileModalLabel">編輯個人資料</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label for="profileName" class="form-label">姓名</label>
                <input type="text" class="form-control" id="profileName" v-model="profileForm.name" required>
              </div>
              <div class="mb-3">
                <label for="profilePhone" class="form-label">電話</label>
                <input type="tel" class="form-control" id="profilePhone" v-model="profileForm.phone" required>
              </div>
              <div class="mb-3">
                <label for="profileEmail" class="form-label">電子郵件</label>
                <input type="email" class="form-control" id="profileEmail" v-model="profileForm.email" required disabled>
                <div class="form-text">電子郵件無法修改</div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProfile" :disabled="updating">
              {{ updating ? '儲存中...' : '儲存變更' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { ref, onMounted } from 'vue';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  increment 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'DashboardView',
  setup() {
    const router = useRouter();
    const userData = ref({});
    const registrations = ref([]);
    const upcomingSessions = ref([]);
    const loadingRegistrations = ref(true);
    const loadingSessions = ref(true);
    const currentUser = ref(null);
    const selectedRegistration = ref(null);
    const updating = ref(false);

    const profileForm = ref({
      name: '',
      phone: '',
      email: ''
    });

    // Modal instances
    let detailModal = null;
    let profileModal = null;

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          await fetchUserData(user.uid);
          await fetchUserRegistrations(user.uid);
          await fetchUpcomingSessions();

          // 初始化Bootstrap Modals
          if (typeof window !== 'undefined' && window.bootstrap) {
            // 使用window.bootstrap而不是直接使用bootstrap
            detailModal = new window.bootstrap.Modal(document.getElementById('registrationDetailModal'));
            profileModal = new window.bootstrap.Modal(document.getElementById('editProfileModal'));
          }
        } else {
          router.push('/login');
        }
      });
    });

    const fetchUserData = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          userData.value = userDoc.data();
          
          // 初始化個人資料表單
          profileForm.value = {
            name: userData.value.name || '',
            phone: userData.value.phone || '',
            email: userData.value.email || ''
          };
        }
      } catch (e) {
        console.error('Error fetching user data:', e);
      }
    };

    const fetchUserRegistrations = async (userId) => {
      try {
        loadingRegistrations.value = true;
        
        const registrationsQuery = query(
          collection(db, 'registrations'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(registrationsQuery);
        
        // 獲取所有報名記錄
        const registrationDocs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        
        // 獲取相關場次資料
        for (const reg of registrationDocs) {
          const sessionDoc = await getDoc(doc(db, 'sessions', reg.sessionId));
          if (sessionDoc.exists()) {
            reg.sessionData = {
              id: sessionDoc.id,
              ...sessionDoc.data(),
              date: sessionDoc.data().date.toDate()
            };
          }
        }
        
        registrations.value = registrationDocs;
      } catch (e) {
        console.error('Error fetching registrations:', e);
      } finally {
        loadingRegistrations.value = false;
      }
    };

    const fetchUpcomingSessions = async () => {
      try {
        loadingSessions.value = true;
        
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
      } catch (e) {
        console.error('Error fetching upcoming sessions:', e);
      } finally {
        loadingSessions.value = false;
      }
    };

    const viewRegistrationDetails = (registration) => {
      selectedRegistration.value = registration;
      
      if (detailModal) {
        detailModal.show();
      }
    };

    const cancelRegistration = async (registrationId, sessionId, participantsCount) => {
      const confirmCancel = confirm('確定要取消此報名嗎？');
      if (!confirmCancel) return;
      
      try {
        // 刪除報名記錄
        await deleteDoc(doc(db, 'registrations', registrationId));
        
        // 更新場次的參加人數
        const sessionRef = doc(db, 'sessions', sessionId);
        await updateDoc(sessionRef, {
          currentParticipants: increment(-participantsCount)
        });
        
        // 從列表中移除報名記錄
        registrations.value = registrations.value.filter(r => r.id !== registrationId);
        
        alert('報名已成功取消');
      } catch (e) {
        console.error('Error canceling registration:', e);
        alert('取消報名失敗，請稍後再試');
      }
    };

    const editProfile = () => {
      // 重新填充表單
      profileForm.value = {
        name: userData.value.name || '',
        phone: userData.value.phone || '',
        email: userData.value.email || ''
      };
      
      if (profileModal) {
        profileModal.show();
      }
    };

    const updateProfile = async () => {
      if (!profileForm.value.name || !profileForm.value.phone) {
        alert('請填寫所有必填欄位');
        return;
      }
      
      updating.value = true;
      
      try {
        const userRef = doc(db, 'users', currentUser.value.uid);
        
        await updateDoc(userRef, {
          name: profileForm.value.name,
          phone: profileForm.value.phone,
          updatedAt: new Date()
        });
        
        // 更新本地用戶資料
        userData.value = {
          ...userData.value,
          name: profileForm.value.name,
          phone: profileForm.value.phone
        };
        
        // 關閉彈窗
        if (profileModal) {
          profileModal.hide();
        }
        
        alert('個人資料已更新');
      } catch (e) {
        console.error('Error updating profile:', e);
        alert('更新個人資料失敗，請稍後再試');
      } finally {
        updating.value = false;
      }
    };

    const isUpcoming = (date) => {
      return new Date(date) > new Date();
    };

    const isRegistered = (sessionId) => {
      return registrations.value.some(reg => reg.sessionId === sessionId);
    };

    const formatDate = (date) => {
      if (!date) return '未知時間';
      
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
      userData,
      registrations,
      upcomingSessions,
      loadingRegistrations,
      loadingSessions,
      selectedRegistration,
      profileForm,
      updating,
      viewRegistrationDetails,
      cancelRegistration,
      editProfile,
      updateProfile,
      isUpcoming,
      isRegistered,
      formatDate
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding-bottom: 2rem;
}

.card {
  margin-bottom: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  padding: 0.75rem 1.25rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35em 0.65em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.table th {
  background-color: #f8f9fa;
}
</style>
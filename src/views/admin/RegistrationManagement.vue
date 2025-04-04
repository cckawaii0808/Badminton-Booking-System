<template>
  <div class="registration-management">
    <div class="container py-4">
      <h1>報名管理</h1>
      
      <!-- 篩選選項 -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">篩選報名記錄</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label for="filterSession" class="form-label">場次</label>
              <select id="filterSession" class="form-select" v-model="filterOptions.sessionId">
                <option value="">全部場次</option>
                <option v-for="session in sessions" :key="session.id" :value="session.id">
                  {{ session.title }}
                </option>
              </select>
            </div>
            
            <div class="col-md-4 mb-3">
              <label for="filterPayment" class="form-label">付款狀態</label>
              <select id="filterPayment" class="form-select" v-model="filterOptions.paymentStatus">
                <option value="">全部狀態</option>
                <option value="已付款">已付款</option>
                <option value="未付款">未付款</option>
              </select>
            </div>
            
            <div class="col-md-4 mb-3 d-flex align-items-end">
              <button class="btn btn-primary w-100" @click="applyFilters">套用篩選</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 報名列表 -->
      <div class="card">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0">報名記錄</h5>
        </div>
        <div class="card-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
            <p>載入報名記錄...</p>
          </div>
          
          <div v-else-if="filteredRegistrations.length === 0" class="text-center py-4">
            <p>沒有找到符合條件的報名記錄</p>
          </div>
          
          <div v-else>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>場次</th>
                    <th>報名者</th>
                    <th>參加人數</th>
                    <th>報名時間</th>
                    <th>付款狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="reg in filteredRegistrations" :key="reg.id">
                    <td>{{ getSessionTitle(reg.sessionId) }}</td>
                    <td>{{ reg.participants[0].name }}</td>
                    <td>{{ reg.participants.length }}</td>
                    <td>{{ formatDate(reg.timestamp) }}</td>
                    <td>
                      <span :class="reg.paymentStatus === '已付款' ? 'badge bg-success' : 'badge bg-warning'">
                        {{ reg.paymentStatus }}
                      </span>
                    </td>
                    <td>
                      <button 
                        class="btn btn-sm btn-outline-success me-1" 
                        v-if="reg.paymentStatus !== '已付款'"
                        @click="markAsPaid(reg.id)"
                      >
                        標記為已付款
                      </button>
                      
                      <button 
                        class="btn btn-sm btn-outline-info me-1" 
                        @click="viewRegistrationDetails(reg)"
                      >
                        查看詳情
                      </button>
                      
                      <button 
                        class="btn btn-sm btn-outline-danger" 
                        @click="deleteRegistration(reg.id, reg.sessionId, reg.participants.length)"
                      >
                        移除報名
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    <td>{{ getSessionTitle(selectedRegistration.sessionId) }}</td>
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
              <h5>參加者清單 (共 {{ selectedRegistration.participants.length }} 人)</h5>
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
            
            <div class="mt-3" v-if="selectedRegistration.paymentStatus !== '已付款'">
              <button 
                class="btn btn-success"
                @click="markAsPaid(selectedRegistration.id)"
              >
                標記為已付款
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars, no-undef */
import { ref, computed, onMounted } from 'vue';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'RegistrationManagement',
  setup() {
    const router = useRouter();
    const registrations = ref([]);
    const sessions = ref([]);
    const loading = ref(true);
    const currentUser = ref(null);
    const selectedRegistration = ref(null);
    
    const filterOptions = ref({
      sessionId: '',
      paymentStatus: ''
    });
    
    // Modal instance
    let detailModal = null;
    
    onMounted(() => {
      // 檢查用戶權限
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          // 檢查是否為管理員
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            // 獲取場次列表和報名記錄
            await fetchSessions();
            await fetchRegistrations();
          } else {
            // 非管理員導回儀表板
            alert('您沒有管理員權限');
            router.push('/dashboard');
          }
        } else {
          router.push('/login');
        }
      });
      
      // 初始化Bootstrap Modal
      if (typeof window !== 'undefined' && window.bootstrap) {
        detailModal = new window.bootstrap.Modal(document.getElementById('registrationDetailModal'));
      }
    });
    
    const fetchSessions = async () => {
      try {
        const sessionsQuery = query(
          collection(db, 'sessions'),
          orderBy('date', 'desc')
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
      }
    };
    
    const fetchRegistrations = async () => {
      try {
        loading.value = true;
        const registrationsQuery = query(
          collection(db, 'registrations'),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(registrationsQuery);
        registrations.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
      } catch (e) {
        console.error('Error fetching registrations:', e);
        alert('載入報名記錄失敗，請稍後再試');
      } finally {
        loading.value = false;
      }
    };
    
    const getSessionTitle = (sessionId) => {
      const session = sessions.value.find(s => s.id === sessionId);
      return session ? session.title : '未知場次';
    };
    
    const applyFilters = () => {
      // 重新載入報名記錄（已經有本地篩選，不需要重新獲取資料）
    };
    
    const markAsPaid = async (registrationId) => {
      const confirmMark = confirm('確定將此報名標記為已付款？');
      if (!confirmMark) return;
      
      try {
        await updateDoc(doc(db, 'registrations', registrationId), {
          paymentStatus: '已付款',
          paidAt: serverTimestamp(),
          updatedBy: currentUser.value.uid
        });
        
        // 更新本地報名資料
        const index = registrations.value.findIndex(r => r.id === registrationId);
        if (index !== -1) {
          registrations.value[index].paymentStatus = '已付款';
        }
        
        // 如果正在查看詳情，關閉彈窗
        if (detailModal) {
          detailModal.hide();
        }
        
        alert('已成功標記為已付款');
      } catch (e) {
        console.error('Error marking as paid:', e);
        alert('操作失敗，請稍後再試');
      }
    };
    
    const viewRegistrationDetails = (registration) => {
      selectedRegistration.value = registration;
      
      if (detailModal) {
        detailModal.show();
      }
    };
    
    const deleteRegistration = async (registrationId, sessionId, participantsCount) => {
      const confirmDelete = confirm('確定要移除此報名記錄？此操作無法還原');
      if (!confirmDelete) return;
      
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
        
        alert('報名記錄已成功移除');
      } catch (e) {
        console.error('Error deleting registration:', e);
        alert('移除報名失敗，請稍後再試');
      }
    };
    
    // 篩選後的報名記錄
    const filteredRegistrations = computed(() => {
      let filtered = [...registrations.value];
      
      if (filterOptions.value.sessionId) {
        filtered = filtered.filter(r => r.sessionId === filterOptions.value.sessionId);
      }
      
      if (filterOptions.value.paymentStatus) {
        filtered = filtered.filter(r => r.paymentStatus === filterOptions.value.paymentStatus);
      }
      
      return filtered;
    });
    
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
      registrations,
      sessions,
      loading,
      filterOptions,
      filteredRegistrations,
      selectedRegistration,
      getSessionTitle,
      applyFilters,
      markAsPaid,
      viewRegistrationDetails,
      deleteRegistration,
      formatDate
    };
  }
};
</script>

<style scoped>
.registration-management {
  padding-bottom: 2rem;
}

.card {
  margin-bottom: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.badge {
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
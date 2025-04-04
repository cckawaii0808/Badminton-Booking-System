<template>
  <div class="session-management">
    <div class="container py-4">
      <h1>場次管理</h1>

      <!-- 新增場次表單 -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">新增場次</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="addSession">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="title" class="form-label">場次名稱</label>
                <input type="text" class="form-control" id="title" v-model="newSession.title" required>
              </div>
              <div class="col-md-6">
                <label for="location" class="form-label">地點</label>
                <input type="text" class="form-control" id="location" v-model="newSession.location" required>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="date" class="form-label">日期時間</label>
                <input type="datetime-local" class="form-control" id="date" v-model="newSession.date" required>
              </div>
              <div class="col-md-6">
                <label for="maxParticipants" class="form-label">最大人數</label>
                <input type="number" class="form-control" id="maxParticipants" v-model="newSession.maxParticipants" min="1" required>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label for="price" class="form-label">費用</label>
                <input type="number" class="form-control" id="price" v-model="newSession.price" min="0" required>
              </div>
              <div class="col-md-6">
                <label for="status" class="form-label">狀態</label>
                <select class="form-select" id="status" v-model="newSession.status" required>
                  <option value="開放">開放</option>
                  <option value="關閉">關閉</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label for="details" class="form-label">詳細說明</label>
              <textarea class="form-control" id="details" v-model="newSession.details" rows="3"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? '處理中...' : '新增場次' }}
            </button>
          </form>
        </div>
      </div>

      <!-- 場次列表 -->
      <div class="card">
        <div class="card-header bg-secondary text-white">
          <h5 class="mb-0">場次列表</h5>
        </div>
        <div class="card-body">
          <div v-if="loadingSessions" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
            <p>載入場次資料...</p>
          </div>
          
          <div v-else-if="sessions.length === 0" class="text-center py-4">
            <p>暫無場次資料</p>
          </div>
          
          <div v-else>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>場次名稱</th>
                    <th>日期時間</th>
                    <th>地點</th>
                    <th>報名人數</th>
                    <th>費用</th>
                    <th>狀態</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="session in sessions" :key="session.id">
                    <td>{{ session.title }}</td>
                    <td>{{ formatDate(session.date) }}</td>
                    <td>{{ session.location }}</td>
                    <td>{{ session.currentParticipants }}/{{ session.maxParticipants }}</td>
                    <td>{{ session.price }} 元</td>
                    <td>
                      <span 
                        :class="session.status === '開放' ? 'badge bg-success' : 'badge bg-danger'"
                      >
                        {{ session.status }}
                      </span>
                    </td>
                    <td>
                      <button 
                        class="btn btn-sm btn-outline-primary me-1"
                        @click="editSession(session)"
                      >
                        編輯
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-warning me-1"
                        @click="toggleSessionStatus(session)"
                      >
                        {{ session.status === '開放' ? '關閉' : '開放' }}
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteSession(session.id)"
                      >
                        刪除
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

    <!-- 編輯場次彈窗 -->
    <div class="modal fade" id="editSessionModal" tabindex="-1" aria-labelledby="editSessionModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editSessionModalLabel">編輯場次</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateSession">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="editTitle" class="form-label">場次名稱</label>
                  <input type="text" class="form-control" id="editTitle" v-model="editingSession.title" required>
                </div>
                <div class="col-md-6">
                  <label for="editLocation" class="form-label">地點</label>
                  <input type="text" class="form-control" id="editLocation" v-model="editingSession.location" required>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="editDate" class="form-label">日期時間</label>
                  <input type="datetime-local" class="form-control" id="editDate" v-model="editingSession.dateString" required>
                </div>
                <div class="col-md-6">
                  <label for="editMaxParticipants" class="form-label">最大人數</label>
                  <input type="number" class="form-control" id="editMaxParticipants" v-model="editingSession.maxParticipants" min="1" required>
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="editPrice" class="form-label">費用</label>
                  <input type="number" class="form-control" id="editPrice" v-model="editingSession.price" min="0" required>
                </div>
                <div class="col-md-6">
                  <label for="editStatus" class="form-label">狀態</label>
                  <select class="form-select" id="editStatus" v-model="editingSession.status" required>
                    <option value="開放">開放</option>
                    <option value="關閉">關閉</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label for="editDetails" class="form-label">詳細說明</label>
                <textarea class="form-control" id="editDetails" v-model="editingSession.details" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateSession" :disabled="updateLoading">
              {{ updateLoading ? '儲存中...' : '儲存變更' }}
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
  orderBy, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'SessionManagement',
  setup() {
    const router = useRouter();
    const sessions = ref([]);
    const newSession = ref({
      title: '',
      location: '',
      date: '',
      maxParticipants: 20,
      details: '',
      price: 200,
      status: '開放'
    });
    
    const loading = ref(false);
    const updateLoading = ref(false);
    const loadingSessions = ref(true);
    const currentUser = ref(null);
    const editingSession = ref({
      id: null,
      title: '',
      location: '',
      dateString: '',
      maxParticipants: 0,
      details: '',
      price: 0,
      status: '開放'
    });
    
    // Modal instance
    let editModal = null;

    onMounted(() => {
      // 檢查用戶權限
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          // 檢查是否為管理員
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            // 獲取場次列表
            fetchSessions();
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
        editModal = new window.bootstrap.Modal(document.getElementById('editSessionModal'));
      }
    });

    const fetchSessions = async () => {
      try {
        loadingSessions.value = true;
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
      } finally {
        loadingSessions.value = false;
      }
    };

    const addSession = async () => {
      if (!newSession.value.date) {
        alert('請選擇日期時間');
        return;
      }
      
      loading.value = true;
      
      try {
        const sessionData = {
          title: newSession.value.title,
          location: newSession.value.location,
          date: Timestamp.fromDate(new Date(newSession.value.date)),
          maxParticipants: parseInt(newSession.value.maxParticipants),
          currentParticipants: 0,
          details: newSession.value.details,
          price: parseInt(newSession.value.price),
          status: newSession.value.status,
          createdBy: currentUser.value.uid,
          createdAt: serverTimestamp()
        };
        
        await addDoc(collection(db, 'sessions'), sessionData);
        
        // 重置表單
        newSession.value = {
          title: '',
          location: '',
          date: '',
          maxParticipants: 20,
          details: '',
          price: 200,
          status: '開放'
        };
        
        // 重新獲取場次列表
        fetchSessions();
        
        alert('場次新增成功！');
      } catch (e) {
        console.error('Error adding session:', e);
        alert('新增場次失敗，請稍後再試');
      } finally {
        loading.value = false;
      }
    };

    const editSession = (session) => {
      // 格式化日期為本地日期時間字串
      const localDate = new Date(session.date);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const hours = String(localDate.getHours()).padStart(2, '0');
      const minutes = String(localDate.getMinutes()).padStart(2, '0');
      
      editingSession.value = {
        id: session.id,
        title: session.title,
        location: session.location,
        dateString: `${year}-${month}-${day}T${hours}:${minutes}`,
        maxParticipants: session.maxParticipants,
        details: session.details || '',
        price: session.price,
        status: session.status,
        currentParticipants: session.currentParticipants
      };
      
      // 顯示編輯彈窗
      if (editModal) {
        editModal.show();
      }
    };

    const updateSession = async () => {
      if (!editingSession.value.dateString) {
        alert('請選擇日期時間');
        return;
      }
      
      updateLoading.value = true;
      
      try {
        const sessionRef = doc(db, 'sessions', editingSession.value.id);
        
        await updateDoc(sessionRef, {
          title: editingSession.value.title,
          location: editingSession.value.location,
          date: Timestamp.fromDate(new Date(editingSession.value.dateString)),
          maxParticipants: parseInt(editingSession.value.maxParticipants),
          details: editingSession.value.details,
          price: parseInt(editingSession.value.price),
          status: editingSession.value.status,
          updatedAt: serverTimestamp()
        });
        
        // 關閉彈窗
        if (editModal) {
          editModal.hide();
        }
        
        // 重新獲取場次列表
        fetchSessions();
        
        alert('場次更新成功！');
      } catch (e) {
        console.error('Error updating session:', e);
        alert('更新場次失敗，請稍後再試');
      } finally {
        updateLoading.value = false;
      }
    };

    const toggleSessionStatus = async (session) => {
      const newStatus = session.status === '開放' ? '關閉' : '開放';
      const confirmToggle = confirm(`確定將場次「${session.title}」狀態設為「${newStatus}」?`);
      
      if (!confirmToggle) return;
      
      try {
        const sessionRef = doc(db, 'sessions', session.id);
        await updateDoc(sessionRef, {
          status: newStatus,
          updatedAt: serverTimestamp()
        });
        
        // 重新獲取場次列表
        fetchSessions();
        
        alert(`場次狀態已更新為「${newStatus}」`);
      } catch (e) {
        console.error('Error toggling session status:', e);
        alert('更新場次狀態失敗，請稍後再試');
      }
    };

    const deleteSession = async (sessionId) => {
      const confirmDelete = confirm('確定要刪除此場次？此操作無法還原！');
      
      if (!confirmDelete) return;
      
      try {
        await deleteDoc(doc(db, 'sessions', sessionId));
        
        // 重新獲取場次列表
        fetchSessions();
        
        alert('場次已刪除');
      } catch (e) {
        console.error('Error deleting session:', e);
        alert('刪除場次失敗，請稍後再試');
      }
    };

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
      newSession,
      loading,
      updateLoading,
      loadingSessions,
      editingSession,
      fetchSessions,
      addSession,
      editSession,
      updateSession,
      toggleSessionStatus,
      deleteSession,
      formatDate
    };
  }
};
</script>

<style scoped>
.session-management {
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
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
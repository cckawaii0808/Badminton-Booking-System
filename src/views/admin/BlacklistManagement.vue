<template>
  <div class="blacklist-management">
    <div class="container py-4">
      <h1>黑名單管理</h1>
      
      <!-- 新增黑名單 -->
      <div class="card mb-4">
        <div class="card-header bg-danger text-white">
          <h5 class="mb-0">新增黑名單</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="addToBlacklist">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="userEmail" class="form-label">使用者電子郵件</label>
                <input type="email" class="form-control" id="userEmail" v-model="blacklistForm.email" required>
              </div>
              <div class="col-md-6">
                <label for="reason" class="form-label">列入黑名單原因</label>
                <input type="text" class="form-control" id="reason" v-model="blacklistForm.reason" required>
              </div>
            </div>
            
            <button type="submit" class="btn btn-danger" :disabled="loading">
              {{ loading ? '處理中...' : '新增至黑名單' }}
            </button>
          </form>
        </div>
      </div>
      
      <!-- 黑名單列表 -->
      <div class="card">
        <div class="card-header bg-dark text-white">
          <h5 class="mb-0">黑名單列表</h5>
        </div>
        <div class="card-body">
          <div v-if="loadingUsers" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">載入中...</span>
            </div>
            <p>載入黑名單用戶...</p>
          </div>
          
          <div v-else-if="blacklistedUsers.length === 0" class="text-center py-4">
            <p>目前沒有黑名單用戶</p>
          </div>
          
          <div v-else>
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>用戶名稱</th>
                    <th>電子郵件</th>
                    <th>電話</th>
                    <th>黑名單原因</th>
                    <th>加入時間</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in blacklistedUsers" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.phone }}</td>
                    <td>{{ user.blacklistReason }}</td>
                    <td>{{ formatDate(user.blacklistedAt) }}</td>
                    <td>
                      <button 
                        class="btn btn-sm btn-outline-success" 
                        @click="removeFromBlacklist(user.id)"
                      >
                        移出黑名單
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
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'BlacklistManagement',
  setup() {
    const router = useRouter();
    const users = ref([]);
    const loading = ref(false);
    const loadingUsers = ref(true);
    const currentUser = ref(null);
    
    const blacklistForm = ref({
      email: '',
      reason: ''
    });
    
    onMounted(() => {
      // 檢查用戶權限
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          // 檢查是否為管理員
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            // 獲取黑名單用戶
            fetchBlacklistedUsers();
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
    
    const fetchBlacklistedUsers = async () => {
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('isBlacklisted', '==', true),
          orderBy('blacklistedAt', 'desc')
        );
        
        const querySnapshot = await getDocs(usersQuery);
        users.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (e) {
        console.error('Error fetching blacklisted users:', e);
        alert('載入黑名單用戶失敗，請稍後再試');
      } finally {
        loadingUsers.value = false;
      }
    };
    
    const addToBlacklist = async () => {
      loading.value = true;
      
      try {
        // 查找用戶
        const usersQuery = query(
          collection(db, 'users'),
          where('email', '==', blacklistForm.value.email)
        );
        
        const querySnapshot = await getDocs(usersQuery);
        
        if (querySnapshot.empty) {
          alert('找不到此電子郵件對應的用戶');
          loading.value = false;
          return;
        }
        
        // 更新用戶的黑名單狀態
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          isBlacklisted: true,
          blacklistReason: blacklistForm.value.reason,
          blacklistedAt: serverTimestamp(),
          blacklistedBy: currentUser.value.uid
        });
        
        // 重置表單
        blacklistForm.value = {
          email: '',
          reason: ''
        };
        
        // 重新獲取黑名單用戶
        fetchBlacklistedUsers();
        
        alert('用戶已成功添加至黑名單');
      } catch (e) {
        console.error('Error adding to blacklist:', e);
        alert('操作失敗，請稍後再試');
      } finally {
        loading.value = false;
      }
    };
    
    const removeFromBlacklist = async (userId) => {
      const confirmRemove = confirm('確定要將此用戶從黑名單中移除？');
      if (!confirmRemove) return;
      
      try {
        await updateDoc(doc(db, 'users', userId), {
          isBlacklisted: false,
          removedFromBlacklistAt: serverTimestamp(),
          removedFromBlacklistBy: currentUser.value.uid
        });
        
        // 從列表中移除用戶
        users.value = users.value.filter(u => u.id !== userId);
        
        alert('用戶已從黑名單中移除');
      } catch (e) {
        console.error('Error removing from blacklist:', e);
        alert('操作失敗，請稍後再試');
      }
    };
    
    // 黑名單用戶列表
    const blacklistedUsers = computed(() => {
      return users.value.filter(u => u.isBlacklisted);
    });
    
    const formatDate = (timestamp) => {
      if (!timestamp) return '未知時間';
      
      // 處理Firestore Timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    return {
      users,
      loading,
      loadingUsers,
      blacklistForm,
      blacklistedUsers,
      addToBlacklist,
      removeFromBlacklist,
      formatDate
    };
  }
};
</script>

<style scoped>
.blacklist-management {
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
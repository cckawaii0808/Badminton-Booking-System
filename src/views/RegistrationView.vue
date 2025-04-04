<template>
  <div class="registration">
    <div class="container py-4">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">載入中...</span>
        </div>
        <p class="mt-2">載入場次資料...</p>
      </div>
      
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      
      <div v-else>
        <h1>報名表單</h1>
        
        <!-- 場次資訊卡 -->
        <div class="card mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">場次資訊</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h2>{{ session.title }}</h2>
                <p>
                  <i class="bi bi-calendar"></i> <strong>時間：</strong> {{ formatDate(session.date) }}<br>
                  <i class="bi bi-geo-alt"></i> <strong>地點：</strong> {{ session.location }}<br>
                  <i class="bi bi-people"></i> <strong>人數：</strong> {{ session.currentParticipants }}/{{ session.maxParticipants }} 人<br>
                  <i class="bi bi-currency-dollar"></i> <strong>費用：</strong> {{ session.price }} 元
                </p>
              </div>
              <div class="col-md-4 text-md-end">
                <div v-if="!canRegister" class="alert alert-warning">
                  {{ registrationStatusMessage }}
                </div>
              </div>
            </div>
            
            <div v-if="session.details" class="mt-3">
              <h5>詳細說明</h5>
              <p>{{ session.details }}</p>
            </div>
          </div>
        </div>
        
        <!-- 報名表單 -->
        <div v-if="currentUser">
          <div v-if="canRegister" class="card">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">填寫報名資料</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitRegistration">
                <!-- 主要報名者資料 -->
                <div class="mb-4">
                  <h5>主要報名者</h5>
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group mb-3">
                        <label for="name" class="form-label">姓名</label>
                        <input type="text" class="form-control" id="name" v-model="primaryParticipant.name" required>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group mb-3">
                        <label for="phone" class="form-label">電話</label>
                        <input type="tel" class="form-control" id="phone" v-model="primaryParticipant.phone" required>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group mb-3">
                        <label for="email" class="form-label">電子郵件</label>
                        <input type="email" class="form-control" id="email" v-model="primaryParticipant.email" required>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 其他參加者資料 -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>其他參加者</h5>
                    <button type="button" class="btn btn-sm btn-outline-primary" @click="addParticipant">
                      <i class="bi bi-plus"></i> 新增參加者
                    </button>
                  </div>
                  
                  <div v-if="additionalParticipants.length === 0" class="text-center py-3 border rounded">
                    <p class="mb-0 text-muted">目前未添加其他參加者</p>
                  </div>
                  
                  <div v-for="(participant, index) in additionalParticipants" :key="index" class="border rounded p-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h6>參加者 #{{ index + 1 }}</h6>
                      <button type="button" class="btn btn-sm btn-outline-danger" @click="removeParticipant(index)">
                        <i class="bi bi-trash"></i> 移除
                      </button>
                    </div>
                    
                    <div class="row">
                      <div class="col-md-4">
                        <div class="form-group mb-3">
                          <label :for="'additional-name-' + index" class="form-label">姓名</label>
                          <input type="text" class="form-control" :id="'additional-name-' + index" v-model="participant.name" required>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group mb-3">
                          <label :for="'additional-phone-' + index" class="form-label">電話</label>
                          <input type="tel" class="form-control" :id="'additional-phone-' + index" v-model="participant.phone" required>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <div class="form-group mb-3">
                          <label :for="'additional-email-' + index" class="form-label">電子郵件</label>
                          <input type="email" class="form-control" :id="'additional-email-' + index" v-model="participant.email" required>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 備註 -->
                <div class="mb-4">
                  <label for="notes" class="form-label">備註</label>
                  <textarea class="form-control" id="notes" v-model="notes" rows="3"></textarea>
                </div>
                
                <!-- 預約限制提示 -->
                <div class="alert alert-info" v-if="maxAllowed > 0">
                  <p class="mb-0">
                    <i class="bi bi-info-circle"></i> 
                    本場次每人最多可代表 {{ maxAllowed }} 人報名
                    <span v-if="remainingSlots > 0">（目前剩餘名額: {{ remainingSlots }} 人）</span>
                  </p>
                </div>
                
                <!-- 送出按鈕 -->
                <div class="text-center">
                  <button 
                    type="submit" 
                    class="btn btn-lg btn-success" 
                    :disabled="submitLoading || totalParticipants > maxAllowed || totalParticipants > remainingSlots"
                  >
                    {{ submitLoading ? '處理中...' : '確認報名' }}
                  </button>
                  
                  <div v-if="totalParticipants > maxAllowed" class="text-danger mt-2">
                    超過每人最多報名人數限制
                  </div>
                  <div v-else-if="totalParticipants > remainingSlots" class="text-danger mt-2">
                    超過剩餘名額
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div v-else class="alert alert-warning">
            {{ registrationStatusMessage }}
          </div>
        </div>
        
        <div v-else class="alert alert-info">
          請先 <router-link to="/login" class="alert-link">登入</router-link> 後再進行報名
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  serverTimestamp, 
  increment, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/firebase';

export default {
  name: 'RegistrationView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const loading = ref(true);
    const error = ref(null);
    const session = ref({});
    const currentUser = ref(null);
    const submitLoading = ref(false);
    
    const primaryParticipant = ref({
      name: '',
      phone: '',
      email: ''
    });
    const additionalParticipants = ref([]);
    const notes = ref('');
    
    // 場次ID
    const sessionId = route.params.id;
    
    onMounted(() => {
      // 獲取場次資料
      fetchSessionData();
      
      // 監聽用戶認證狀態
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          
          // 獲取用戶資料並填入主要報名者資訊
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            primaryParticipant.value = {
              name: userData.name || '',
              phone: userData.phone || '',
              email: userData.email || ''
            };
          }
          
          // 檢查用戶是否已報名此場次
          checkExistingRegistration(user.uid);
        }
      });
    });
    
    const fetchSessionData = async () => {
      try {
        const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
        
        if (!sessionDoc.exists()) {
          error.value = '找不到該場次資料';
          loading.value = false;
          return;
        }
        
        session.value = {
          id: sessionDoc.id,
          ...sessionDoc.data(),
          date: sessionDoc.data().date.toDate()
        };
      } catch (e) {
        console.error('Error fetching session data:', e);
        error.value = '無法載入場次資料，請稍後再試';
      } finally {
        loading.value = false;
      }
    };
    
    // 是否已報名此場次
    const alreadyRegistered = ref(false);
    
    const checkExistingRegistration = async (userId) => {
      try {
        const registrationsQuery = query(
          collection(db, 'registrations'),
          where('userId', '==', userId),
          where('sessionId', '==', sessionId)
        );
        
        const querySnapshot = await getDocs(registrationsQuery);
        
        if (!querySnapshot.empty) {
          alreadyRegistered.value = true;
        }
      } catch (e) {
        console.error('Error checking existing registration:', e);
      }
    };
    
    const addParticipant = () => {
      additionalParticipants.value.push({
        name: '',
        phone: '',
        email: ''
      });
    };
    
    const removeParticipant = (index) => {
      additionalParticipants.value.splice(index, 1);
    };
    
    const submitRegistration = async () => {
      submitLoading.value = true;
      
      try {
        // 準備所有參加者資料
        const allParticipants = [primaryParticipant.value, ...additionalParticipants.value];
        
        // 創建報名記錄
        await addDoc(collection(db, 'registrations'), {
          sessionId: sessionId,
          userId: currentUser.value.uid,
          participants: allParticipants,
          notes: notes.value,
          paymentStatus: '未付款',
          timestamp: serverTimestamp()
        });
        
        // 更新場次的當前報名人數
        const sessionRef = doc(db, 'sessions', sessionId);
        await updateDoc(sessionRef, {
          currentParticipants: increment(allParticipants.length)
        });
        
        // 報名成功後導向確認頁面
        router.push({
          path: '/registration-success',
          query: { 
            session: session.value.title,
            participants: allParticipants.length
          }
        });
      } catch (e) {
        console.error('Error submitting registration:', e);
        alert('報名失敗，請稍後再試');
      } finally {
        submitLoading.value = false;
      }
    };
    
    // 每個人最多可報名的人數 (自己 + 其他人)
    const maxAllowed = computed(() => {
      // 預設每人最多報名5人
      return 5;
    });
    
    // 已報名的總人數
    const totalParticipants = computed(() => {
      return 1 + additionalParticipants.value.length;
    });
    
    // 場次剩餘名額
    const remainingSlots = computed(() => {
      if (!session.value || !session.value.maxParticipants) return 0;
      return session.value.maxParticipants - session.value.currentParticipants;
    });
    
    // 是否可以報名
    const canRegister = computed(() => {
      if (!session.value || !session.value.status) return false;
      if (alreadyRegistered.value) return false;
      if (session.value.status !== '開放') return false;
      if (session.value.currentParticipants >= session.value.maxParticipants) return false;
      if (new Date(session.value.date) < new Date()) return false;
      return true;
    });
    
    // 報名狀態訊息
    const registrationStatusMessage = computed(() => {
      if (alreadyRegistered.value) return '您已報名此場次';
      if (!session.value || !session.value.status) return '無法取得場次資訊';
      if (session.value.status !== '開放') return '此場次已關閉報名';
      if (session.value.currentParticipants >= session.value.maxParticipants) return '此場次已額滿';
      if (new Date(session.value.date) < new Date()) return '此場次已過期';
      return '';
    });
    
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
      session,
      loading,
      error,
      currentUser,
      primaryParticipant,
      additionalParticipants,
      notes,
      submitLoading,
      maxAllowed,
      totalParticipants,
      remainingSlots,
      canRegister,
      registrationStatusMessage,
      addParticipant,
      removeParticipant,
      submitRegistration,
      formatDate
    };
  }
};
</script>

<style scoped>
.registration {
  padding-bottom: 2rem;
}

.card {
  margin-bottom: 1.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.card-header {
  padding: 0.75rem 1.25rem;
}

.alert {
  margin-bottom: 1.5rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
</style>
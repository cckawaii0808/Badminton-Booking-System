<template>
  <div class="profile">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">個人資料</h3>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">載入中...</span>
                </div>
                <p>載入用戶資料...</p>
              </div>
              
              <div v-else>
                <form @submit.prevent="updateProfile">
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="name" class="form-label">姓名</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="name" 
                          v-model="profile.name" 
                          required
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="phone" class="form-label">電話</label>
                        <input 
                          type="tel" 
                          class="form-control" 
                          id="phone" 
                          v-model="profile.phone" 
                          required
                        >
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="email" class="form-label">電子郵件</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="profile.email" 
                      disabled
                    >
                    <div class="form-text">電子郵件無法修改</div>
                  </div>
                  
                  <hr class="my-4">
                  
                  <div class="d-grid">
                    <button 
                      type="submit" 
                      class="btn btn-primary btn-lg" 
                      :disabled="saving"
                    >
                      {{ saving ? '儲存中...' : '儲存變更' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export default {
  name: 'ProfileView',
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const saving = ref(false);
    const currentUser = ref(null);
    
    const profile = ref({
      name: '',
      email: '',
      phone: ''
    });
    
    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          currentUser.value = user;
          await fetchUserData(user.uid);
        } else {
          router.push('/login');
        }
      });
    });
    
    const fetchUserData = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          profile.value = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || ''
          };
        }
      } catch (e) {
        console.error('Error fetching user data:', e);
        alert('無法載入用戶資料，請稍後再試');
      } finally {
        loading.value = false;
      }
    };
    
    const updateProfile = async () => {
      if (!profile.value.name || !profile.value.phone) {
        alert('請填寫所有必填欄位');
        return;
      }
      
      saving.value = true;
      
      try {
        const userRef = doc(db, 'users', currentUser.value.uid);
        
        await updateDoc(userRef, {
          name: profile.value.name,
          phone: profile.value.phone,
          updatedAt: serverTimestamp()
        });
        
        alert('個人資料已更新');
        router.push('/dashboard');
      } catch (e) {
        console.error('Error updating profile:', e);
        alert('更新個人資料失敗，請稍後再試');
      } finally {
        saving.value = false;
      }
    };
    
    return {
      loading,
      saving,
      profile,
      updateProfile
    };
  }
};
</script>

<style scoped>
.profile {
  padding-bottom: 2rem;
}

.card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}
</style>

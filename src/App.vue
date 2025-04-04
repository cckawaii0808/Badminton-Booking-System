<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand" to="/">羽球報名系統</router-link>
          <button 
            class="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarMain"
            aria-controls="navbarMain" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarMain">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link" to="/">首頁</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link" to="/sessions">場次列表</router-link>
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <router-link class="nav-link" to="/dashboard">個人儀表板</router-link>
              </li>
              <!-- 管理員選單 -->
              <li class="nav-item dropdown" v-if="isAdmin">
                <a 
                  class="nav-link dropdown-toggle" 
                  href="#" 
                  id="adminDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  管理功能
                </a>
                <ul class="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <router-link class="dropdown-item" to="/admin/sessions">場次管理</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" to="/admin/registrations">報名管理</router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" to="/admin/blacklist">黑名單管理</router-link>
                  </li>
                </ul>
              </li>
            </ul>
            
            <div class="d-flex">
              <template v-if="isLoggedIn">
                <span class="navbar-text me-3">
                  {{ userDisplayName }}
                </span>
                <button class="btn btn-outline-light" @click="logout">登出</button>
              </template>
              <template v-else>
                <router-link to="/login" class="btn btn-outline-light me-2">登入</router-link>
                <router-link to="/register" class="btn btn-light">註冊</router-link>
              </template>
            </div>
          </div>
        </div>
      </nav>
    </header>
    
    <main>
      <router-view/>
    </main>
    
    <footer class="bg-dark text-white mt-5 py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>羽球報名系統</h5>
            <p>簡單、快速的羽球場地和活動報名平台</p>
          </div>
          <div class="col-md-6 text-md-end">
            <p>&copy; {{ new Date().getFullYear() }} 羽球報名系統. 保留所有權利.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed, inject } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export default {
  name: 'App',
  setup() {
    const store = inject('store')
    const currentUser = ref(null)
    const userData = ref({})
    
    const isLoggedIn = computed(() => !!currentUser.value)
    
    const isAdmin = computed(() => {
      return userData.value && userData.value.role === 'admin'
    })
    
    const userDisplayName = computed(() => {
      return userData.value && userData.value.name ? userData.value.name : '用戶'
    })
    
    onMounted(() => {
      // 監聽用戶狀態
      onAuthStateChanged(auth, async (user) => {
        currentUser.value = user
        
        if (user) {
          try {
            // 獲取用戶資料
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            if (userDoc.exists()) {
              userData.value = userDoc.data()
              store.setAdmin(userData.value.role === 'admin')
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
          }
        } else {
          userData.value = {}
          store.setAdmin(false)
        }
        
        // 更新store
        store.setUser(user)
      })
      
      // 確保Bootstrap JS 加載
      if (typeof document !== 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
        script.integrity = 'sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p'
        script.crossOrigin = 'anonymous'
        document.head.appendChild(script)
      }
    })
    
    const logout = async () => {
      try {
        await auth.signOut()
        // 可以導航到首頁
        window.location.href = '/'
      } catch (error) {
        console.error('Error signing out:', error)
      }
    }
    
    return {
      isLoggedIn,
      isAdmin,
      userDisplayName,
      logout
    }
  }
}
</script>

<style>
#app {
  font-family: 'Noto Sans TC', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.navbar-brand {
  font-weight: bold;
}

.dropdown-item.active, .dropdown-item:active {
  background-color: #3f51b5;
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: #3f51b5;
  border-color: #3f51b5;
}

.btn-primary:hover {
  background-color: #303f9f;
  border-color: #303f9f;
}

.bg-primary {
  background-color: #3f51b5 !important;
}

footer {
  margin-top: auto;
}
</style>

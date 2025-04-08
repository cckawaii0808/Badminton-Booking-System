import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/auth/Login.vue";
import RegisterView from "../views/auth/Register.vue";
import LineCallback from "../views/auth/LineCallback.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/__/auth/handler",
    name: "line-callback",
    component: LineCallback,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("../views/admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/sessions",
    name: "admin-sessions",
    component: () => import("../views/admin/SessionManagement.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/registrations",
    name: "admin-registrations",
    component: () => import("../views/admin/RegistrationManagement.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admin/blacklist",
    name: "admin-blacklist",
    component: () => import("../views/admin/BlacklistManagement.vue"),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/sessions",
    name: "sessions",
    component: () => import("../views/SessionsView.vue"),
  },
  {
    path: "/registration/:id",
    name: "registration",
    component: () => import("../views/RegistrationView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/registration-success",
    name: "registration-success",
    component: () => import("../views/RegistrationSuccessView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/Badminton-Booking-System/' : '/'),
  routes,
});

// 導航守衛
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  // 獲取當前用戶
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else if (requiresAdmin && currentUser) {
    // 檢查用戶是否為管理員
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const isAdmin = userDoc.exists() && userDoc.data().role === "admin";
      
      if (isAdmin) {
        next();
      } else {
        alert("您沒有管理員權限");
        next("/dashboard");
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      next("/dashboard");
    }
  } else {
    next();
  }
});

export default router;

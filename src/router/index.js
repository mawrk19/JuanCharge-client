
import Vue from "vue";
import Router from "vue-router";
import { Cache } from "@/service/cache";
import store from "@/store";

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/application/modules/auth/pages/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/application/modules/auth/pages/Register.vue"),
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/application/modules/auth/pages/ForgotPassword.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/application/modules/auth/pages/ResetPassword.vue"),
  },
  {
    path: "/main",
    component: () => import("@/views/Main.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "dashboard"
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/application/modules/dashboard/Index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "map",
        name: "map",
        component: () => import("@/application/modules/map/Index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/application/modules/settings/Index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/application/modules/users/Index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "kiosks",
        name: "kiosks",
        component: () => import("@/application/modules/kiosks/Index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "kiosks-users",
        name: "kiosks-users",
        component: () => import("@/application/modules/kiosks_user/Index.vue"),
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: "/patron",
    component: () => import("@/application/modules/patron/Layout.vue"),
    meta: { requiresAuth: true, requiresRole: 'patron' },
    children: [
      {
        path: "",
        name: "patron-dashboard",
        component: () => import("@/application/modules/patron/Index.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "map",
        name: "patron-map",
        component: () => import("@/application/modules/patron/pages/Map.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "achievements",
        name: "patron-achievements",
        component: () => import("@/application/modules/patron/pages/Achievements.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "convert",
        name: "patron-convert",
        component: () => import("@/application/modules/patron/pages/ConvertPoints.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "charging",
        name: "patron-charging",
        component: () => import("@/application/modules/patron/pages/ChargingSession.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "profile",
        name: "patron-profile",
        component: () => import("@/application/modules/patron/pages/Profile.vue"),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '*',
    name: 'not-found',
    component: { render: h => h('div', { style: { padding: '2rem', textAlign: 'center' } }, [h('h1', '404 Not Found')]) }
  }
];

const permissions = {
  Admin:[ 
    {name: 'dashboard', path: '/main/dashboard' }
  ],
  Partner:[ 
    {name: 'dashboard', path: '/main/dashboard' }
  ],
  Patrons:[ 
    {name: 'dashboard', path: '/main/dashboard' }
  ]
};

const router = new Router({
  mode: "history",
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Always prioritize localStorage for token check
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('user_type');
  
  // If store is empty but localStorage has data, restore session
  if (token && !store.state.auth?.token) {
    try {
      store.dispatch('auth/restoreSession');
    } catch (error) {
      console.error('Failed to restore session:', error);
    }
  }
  
  // Treat kiosk_user as patron (they are the users who charge at kiosks)
  const isPatron = userType === 'patron' || userType === 'kiosk_user';
  
  // Public routes (accessible without authentication)
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  const authRequired = !publicPages.includes(to.path);
  
  if (authRequired && !token) {
    // Redirect to login if not authenticated
    return next('/login');
  }
  
  // If user has token and accessing protected route, validate it
  if (authRequired && token) {
    // Only validate on first load or when coming from public page
    const shouldValidate = !from.name || publicPages.includes(from.path);
    
    if (shouldValidate) {
      const isValid = await store.dispatch('auth/validateToken');
      if (!isValid) {
        // Token is invalid, redirect to login
        return next('/login');
      }
    }
  }
  
  // If user is authenticated and on login page, redirect based on role
  if (token && publicPages.includes(to.path)) {
    if (isPatron) {
      return next('/patron');
    }
    return next('/main/dashboard');
  }
  
  // Check if patron trying to access admin routes
  if (token && isPatron && to.path.startsWith('/main')) {
    return next('/patron');
  }
  
  // Check if admin/lgu trying to access patron routes
  if (token && !isPatron && to.path.startsWith('/patron')) {
    return next('/main/dashboard');
  }
  
  // For non-protected routes, allow access
  next();
});

export default router;
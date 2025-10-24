
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

router.beforeEach((to, from, next) => {
  // Get token and user from Cache or sessionStorage only
  let token = Cache.get('token') || sessionStorage.getItem('token');
  let user = Cache.get('user');
  
  if (!user) {
    // Only check sessionStorage
    let userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        user = JSON.parse(userStr);
        if (user) Cache.set('user', user);
      } catch (e) {
        // Invalid user data, clear it
        sessionStorage.removeItem('user');
        user = null;
      }
    }
  }

  // Sync token to cache if it exists
  if (token && !Cache.get('token')) {
    Cache.set('token', token);
  }

  // Simple authentication check - just need a valid token
  const isAuthenticated = !!token;
  
  // If going to login and already authenticated, redirect to dashboard
  if (to.path === "/login" && isAuthenticated) {
    next({ path: "/main/dashboard" });
    return;
  }

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Clear any invalid session data and go to login
      if (token || user) {
        store.dispatch("auth/logout");
      }
      next({ path: "/login" });
      return;
    }
    
    // If authenticated, allow access
    next();
    return;
  }
  
  // For non-protected routes, allow access
  next();
});

export default router;
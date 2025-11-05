
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
      },
      {
        path: "kiosks",
        name: "kiosks",
        component: () => import("@/application/modules/kiosks/Index.vue"),
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
  const token = localStorage.getItem('token');
  const storeToken = store.state.auth?.token;
  
  // Use token from localStorage OR Vuex store
  const hasToken = token || storeToken;
  
  // Public routes
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  
  if (authRequired && !hasToken) {
    // Redirect to login if not authenticated
    return next('/login');
  }

  // Simple authentication check - just need a valid token
  const isAuthenticated = !!token;
  
  // If user is authenticated and on login page, redirect to dashboard
  if (hasToken && publicPages.includes(to.path)) {
    return next('/main/dashboard');
  }
  
  // For non-protected routes, allow access
  next();
});

export default router;
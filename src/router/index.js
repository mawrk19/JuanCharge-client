import Vue from "vue";
import Router from "vue-router";

// Import module routes
import dashboardRoutes from "@/application/modules/dashboard/router/index";

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
    children: [
      {
        path: "",
        redirect: "dashboard"
      },
      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/application/modules/dashboard/Index.vue")
      }
    ]
  }
];

export default new Router({
  mode: "history",
  routes,
});
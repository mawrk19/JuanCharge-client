export default [
  {
    name: "patron",
    path: "/patron",
    component: () => import("./../Index.vue"),
  },
  {
    name: "patron-map",
    path: "/patron/map",
    component: () => import("./../pages/Map.vue"),
  },
];

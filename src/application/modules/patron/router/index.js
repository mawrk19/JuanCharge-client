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
  {
    name: "patron-convert",
    path: "/patron/convert",
    component: () => import("./../pages/ConvertPoints.vue"),
  },
  {
    name: "patron-charging",
    path: "/patron/charging",
    component: () => import("./../pages/ChargingSession.vue"),
  },
];

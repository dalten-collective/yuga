import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Admin from "../views/Admin.vue";
import Explore from "../views/Explore.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/", // TODO: make explore the root
    name: "admin",
    component: Admin,
  },
  {
    path: "/explore",  // TODO: make explore the root
    name: "explore",
    component: Explore,
  },
  //{
  //path: "/about",
  //name: "about",
  //// route level code-splitting
  //// this generates a separate chunk (about.[hash].js) for this route
  //// which is lazy-loaded when the route is visited.
  //component: () =>
  //import([> webpackChunkName: "about" <] "../views/AboutView.vue"),
  //},
];

const router = createRouter({
  history: createWebHistory('/apps/cyclo/'),
  routes,
});

export default router;

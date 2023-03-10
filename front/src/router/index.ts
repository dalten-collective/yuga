import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Admin from "../views/Admin.vue";
import Explore from "../views/Explore.vue";
import HostFoundation from "../views/HostFoundation.vue";
import HostFolder from "../views/HostFolder.vue";
import AuthorShow from "../views/AuthorShow.vue";
import TagShow from "../views/TagShow.vue";
import RamaPostShow from "../views/RamaPostShow.vue";

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
  {
    path: "/explore/:foundationHost/:foundationName",
    name: "hostFoundationShow",
    component: HostFoundation,
    props: route => ({
      host: route.params.foundationHost,
      foundationName: route.params.foundationName
    })
  },
  {
    path: "/explore/:foundationHost/:foundationName/folders/:folderName",
    name: "hostFolder",
    component: HostFolder,
    props: route => ({
      host: route.params.foundationHost,
      foundationName: route.params.foundationName,
      folderName: route.params.folderName,
    })
  },
  {
    path: "/explore/:foundationHost/:foundationName/authors/:authorName",
    name: "authorShow",
    component: AuthorShow,
    props: route => ({
      host: route.params.foundationHost,
      foundationName: route.params.foundationName,
      authorName: route.params.authorName,
    })
  },
  {
    path: "/explore/:foundationHost/:foundationName/tags/:tagName",
    name: "tagShow",
    component: TagShow,
    props: route => ({
      host: route.params.foundationHost,
      foundationName: route.params.foundationName,
      tagName: route.params.tagName,
    })
  },

  {
    path: "/explore/:foundationHost/:foundationName/posts/:postID",
    name: "ramaPostShow",
    component: RamaPostShow,
    props: route => ({
      host: route.params.foundationHost,
      foundationName: route.params.foundationName,
      postID: route.params.postID,
    })
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

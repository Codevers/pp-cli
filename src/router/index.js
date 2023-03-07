import { createRouter, createWebHistory } from 'vue-router';
import { BasicRoute } from './basic';

export const router = createRouter({
  // history模式（部署到nginx时需设定tryfile）
  history: createWebHistory(),
  routes: BasicRoute
});

export function setupRouter(app) {
  app.use(router);
}
// 重置路由
// export function resetRouter() {
//   // const newRouter = createRouter()
//   // router.matcher = newRouter.matcher
// }

export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(),
    routes: BasicRoute
  })
  router.matcher = newRouter.matcher
}

import { createRouter, createWebHistory } from 'vue-router';
import checkAuth from './middlewares/check-auth.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 等待確認
    {
      path: '/target',
      component: () => import('../views/TargetView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/LoginView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  checkAuth(to, from, next);
});

export default router;

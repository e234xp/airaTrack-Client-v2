import { createRouter, createWebHistory } from 'vue-router';

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

export default router;

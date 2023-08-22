import { createRouter, createWebHashHistory } from 'vue-router';
import checkAuth from './middlewares/check-auth';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    // 等待確認
    {
      path: '/target',
      component: () => import('../views/TargetView.vue'),
    },
    {
      path: '/investigation',
      component: () => import('../views/InvestigationView.vue'),
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

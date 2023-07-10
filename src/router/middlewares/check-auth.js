import useUserStore from '@/stores/user';

export default (to, from, next) => {
  const userStore = useUserStore();
  const { user } = userStore;

  if (to.path !== '/' && !user) {
    next({ path: '/' });
    return;
  }

  next();
};

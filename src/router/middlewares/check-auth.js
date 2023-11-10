import useUserStore from '@/stores/user';

export default (to, from, next) => {
  const userStore = useUserStore();
  const { setPath } = userStore;
  const { user } = userStore;

  if (to.path !== '/' && !user) {
    next({ path: '/' });
    setPath(to.path);
    return;
  }

  next();
};

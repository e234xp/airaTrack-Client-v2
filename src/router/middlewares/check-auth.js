import useUserStore from '@/stores/user';

export default (to, from, next) => {
  const userStore = useUserStore();
  const { setPath } = userStore;
  const { user, admin } = userStore;

  if (to.path.includes('/config') && !admin) {
    next({ path: from.path });
    return;
  }

  if (to.path !== '/' && !user) {
    next({ path: '/' });
    setPath(to.path);
    return;
  }

  next();
};

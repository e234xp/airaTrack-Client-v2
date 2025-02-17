import useUserStore from '@/stores/user';

export default (to, from, next) => {
  const userStore = useUserStore();
  const { setPath } = userStore;
  const { user, admin, sessionId } = userStore;

  const redirPages = ['/target', '/investigation', '/case', '/config'];
  let toPage = to.path.toLowerCase();

  if (redirPages.includes(toPage) && !sessionId) {
    next({ path: '/', query: { nextUrl: to.path, username: to.query.username, password: to.query.password } });
    return;
  }

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

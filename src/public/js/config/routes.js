const routes = {
  root: '/',
  home: '/home',
  feed: '/feed',
  profileTemplate: '/profile/:userName',
  profile: (userName) => `/profile/${userName}`,
  verifyEmail: '/account/verify-email',
};

export default routes;

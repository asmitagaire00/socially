const routes = {
  root: '/',
  home: '/home',
  feed: '/feed',
  messages: '/messages',
  messageTemplate: '/messages/:convId',
  message: (convId) => `/messages/:${convId}`,
  profileTemplate: '/profile/:userName',
  profile: (userName) => `/profile/${userName}`,
  verifyEmail: '/account/verify-email',
};

export default routes;

// eslint-disable-next-line func-names
const TokenService = (function (window) {
  let instance;
  const TOKEN_KEY = 'jwtToken';
  const { localStorage } = window;

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  return {
    getInstance() {
      if (!instance) {
        instance = {
          setToken,
          getToken,
          removeToken,
        };
      }
      return instance;
    },
  };
})(window);

export default TokenService.getInstance();

// eslint-disable-next-line no-use-before-define
module.exports = extractCookies;

// express supertest / superagent utility for accessing response cookies as objects
// gist: https://gist.github.com/the-vampiire/a564af41ed0ce8eb7c30dbe6c0f627d8

function shapeFlags(flags) {
  return flags.reduce((shapedFlags, flag) => {
    const [flagName, rawValue] = flag.split('=');
    // edge case where a cookie has a single flag and "; " split results in trailing ";"
    const value = rawValue ? rawValue.replace(';', '') : true;
    return { ...shapedFlags, [flagName]: value };
  }, {});
}

// output shape:
// const cookies = {
//   cookieName: {
//     value: 'cookie value',
//     flags: {
//       flagName: 'flag value',
//       booleanFlag: true, // boolean flags (no value) are given true as their value
//     },
//   },
// };

function extractCookies(headers) {
  const cookies = headers['set-cookie']; // Cookie[]

  return cookies.reduce((shapedCookies, cookieString) => {
    const [rawCookie, ...flags] = cookieString.split('; ');
    const [cookieName, value] = rawCookie.split('=');
    return {
      ...shapedCookies,
      [cookieName]: { value, flags: shapeFlags(flags) },
    };
  }, {});
}

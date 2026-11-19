// What to do with one browser request while a stylesheet is being substituted. Pure, so the
// decision is unit-tested without a browser.

/**
 * @param {string}   requestUrl  absolute URL the page asked for
 * @param {string}   origin      origin of the local static server
 * @param {string[]} [allow]     extra origins let through untouched (e.g. web-font hosts); none by default
 * @returns {'css'|'continue'|'abort'} `css` = answer with the substituted stylesheet
 */
export function routeAction(requestUrl, origin, allow = []) {
  const u = new URL(requestUrl);
  if (u.origin !== origin) return allow.includes(u.origin) ? 'continue' : 'abort';
  return u.pathname.endsWith('/nightwire.css') ? 'css' : 'continue';
}

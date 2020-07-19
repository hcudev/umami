import 'promise-polyfill/src/polyfill';
import 'unfetch/polyfill';

const {
  screen: { width, height },
  navigator: { language },
  location: { hostname, pathname, search },
  localStorage: store,
  document,
  history,
} = window;

const script = document.querySelector('script[data-website-id]');

if (script) {
  const website_id = script.getAttribute('data-website-id');

  if (website_id) {
    const sessionKey = 'umami.session';
    const hostUrl = new URL(script.src).origin;
    const screen = `${width}x${height}`;
    let currentUrl = `${pathname}${search}`;
    let currenrRef = document.referrer;

    const post = (url, params) =>
      fetch(url, {
        method: 'post',
        cache: 'no-cache',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }).then(res => res.json());

    const createSession = data =>
      post(`${hostUrl}/api/session`, data).then(({ success, ...session }) => {
        if (success) {
          store.setItem(sessionKey, JSON.stringify(session));
          return success;
        }
      });

    const getSession = () => JSON.parse(store.getItem(sessionKey));

    const getSessionData = url => ({ website_id, hostname, url, screen, language });

    const pageView = (url, referrer) =>
      post(`${hostUrl}/api/collect`, {
        type: 'pageview',
        payload: { url, referrer, session: getSession() },
      }).then(({ success }) => {
        if (!success) {
          store.removeItem(sessionKey);
        }
        return success;
      });

    const execute = (url, referrer) => {
      const data = getSessionData(url);

      if (!store.getItem(sessionKey)) {
        createSession(data).then(success => success && pageView(url, referrer));
      } else {
        pageView(url, referrer).then(
          success =>
            !success && createSession(data).then(success => success && pageView(url, referrer)),
        );
      }
    };

    const handlePush = (state, title, url) => {
      currenrRef = currentUrl;
      currentUrl = url;
      execute(currentUrl, currenrRef);
    };

    const hook = (type, cb) => {
      const orig = history[type];
      return (state, title, url) => {
        const args = [state, title, url];
        cb.apply(null, args);
        return orig.apply(history, args);
      };
    };

    history.pushState = hook('pushState', handlePush);
    history.replaceState = hook('replaceState', handlePush);

    execute(currentUrl, currenrRef);
  }
}

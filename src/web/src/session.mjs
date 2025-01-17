export function setCookie(name, value, maxAge = 60 * 60 * 24 * 7) {
  document.cookie = `${name}=${value};path=/;max-age=${maxAge}`;
}

export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)",
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function getLocalAccount(identity) {
  const schema = /^-kiwi-news-(0x[a-fA-F0-9]{40})-key$/;
  const keys = Object.entries(localStorage).reduce((obj, [key, value]) => {
    const match = key.match(schema);
    if (match) {
      const addr = match[1];
      obj[addr] = value;
    }
    return obj;
  }, {});

  if (Object.keys(keys).length === 1) {
    const [[key, value]] = Object.entries(keys);
    setCookie("identity", key);
    return { identity: key, privateKey: value };
  }
  if (Object.keys(keys).length > 1 && identity && keys[identity]) {
    return { identity, privateKey: keys[identity] };
  }

  if (Object.keys(keys).length === 0 && identity) {
    setCookie("identity", identity);
  }
  return null;
}

export function isSafariOnIOS() {
  const ua = navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  return iOS && webkit;
}

export function isChromeOnAndroid() {
  const ua = navigator.userAgent;
  const android = !!ua.match(/Android/i);
  const chrome = !!ua.match(/Chrome/i);
  return android && chrome;
}

export function isRunningPWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  );
}

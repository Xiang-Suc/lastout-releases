// Visit counts for lastout.dev, two of them:
//
// - Cloudflare Web Analytics. Cloudflare's script sets no cookie and keeps
//   nothing in the browser; it reports the page, the referring site and how
//   fast the page loaded.
// - The site's own count, for the admin's 「数据」 page: a page opened,
//   Download or Buy pressed, the film played, each sent to the license
//   server (POST /e, service/src/analytics/collect.ts) with the page, where
//   the visitor came from, the language and whether it is a Mac. The server
//   keeps daily totals only.
//
// What the site says about both is in docs/privacy.md, "The website"; change
// them together.
//
// Loaded by the public pages only. thanks.html and activate.html never load
// it: their address carries a transaction ID or a license key
// (site/test/analytics.test.mjs).
(function () {
  // Cloudflare dashboard → Analytics & Logs → Web Analytics → lastout.dev →
  // Manage site → the token in the JS snippet. It is public (every visitor's
  // browser sends it). Left empty, Cloudflare's script isn't loaded.
  var TOKEN = "5fffd32f11c148169d2194ae5ba9a741";
  // config.js's licenseServer + "/e"; the legal pages don't load config.js.
  var ENDPOINT = "https://license.lastout.dev/e";
  // Only the real site reports: not a local preview, not a copy elsewhere.
  var SITE = "https://lastout.dev";

  var params;
  try {
    params = new URLSearchParams(location.search);
  } catch (e) {
    return; // an address that can't be read: don't count it
  }

  // The owner's own browsers: lastout.dev/?lo_me=1 once in each, and they
  // count nowhere from then on (?lo_me=0 undoes it).
  var ME = "lastoutMe";
  try {
    if (params.get("lo_me") === "1") window.localStorage.setItem(ME, "1");
    if (params.get("lo_me") === "0") window.localStorage.removeItem(ME);
    if (window.localStorage.getItem(ME) === "1") return;
  } catch (e) {
    /* storage blocked: a visitor like any other */
  }

  // A visitor who asked not to be tracked isn't counted.
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return;
  // A payment link from Paddle (lastout.dev/?_ptxn=txn_…) names an order.
  if (params.has("_ptxn")) return;
  // A browser driven by a script.
  if (navigator.webdriver === true) return;

  if (TOKEN) {
    var beacon = document.createElement("script");
    beacon.defer = true;
    beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
    beacon.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN }));
    document.head.appendChild(beacon);
  }

  if (location.origin !== SITE) return;

  // Where this tab came from: the campaign tag (?utm_source= or ?ref=), else
  // the referring site, else "direct". Set when the tab first lands, so a
  // download or a purchase later in the tab counts for where it came from.
  var SOURCE = "lastoutSource";
  function arrivedFrom() {
    var tag = params.get("utm_source") || params.get("ref");
    if (tag) return tag;
    try {
      var host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== "lastout.dev") return host;
    } catch (e) {
      /* no referrer, or not an address */
    }
    return "direct";
  }
  var source;
  try {
    source = window.sessionStorage.getItem(SOURCE);
    if (!source) {
      source = arrivedFrom();
      window.sessionStorage.setItem(SOURCE, source);
    }
  } catch (e) {
    source = arrivedFrom();
  }

  // As index.html decides: an iPad calls itself a Mac but has a touch screen.
  var mac = /Macintosh/.test(navigator.userAgent || "") && !(navigator.maxTouchPoints > 1) ? 1 : 0;

  function send(event) {
    var body = JSON.stringify({
      e: event,
      p: location.pathname,
      s: source,
      l: /^zh/i.test(document.documentElement.lang || "") ? "zh" : "en",
      m: mac,
    });
    try {
      // text/plain: no preflight, and nothing waits for the answer.
      if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, body);
      else fetch(ENDPOINT, { method: "POST", body: body, keepalive: true, mode: "no-cors" }).catch(function () {});
    } catch (e) {
      /* a count lost; the page goes on */
    }
  }

  send("view");

  // Caught on the way down, before the page's own handlers can stop the event.
  document.addEventListener(
    "click",
    function (e) {
      var target = e.target;
      if (!target || typeof target.closest !== "function") return;
      // The app's zip, from GitHub or the mirror; not the checksum file.
      if (target.closest('[data-download], [data-mirror="Lastout.zip"]')) send("download");
      else if (target.closest("[data-buy]")) send("checkout");
    },
    true
  );

  // `play` doesn't bubble, so it is caught on the way down too.
  var played = false;
  document.addEventListener(
    "play",
    function () {
      if (played) return;
      played = true;
      send("film");
    },
    true
  );
})();

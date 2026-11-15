// Visit counts for lastout.dev: Cloudflare Web Analytics. Cloudflare's script
// sets no cookie and keeps nothing in the browser; it reports the page, the
// referring site and how fast the page loaded. What the site says about it is
// in docs/privacy.md, "The website"; change both together.
//
// Loaded by the public pages only. thanks.html and activate.html never load
// it: their address carries a transaction ID or a license key
// (site/test/analytics.test.mjs).
(function () {
  // Cloudflare dashboard → Analytics & Logs → Web Analytics → lastout.dev →
  // Manage site → the token in the JS snippet. It is public (every visitor's
  // browser sends it). Left empty, nothing is loaded.
  var TOKEN = "5fffd32f11c148169d2194ae5ba9a741";
  if (!TOKEN) return;

  // A visitor who asked not to be tracked isn't counted.
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return;

  // A payment link from Paddle (lastout.dev/?_ptxn=txn_…) names an order.
  try {
    if (new URLSearchParams(location.search).has("_ptxn")) return;
  } catch (e) {
    return; // an address that can't be read: don't count it
  }

  var beacon = document.createElement("script");
  beacon.defer = true;
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  beacon.setAttribute("data-cf-beacon", JSON.stringify({ token: TOKEN }));
  document.head.appendChild(beacon);
})();

// Lastout store configuration, shared by index.html (the Buy button) and
// thanks.html (the key lookup). Plain values, no build step: edit this file
// and publish.
window.LASTOUT_STORE = {
  // Which Paddle environment the Buy button uses. "sandbox" rehearses with
  // test cards and sandbox keys; "production" charges real cards.
  // Live since 0.3.4. It moves together with service/wrangler.toml's
  // PADDLE_ENVIRONMENT (and the Worker's live secrets): a sandbox checkout
  // against the live Worker issues no key, and sandbox keys don't work live.
  environment: "production",

  paddle: {
    // Paddle sandbox (sandbox-vendors.paddle.com): Developer tools →
    // Authentication → client-side token (test_…); Catalog → Products →
    // "Lastout for Mac" → the one-time price's id (pri_…). Left empty, the
    // Buy button opens no checkout and the console says what is missing.
    sandbox: {
      clientToken: "test_c65cc32df1acd5e914038cafc56",
      priceId: "pri_01m5e3vcab25cmb8gh09jkkh30",
    },
    // The same two values from the live dashboard (vendors.paddle.com):
    // the client-side token starts with live_…, the price id with pri_….
    // An empty priceId pauses the checkout: the Buy button opens none and
    // says it isn't open yet.
    production: {
      clientToken: "live_164136e9fadbb86a29b392f2598",
      priceId: "pri_01m5e2hbfy8xp006zree8mce6c",
    },
  },

  // The license service (service/, a Cloudflare Worker). thanks.html asks
  // it for the key after checkout: GET {licenseServer}/thanks-lookup?txn=….
  // The Worker's THANKS_ORIGIN has to be this site's origin, or CORS refuses.
  licenseServer: "https://license.lastout.dev",

  // Where the Download button points. The page links the latest release
  // and, once the GitHub API answers, the Lastout-<version>.zip inside it.
  releases: "https://github.com/Xiang-Suc/lastout-releases",

  // The download mirror (a Cloudflare R2 bucket, filled by scripts/mirror.sh
  // after each release is published): {mirror}/Lastout.zip is the latest
  // app zip, {mirror}/SHA256SUMS its checksum. The page links it under
  // Download and puts it on the button when GitHub's API doesn't answer.
  // Empty: no mirror link, and the button stays on the releases page.
  mirror: "https://dl.lastout.dev",

  // Shown wherever the site says "write to us".
  support: "support@lastout.dev",
};

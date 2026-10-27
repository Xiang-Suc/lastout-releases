// Lastout store configuration, shared by index.html (the Buy button) and
// thanks.html (the key lookup). Plain values, no build step: edit this file
// and publish. Everything marked 上线前 has to be filled in before launch.
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
    // "Lastout for Mac" → the one-time price's id (pri_…).
    // 上线前填（沙盒彩排用；留空则 Buy 按钮不弹结账，只在控制台说缺什么）。
    sandbox: {
      clientToken: "test_c65cc32df1acd5e914038cafc56",
      priceId: "pri_01m5e3vcab25cmb8gh09jkkh30",
    },
    // The same two values from the live dashboard (vendors.paddle.com):
    // the client-side token starts with live_…, the price id with pri_….
    // Live token ctkn_01m5v2keqfxxfjzn0a7p12npkp "lastout site"; the price
    // is $29 one-time on "Lastout for Mac" (pro_01m56esd3gyfhngcah22apxka4).
    production: {
      clientToken: "live_164136e9fadbb86a29b392f2598",
      priceId: "pri_01m5e2hbfy8xp006zree8mce6c",
    },
  },

  // The license service (service/, a Cloudflare Worker). thanks.html asks
  // it for the key after checkout: GET {licenseServer}/thanks-lookup?txn=….
  // 上线前：确认已部署，且 Worker 的 THANKS_ORIGIN 是本站的 origin（否则 CORS 拒绝）。
  licenseServer: "https://license.lastout.dev",

  // Where the Download button points. The page links the latest release
  // and, once the GitHub API answers, the Lastout-<version>.zip inside it.
  releases: "https://github.com/Xiang-Suc/lastout-releases",

  // Shown wherever the site says "write to us".
  // 上线前：确认 lastout.dev 已购买，这个地址已转发到收件箱。
  support: "support@lastout.dev",
};

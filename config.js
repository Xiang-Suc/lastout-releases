// Lastout store configuration, shared by index.html (the Buy button) and
// thanks.html (the key lookup). Plain values, no build step: edit this file
// and publish. Everything marked 上线前 has to be filled in before launch.
window.LASTOUT_STORE = {
  // Which Paddle environment the Buy button uses. "sandbox" rehearses with
  // test cards and sandbox keys; "production" charges real cards.
  // 上线前：改成 "production"（同时 service/ 的 Worker 也切到 live 的密钥）。
  environment: "sandbox",

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
    // 上线前填。
    production: {
      clientToken: "",
      priceId: "",
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

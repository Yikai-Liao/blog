import { spawn } from "node:child_process";

const env = {
  ...process.env,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL || "http://127.0.0.1:1111",
  PUBLIC_BASE_PATH: process.env.PUBLIC_BASE_PATH || "/",
};

const preprocess = spawn("node", ["scripts/preprocess-zola-content.mjs"], { stdio: "inherit", env });
preprocess.on("exit", (code) => {
  if (code !== 0) process.exit(code || 1);
  const zola = spawn("zola", ["serve", "--interface", "127.0.0.1", "--port", process.env.PORT || "1111", "--base-url", env.PUBLIC_SITE_URL], {
    stdio: "inherit",
    env,
  });
  zola.on("exit", (zolaCode) => process.exit(zolaCode || 0));
});

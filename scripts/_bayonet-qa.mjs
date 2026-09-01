import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(120000);
page.on("pageerror", (e) => console.log("PAGEERROR", e.message.slice(0, 400)));

await page.goto(`http://127.0.0.1:8080/?w=${Date.now()}`, { waitUntil: "domcontentloaded", timeout: 60000 });
let ready = false;
for (let i = 0; i < 90; i++) {
  const txt = await page.locator("body").innerText();
  const canvases = await page.locator("canvas").count();
  const loading = /组装|解析|载入|准备下载/.test(txt);
  if (canvases > 0 && txt.includes("柔肠模拟器") && !loading) {
    ready = true;
    await page.waitForTimeout(1800);
    break;
  }
  await page.waitForTimeout(1000);
}
console.log("READY", ready);

const deep = await page.evaluate(() => {
  const v = window.__vela;
  v.setBayonetKind?.("short");
  const r = v.driveBayonet?.(0.14);
  v.frameBelly?.();
  return r;
});
console.log("DEEP", JSON.stringify(deep));
await page.waitForTimeout(600);
const dump = await page.evaluate(() => window.__vela?.bayonet);
console.log("DUMP", JSON.stringify(dump));
await page.screenshot({ path: "/workspace/screenshots/bayonet-wounds.png" });

const xray = await page.evaluate(() => {
  const v = window.__vela;
  // raise xray via store if possible
  return v.bayonet;
});
console.log("XRAY", JSON.stringify(xray));

await page.getByText("腹部半透明", { exact: false }).first().isVisible().catch(() => false);
await page.evaluate(() => {
  const st = window.__vela;
  st.driveBayonet?.(0.14);
});
await page.waitForTimeout(300);
await page.screenshot({ path: "/workspace/screenshots/bayonet-stab.png" });

await browser.close();

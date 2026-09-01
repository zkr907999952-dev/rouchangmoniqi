import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.setDefaultTimeout(120000);
page.on("pageerror", (e) => console.log("PAGEERROR", e.message.slice(0, 300)));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CERR", m.text().slice(0, 220));
});

await page.goto(`http://127.0.0.1:8080/?b=${Date.now()}`, { waitUntil: "domcontentloaded", timeout: 60000 });
let ready = false;
for (let i = 0; i < 90; i++) {
  const txt = await page.locator("body").innerText();
  const canvases = await page.locator("canvas").count();
  const loading = /组装|解析|载入|准备下载/.test(txt);
  if (i % 5 === 0) console.log("t", i, "canvas", canvases, "loading", loading);
  if (txt.includes("加载失败") || txt.includes("Something went wrong")) {
    console.log("FAIL", txt.slice(0, 200));
    break;
  }
  if (canvases > 0 && txt.includes("柔肠模拟器") && !loading) {
    ready = true;
    await page.waitForTimeout(2000);
    break;
  }
  await page.waitForTimeout(1000);
}
console.log("READY", ready);

const hover = await page.evaluate(() => {
  const v = window.__vela;
  if (!v?.driveBayonet) return { err: "no drive" };
  const r = v.driveBayonet(0);
  v.frameBelly?.();
  return r;
});
console.log("HOVER", JSON.stringify(hover));
await page.waitForTimeout(600);

await page.evaluate(() => {
  const v = window.__vela;
  if (!v?.navel) return;
  // close-up on navel
});
await page.screenshot({ path: "/workspace/screenshots/bayonet-hover.png" });

const mid = await page.evaluate(() => window.__vela?.driveBayonet(0.08));
console.log("MID", JSON.stringify(mid));
await page.waitForTimeout(800);
const dump1 = await page.evaluate(() => window.__vela?.bayonet);
console.log("DUMP_MID", JSON.stringify(dump1));
await page.screenshot({ path: "/workspace/screenshots/bayonet-mid.png" });

const deep = await page.evaluate(() => window.__vela?.driveBayonet(0.16));
console.log("DEEP", JSON.stringify(deep));
await page.waitForTimeout(800);
const dump2 = await page.evaluate(() => {
  const v = window.__vela;
  return { bayonet: v?.bayonet, navel: v?.navel, abdomen: v?.abdomen };
});
console.log("DUMP_DEEP", JSON.stringify(dump2));
await page.screenshot({ path: "/workspace/screenshots/bayonet-deep.png" });

const cone = await page.evaluate(() => {
  const v = window.__vela;
  if (!v?.tiltBayonet || !v.bayonet) return { err: "no tilt" };
  const e = v.bayonet.entry;
  // 45° in +X from a handle 0.25m out
  const hdl = [e[0] + 0.18, e[1], e[2] + 0.18];
  return v.tiltBayonet(hdl[0], hdl[1], hdl[2]);
});
console.log("CONE", JSON.stringify(cone));
await page.screenshot({ path: "/workspace/screenshots/bayonet-cone.png" });

await page.evaluate(() => window.__vela?.driveBayonet?.(-0.07));
await page.getByRole("button", { name: "复位" }).click();
await page.waitForTimeout(400);
await page.getByRole("button", { name: "刺刀" }).first().click();
await page.waitForTimeout(200);
const canvas = page.locator("canvas").first();
const box = await canvas.boundingBox();
if (box) {
  // click near navel: camera looks at belly, a bit below center
  await page.mouse.click(box.x + box.width * 0.48, box.y + box.height * 0.52);
  await page.waitForTimeout(500);
}
const clickDump = await page.evaluate(() => {
  const v = window.__vela;
  return { bayonet: v?.bayonet, navel: v?.navel };
});
console.log("CLICK", JSON.stringify(clickDump));
await page.screenshot({ path: "/workspace/screenshots/bayonet-click.png" });

await browser.close();

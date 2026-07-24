const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const storage = new Map();
const context = vm.createContext({
  URL,
  Intl,
  Date,
  console,
  crypto: { randomUUID: () => "test-id" },
  localStorage: {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  },
  window: {
    location: {
      hostname: "example.com",
      pathname: "/",
      search: "",
      hash: "",
      replace: () => {},
    },
  },
  document: {
    body: { classList: { contains: () => false } },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => {
      let text = "";
      return {
        set textContent(value) {
          text = String(value);
        },
        get innerHTML() {
          return text
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
        },
      };
    },
  },
});

const source = fs.readFileSync("site.js", "utf8").replace(/\ninitSite\(\);\s*$/, "\n");
vm.runInContext(source, context);

const adminSource = fs.readFileSync("admin.js", "utf8");
const normalizeExternalUrlSource = adminSource.match(/function normalizeExternalUrl[\s\S]*?(?=\nfunction externalLinkItem)/)[0];
vm.runInContext(normalizeExternalUrlSource, context);

const mediaItems = [
  { name: "Main <Art>", type: "image/png", url: "https://cdn.example/main.png", role: "release-main" },
  { name: "Google Play", type: "image/png", url: "https://cdn.example/google.png", role: "release-sub", linkUrl: "https://play.google.com/store/apps/details?id=test" },
  { name: "Unsafe", type: "image/png", url: "https://cdn.example/unsafe.png", role: "release-sub", linkUrl: "javascript:alert(1)" },
];

const releaseMediaHtml = vm.runInContext("renderReleaseMediaItems", context)(mediaItems);
assert.match(releaseMediaHtml, /class="release-main-media"/);
assert.match(releaseMediaHtml, /Main &lt;Art&gt;/);
assert.match(releaseMediaHtml, /href="https:\/\/play\.google\.com/);
assert.match(releaseMediaHtml, /rel="noopener noreferrer"/);
assert.doesNotMatch(releaseMediaHtml, /href="javascript:/);
assert.match(releaseMediaHtml, /class="release-download-disabled"/);

const cardHtml = vm.runInContext("renderReleaseCard", context)({
  id: "release-1",
  title: "New Release",
  body: "Download now",
  mediaItems,
});
assert.match(cardHtml, /class="release-card"/);
assert.match(cardHtml, /detail\.html\?type=custom&id=release-1/);
assert.match(cardHtml, /Google Play/);

assert.equal(vm.runInContext("findReleaseMain", context)(mediaItems).role, "release-main");
assert.equal(vm.runInContext("findReleaseLinks", context)(mediaItems).length, 2);
assert.equal(vm.runInContext("normalizeExternalUrl", context)("play.google.com/store/apps"), "https://play.google.com/store/apps");
assert.throws(() => vm.runInContext("normalizeExternalUrl", context)("javascript:alert(1)"));

console.log("release rendering tests passed");

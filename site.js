const POSTS_KEY = "bacon-cake-posts";
const SETTINGS_KEY = "bacon-cake-settings";
const STUDIO_NOTES_KEY = "bacon-cake-studio-notes";
const ADMIN_TOKEN_KEY = "bacon-cake-supabase-token";
const ADMIN_REFRESH_KEY = "bacon-cake-supabase-refresh";
const PREVIEW_BODY_LIMIT = 170;
const CANONICAL_ORIGIN = "https://leeminseok8063.github.io";
const CANONICAL_BASE_PATH = "/BaconCakeSite";
const STALE_CUSTOM_DOMAINS = new Set(["baconcakeofficialgames.com", "www.baconcakeofficialgames.com"]);
const SITE_SETTINGS_ID = "main";

function canonicalUrl(path = "index.html") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${CANONICAL_ORIGIN}${CANONICAL_BASE_PATH}${cleanPath}`;
}

function redirectStaleCustomDomain() {
  if (!STALE_CUSTOM_DOMAINS.has(window.location.hostname)) return;

  const path = window.location.pathname === "/" ? "/index.html" : window.location.pathname;
  window.location.replace(`${CANONICAL_ORIGIN}${CANONICAL_BASE_PATH}${path}${window.location.search}${window.location.hash}`);
}

redirectStaleCustomDomain();

const UI_TEXT = {
  adminAccessTitle: "관리자 로그인",
  adminAccessBody: "관리자 계정으로 로그인하면 편집 화면으로 이동합니다.",
  adminEmailPlaceholder: "이메일",
  adminPasswordPlaceholder: "비밀번호",
  adminMove: "관리자 이동",
  adminLoginProgress: "로그인 중입니다...",
  adminLoginFailure: "로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.",
  loadingTitle: "불러오는 중입니다.",
  loadingBody: "잠시만 기다려주세요.",
  noticeLoadFailure: "공지사항을 불러오지 못했습니다.",
  studioLoadFailure: "스튜디오 노트를 불러오지 못했습니다.",
  emptyNoticeTitle: "등록된 공지가 없습니다.",
  emptyNoticeBody: "새 소식이 등록되면 이곳에 표시됩니다.",
  emptyStudioTitle: "등록된 스튜디오 노트가 없습니다.",
  emptyStudioBody: "새 노트가 등록되면 이곳에 표시됩니다.",
  edit: "수정",
  delete: "삭제",
  notFoundLabel: "내용 없음",
  notFoundTitle: "내용을 찾을 수 없습니다.",
  notFoundBody: "삭제되었거나 잘못된 주소일 수 있습니다.",
  homeBack: "홈으로 돌아가기",
  listBack: "목록으로 돌아가기",
};

const defaultSettings = {
  brandName: "BaconCakeOfficial.com",
  siteTitle: "BaconCakeOfficial.com",
  heroEyebrow: "BaconCake 스튜디오 · 공식",
  heroTitle: "BaconCake",
  heroDescription: "BaconCake는 작고 선명한 아이디어를 게임, 웹, 커뮤니티 경험으로 만드는 개발사입니다.",
};

const defaultStudioNotes = [
  {
    id: crypto.randomUUID(),
    number: "01",
    title: "게임 개발",
    body: "가볍게 시작해 오래 기억되는 플레이 경험을 설계합니다.",
  },
  {
    id: crypto.randomUUID(),
    number: "02",
    title: "웹 경험",
    body: "브랜드, 커뮤니티, 업데이트 소식을 담는 웹페이지를 만듭니다.",
  },
  {
    id: crypto.randomUUID(),
    number: "03",
    title: "창작 시스템",
    body: "작은 팀이 빠르게 운영할 수 있는 도구와 콘텐츠 흐름을 다듬습니다.",
  },
];

const defaultPosts = [
  {
    id: crypto.randomUUID(),
    title: "BaconCake 공식 페이지 오픈",
    body: "BaconCakeOfficial.com에서 개발 소식과 운영 공지를 확인할 수 있습니다.",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: "공지사항 운영 안내",
    body: "중요 업데이트, 점검, 프로젝트 소식은 이 공지사항 영역에 순서대로 등록됩니다.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

function readJson(key, fallback) {
  const saved = localStorage.getItem(key);
  if (!saved) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

function loadPosts() {
  return readJson(POSTS_KEY, defaultPosts);
}

function truncateText(value, limit = PREVIEW_BODY_LIMIT) {
  const text = value || "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function storeAdminSession(session) {
  localStorage.setItem(ADMIN_TOKEN_KEY, session.access_token);
  localStorage.setItem(ADMIN_REFRESH_KEY, session.refresh_token);
}

function clearAdminSession() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_REFRESH_KEY);
}

function supabaseHeaders({ authToken, prefer } = {}) {
  const bearerToken = String(authToken || BACONCAKE_SUPABASE.anonKey || "").trim();
  const headers = {
    apikey: BACONCAKE_SUPABASE.anonKey,
    Authorization: `Bearer ${bearerToken}`,
    "Content-Type": "application/json",
  };

  if (prefer) headers.Prefer = prefer;
  return headers;
}

function supabaseUrl(path) {
  const baseUrl = String(BACONCAKE_SUPABASE.restUrl || "").replace(/\/+$/, "");
  const cleanPath = String(path || "").startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

async function supabaseRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(supabaseUrl(path), {
      ...options,
      headers: {
        ...supabaseHeaders({ authToken: options.authToken, prefer: options.prefer }),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error(`Supabase 요청을 만들지 못했습니다. 설정 주소와 로그인 세션을 확인하세요. (${error.message})`);
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function signInAdmin(email, password) {
  const response = await fetch(`${BACONCAKE_SUPABASE.authUrl}/token?grant_type=password`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || data.msg || "Login failed");
  storeAdminSession(data);
  return data;
}

async function fetchAdminUser() {
  const token = getStoredAdminToken();
  if (!token) return null;

  const response = await fetch(`${BACONCAKE_SUPABASE.authUrl}/user`, {
    headers: supabaseHeaders({ authToken: token }),
  });

  if (!response.ok) {
    clearAdminSession();
    return null;
  }

  return response.json();
}

async function fetchPosts() {
  if (!window.BACONCAKE_SUPABASE) return loadPosts();

  let data;
  try {
    data = await supabaseRequest("/notices?select=id,title,body,created_at,media_items&order=created_at.desc");
  } catch (error) {
    data = await supabaseRequest("/notices?select=id,title,body,created_at&order=created_at.desc");
  }

  return data.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    createdAt: post.created_at,
    mediaItems: post.media_items || [],
  }));
}

async function fetchCustomSections() {
  if (!window.BACONCAKE_SUPABASE) return [];

  try {
    return await supabaseRequest("/content_sections?select=id,eyebrow,title,slug,layout,created_at&order=created_at.asc");
  } catch {
    try {
      return await supabaseRequest("/content_sections?select=id,eyebrow,title,layout,created_at&order=created_at.asc");
    } catch {
      return [];
    }
  }
}

async function fetchCustomEntries(sectionId) {
  if (!window.BACONCAKE_SUPABASE) return [];

  const sectionFilter = sectionId ? `&section_id=eq.${encodeURIComponent(sectionId)}` : "";
  try {
    const data = await supabaseRequest(`/content_entries?select=id,section_id,number,title,slug,body,media_items,created_at${sectionFilter}&order=created_at.desc`);
    return data.map((entry) => ({
      ...entry,
      mediaItems: entry.media_items || [],
      createdAt: entry.created_at,
    }));
  } catch {
    try {
      const data = await supabaseRequest(`/content_entries?select=id,section_id,number,title,body,created_at${sectionFilter}&order=created_at.desc`);
      return data.map((entry) => ({
        ...entry,
        mediaItems: [],
        createdAt: entry.created_at,
      }));
    } catch {
      return [];
    }
  }
}

async function fetchCustomEntry(id) {
  const entries = await fetchCustomEntries();
  return entries.find((entry) => entry.id === id || entry.slug === id);
}

function savePosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

function loadSettings() {
  return { ...defaultSettings, ...readJson(SETTINGS_KEY, defaultSettings) };
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

async function fetchSiteSettings() {
  if (!window.BACONCAKE_SUPABASE) return loadSettings();

  try {
    const data = await supabaseRequest(`/site_settings?id=eq.${encodeURIComponent(SITE_SETTINGS_ID)}&select=settings`);
    const settings = data[0]?.settings ? { ...defaultSettings, ...data[0].settings } : loadSettings();
    saveSettings(settings);
    return settings;
  } catch {
    return loadSettings();
  }
}

async function persistSiteSettings(settings) {
  saveSettings(settings);
  if (!window.BACONCAKE_SUPABASE) return;

  await supabaseRequest("/site_settings", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "resolution=merge-duplicates,return=minimal",
    body: JSON.stringify({ id: SITE_SETTINGS_ID, settings }),
  });
}

function loadStudioNotes() {
  const notes = readJson(STUDIO_NOTES_KEY, defaultStudioNotes);
  let changed = false;
  const normalizedNotes = notes.map((note) => {
    if (note.id) return note;
    changed = true;
    return { ...note, id: crypto.randomUUID() };
  });

  if (changed) saveStudioNotes(normalizedNotes);
  return normalizedNotes;
}

async function fetchStudioNotes() {
  if (!window.BACONCAKE_SUPABASE) return loadStudioNotes();

  let data;
  try {
    data = await supabaseRequest("/studio_notes?select=id,number,title,body,created_at,media_items&order=created_at.asc");
  } catch (error) {
    data = await supabaseRequest("/studio_notes?select=id,number,title,body,created_at&order=created_at.asc");
  }

  return data.map((note) => ({
    id: note.id,
    number: note.number,
    title: note.title,
    body: note.body,
    createdAt: note.created_at,
    mediaItems: note.media_items || [],
  }));
}

function saveStudioNotes(notes) {
  localStorage.setItem(STUDIO_NOTES_KEY, JSON.stringify(notes));
}

function t(key) {
  return UI_TEXT[key] || key;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function itemDetailUrl(type, itemOrId) {
  const id = typeof itemOrId === "object" ? itemOrId.slug || itemOrId.id : itemOrId;
  const key = typeof itemOrId === "object" && itemOrId.slug ? "slug" : "id";
  return `detail.html?type=${encodeURIComponent(type)}&${key}=${encodeURIComponent(id)}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function renderMediaItems(mediaItems = []) {
  if (!mediaItems.length) return "";

  return `<div class="media-list">
    ${mediaItems
      .map((item) => {
        const url = escapeHtml(item.url);
        const name = escapeHtml(item.name || "첨부 파일");
        const type = item.type || "";

        if (type.startsWith("image/")) {
          return `<figure class="media-item"><img src="${url}" alt="${name}" loading="lazy" /><figcaption>${name}</figcaption></figure>`;
        }

        if (type.startsWith("video/")) {
          return `<figure class="media-item"><video src="${url}" controls preload="metadata"></video><figcaption>${name}</figcaption></figure>`;
        }

        if (type.startsWith("audio/")) {
          return `<figure class="media-item"><audio src="${url}" controls></audio><figcaption>${name}</figcaption></figure>`;
        }

        return `<a class="media-download" href="${url}" target="_blank" rel="noreferrer">${name}</a>`;
      })
      .join("")}
  </div>`;
}

function renderArticleCard(item, { editable = false, actions = "", detailType = "custom" } = {}) {
  const content = `<article class="notice-card">
    <header>
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        ${item.created_at || item.createdAt ? `<time datetime="${item.created_at || item.createdAt}">${formatDate(item.created_at || item.createdAt)}</time>` : ""}
      </div>
      ${actions}
    </header>
    <p>${escapeHtml(truncateText(item.body))}</p>
    ${renderMediaItems((item.media_items || item.mediaItems || []).slice(0, 1))}
  </article>`;

  if (editable) return content;
  return `<a class="card-link" href="${itemDetailUrl(detailType, item)}">${content}</a>`;
}

function renderAlbumCard(item, { editable = false, actions = "", detailType = "custom" } = {}) {
  const content = `<article>
    <header>
      <span>${escapeHtml(item.number || "항목")}</span>
      ${actions}
    </header>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(truncateText(item.body, 120))}</p>
    ${renderMediaItems((item.media_items || item.mediaItems || []).slice(0, 1))}
  </article>`;

  if (editable) return content;
  return `<a class="card-link" href="${itemDetailUrl(detailType, item)}">${content}</a>`;
}

function applySettings(settings = loadSettings()) {
  document.title = document.body.classList.contains("admin-page") ? "BaconCake 관리자 콘솔" : settings.siteTitle;

  Object.entries(settings).forEach(([key, value]) => {
    document.querySelectorAll(`[data-setting="${key}"]`).forEach((element) => {
      element.textContent = value;
    });
  });

  renderPrivacyPolicy(settings);
}

function renderPrivacyPolicy(settings = loadSettings()) {
  const privacyTitle = document.querySelector("#privacyTitle");
  const privacyBody = document.querySelector("#privacyBody");
  if (!privacyTitle || !privacyBody) return;

  privacyTitle.textContent = settings.privacyTitle || defaultSettings.privacyTitle;
  privacyBody.textContent = settings.privacyBody || defaultSettings.privacyBody;
}

function sectionHash(section) {
  return `section-${section.slug || section.id}`;
}

function sectionHref(section) {
  const hash = sectionHash(section);
  const page = window.location.pathname.split("/").pop() || "index.html";
  return page === "index.html" ? `#${hash}` : `index.html#${hash}`;
}

async function renderSectionNav(sections = null) {
  const nav = document.querySelector("#sectionNav");
  if (!nav) return;

  const items = sections || await fetchCustomSections();
  nav.innerHTML = items.length
    ? items.map((section) => `<a href="${sectionHref(section)}">${escapeHtml(section.title)}</a>`).join("")
    : `<span class="empty-nav">섹션 없음</span>`;

  const heroActions = document.querySelector("#heroActions");
  if (!heroActions) return;

  heroActions.innerHTML = items.length
    ? `<a class="primary-action" href="#${sectionHash(items[0])}">첫 섹션 보기</a>`
    : "";
}

async function renderPosts({ editable = false } = {}) {
  const noticeList = document.querySelector("#noticeList");
  if (!noticeList) return;

  noticeList.innerHTML = `<article class="notice-card"><h3>${t("loadingTitle")}</h3><p>${t("loadingBody")}</p></article>`;

  let posts = [];
  try {
    posts = await fetchPosts();
  } catch (error) {
    noticeList.innerHTML = `<article class="notice-card"><h3>${t("noticeLoadFailure")}</h3><p>${escapeHtml(error.message)}</p></article>`;
    return;
  }

  posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!posts.length) {
    noticeList.innerHTML = `<article class="notice-card"><h3>${t("emptyNoticeTitle")}</h3><p>${t("emptyNoticeBody")}</p></article>`;
    return;
  }

  noticeList.innerHTML = posts
    .map((post) => {
      const actions = editable
        ? `<div class="notice-actions">
            <button type="button" data-action="edit" data-id="${post.id}">${t("edit")}</button>
            <button type="button" data-action="delete" data-id="${post.id}">${t("delete")}</button>
          </div>`
        : "";

      return renderArticleCard(post, { editable, actions, detailType: "notice" });
    })
    .join("");
}

async function renderStudioNotes({ editable = false } = {}) {
  const studioGrid = document.querySelector("#studioGrid");
  if (!studioGrid) return;

  studioGrid.innerHTML = `<article><h3>${t("loadingTitle")}</h3><p>${t("loadingBody")}</p></article>`;

  let notes = [];
  try {
    notes = await fetchStudioNotes();
  } catch (error) {
    studioGrid.innerHTML = `<article><h3>${t("studioLoadFailure")}</h3><p>${escapeHtml(error.message)}</p></article>`;
    return;
  }

  if (!notes.length) {
    studioGrid.innerHTML = `<article><h3>${t("emptyStudioTitle")}</h3><p>${t("emptyStudioBody")}</p></article>`;
    return;
  }

  studioGrid.innerHTML = notes
    .map((note) => {
      const actions = editable
        ? `<div class="notice-actions">
            <button type="button" data-action="edit-studio" data-id="${note.id}">${t("edit")}</button>
            <button type="button" data-action="delete-studio" data-id="${note.id}">${t("delete")}</button>
          </div>`
        : "";

      return renderAlbumCard(note, { editable, actions, detailType: "studio" });
    })
    .join("");
}

async function renderCustomSections({ editable = false } = {}) {
  const customSections = document.querySelector("#customSections");
  if (!customSections) return;

  const sections = await fetchCustomSections();
  await renderSectionNav(sections);

  if (!sections.length) {
    customSections.innerHTML = `<section class="section-grid empty-site">
      <div class="section-heading">
        <p class="eyebrow">빈 사이트</p>
        <h2>등록된 섹션이 없습니다.</h2>
      </div>
      <article class="notice-card">
        <h3>어드민 콘솔에서 섹션을 추가하세요.</h3>
        <p>섹션을 만들면 상단 탭이 자동으로 생기고, 섹션 안의 글은 상세 HTML 페이지처럼 열립니다.</p>
      </article>
    </section>`;
    return;
  }

  const rendered = await Promise.all(
    sections.map(async (section) => {
      const entries = await fetchCustomEntries(section.id);
      const layoutClass = section.layout === "album" ? "studio-section" : "section-grid";
      const listClass = section.layout === "album" ? "studio-grid" : "notice-list";
      const cards = entries.length
        ? entries
            .map((entry) => {
              const actions = editable
                ? `<div class="notice-actions">
                    <a href="${itemDetailUrl("custom", entry)}" target="_blank" rel="noreferrer">상세페이지</a>
                    <button type="button" data-action="edit-entry" data-id="${entry.id}">${t("edit")}</button>
                    <button type="button" data-action="delete-entry" data-id="${entry.id}">${t("delete")}</button>
                  </div>`
                : "";

              return section.layout === "album"
                ? renderAlbumCard(entry, { editable, actions, detailType: "custom" })
                : renderArticleCard(entry, { editable, actions, detailType: "custom" });
            })
            .join("")
        : `<article class="notice-card"><h3>등록된 콘텐츠가 없습니다.</h3><p>관리자 콘솔에서 콘텐츠를 추가하세요.</p></article>`;

      return `<section class="${layoutClass}" id="${sectionHash(section)}">
        <div class="section-heading">
          <p class="eyebrow">${escapeHtml(section.eyebrow || "")}</p>
          <h2>${escapeHtml(section.title)}</h2>
        </div>
        <div class="${listClass}" data-section-id="${section.id}" data-layout="${section.layout}">${cards}</div>
      </section>`;
    }),
  );

  customSections.innerHTML = rendered.join("");
}

function setupAdminLogin() {
  const adminOpen = document.querySelector("#adminOpen");
  const adminDialog = document.querySelector("#adminDialog");
  const adminLoginForm = document.querySelector("#adminLoginForm");
  const adminDialogClose = document.querySelector("#adminDialogClose");
  const adminEmail = document.querySelector("#adminEmail");
  const adminPassword = document.querySelector("#adminPassword");
  const adminLoginMessage = document.querySelector("#adminLoginMessage");

  if (!adminOpen || !adminDialog || !adminLoginForm || !adminDialogClose || !adminEmail || !adminPassword || !adminLoginMessage) return;

  adminOpen.addEventListener("click", () => {
    adminEmail.value = "";
    adminPassword.value = "";
    adminLoginMessage.textContent = "";
    adminDialog.querySelector("h2").textContent = t("adminAccessTitle");
    adminDialog.querySelector("p").textContent = t("adminAccessBody");
    adminEmail.placeholder = t("adminEmailPlaceholder");
    adminPassword.placeholder = t("adminPasswordPlaceholder");
    adminLoginForm.querySelector(".primary-action").textContent = t("adminMove");
    adminDialog.showModal();
    adminEmail.focus();
  });

  adminDialogClose.addEventListener("click", () => {
    adminDialog.close();
  });

  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    adminLoginMessage.textContent = t("adminLoginProgress");
    try {
      await signInAdmin(adminEmail.value.trim(), adminPassword.value);
    } catch (error) {
      adminLoginMessage.textContent = `${t("adminLoginFailure")} (${error.message})`;
      return;
    }

    window.location.href = canonicalUrl("admin.html");
  });
}

async function initSite() {
  applySettings();
  renderCustomSections();
  setupAdminLogin();

  const settings = await fetchSiteSettings();
  applySettings(settings);
  await renderSectionNav();
}

initSite();

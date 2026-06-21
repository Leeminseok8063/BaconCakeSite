const POSTS_KEY = "bacon-cake-posts";
const SETTINGS_KEY = "bacon-cake-settings";
const STUDIO_NOTES_KEY = "bacon-cake-studio-notes";
const ADMIN_TOKEN_KEY = "bacon-cake-supabase-token";
const ADMIN_REFRESH_KEY = "bacon-cake-supabase-refresh";
const LANGUAGE_KEY = "bacon-cake-language";

const translations = {
  ko: {
    adminAccessTitle: "Admin Access",
    adminAccessBody: "관리자 계정으로 로그인하면 편집 화면으로 이동합니다.",
    adminEmailPlaceholder: "이메일",
    adminPasswordPlaceholder: "비밀번호",
    adminMove: "관리자 이동",
    adminLoginProgress: "로그인 중입니다...",
    adminLoginFailure: "로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.",
    studioIntroCta: "스튜디오 소개",
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
    noticeLabel: "공지사항",
    studioLabel: "스튜디오 노트",
    notFoundLabel: "Not Found",
    notFoundTitle: "내용을 찾을 수 없습니다.",
    notFoundBody: "삭제되었거나 잘못된 주소일 수 있습니다.",
    homeBack: "홈으로 돌아가기",
    listBack: "목록으로 돌아가기",
  },
  en: {
    adminAccessTitle: "Admin Access",
    adminAccessBody: "Sign in with an admin account to open the editor.",
    adminEmailPlaceholder: "Email",
    adminPasswordPlaceholder: "Password",
    adminMove: "Open admin",
    adminLoginProgress: "Signing in...",
    adminLoginFailure: "Sign-in failed. Check your email and password.",
    studioIntroCta: "Studio Intro",
    loadingTitle: "Loading.",
    loadingBody: "Please wait a moment.",
    noticeLoadFailure: "Could not load notices.",
    studioLoadFailure: "Could not load studio notes.",
    emptyNoticeTitle: "No notices yet.",
    emptyNoticeBody: "New updates will appear here.",
    emptyStudioTitle: "No studio notes yet.",
    emptyStudioBody: "New notes will appear here.",
    edit: "Edit",
    delete: "Delete",
    noticeLabel: "Notice",
    studioLabel: "Studio Note",
    notFoundLabel: "Not Found",
    notFoundTitle: "Content not found.",
    notFoundBody: "It may have been deleted or the link may be incorrect.",
    homeBack: "Back home",
    listBack: "Back to list",
  },
  ja: {
    adminAccessTitle: "Admin Access",
    adminAccessBody: "管理者アカウントでログインすると編集画面に移動します。",
    adminEmailPlaceholder: "メール",
    adminPasswordPlaceholder: "パスワード",
    adminMove: "管理画面へ",
    adminLoginProgress: "ログイン中です...",
    adminLoginFailure: "ログインに失敗しました。メールとパスワードを確認してください。",
    studioIntroCta: "スタジオ紹介",
    loadingTitle: "読み込み中です。",
    loadingBody: "少々お待ちください。",
    noticeLoadFailure: "お知らせを読み込めませんでした。",
    studioLoadFailure: "スタジオノートを読み込めませんでした。",
    emptyNoticeTitle: "登録されたお知らせはありません。",
    emptyNoticeBody: "新しいお知らせが登録されるとここに表示されます。",
    emptyStudioTitle: "登録されたスタジオノートはありません。",
    emptyStudioBody: "新しいノートが登録されるとここに表示されます。",
    edit: "編集",
    delete: "削除",
    noticeLabel: "お知らせ",
    studioLabel: "スタジオノート",
    notFoundLabel: "Not Found",
    notFoundTitle: "内容が見つかりません。",
    notFoundBody: "削除されたか、リンクが正しくない可能性があります。",
    homeBack: "ホームへ戻る",
    listBack: "一覧へ戻る",
  },
};

const defaultSettings = {
  brandName: "BaconCakeOfficial.com",
  siteTitle: "BaconCakeOfficial.com",
  heroEyebrow: "BaconCake Studio · Official",
  heroTitle: "BaconCake",
  heroDescription: "BaconCake는 작고 선명한 아이디어를 게임, 웹, 커뮤니티 경험으로 만드는 개발사입니다.",
  primaryCta: "공지사항 보기",
  noticeEyebrow: "Official Board",
  noticeTitle: "공지사항",
  noticeNavLabel: "공지사항",
  studioEyebrow: "Studio Notes",
  studioTitle: "무엇을 만드는가",
};

const translatedDefaultSettings = {
  en: {
    heroDescription: "BaconCake turns small, clear ideas into games, web experiences, and community tools.",
    primaryCta: "View Notices",
    noticeTitle: "Notices",
    noticeNavLabel: "Notices",
    studioTitle: "What We Make",
  },
  ja: {
    heroDescription: "BaconCakeは小さく明確なアイデアをゲーム、Web、コミュニティ体験にします。",
    primaryCta: "お知らせを見る",
    noticeTitle: "お知らせ",
    noticeNavLabel: "お知らせ",
    studioTitle: "つくるもの",
  },
};

const defaultStudioNotes = [
  {
    id: crypto.randomUUID(),
    number: "01",
    title: "Game Development",
    body: "가볍게 시작해 오래 기억되는 플레이 경험을 설계합니다.",
  },
  {
    id: crypto.randomUUID(),
    number: "02",
    title: "Web Experience",
    body: "브랜드, 커뮤니티, 업데이트 소식을 담는 웹페이지를 만듭니다.",
  },
  {
    id: crypto.randomUUID(),
    number: "03",
    title: "Creative Systems",
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
  const headers = {
    apikey: BACONCAKE_SUPABASE.anonKey,
    Authorization: `Bearer ${authToken || BACONCAKE_SUPABASE.anonKey}`,
    "Content-Type": "application/json",
  };

  if (prefer) headers.Prefer = prefer;
  return headers;
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${BACONCAKE_SUPABASE.restUrl}${path}`, {
    ...options,
    headers: {
      ...supabaseHeaders({ authToken: options.authToken, prefer: options.prefer }),
      ...(options.headers || {}),
    },
  });

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

  const data = await supabaseRequest("/notices?select=id,title,body,created_at&order=created_at.desc");
  return data.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    createdAt: post.created_at,
  }));
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

  const data = await supabaseRequest("/studio_notes?select=id,number,title,body,created_at&order=created_at.asc");
  return data.map((note) => ({
    id: note.id,
    number: note.number,
    title: note.title,
    body: note.body,
    createdAt: note.created_at,
  }));
}

function saveStudioNotes(notes) {
  localStorage.setItem(STUDIO_NOTES_KEY, JSON.stringify(notes));
}

function normalizeLanguage(language) {
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("en")) return "en";
  return "ko";
}

function getCurrentLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  if (savedLanguage && translations[savedLanguage]) return savedLanguage;
  return normalizeLanguage(navigator.language || "ko");
}

function t(key) {
  return translations[getCurrentLanguage()][key] || translations.ko[key] || key;
}

function formatDate(value) {
  const localeMap = { ko: "ko-KR", en: "en-US", ja: "ja-JP" };
  return new Intl.DateTimeFormat(localeMap[getCurrentLanguage()], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function itemDetailUrl(type, id) {
  return `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function applySettings() {
  const settings = loadSettings();
  const language = getCurrentLanguage();
  const languageDefaults = translatedDefaultSettings[language] || {};
  document.title = document.body.classList.contains("admin-page") ? "BaconCake Root Console" : settings.siteTitle;

  Object.entries(settings).forEach(([key, value]) => {
    const translatedValue = value === defaultSettings[key] && languageDefaults[key] ? languageDefaults[key] : value;
    document.querySelectorAll(`[data-setting="${key}"]`).forEach((element) => {
      element.textContent = translatedValue;
    });
  });
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

      const content = `<article class="notice-card">
        <header>
          <div>
            <h3>${escapeHtml(post.title)}</h3>
            <time datetime="${post.createdAt}">${formatDate(post.createdAt)}</time>
          </div>
          ${actions}
        </header>
        <p>${escapeHtml(post.body)}</p>
      </article>`;

      if (editable) return content;
      return `<a class="card-link" href="${itemDetailUrl("notice", post.id)}">${content}</a>`;
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

      const content = `<article>
        <header>
          <span>${escapeHtml(note.number)}</span>
          ${actions}
        </header>
        <h3>${escapeHtml(note.title)}</h3>
        <p>${escapeHtml(note.body)}</p>
      </article>`;

      if (editable) return content;
      return `<a class="card-link" href="${itemDetailUrl("studio", note.id)}">${content}</a>`;
    })
    .join("");
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

    window.location.href = "admin.html";
  });
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
}

async function refreshTranslatedContent() {
  applySettings();
  applyStaticTranslations();
  await renderPosts({ editable: document.body.classList.contains("admin-page") });
  await renderStudioNotes({ editable: document.body.classList.contains("admin-page") });

  if (typeof renderDetail === "function") {
    await renderDetail();
  }
}

function setupLanguageSwitcher() {
  const switcher = document.createElement("div");
  switcher.className = "language-switcher";
  switcher.setAttribute("aria-label", "Language");
  switcher.innerHTML = `
    <button type="button" data-lang="ko">KO</button>
    <button type="button" data-lang="en">EN</button>
    <button type="button" data-lang="ja">JA</button>
  `;
  document.body.appendChild(switcher);

  function updateActiveLanguage() {
    switcher.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === getCurrentLanguage());
    });
  }

  switcher.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-lang]");
    if (!button) return;

    localStorage.setItem(LANGUAGE_KEY, button.dataset.lang);
    updateActiveLanguage();
    await refreshTranslatedContent();
  });

  updateActiveLanguage();
}

applySettings();
applyStaticTranslations();
renderPosts();
renderStudioNotes();
setupAdminLogin();
setupLanguageSwitcher();

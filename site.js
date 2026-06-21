const POSTS_KEY = "bacon-cake-posts";
const SETTINGS_KEY = "bacon-cake-settings";
const STUDIO_NOTES_KEY = "bacon-cake-studio-notes";
const ADMIN_TOKEN_KEY = "bacon-cake-supabase-token";
const ADMIN_REFRESH_KEY = "bacon-cake-supabase-refresh";
const LANGUAGE_KEY = "bacon-cake-language";
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
  privacyNavLabel: "개인정보 처리방침",
  privacyTitle: "개인정보 처리방침",
  privacyBody: `BaconCake은 이용자의 개인정보를 중요하게 생각합니다.
본 개인정보 처리방침은 One More Bite 앱에 적용됩니다.

시행일자: 2026년 6월 21일

1. 개인정보의 처리 목적

BaconCake은 다음 목적을 위해 개인정보를 처리할 수 있습니다.

서비스 제공 및 운영
랭킹과 점수 표시
광고 제공
광고제거 인앱결제 확인
앱 오류 확인 및 서비스 개선
부정 이용 방지
스토어 정책 및 관련 법령 준수

2. 수집 또는 처리될 수 있는 정보

앱 이용 과정에서 다음 정보가 처리될 수 있습니다.

기기 정보
운영체제 정보
앱 버전
국가 또는 지역 정보
IP 주소
광고 식별자
앱 이용 기록
광고 노출 및 클릭 기록
오류 및 충돌 정보
랭킹 점수
순위 정보
닉네임 또는 표시 이름
구매 상품 정보
구매 상태
구매 영수증 또는 구매 토큰

BaconCake은 결제 카드번호, 계좌번호 등 결제수단 정보를 직접 수집하지 않습니다.
결제는 Google Play 또는 Apple App Store를 통해 처리됩니다.

3. 개인정보의 보유 기간

BaconCake은 개인정보를 수집 목적에 필요한 기간 동안 보관합니다.

랭킹 정보는 서비스 제공 기간 동안 보관될 수 있습니다.
구매 정보는 광고제거 상품 제공과 구매 복원을 위해 필요한 기간 동안 보관될 수 있습니다.
오류 및 이용 기록은 앱 개선과 부정 이용 방지를 위해 필요한 기간 동안 보관될 수 있습니다.

이용자가 삭제를 요청하는 경우 관련 법령상 보관이 필요한 정보를 제외하고 지체 없이 삭제합니다.

4. 광고 제공

One More Bite는 Google AdMob을 사용하여 광고를 표시할 수 있습니다.
Google AdMob은 광고 제공, 광고 성과 측정, 부정 광고 방지를 위해 광고 식별자, 기기 정보, IP 주소, 앱 이용 정보 등을 처리할 수 있습니다.

이용자는 기기 설정에서 맞춤형 광고를 제한하거나 광고 식별자를 재설정할 수 있습니다.

5. 인앱결제

One More Bite는 광고제거를 위한 유료 인앱결제 상품을 제공할 수 있습니다.
구매가 완료되면 앱은 구매 상태를 확인하여 광고제거 기능을 제공합니다.
결제 처리는 Google Play 또는 Apple App Store에서 진행됩니다.

6. 랭킹 정보

One More Bite는 이용자의 점수와 순위를 랭킹에 표시할 수 있습니다.
랭킹에는 닉네임 또는 표시 이름, 점수, 순위가 표시될 수 있습니다.

이용자는 랭킹 정보 삭제를 요청할 수 있습니다.

7. 제3자 서비스

앱 운영을 위해 다음 외부 서비스를 사용할 수 있습니다.

Google AdMob
Google Play 결제
Apple 인앱결제
Unity Gaming Services 또는 랭킹 서비스 제공자

각 서비스는 광고 제공, 결제 처리, 구매 확인, 랭킹 제공, 앱 안정성 개선을 위해 필요한 정보를 처리할 수 있습니다.

8. 아동의 개인정보

One More Bite는 만 14세 미만 아동을 주요 대상으로 하지 않습니다.
만 14세 미만 아동의 개인정보 처리가 필요한 경우 관련 법령에 따라 필요한 조치를 취합니다.

9. 개인정보의 삭제 요청

이용자는 개인정보 열람, 수정, 삭제, 처리 정지를 요청할 수 있습니다.
랭킹 정보 삭제도 요청할 수 있습니다.

문의 이메일: [문의 이메일]

10. 개인정보 보호책임자

개인정보 보호책임자: BaconCake
문의 이메일: [문의 이메일]

11. 개인정보 처리방침 변경

본 개인정보 처리방침은 앱 기능, 법령, 스토어 정책 변경에 따라 수정될 수 있습니다.
변경 사항은 앱 또는 스토어 페이지를 통해 안내할 수 있습니다.

최종 수정일: 2026년 6월 21일`,
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
    return await supabaseRequest("/content_sections?select=id,eyebrow,title,layout,created_at&order=created_at.asc");
  } catch {
    return [];
  }
}

async function fetchCustomEntries(sectionId) {
  if (!window.BACONCAKE_SUPABASE) return [];

  const sectionFilter = sectionId ? `&section_id=eq.${encodeURIComponent(sectionId)}` : "";
  try {
    const data = await supabaseRequest(`/content_entries?select=id,section_id,number,title,body,media_items,created_at${sectionFilter}&order=created_at.desc`);
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
  return entries.find((entry) => entry.id === id);
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
  return `<a class="card-link" href="${itemDetailUrl(detailType, item.id)}">${content}</a>`;
}

function renderAlbumCard(item, { editable = false, actions = "", detailType = "custom" } = {}) {
  const content = `<article>
    <header>
      <span>${escapeHtml(item.number || "ITEM")}</span>
      ${actions}
    </header>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(truncateText(item.body, 120))}</p>
    ${renderMediaItems((item.media_items || item.mediaItems || []).slice(0, 1))}
  </article>`;

  if (editable) return content;
  return `<a class="card-link" href="${itemDetailUrl(detailType, item.id)}">${content}</a>`;
}

function applySettings(settings = loadSettings()) {
  const language = getCurrentLanguage();
  const languageDefaults = translatedDefaultSettings[language] || {};
  document.title = document.body.classList.contains("admin-page") ? "BaconCake Root Console" : settings.siteTitle;

  Object.entries(settings).forEach(([key, value]) => {
    const translatedValue = value === defaultSettings[key] && languageDefaults[key] ? languageDefaults[key] : value;
    document.querySelectorAll(`[data-setting="${key}"]`).forEach((element) => {
      element.textContent = translatedValue;
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
  if (!sections.length) {
    customSections.innerHTML = "";
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

      return `<section class="${layoutClass}" id="section-${section.id}">
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

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
}

async function refreshTranslatedContent() {
  const settings = await fetchSiteSettings();
  applySettings(settings);
  applyStaticTranslations();
  await renderPosts({ editable: document.body.classList.contains("admin-page") });
  await renderStudioNotes({ editable: document.body.classList.contains("admin-page") });
  await renderCustomSections({ editable: document.body.classList.contains("admin-page") });

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

async function initSite() {
  applySettings();
  applyStaticTranslations();
  renderPosts();
  renderStudioNotes();
  renderCustomSections();
  setupAdminLogin();
  setupLanguageSwitcher();

  const settings = await fetchSiteSettings();
  applySettings(settings);
}

initSite();

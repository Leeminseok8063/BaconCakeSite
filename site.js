const POSTS_KEY = "bacon-cake-posts";
const SETTINGS_KEY = "bacon-cake-settings";
const STUDIO_NOTES_KEY = "bacon-cake-studio-notes";
const ADMIN_SESSION_KEY = "bacon-cake-admin";
const ADMIN_PASSWORD = "0427";

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

function saveStudioNotes(notes) {
  localStorage.setItem(STUDIO_NOTES_KEY, JSON.stringify(notes));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ko-KR", {
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
  document.title = document.body.classList.contains("admin-page") ? "BaconCake Root Console" : settings.siteTitle;

  Object.entries(settings).forEach(([key, value]) => {
    document.querySelectorAll(`[data-setting="${key}"]`).forEach((element) => {
      element.textContent = value;
    });
  });
}

function renderPosts({ editable = false } = {}) {
  const noticeList = document.querySelector("#noticeList");
  if (!noticeList) return;

  const posts = loadPosts().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!posts.length) {
    noticeList.innerHTML = `<article class="notice-card"><h3>등록된 공지가 없습니다.</h3><p>새 소식이 등록되면 이곳에 표시됩니다.</p></article>`;
    return;
  }

  noticeList.innerHTML = posts
    .map((post) => {
      const actions = editable
        ? `<div class="notice-actions">
            <button type="button" data-action="edit" data-id="${post.id}">수정</button>
            <button type="button" data-action="delete" data-id="${post.id}">삭제</button>
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

function renderStudioNotes({ editable = false } = {}) {
  const studioGrid = document.querySelector("#studioGrid");
  if (!studioGrid) return;

  const notes = loadStudioNotes();
  if (!notes.length) {
    studioGrid.innerHTML = `<article><h3>등록된 스튜디오 노트가 없습니다.</h3><p>새 노트가 등록되면 이곳에 표시됩니다.</p></article>`;
    return;
  }

  studioGrid.innerHTML = notes
    .map((note) => {
      const actions = editable
        ? `<div class="notice-actions">
            <button type="button" data-action="edit-studio" data-id="${note.id}">수정</button>
            <button type="button" data-action="delete-studio" data-id="${note.id}">삭제</button>
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
  const adminPassword = document.querySelector("#adminPassword");
  const adminLoginMessage = document.querySelector("#adminLoginMessage");

  if (!adminOpen || !adminDialog || !adminLoginForm || !adminPassword || !adminLoginMessage) return;

  adminOpen.addEventListener("click", () => {
    adminPassword.value = "";
    adminLoginMessage.textContent = "";
    adminDialog.showModal();
    adminPassword.focus();
  });

  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (adminPassword.value.trim() !== ADMIN_PASSWORD) {
      adminLoginMessage.textContent = "비밀번호가 올바르지 않습니다.";
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    window.location.href = "admin.html";
  });
}

applySettings();
renderPosts();
renderStudioNotes();
setupAdminLogin();

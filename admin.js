const settingsForm = document.querySelector("#settingsForm");
const resetSettings = document.querySelector("#resetSettings");
const adminLogout = document.querySelector("#adminLogout");
const sectionForm = document.querySelector("#sectionForm");
const sectionEyebrow = document.querySelector("#sectionEyebrow");
const sectionTitle = document.querySelector("#sectionTitle");
const sectionSlug = document.querySelector("#sectionSlug");
const sectionLayout = document.querySelector("#sectionLayout");
const submitSection = document.querySelector("#submitSection");
const cancelSectionEdit = document.querySelector("#cancelSectionEdit");
const sectionList = document.querySelector("#sectionList");
const customEntryForm = document.querySelector("#customEntryForm");
const entrySection = document.querySelector("#entrySection");
const entryNumber = document.querySelector("#entryNumber");
const entryTitle = document.querySelector("#entryTitle");
const entrySlug = document.querySelector("#entrySlug");
const entryExternalUrl = document.querySelector("#entryExternalUrl");
const entryBody = document.querySelector("#entryBody");
const entryMedia = document.querySelector("#entryMedia");
const submitEntry = document.querySelector("#submitEntry");
const cancelEntryEdit = document.querySelector("#cancelEntryEdit");
const customSections = document.querySelector("#customSections");

let editingSectionId = null;
let editingEntryId = null;
const MAX_MEDIA_FILE_SIZE_BYTES = 500 * 1024 * 1024;
const MAX_MEDIA_FILE_SIZE_LABEL = "500MB";

async function requireAdminSession() {
  const user = await fetchAdminUser();
  if (!user) {
    window.location.replace(canonicalUrl("index.html"));
    return false;
  }

  return true;
}

function slugify(value, fallback = "") {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || fallback;
}

function publicUrl(path) {
  return canonicalUrl(path);
}

function fillSettingsForm(settings = loadSettings()) {
  Object.entries(settings).forEach(([key, value]) => {
    const field = settingsForm.querySelector(`#${key}`);
    if (field) field.value = value;
  });
}

function resetSectionEditor() {
  editingSectionId = null;
  sectionForm.reset();
  submitSection.textContent = "섹션 등록";
  cancelSectionEdit.classList.add("hidden");
}

function resetEntryEditor() {
  editingEntryId = null;
  customEntryForm.reset();
  submitEntry.textContent = "글 등록";
  cancelEntryEdit.classList.add("hidden");
}

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-") || "file";
}

function formatFileSize(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + "MB";
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + "KB";
  return bytes + "B";
}

function storageBaseUrl() {
  if (BACONCAKE_SUPABASE.storageUrl) return BACONCAKE_SUPABASE.storageUrl;
  return BACONCAKE_SUPABASE.restUrl.replace("/rest/v1", "/storage/v1");
}

function storageObjectUrl(path) {
  return `${storageBaseUrl().replace(/\/+$/, "")}/object/content-media/${encodeStoragePath(path)}`;
}

function storagePublicUrl(path) {
  return `${storageBaseUrl().replace(/\/+$/, "")}/object/public/content-media/${encodeStoragePath(path)}`;
}

function encodeStoragePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function contentPayload(fields, mediaItems) {
  const payload = { ...fields };
  if (Array.isArray(mediaItems)) payload.media_items = mediaItems;
  return payload;
}

function normalizeExternalUrl(value) {
  const rawValue = value.trim();
  if (!rawValue) return "";
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(rawValue) ? rawValue : `https://${rawValue}`;

  try {
    const url = new URL(withProtocol);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    return url.href;
  } catch {
    throw new Error("외부 링크는 https://example.com 형식의 올바른 주소로 입력해주세요.");
  }
}

function externalLinkItem(url) {
  return url ? { name: "외부 링크", type: "external-link", url } : null;
}

function withoutExternalLink(mediaItems = []) {
  return mediaItems.filter((item) => item.type !== "external-link");
}

function findExternalLink(mediaItems = []) {
  return mediaItems.find((item) => item.type === "external-link")?.url || "";
}

function mergeMediaWithExternalLink(mediaItems, externalUrl) {
  const cleanMediaItems = withoutExternalLink(mediaItems);
  const linkItem = externalLinkItem(externalUrl);
  return linkItem ? [...cleanMediaItems, linkItem] : cleanMediaItems;
}

function adminErrorMessage(action, error) {
  const message = error?.message || String(error);
  const lowerMessage = message.toLowerCase();

  if (message.includes('"statusCode":"413"') || lowerMessage.includes("payload too large") || lowerMessage.includes("maximum allowed size")) {
    return action + " 실패: Supabase Storage가 첨부 파일을 서버 제한으로 거절했습니다. " + MAX_MEDIA_FILE_SIZE_LABEL + " 이하 파일도 Supabase 버킷 설정이 아직 적용되지 않았으면 실패할 수 있습니다. Supabase SQL Editor에서 supabase-setup.sql을 다시 실행해주세요.";
  }

  if (message.includes('"code":"42501"') || lowerMessage.includes("row-level security")) {
    return `${action} 실패: Supabase RLS 정책이 아직 맞지 않습니다. Supabase SQL Editor에서 supabase-setup.sql 전체를 다시 실행한 뒤, 관리자에서 로그아웃 후 재로그인해주세요.`;
  }

  if (lowerMessage.includes("duplicate key") || message.includes("23505")) {
    return `${action} 실패: 같은 주소 이름(slug)이 이미 있습니다. 다른 주소 이름을 입력해주세요.`;
  }

  if (lowerMessage.includes("jwt") || lowerMessage.includes("expired") || lowerMessage.includes("invalid token")) {
    return `${action} 실패: 관리자 로그인 세션이 만료되었습니다. 로그아웃 후 다시 로그인해주세요.`;
  }

  return `${action} 실패: ${message}`;
}

async function uploadMediaFiles(files, folder) {
  const token = getStoredAdminToken();
  const uploads = [...files];
  if (!uploads.length) return [];
  if (!token) throw new Error("관리자 로그인 세션이 없습니다. 다시 로그인해주세요.");

  const oversizedFile = uploads.find((file) => file.size > MAX_MEDIA_FILE_SIZE_BYTES);
  if (oversizedFile) {
    throw new Error(oversizedFile.name + " 파일이 너무 큽니다. 현재 " + formatFileSize(oversizedFile.size) + "이며, 첨부 파일은 " + MAX_MEDIA_FILE_SIZE_LABEL + " 이하만 업로드할 수 있습니다.");
  }

  return Promise.all(
    uploads.map(async (file) => {
      const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const response = await fetch(storageObjectUrl(path), {
        method: "POST",
        headers: {
          apikey: BACONCAKE_SUPABASE.anonKey,
          Authorization: `Bearer ${String(token).trim()}`,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: file,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error((message || "파일 업로드 실패") + " (파일: " + file.name + ", 크기: " + formatFileSize(file.size) + ")");
      }

      return {
        name: file.name,
        type: file.type || "application/octet-stream",
        url: storagePublicUrl(path),
      };
    }),
  );
}

async function createSection(eyebrow, title, slug, layout) {
  const sortOrder = await nextSectionOrder();
  await supabaseRequest("/content_sections", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ eyebrow, title, slug, layout, sort_order: sortOrder }),
  });
}

async function updateSection(id, eyebrow, title, slug, layout) {
  await supabaseRequest(`/content_sections?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ eyebrow, title, slug, layout }),
  });
}

async function deleteSection(id) {
  await supabaseRequest(`/content_sections?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
}

async function nextSectionOrder() {
  const sections = await fetchCustomSections();
  const maxOrder = sections.reduce((max, section, index) => {
    const order = Number.isFinite(section.sort_order) ? section.sort_order : index * 10;
    return Math.max(max, order);
  }, 0);
  return maxOrder + 10;
}

async function updateSectionOrder(id, sortOrder) {
  await supabaseRequest(`/content_sections?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ sort_order: sortOrder }),
  });
}

async function moveSection(id, direction) {
  const sections = await fetchCustomSections();
  const currentIndex = sections.findIndex((section) => section.id === id);
  const targetIndex = currentIndex + direction;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= sections.length) return;

  const current = sections[currentIndex];
  const target = sections[targetIndex];
  const currentOrder = Number.isFinite(current.sort_order) ? current.sort_order : currentIndex * 10;
  const targetOrder = Number.isFinite(target.sort_order) ? target.sort_order : targetIndex * 10;

  await Promise.all([
    updateSectionOrder(current.id, targetOrder),
    updateSectionOrder(target.id, currentOrder),
  ]);
}

async function createCustomEntry(sectionId, number, title, slug, body, mediaItems) {
  await supabaseRequest("/content_entries", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ section_id: sectionId, number, title, slug, body }, mediaItems)),
  });
}

async function updateCustomEntry(id, sectionId, number, title, slug, body, mediaItems) {
  await supabaseRequest(`/content_entries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ section_id: sectionId, number, title, slug, body }, mediaItems)),
  });
}

async function deleteCustomEntry(id) {
  await supabaseRequest(`/content_entries?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
}

function detailUrlForEntry(entry) {
  return publicUrl(itemDetailUrl("custom", entry));
}

async function refreshSectionAdmin() {
  const sections = await fetchCustomSections();
  const entries = await fetchCustomEntries();

  sectionList.innerHTML = sections.length
    ? sections
        .map((section, index) => {
          const count = entries.filter((entry) => entry.section_id === section.id).length;
          const sectionUrl = publicUrl(`index.html#${sectionHash(section)}`);
          return `<article class="section-admin-item">
            <div>
              <strong>${escapeHtml(section.title)}</strong>
              <span>${escapeHtml(section.eyebrow || "작은 글씨 없음")} · ${section.layout === "album" ? "앨범형" : "작문형"} · 글 ${count}개</span>
              <a href="${sectionUrl}" target="_blank" rel="noreferrer">${sectionUrl}</a>
            </div>
            <div class="notice-actions">
              <button type="button" data-action="move-section-up" data-id="${section.id}" ${index === 0 ? "disabled" : ""}>위로</button>
              <button type="button" data-action="move-section-down" data-id="${section.id}" ${index === sections.length - 1 ? "disabled" : ""}>아래로</button>
              <button type="button" data-action="edit-section" data-id="${section.id}">수정</button>
              <button type="button" data-action="delete-section" data-id="${section.id}">삭제</button>
            </div>
          </article>`;
        })
        .join("")
    : `<article class="section-admin-item"><strong>등록된 섹션이 없습니다.</strong><span>섹션을 만들면 일반 사이트 상단에 탭이 생깁니다.</span></article>`;

  entrySection.innerHTML = sections.length
    ? sections.map((section) => `<option value="${section.id}">${escapeHtml(section.title)}</option>`).join("")
    : `<option value="">섹션을 먼저 등록하세요</option>`;
}

async function refreshCustomAdminPreview() {
  await refreshSectionAdmin();
  await renderCustomSections({ editable: true });
}

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const settings = Object.keys(defaultSettings).reduce((nextSettings, key) => {
    const field = settingsForm.querySelector(`#${key}`);
    nextSettings[key] = field?.value.trim() || defaultSettings[key];
    return nextSettings;
  }, {});

  try {
    await persistSiteSettings(settings);
    applySettings(settings);
    fillSettingsForm(settings);
  } catch (error) {
    alert(adminErrorMessage("기본 문구 저장", error));
  }
});

resetSettings.addEventListener("click", async () => {
  try {
    await persistSiteSettings(defaultSettings);
    applySettings(defaultSettings);
    fillSettingsForm(defaultSettings);
  } catch (error) {
    alert(adminErrorMessage("기본값 저장", error));
  }
});

adminLogout.addEventListener("click", () => {
  clearAdminSession();
  window.location.href = canonicalUrl("index.html");
});

sectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const eyebrow = sectionEyebrow.value.trim();
  const title = sectionTitle.value.trim();
  const slug = slugify(sectionSlug.value || title);
  const layout = sectionLayout.value;
  if (!title || !layout) return;

  try {
    submitSection.disabled = true;
    if (editingSectionId) {
      await updateSection(editingSectionId, eyebrow, title, slug, layout);
    } else {
      await createSection(eyebrow, title, slug, layout);
    }

    resetSectionEditor();
    await refreshCustomAdminPreview();
  } catch (error) {
    alert(adminErrorMessage("섹션 저장", error));
  } finally {
    submitSection.disabled = false;
  }
});

cancelSectionEdit.addEventListener("click", resetSectionEditor);

sectionList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const sections = await fetchCustomSections();
  const section = sections.find((item) => item.id === id);

  if (button.dataset.action === "edit-section" && section) {
    editingSectionId = id;
    sectionEyebrow.value = section.eyebrow || "";
    sectionTitle.value = section.title;
    sectionSlug.value = section.slug || "";
    sectionLayout.value = section.layout;
    submitSection.textContent = "수정 저장";
    cancelSectionEdit.classList.remove("hidden");
    sectionForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (button.dataset.action === "move-section-up" || button.dataset.action === "move-section-down") {
    try {
      await moveSection(id, button.dataset.action === "move-section-up" ? -1 : 1);
      await refreshCustomAdminPreview();
    } catch (error) {
      alert(adminErrorMessage("섹션 순서 변경", error));
    }
  }

  if (button.dataset.action === "delete-section") {
    try {
      await deleteSection(id);
      if (editingSectionId === id) resetSectionEditor();
      await refreshCustomAdminPreview();
    } catch (error) {
      alert(adminErrorMessage("섹션 삭제", error));
    }
  }
});

customEntryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const sectionId = entrySection.value;
  const number = entryNumber.value.trim();
  const title = entryTitle.value.trim();
  const slug = slugify(entrySlug.value || title);
  const body = entryBody.value.trim();

  if (!sectionId || !title || !body) return;

  try {
    submitEntry.disabled = true;
    const externalUrl = normalizeExternalUrl(entryExternalUrl.value);
    const existingEntry = editingEntryId ? await fetchCustomEntry(editingEntryId) : null;
    const existingMediaItems = withoutExternalLink(existingEntry?.mediaItems || existingEntry?.media_items || []);
    const uploadedMedia = await uploadMediaFiles(entryMedia.files, "custom-sections");
    const mediaItems = mergeMediaWithExternalLink([...existingMediaItems, ...uploadedMedia], externalUrl);

    if (editingEntryId) {
      await updateCustomEntry(editingEntryId, sectionId, number, title, slug, body, mediaItems);
    } else {
      await createCustomEntry(sectionId, number, title, slug, body, mediaItems);
    }

    resetEntryEditor();
    await refreshCustomAdminPreview();
  } catch (error) {
    alert(adminErrorMessage("글 저장", error));
  } finally {
    submitEntry.disabled = false;
  }
});

cancelEntryEdit.addEventListener("click", resetEntryEditor);

customSections.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === "delete-entry") {
    try {
      await deleteCustomEntry(id);
      if (editingEntryId === id) resetEntryEditor();
      await refreshCustomAdminPreview();
    } catch (error) {
      alert(adminErrorMessage("글 삭제", error));
    }
  }

  if (button.dataset.action === "edit-entry") {
    const entry = await fetchCustomEntry(id);
    if (!entry) return;

    editingEntryId = id;
    entrySection.value = entry.section_id;
    entryNumber.value = entry.number || "";
    entryTitle.value = entry.title;
    entrySlug.value = entry.slug || "";
    entryExternalUrl.value = findExternalLink(entry.mediaItems || entry.media_items || []);
    entryBody.value = entry.body;
    submitEntry.textContent = "수정 저장";
    cancelEntryEdit.classList.remove("hidden");
    customEntryForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

async function initAdmin() {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) return;

  const settings = await fetchSiteSettings();
  fillSettingsForm(settings);
  applySettings(settings);
  resetSectionEditor();
  resetEntryEditor();
  await refreshCustomAdminPreview();
}

initAdmin();

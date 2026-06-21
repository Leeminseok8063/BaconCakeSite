const settingsForm = document.querySelector("#settingsForm");
const studioForm = document.querySelector("#studioForm");
const studioNoteNumber = document.querySelector("#studioNoteNumber");
const studioNoteTitle = document.querySelector("#studioNoteTitle");
const studioNoteBody = document.querySelector("#studioNoteBody");
const studioNoteMedia = document.querySelector("#studioNoteMedia");
const submitStudioNote = document.querySelector("#submitStudioNote");
const cancelStudioEdit = document.querySelector("#cancelStudioEdit");
const postForm = document.querySelector("#postForm");
const postTitle = document.querySelector("#postTitle");
const postBody = document.querySelector("#postBody");
const postMedia = document.querySelector("#postMedia");
const submitPost = document.querySelector("#submitPost");
const cancelEdit = document.querySelector("#cancelEdit");
const clearPosts = document.querySelector("#clearPosts");
const resetSettings = document.querySelector("#resetSettings");
const clearStudioNotes = document.querySelector("#clearStudioNotes");
const noticeList = document.querySelector("#noticeList");
const studioGrid = document.querySelector("#studioGrid");
const adminLogout = document.querySelector("#adminLogout");
const sectionForm = document.querySelector("#sectionForm");
const sectionEyebrow = document.querySelector("#sectionEyebrow");
const sectionTitle = document.querySelector("#sectionTitle");
const sectionLayout = document.querySelector("#sectionLayout");
const submitSection = document.querySelector("#submitSection");
const cancelSectionEdit = document.querySelector("#cancelSectionEdit");
const sectionList = document.querySelector("#sectionList");
const customEntryForm = document.querySelector("#customEntryForm");
const entrySection = document.querySelector("#entrySection");
const entryNumber = document.querySelector("#entryNumber");
const entryTitle = document.querySelector("#entryTitle");
const entryBody = document.querySelector("#entryBody");
const entryMedia = document.querySelector("#entryMedia");
const submitEntry = document.querySelector("#submitEntry");
const cancelEntryEdit = document.querySelector("#cancelEntryEdit");
const customSections = document.querySelector("#customSections");

let editingId = null;
let editingStudioId = null;
let editingSectionId = null;
let editingEntryId = null;

async function requireAdminSession() {
  const user = await fetchAdminUser();
  if (!user) {
    window.location.replace(canonicalUrl("index.html"));
    return false;
  }

  return true;
}

function fillSettingsForm() {
  const settings = loadSettings();
  Object.entries(settings).forEach(([key, value]) => {
    const field = settingsForm.querySelector(`#${key}`);
    if (field) field.value = value;
  });
}

function resetEditor() {
  editingId = null;
  postForm.reset();
  submitPost.textContent = "글 등록";
  cancelEdit.classList.add("hidden");
}

function resetStudioEditor() {
  editingStudioId = null;
  studioForm.reset();
  submitStudioNote.textContent = "노트 등록";
  cancelStudioEdit.classList.add("hidden");
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
  submitEntry.textContent = "콘텐츠 등록";
  cancelEntryEdit.classList.add("hidden");
}

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-") || "file";
}

function storageBaseUrl() {
  if (BACONCAKE_SUPABASE.storageUrl) return BACONCAKE_SUPABASE.storageUrl;
  return BACONCAKE_SUPABASE.restUrl.replace("/rest/v1", "/storage/v1");
}

function encodeStoragePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function contentPayload(fields, mediaItems) {
  const payload = { ...fields };
  if (mediaItems.length) payload.media_items = mediaItems;
  return payload;
}

async function uploadMediaFiles(files, folder) {
  const token = getStoredAdminToken();
  const uploads = [...files];
  if (!uploads.length) return [];
  if (!token) throw new Error("관리자 로그인 세션이 없습니다. 다시 로그인해주세요.");

  return Promise.all(
    uploads.map(async (file) => {
      const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const encodedPath = encodeStoragePath(path);
      const response = await fetch(`${storageBaseUrl()}/object/content-media/${encodedPath}`, {
        method: "POST",
        headers: {
          apikey: BACONCAKE_SUPABASE.anonKey,
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type || "application/octet-stream",
          "x-upsert": "false",
        },
        body: file,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `파일 업로드 실패: ${file.name}`);
      }

      return {
        name: file.name,
        type: file.type || "application/octet-stream",
        url: `${storageBaseUrl()}/object/public/content-media/${encodedPath}`,
      };
    }),
  );
}

async function createNotice(title, body, mediaItems) {
  await supabaseRequest("/notices", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ title, body }, mediaItems)),
  });
}

async function updateNotice(id, title, body, mediaItems) {
  await supabaseRequest(`/notices?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ title, body }, mediaItems)),
  });
}

async function deleteNotice(id) {
  await supabaseRequest(`/notices?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
}

async function createStudioNote(number, title, body, mediaItems) {
  await supabaseRequest("/studio_notes", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ number, title, body }, mediaItems)),
  });
}

async function updateStudioNote(id, number, title, body, mediaItems) {
  await supabaseRequest(`/studio_notes?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ number, title, body }, mediaItems)),
  });
}

async function deleteStudioNote(id) {
  await supabaseRequest(`/studio_notes?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
}

async function createSection(eyebrow, title, layout) {
  await supabaseRequest("/content_sections", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ eyebrow, title, layout }),
  });
}

async function updateSection(id, eyebrow, title, layout) {
  await supabaseRequest(`/content_sections?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ eyebrow, title, layout }),
  });
}

async function deleteSection(id) {
  await supabaseRequest(`/content_sections?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
}

async function createCustomEntry(sectionId, number, title, body, mediaItems) {
  await supabaseRequest("/content_entries", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ section_id: sectionId, number, title, body }, mediaItems)),
  });
}

async function updateCustomEntry(id, sectionId, number, title, body, mediaItems) {
  await supabaseRequest(`/content_entries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify(contentPayload({ section_id: sectionId, number, title, body }, mediaItems)),
  });
}

async function deleteCustomEntry(id) {
  await supabaseRequest(`/content_entries?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
}

async function refreshSectionAdmin() {
  const sections = await fetchCustomSections();
  sectionList.innerHTML = sections.length
    ? sections
        .map((section) => `<article class="section-admin-item">
          <div>
            <strong>${section.title}</strong>
            <span>${section.eyebrow || ""} · ${section.layout === "album" ? "앨범형" : "작문형"}</span>
          </div>
          <div class="notice-actions">
            <button type="button" data-action="edit-section" data-id="${section.id}">수정</button>
            <button type="button" data-action="delete-section" data-id="${section.id}">삭제</button>
          </div>
        </article>`)
        .join("")
    : `<article class="section-admin-item"><strong>등록된 섹션이 없습니다.</strong><span>새 섹션을 만들어보세요.</span></article>`;

  entrySection.innerHTML = sections.length
    ? sections.map((section) => `<option value="${section.id}">${section.title}</option>`).join("")
    : `<option value="">섹션을 먼저 등록하세요</option>`;
}

async function refreshCustomAdminPreview() {
  await refreshSectionAdmin();
  await renderCustomSections({ editable: true });
}

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const settings = Object.keys(defaultSettings).reduce((nextSettings, key) => {
    const field = settingsForm.querySelector(`#${key}`);
    nextSettings[key] = field.value.trim() || defaultSettings[key];
    return nextSettings;
  }, {});

  saveSettings(settings);
  applySettings();
  fillSettingsForm();
});

resetSettings.addEventListener("click", () => {
  saveSettings(defaultSettings);
  applySettings();
  fillSettingsForm();
});

adminLogout.addEventListener("click", async () => {
  clearAdminSession();
  window.location.href = canonicalUrl("index.html");
});

studioForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const number = studioNoteNumber.value.trim();
  const title = studioNoteTitle.value.trim();
  const body = studioNoteBody.value.trim();

  if (!number || !title || !body) return;

  try {
    submitStudioNote.disabled = true;
    const existingNote = editingStudioId ? (await fetchStudioNotes()).find((note) => note.id === editingStudioId) : null;
    const uploadedMedia = await uploadMediaFiles(studioNoteMedia.files, "studio-notes");
    const mediaItems = [...(existingNote?.mediaItems || []), ...uploadedMedia];

    if (editingStudioId) {
      await updateStudioNote(editingStudioId, number, title, body, mediaItems);
    } else {
      await createStudioNote(number, title, body, mediaItems);
    }

    resetStudioEditor();
    await renderStudioNotes({ editable: true });
  } catch (error) {
    alert(`스튜디오 노트 저장 실패: ${error.message}`);
  } finally {
    submitStudioNote.disabled = false;
  }
});

cancelStudioEdit.addEventListener("click", resetStudioEditor);

clearStudioNotes.addEventListener("click", async () => {
  try {
    const notes = await fetchStudioNotes();
    await Promise.all(notes.map((note) => deleteStudioNote(note.id)));
    resetStudioEditor();
    await renderStudioNotes({ editable: true });
  } catch (error) {
    alert(`스튜디오 노트 삭제 실패: ${error.message}`);
  }
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = postTitle.value.trim();
  const body = postBody.value.trim();

  if (!title || !body) return;

  try {
    submitPost.disabled = true;
    const existingPost = editingId ? (await fetchPosts()).find((post) => post.id === editingId) : null;
    const uploadedMedia = await uploadMediaFiles(postMedia.files, "notices");
    const mediaItems = [...(existingPost?.mediaItems || []), ...uploadedMedia];

    if (editingId) {
      await updateNotice(editingId, title, body, mediaItems);
    } else {
      await createNotice(title, body, mediaItems);
    }

    resetEditor();
    await renderPosts({ editable: true });
  } catch (error) {
    alert(`공지 저장 실패: ${error.message}`);
  } finally {
    submitPost.disabled = false;
  }
});

cancelEdit.addEventListener("click", resetEditor);

clearPosts.addEventListener("click", async () => {
  try {
    const posts = await fetchPosts();
    await Promise.all(posts.map((post) => deleteNotice(post.id)));
    resetEditor();
    await renderPosts({ editable: true });
  } catch (error) {
    alert(`공지 삭제 실패: ${error.message}`);
  }
});

sectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const eyebrow = sectionEyebrow.value.trim();
  const title = sectionTitle.value.trim();
  const layout = sectionLayout.value;
  if (!title || !layout) return;

  try {
    submitSection.disabled = true;
    if (editingSectionId) {
      await updateSection(editingSectionId, eyebrow, title, layout);
    } else {
      await createSection(eyebrow, title, layout);
    }

    resetSectionEditor();
    await refreshCustomAdminPreview();
  } catch (error) {
    alert(`섹션 저장 실패: ${error.message}`);
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
    sectionLayout.value = section.layout;
    submitSection.textContent = "수정 저장";
    cancelSectionEdit.classList.remove("hidden");
    sectionForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (button.dataset.action === "delete-section") {
    try {
      await deleteSection(id);
      if (editingSectionId === id) resetSectionEditor();
      await refreshCustomAdminPreview();
    } catch (error) {
      alert(`섹션 삭제 실패: ${error.message}`);
    }
  }
});

customEntryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const sectionId = entrySection.value;
  const number = entryNumber.value.trim();
  const title = entryTitle.value.trim();
  const body = entryBody.value.trim();

  if (!sectionId || !title || !body) return;

  try {
    submitEntry.disabled = true;
    const existingEntry = editingEntryId ? await fetchCustomEntry(editingEntryId) : null;
    const uploadedMedia = await uploadMediaFiles(entryMedia.files, "custom-sections");
    const mediaItems = [...(existingEntry?.mediaItems || existingEntry?.media_items || []), ...uploadedMedia];

    if (editingEntryId) {
      await updateCustomEntry(editingEntryId, sectionId, number, title, body, mediaItems);
    } else {
      await createCustomEntry(sectionId, number, title, body, mediaItems);
    }

    resetEntryEditor();
    await refreshCustomAdminPreview();
  } catch (error) {
    alert(`콘텐츠 저장 실패: ${error.message}`);
  } finally {
    submitEntry.disabled = false;
  }
});

cancelEntryEdit.addEventListener("click", resetEntryEditor);

noticeList.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === "delete") {
    try {
      await deleteNotice(id);
      if (editingId === id) resetEditor();
      await renderPosts({ editable: true });
    } catch (error) {
      alert(`공지 삭제 실패: ${error.message}`);
    }
  }

  if (button.dataset.action === "edit") {
    const post = (await fetchPosts()).find((item) => item.id === id);
    if (!post) return;

    editingId = id;
    postTitle.value = post.title;
    postBody.value = post.body;
    submitPost.textContent = "수정 저장";
    cancelEdit.classList.remove("hidden");
    postForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

studioGrid.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  if (button.dataset.action === "delete-studio") {
    try {
      await deleteStudioNote(id);
      if (editingStudioId === id) resetStudioEditor();
      await renderStudioNotes({ editable: true });
    } catch (error) {
      alert(`스튜디오 노트 삭제 실패: ${error.message}`);
    }
  }

  if (button.dataset.action === "edit-studio") {
    const note = (await fetchStudioNotes()).find((item) => item.id === id);
    if (!note) return;

    editingStudioId = id;
    studioNoteNumber.value = note.number;
    studioNoteTitle.value = note.title;
    studioNoteBody.value = note.body;
    submitStudioNote.textContent = "수정 저장";
    cancelStudioEdit.classList.remove("hidden");
    studioForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

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
      alert(`콘텐츠 삭제 실패: ${error.message}`);
    }
  }

  if (button.dataset.action === "edit-entry") {
    const entry = await fetchCustomEntry(id);
    if (!entry) return;

    editingEntryId = id;
    entrySection.value = entry.section_id;
    entryNumber.value = entry.number || "";
    entryTitle.value = entry.title;
    entryBody.value = entry.body;
    submitEntry.textContent = "수정 저장";
    cancelEntryEdit.classList.remove("hidden");
    customEntryForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

async function initAdmin() {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) return;

  fillSettingsForm();
  resetStudioEditor();
  resetSectionEditor();
  resetEntryEditor();
  await renderPosts({ editable: true });
  await renderStudioNotes({ editable: true });
  await refreshCustomAdminPreview();
}

initAdmin();

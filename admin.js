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

let editingId = null;
let editingStudioId = null;

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

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function uploadMediaFiles(files, folder) {
  const token = getStoredAdminToken();
  const uploads = [...files];
  if (!uploads.length) return [];

  return Promise.all(
    uploads.map(async (file) => {
      const path = `${folder}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const response = await fetch(`${BACONCAKE_SUPABASE.storageUrl}/object/content-media/${path}`, {
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
        url: `${BACONCAKE_SUPABASE.storageUrl}/object/public/content-media/${path}`,
      };
    }),
  );
}

async function createNotice(title, body, mediaItems) {
  await supabaseRequest("/notices", {
    method: "POST",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ title, body, media_items: mediaItems }),
  });
}

async function updateNotice(id, title, body, mediaItems) {
  await supabaseRequest(`/notices?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ title, body, media_items: mediaItems }),
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
    body: JSON.stringify({ number, title, body, media_items: mediaItems }),
  });
}

async function updateStudioNote(id, number, title, body, mediaItems) {
  await supabaseRequest(`/studio_notes?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
    body: JSON.stringify({ number, title, body, media_items: mediaItems }),
  });
}

async function deleteStudioNote(id) {
  await supabaseRequest(`/studio_notes?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    authToken: getStoredAdminToken(),
    prefer: "return=minimal",
  });
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

async function initAdmin() {
  const isAdmin = await requireAdminSession();
  if (!isAdmin) return;

  fillSettingsForm();
  resetStudioEditor();
  await renderPosts({ editable: true });
  await renderStudioNotes({ editable: true });
}

initAdmin();

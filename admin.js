const settingsForm = document.querySelector("#settingsForm");
const studioForm = document.querySelector("#studioForm");
const studioNoteNumber = document.querySelector("#studioNoteNumber");
const studioNoteTitle = document.querySelector("#studioNoteTitle");
const studioNoteBody = document.querySelector("#studioNoteBody");
const submitStudioNote = document.querySelector("#submitStudioNote");
const cancelStudioEdit = document.querySelector("#cancelStudioEdit");
const postForm = document.querySelector("#postForm");
const postTitle = document.querySelector("#postTitle");
const postBody = document.querySelector("#postBody");
const submitPost = document.querySelector("#submitPost");
const cancelEdit = document.querySelector("#cancelEdit");
const clearPosts = document.querySelector("#clearPosts");
const resetSettings = document.querySelector("#resetSettings");
const clearStudioNotes = document.querySelector("#clearStudioNotes");
const noticeList = document.querySelector("#noticeList");
const studioGrid = document.querySelector("#studioGrid");

let editingId = null;
let editingStudioId = null;

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

studioForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const number = studioNoteNumber.value.trim();
  const title = studioNoteTitle.value.trim();
  const body = studioNoteBody.value.trim();

  if (!number || !title || !body) return;

  const notes = loadStudioNotes();
  if (editingStudioId) {
    const target = notes.find((note) => note.id === editingStudioId);
    if (target) {
      target.number = number;
      target.title = title;
      target.body = body;
    }
  } else {
    notes.push({
      id: crypto.randomUUID(),
      number,
      title,
      body,
    });
  }

  saveStudioNotes(notes);
  resetStudioEditor();
  renderStudioNotes({ editable: true });
});

cancelStudioEdit.addEventListener("click", resetStudioEditor);

clearStudioNotes.addEventListener("click", () => {
  saveStudioNotes([]);
  resetStudioEditor();
  renderStudioNotes({ editable: true });
});

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = postTitle.value.trim();
  const body = postBody.value.trim();

  if (!title || !body) return;

  const posts = loadPosts();
  if (editingId) {
    const target = posts.find((post) => post.id === editingId);
    if (target) {
      target.title = title;
      target.body = body;
      target.createdAt = new Date().toISOString();
    }
  } else {
    posts.push({
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: new Date().toISOString(),
    });
  }

  savePosts(posts);
  resetEditor();
  renderPosts({ editable: true });
});

cancelEdit.addEventListener("click", resetEditor);

clearPosts.addEventListener("click", () => {
  savePosts([]);
  resetEditor();
  renderPosts({ editable: true });
});

noticeList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const posts = loadPosts();
  const id = button.dataset.id;

  if (button.dataset.action === "delete") {
    savePosts(posts.filter((post) => post.id !== id));
    if (editingId === id) resetEditor();
    renderPosts({ editable: true });
  }

  if (button.dataset.action === "edit") {
    const post = posts.find((item) => item.id === id);
    if (!post) return;

    editingId = id;
    postTitle.value = post.title;
    postBody.value = post.body;
    submitPost.textContent = "수정 저장";
    cancelEdit.classList.remove("hidden");
    postForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

studioGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const notes = loadStudioNotes();
  const id = button.dataset.id;

  if (button.dataset.action === "delete-studio") {
    saveStudioNotes(notes.filter((note) => note.id !== id));
    if (editingStudioId === id) resetStudioEditor();
    renderStudioNotes({ editable: true });
  }

  if (button.dataset.action === "edit-studio") {
    const note = notes.find((item) => item.id === id);
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

fillSettingsForm();
resetStudioEditor();
renderPosts({ editable: true });
renderStudioNotes({ editable: true });

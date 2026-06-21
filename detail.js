const detailView = document.querySelector("#detailView");

async function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const id = params.get("id");

  let item;
  let label;
  let backHref;

  if (type === "notice") {
    item = (await fetchPosts()).find((post) => post.id === id);
    label = t("noticeLabel");
    backHref = "index.html#news";
  }

  if (type === "studio") {
    item = (await fetchStudioNotes()).find((note) => note.id === id);
    label = t("studioLabel");
    backHref = "index.html#studio";
  }

  if (!item) {
    detailView.innerHTML = `<article class="detail-card">
      <p class="eyebrow">${t("notFoundLabel")}</p>
      <h1>${t("notFoundTitle")}</h1>
      <p>${t("notFoundBody")}</p>
      <a class="secondary-action" href="index.html">${t("homeBack")}</a>
    </article>`;
    return;
  }

  const meta = type === "notice" && item.createdAt
    ? `<time datetime="${item.createdAt}">${formatDate(item.createdAt)}</time>`
    : `<span>${escapeHtml(item.number || "")}</span>`;

  detailView.innerHTML = `<article class="detail-card">
    <p class="eyebrow">${label}</p>
    <div class="detail-meta">${meta}</div>
    <h1>${escapeHtml(item.title)}</h1>
    <p>${escapeHtml(item.body)}</p>
    <a class="secondary-action" href="${backHref}">${t("listBack")}</a>
  </article>`;
}

renderDetail();

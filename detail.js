const detailView = document.querySelector("#detailView");

async function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("slug") || params.get("id");

  let item;
  let label;
  let backHref;

  item = id ? await fetchCustomEntry(id) : null;
  const sections = await fetchCustomSections();
  const section = sections.find((candidate) => candidate.id === item?.section_id);
  label = section?.title || "Content";
  backHref = section ? `index.html#${sectionHash(section)}` : "index.html";

  if (!item) {
    detailView.innerHTML = `<article class="detail-card">
      <p class="eyebrow">${t("notFoundLabel")}</p>
      <h1>${t("notFoundTitle")}</h1>
      <p>${t("notFoundBody")}</p>
      <a class="secondary-action" href="index.html">${t("homeBack")}</a>
    </article>`;
    return;
  }

  const meta = item.createdAt
    ? `<time datetime="${item.createdAt}">${formatDate(item.createdAt)}</time>`
    : `<span>${escapeHtml(item.number || "")}</span>`;

  detailView.innerHTML = `<article class="detail-card">
    <p class="eyebrow">${label}</p>
    <div class="detail-meta">${meta}</div>
    <h1>${escapeHtml(item.title)}</h1>
    <div class="detail-body">${renderMarkdownLinks(item.body)}</div>
    ${renderMediaItems(item.mediaItems)}
    <a class="secondary-action" href="${backHref}">${t("listBack")}</a>
  </article>`;
}

renderDetail();

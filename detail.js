const detailView = document.querySelector("#detailView");

function renderDetailBody(value) {
  if (typeof renderBodyText === "function") return renderBodyText(value);

  const text = value || "";
  const linkPattern = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  let html = "";
  let lastIndex = 0;

  for (const match of text.matchAll(linkPattern)) {
    const [source, label, url] = match;
    html += escapeHtml(text.slice(lastIndex, match.index));

    try {
      const parsedUrl = new URL(url);
      html += ["http:", "https:"].includes(parsedUrl.protocol)
        ? `<a href="${escapeHtml(parsedUrl.href)}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`
        : escapeHtml(source);
    } catch {
      html += escapeHtml(source);
    }

    lastIndex = match.index + source.length;
  }

  return html + escapeHtml(text.slice(lastIndex));
}

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
  const media = section?.layout === "release"
    ? renderReleaseMediaItems(item.mediaItems, { detail: true })
    : renderMediaItems(item.mediaItems);

  detailView.innerHTML = `<article class="detail-card">
    <p class="eyebrow">${label}</p>
    <div class="detail-meta">${meta}</div>
    <h1>${escapeHtml(item.title)}</h1>
    <div class="detail-body">${renderDetailBody(item.body)}</div>
    ${media}
    <a class="secondary-action" href="${backHref}">${t("listBack")}</a>
  </article>`;
}

renderDetail();

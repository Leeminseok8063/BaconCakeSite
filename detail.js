const detailView = document.querySelector("#detailView");

function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const id = params.get("id");

  let item;
  let label;
  let backHref;

  if (type === "notice") {
    item = loadPosts().find((post) => post.id === id);
    label = "공지사항";
    backHref = "index.html#news";
  }

  if (type === "studio") {
    item = loadStudioNotes().find((note) => note.id === id);
    label = "스튜디오 노트";
    backHref = "index.html#studio";
  }

  if (!item) {
    detailView.innerHTML = `<article class="detail-card">
      <p class="eyebrow">Not Found</p>
      <h1>내용을 찾을 수 없습니다.</h1>
      <p>삭제되었거나 잘못된 주소일 수 있습니다.</p>
      <a class="secondary-action" href="index.html">홈으로 돌아가기</a>
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
    <a class="secondary-action" href="${backHref}">목록으로 돌아가기</a>
  </article>`;
}

renderDetail();

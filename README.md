# BaconCakeOfficial.com

이미지를 활용한 BaconCake 개발사 공식 사이트 스타일의 정적 웹앱입니다.

## 실행

`index.html`을 브라우저로 열면 바로 확인할 수 있습니다.

일반 방문자 페이지는 `index.html`, 관리자 편집 페이지는 `admin.html`입니다. 일반 페이지 상단의 `ADMIN` 버튼에서 Supabase 관리자 계정으로 로그인하면 관리자 페이지로 이동합니다.

사이트는 어드민이 만든 섹션과 글만으로 구성됩니다. 섹션을 만들면 일반 사이트 상단에 탭이 생기고, 섹션 안의 글은 `detail.html?slug=...` 형태의 독립 상세 페이지 주소를 가집니다.

예를 들어 개인정보 처리방침은 어드민에서 `개인정보처리` 섹션을 만들고, 그 안에 `개인정보 처리방침` 글을 만든 뒤 상세 주소를 Google Play에 입력하면 됩니다.

어드민 콘솔의 섹션 목록에서 `위로`, `아래로` 버튼으로 섹션 순서를 바꿀 수 있습니다. 이 순서는 일반 사이트 상단 탭과 본문 섹션 순서에 같이 반영됩니다.

긴 글 작성 제한은 없으며, 섹션 글에는 이미지, 동영상, 오디오, PDF 첨부가 가능합니다.

처음 세팅하거나 RLS 오류가 뜨면 Supabase SQL Editor에서 [`supabase-setup.sql`](./supabase-setup.sql) 전체를 한 번 실행해야 합니다.

이 파일은 아래 항목을 한 번에 정리합니다.

- `content_sections`
- `content_entries`
- `site_settings`
- `content-media` Storage bucket
- 일반 방문자 읽기 권한
- 관리자 작성, 수정, 삭제 권한
- 섹션/글 상세 URL용 `slug` 컬럼
- 섹션 순서 변경용 `sort_order` 컬럼

Supabase SQL Editor에서 `Run and enable RLS` 경고가 뜨면 초록 버튼으로 실행해도 됩니다. 실행 후에는 관리자 페이지에서 로그아웃한 뒤 다시 로그인하세요.

## GitHub Pages

이 프로젝트는 정적 사이트라 GitHub Pages에 바로 배포할 수 있습니다.

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더를 해당 저장소에 push합니다.
3. 저장소의 `Settings > Pages`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `master`, folder는 `/root`를 선택하고 저장합니다.

배포 후 일반 사이트는 GitHub Pages 주소의 `/`에서, 관리자 페이지는 `/admin.html`에서 열 수 있습니다.

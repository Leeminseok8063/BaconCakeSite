# BaconCakeOfficial.com

이미지를 활용한 BaconCake 개발사 공식 사이트 스타일의 정적 웹앱입니다.

## 실행

`index.html`을 브라우저로 열면 바로 확인할 수 있습니다.

별도 로그인 없이 페이지 하단 ROOT 콘솔에서 사이트 문구와 공지 작성, 수정, 삭제가 가능합니다. 데이터는 브라우저 `localStorage`에 저장됩니다.

일반 방문자 페이지는 `index.html`, 관리자 편집 페이지는 `admin.html`입니다.

운영용으로 배포하려면 실제 서버 인증과 데이터베이스를 연결해야 합니다.

## GitHub Pages

이 프로젝트는 정적 사이트라 GitHub Pages에 바로 배포할 수 있습니다.

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더를 해당 저장소에 push합니다.
3. 저장소의 `Settings > Pages`에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `master`, folder는 `/root`를 선택하고 저장합니다.

배포 후 일반 사이트는 GitHub Pages 주소의 `/`에서, 관리자 페이지는 `/admin.html`에서 열 수 있습니다.

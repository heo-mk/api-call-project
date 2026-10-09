# GitFind Dashboard

* **배포 사이트:** [https://github-repo-search-xi.vercel.app/](https://github-repo-search-xi.vercel.app/)

GitHub REST API 기반 레포지토리 검색 대시보드입니다. 키워드로 레포지토리를 검색하고, 무한 스크롤로 결과를 탐색하며, 마음에 드는 레포를 즐겨찾기에 등록해 영구 저장할 수 있습니다.

TanStack Query의 주요 패턴(Infinite Query, Optimistic Update)과 Zustand persist 미들웨어를 실전 구조로 검증하기 위해 만든 프로젝트입니다.

---
<img width="1304" height="524" alt="스크린샷 2026-10-09 113424" src="https://github.com/user-attachments/assets/0ff936af-d326-4302-98bb-2aeb45145e10" />
<img width="1216" height="1074" alt="스크린샷 2026-10-09 113435" src="https://github.com/user-attachments/assets/afcb7698-5977-42f1-867b-981ee3743e93" />
<img width="1281" height="1113" alt="스크린샷 2026-10-09 113501" src="https://github.com/user-attachments/assets/e25feb01-8421-4817-8271-e030c86ed643" />
<img width="383" height="843" alt="스크린샷 2026-10-09 113941" src="https://github.com/user-attachments/assets/fc49c096-21bd-430d-9755-83d5d3e3f41a" />
<img width="385" height="849" alt="스크린샷 2026-10-09 113551" src="https://github.com/user-attachments/assets/95f57722-5090-4914-b6c4-b2ce8ea1e988" />
<img width="392" height="847" alt="스크린샷 2026-10-09 113601" src="https://github.com/user-attachments/assets/2e5bce9c-da0f-4c4b-ba5d-85d37e953cd0" />
<img width="387" height="846" alt="스크린샷 2026-10-09 113615" src="https://github.com/user-attachments/assets/1278a522-be17-4ce5-9726-5c6e1d7dd394" />
<img width="389" height="847" alt="스크린샷 2026-10-09 113637" src="https://github.com/user-attachments/assets/d54ed0e2-49ce-4766-b46f-98834185e69f" />
<img width="383" height="843" alt="스크린샷 2026-10-09 113941" src="https://github.com/user-attachments/assets/c9ae6edf-cd12-43bb-966f-ca3e26ddfb5a" />


## 주요 기능

- **GitHub 레포지토리 키워드 검색** — GitHub Search API를 호출해 결과를 카드로 표시
- **무한 스크롤** — 스크롤 시 다음 페이지를 자동으로 이어서 로드 (마지막 페이지 또는 GitHub 검색이 제공하는 첫 1,000건에서 종료)
- **즐겨찾기 등록/해제 (낙관적 업데이트)** — 클릭 즉시 UI에 반영되고, 실패 시 누른 레포만 자동으로 원래 상태로 복원
- **즐겨찾기 영구 저장** — `localStorage`에 저장되어 새로고침 후에도 유지
- **라이트/다크 모드** — 테마 설정도 `localStorage`에 저장되어 유지
- **에러 시뮬레이션 토글** — 즐겨찾기 API 실패 상황을 강제로 재현해 복원 동작을 확인 가능
- **요청 한도 초과 안내** — GitHub 검색 요청 한도(분당 10회)를 넘으면 받아 둔 목록을 유지한 채 대기 시간을 안내하고, 다시 시도 버튼을 제공

---

## 기술 스택

| 구분 | 내용 |
|---|---|
| 프레임워크 | React 19 + Vite |
| 언어 | TypeScript |
| 서버 상태 관리 | TanStack React Query v5 (`useInfiniteQuery`, `useMutation`) |
| 클라이언트 상태 관리 | Zustand v5 (`persist` 미들웨어) |
| 스타일 | SCSS (CSS Variables 기반 테마) |
| 테스트 | Vitest, jsdom, React Testing Library |
| 아이콘 | lucide-react |

**외부 API**: [GitHub REST API — Search Repositories](https://docs.github.com/en/rest/search)
> 인증 없이 호출하며, 분당 10회 요청 제한이 적용됩니다.

---

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 테스트 실행
pnpm test
```

별도의 환경 변수나 API 키 설정은 필요하지 않습니다 (GitHub API를 비인증으로 호출).

---

## 아키텍처 설계 원칙

- **서버 상태 / 클라이언트 상태 분리**: 검색 결과(서버에서 오는 데이터)는 TanStack Query, 즐겨찾기·테마(로컬에서 관리하는 데이터)는 Zustand로 명확히 구분해 관리합니다.
- **낙관적 업데이트 복원**: 즐겨찾기 토글 실패 시, 요청 직전 그 레포가 즐겨찾기였는지만 기록해 두었다가 그 레포의 상태만 원래대로 맞춥니다. 목록 전체를 덮어쓰지 않으므로 요청이 겹쳐도 다른 즐겨찾기의 결과가 유지됩니다.
- **무한 스크롤 종료 조건 삼중 체크**: 마지막 페이지가 10건보다 적은 경우, 누적 건수가 `total_count` 이상인 경우, GitHub 검색이 제공하는 첫 1,000건에 이른 경우 중 하나라도 해당하면 더 불러오지 않습니다.

---

## 알려진 제약사항

- 테스트 대상은 훅·스토어·API 오류 처리이며, 화면(컴포넌트) 단위 테스트는 없음
- 즐겨찾기 API는 실제 서버 없이 `setTimeout`으로 동작을 시뮬레이션 (실 서버 연동 시 교체 필요)
- GitHub API 비인증 호출로 분당 10회 요청 제한이 있으며, 초과하면 안내된 대기 시간 뒤에 다시 시도해야 함. 또한 GitHub 검색 API는 검색어당 첫 1,000건까지만 제공함
- 다크모드에서 에러 컨테이너 스타일이 일부 미적용될 수 있음 (`.error-container .dark` 선택자 관련)

---

## 배포

현재 프론트엔드만 Vercel에 배포했으며(상단의 배포 사이트 주소 참고), 별도의 백엔드는 없습니다.

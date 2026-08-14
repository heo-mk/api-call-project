# GitFind Dashboard

GitHub REST API 기반 레포지토리 검색 대시보드입니다. 키워드로 레포지토리를 검색하고, 무한 스크롤로 결과를 탐색하며, 마음에 드는 레포를 즐겨찾기에 등록해 영구 저장할 수 있습니다.

TanStack Query의 주요 패턴(Infinite Query, Optimistic Update)과 Zustand persist 미들웨어를 실전 구조로 검증하기 위해 만든 프로젝트입니다.

---
<img width="1346" height="863" alt="KakaoTalk_20260814_170109730_03" src="https://github.com/user-attachments/assets/c0e0d7b8-be34-4915-85d6-f17566557865" />
<img width="1277" height="1221" alt="KakaoTalk_20260814_170109730" src="https://github.com/user-attachments/assets/95c14261-f012-480a-ab15-266c3006b3a4" />
<img width="1334" height="1207" alt="KakaoTalk_20260814_170109730_01" src="https://github.com/user-attachments/assets/68f05332-b742-4bd5-b161-6d0ea43839df" />


## 주요 기능

- **GitHub 레포지토리 키워드 검색** — GitHub Search API를 호출해 결과를 카드로 표시
- **무한 스크롤** — 스크롤 시 다음 페이지를 자동으로 이어서 로드
- **즐겨찾기 등록/해제 (낙관적 업데이트)** — 클릭 즉시 UI에 반영되고, 실패 시 자동 롤백
- **즐겨찾기 영구 저장** — `localStorage`에 저장되어 새로고침 후에도 유지
- **라이트/다크 모드** — 테마 설정도 `localStorage`에 저장되어 유지
- **에러 시뮬레이션 토글** — 즐겨찾기 API 실패 상황을 강제로 재현해 롤백 동작을 확인 가능

---

## 기술 스택

| 구분 | 내용 |
|---|---|
| 프레임워크 | React 19 + Vite |
| 언어 | TypeScript |
| 서버 상태 관리 | TanStack React Query v5 (`useInfiniteQuery`, `useMutation`) |
| 클라이언트 상태 관리 | Zustand v5 (`persist` 미들웨어) |
| 스타일 | SCSS (CSS Variables 기반 테마) |
| 아이콘 | lucide-react |

**외부 API**: [GitHub REST API — Search Repositories](https://docs.github.com/en/rest/search)
> 인증 없이 호출하며, 분당 10회 요청 제한이 적용됩니다.

---

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

별도의 환경 변수나 API 키 설정은 필요하지 않습니다 (GitHub API를 비인증으로 호출).

---

## 아키텍처 설계 원칙

- **서버 상태 / 클라이언트 상태 분리**: 검색 결과(서버에서 오는 데이터)는 TanStack Query, 즐겨찾기·테마(로컬에서 관리하는 데이터)는 Zustand로 명확히 구분해 관리합니다.
- **낙관적 업데이트 롤백**: 즐겨찾기 토글 실패 시, 재시도 대신 이전 상태 스냅샷 전체를 복원해 중간 상태 불일치를 방지합니다.
- **무한 스크롤 종료 조건 이중 체크**: GitHub API의 `total_count` 신뢰도 문제를 고려해, 아이템 개수와 누적 합계 두 기준을 함께 확인합니다.

---

## 알려진 제약사항

- 테스트 코드 없음
- 즐겨찾기 API는 실제 서버 없이 `setTimeout`으로 동작을 시뮬레이션 (실 서버 연동 시 교체 필요)
- GitHub API 비인증 호출로 분당 10회 요청 제한 있음
- 다크모드에서 에러 컨테이너 스타일이 일부 미적용될 수 있음 (`.error-container .dark` 선택자 관련)

---

## 배포

현재 별도 배포 환경은 없으며, 로컬 실행 및 데모/포트폴리오 용도로 사용 중입니다.

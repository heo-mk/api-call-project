import { useEffect, useMemo, useState } from 'react'
import { useThemeStore } from './store/useThemeStore'
import { useBookmarkStore } from './store/useBookmarkStore'
import { useBookmarkMutation } from './hooks/useRepoMutations'
import { Sun, Moon, AlertTriangle } from 'lucide-react'
import { SearchInput } from './components/SearchInput'
import { RepoList } from './components/RepoList'
import { BookmarkList } from './components/BookmarkList'
import { useRepoSearch } from './hooks/useRepoSearch'
import type { GithubRepo } from './api/github'

// Lucide v1.x에서는 브랜드 아이콘(Github, Discord 등)이 패키지에서 제거되었으므로, 일관된 스타일링과 의존성 제거를 위해 SVG 컴포넌트로 직접 선언하여 사용합니다.
const GithubIcon = ({ size = 24, ...props }: { size?: number } & React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

/*
  앱의 기본 메인 레이아웃 컴포넌트입니다.
  서버 상태(useRepoSearch)와 클라이언트 상태(useBookmarkStore, useThemeStore)를 명확히 분리하고,
  각 커스텀 훅/스토어에서 필요한 값만 구독하여 불필요한 리렌더링을 최소화합니다.
*/
function App() {
  const { isDarkMode, toggleTheme } = useThemeStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Zustand persist 스토어에서 즐겨찾기 상태와 액션을 구독합니다.
  const { bookmarks, toggleBookmark } = useBookmarkStore()

  // bookmarks 배열을 Set<number>으로 변환합니다. useMemo로 bookmarks 변경 시에만 재연산하여 불필요한 객체 생성을 방지합니다.
  const bookmarkedIds = useMemo(() => new Set(bookmarks.map((b) => b.id)), [bookmarks])

  // 첫 마운트 및 다크모드 변경 시 body 클래스를 동기화하여 화면 테마가 깜빡이지 않도록 합니다.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // useInfiniteQuery 반환값에서 pages 배열을 flat하게 병합하여 단일 repos 배열을 구성합니다.
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useRepoSearch(searchQuery)

  // data.pages는 각 페이지의 GithubSearchResponse 배열이므로 flatMap으로 items를 하나의 배열로 통합합니다.
  const repos = data?.pages.flatMap((page) => page.items) ?? []

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // 에러 시뮤레이션 토글: 헤더의 체크박스로 켜고 렜돈 시 낙관적 업데이트 실패 + 롤백 동작을 검증할 수 있습니다.
  const [shouldSimulateError, setShouldSimulateError] = useState(false)

  // Optimistic Update 훅: 에러 유발 여부를 주입받아 냙관적 업데이트 또는 롤백 경로를 실행합니다.
  const mutation = useBookmarkMutation(shouldSimulateError)

  // 현재 mutation이 진행 중인 repo의 id를 추출합니다. 해당 카드에만 isPending prop을 전달하기 위한 용도입니다.
  const pendingRepoId = mutation.isPending ? mutation.variables?.id : null

  // useMutation을 통해 클릭 이벤트를 처리합니다. 낙관적 업데이트는 훅 내부(onMutate)에서 실행되므로 App에서는 mutate만 호출합니다.
  const handleToggleBookmark = (repo: GithubRepo) => {
    mutation.mutate(repo)
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-inner">
          <div className="logo-container">
            <GithubIcon size={28} />
            <span>GitFind Dashboard</span>
          </div>
          <div className="header-actions">
            {/* 에러 유발 토글: 체크하면 다음 즐겨찾기 토글 시 API 실패 시뮬레이션 + 롤백 확인용 */}
            <label
              className={`error-simulate-label${shouldSimulateError ? ' active' : ''}`}
            >
              <AlertTriangle size={14} />
              <input
                type="checkbox"
                className="error-simulate-checkbox"
                checked={shouldSimulateError}
                onChange={(e) => setShouldSimulateError(e.target.checked)}
              />
              에러 유발
            </label>
            <label className="switch" aria-label="Toggle Theme">
              <input 
                type="checkbox" 
                checked={isDarkMode} 
                onChange={toggleTheme} 
              />
              <span className="slider">
                {isDarkMode ? (
                  <Moon size={14} className="theme-icon-moon" />
                ) : (
                  <Sun size={14} className="theme-icon-sun" />
                )}
              </span>
            </label>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          <div className="search-section">
            <SearchInput onSearch={handleSearch} initialValue={searchQuery} />

            {searchQuery === '' ? (
              <div className="empty-state">
                <h2>GitHub 레포지토리 검색</h2>
                <p className="empty-state-subtitle">
                  Vite, TypeScript, React Query 및 Zustand 연동 환경이 구성되었습니다.
                </p>
                <p className="empty-state-hint">
                  검색창에 키워드를 입력하고 검색을 시작해 보세요! (예: react, zustand)
                </p>
              </div>
            ) : isLoading ? (
              <div className="loader-container">
                <div className="spinner" />
                <span>검색 결과를 불러오는 중...</span>
              </div>
            ) : isError ? (
              <div className="error-container">
                <p>오류가 발생했습니다: {error instanceof Error ? error.message : '알 수 없는 오류'}</p>
              </div>
            ) : data ? (
              <>
                {/* mutation 에러 발생 시 롤백 알림 배너: 에러 메시지를 상단에 표시하여 사용자가 실패를 인지할 수 있게 합니다. */}
                {mutation.isError && (
                  <div className="error-container error-container--with-margin">
                    <p>⚠️ {mutation.error?.message} (즉시 이전 상태로 롤백되었습니다.)</p>
                  </div>
                )}
                <RepoList
                  repos={repos}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  isFetchingNextPage={isFetchingNextPage}
                  hasNextPage={hasNextPage}
                  fetchNextPage={fetchNextPage}
                  pendingRepoId={pendingRepoId ?? undefined}
                />
              </>
            ) : null}
          </div>

          {/* 즐겨찾기 사이드바: dashboard-grid의 두 번째 열로 배치되어 992px 이상에서 나란히 표시됩니다. */}
          <BookmarkList
            bookmarks={bookmarks}
            onRemove={toggleBookmark}
          />
        </div>
      </main>
    </div>
  )
}

export default App


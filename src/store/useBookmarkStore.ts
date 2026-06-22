import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GithubRepo } from '../api/github'

/*
  즐겨찾기 목록을 전역으로 관리하는 Zustand 스토어입니다.
  ID만 저장하면 사이드바 렌더링 시 다시 API를 호출해야 하므로, GithubRepo 객체 전체를 저장하여 오프라인에서도 즐겨찾기 목록을 완전하게 표시할 수 있도록 설계했습니다.
*/
interface BookmarkState {
  bookmarks: GithubRepo[]
  toggleBookmark: (repo: GithubRepo) => void
  isBookmarked: (id: number) => boolean
  setBookmarks: (bookmarks: GithubRepo[]) => void // onError 롤백 전용
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      // 북마크를 추가하거나 제거합니다. Set 연산 대신 배열 filter/concat을 사용하여 직렬화(JSON) 호환성을 보장합니다.
      toggleBookmark: (repo: GithubRepo) =>
        set((state) => {
          const exists = state.bookmarks.some((b) => b.id === repo.id)
          return {
            bookmarks: exists
              ? state.bookmarks.filter((b) => b.id !== repo.id)
              : [...state.bookmarks, repo],
          }
        }),

      // 특정 레포가 즐겨찾기 되어 있는지 확인하는 셀렉터 함수입니다.
      isBookmarked: (id: number) => get().bookmarks.some((b) => b.id === id),

      // useMutation onError에서 낙관적 업데이트 실패 시 이전 상태로 복원하기 위해 사용합니다.
      setBookmarks: (bookmarks: GithubRepo[]) => set({ bookmarks }),
    }),
    {
      name: 'bookmark-storage', // 로컬 스토리지 키
    }
  )
)


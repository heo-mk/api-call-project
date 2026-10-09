import { useMutation } from '@tanstack/react-query'
import type { GithubRepo } from '../api/github'
import { simulateBookmarkToggle } from '../api/bookmark'
import { useBookmarkStore } from '../store/useBookmarkStore'

interface MutationContext {
  wasBookmarked: boolean
}

/*
  Optimistic Update + Rollback 패턴을 구현하는 useMutation 훅입니다.
  실제 서버 응답을 기다리지 않고 onMutate에서 즉시 Zustand 상태를 변경(낙관적 업데이트)하고,
  onError에서 누른 레포 하나만 원래 상태로 되돌려 다른 요청의 결과와 서로 영향을 주지 않도록 합니다.
*/
export const useBookmarkMutation = (shouldSimulateError: boolean) => {
  const { toggleBookmark, setBookmarks } = useBookmarkStore()

  return useMutation<void, Error, GithubRepo, MutationContext>({
    mutationFn: () => simulateBookmarkToggle(shouldSimulateError),

    onMutate: async (repo) => {
      /*
        onMutate는 mutationFn 실행 전에 동기적으로 호출됩니다.
        누른 순간 이 레포가 즐겨찾기였는지만 기록해 두고, 즉시 UI를 업데이트합니다(낙관적).
        목록 전체가 아니라 레포 하나의 원래 상태만 저장하므로 다른 요청과 겹쳐도 안전합니다.
      */
      const wasBookmarked = useBookmarkStore
        .getState()
        .bookmarks.some((b) => b.id === repo.id)
      toggleBookmark(repo) // 즉시 Zustand 상태 업데이트 (낙관적)
      return { wasBookmarked }
    },

    onError: (_error, repo, context) => {
      /*
        API 실패 시 그 순간의 목록에서 이 레포만 원래 상태로 맞춥니다.
        원래 있었는데 지금 없으면 추가하고, 원래 없었는데 지금 있으면 제거합니다.
        다른 레포의 상태는 건드리지 않으므로 겹친 요청의 결과가 유지됩니다.
      */
      if (!context) return
      const current = useBookmarkStore.getState().bookmarks
      const isBookmarked = current.some((b) => b.id === repo.id)
      if (context.wasBookmarked && !isBookmarked) {
        setBookmarks([...current, repo])
      } else if (!context.wasBookmarked && isBookmarked) {
        setBookmarks(current.filter((b) => b.id !== repo.id))
      }
    },
  })
}

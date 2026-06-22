import { useMutation } from '@tanstack/react-query'
import type { GithubRepo } from '../api/github'
import { simulateBookmarkToggle } from '../api/bookmark'
import { useBookmarkStore } from '../store/useBookmarkStore'

interface MutationContext {
  previousBookmarks: GithubRepo[]
}

/*
  Optimistic Update + Rollback 패턴을 구현하는 useMutation 훅입니다.
  실제 서버 응답을 기다리지 않고 onMutate에서 즉시 Zustand 상태를 변경(낙관적 업데이트)하고,
  onError에서 저장해 둔 이전 상태로 복원(롤백)하여 사용자 경험을 극대화합니다.
*/
export const useBookmarkMutation = (shouldSimulateError: boolean) => {
  const { toggleBookmark, bookmarks, setBookmarks } = useBookmarkStore()

  return useMutation<void, Error, GithubRepo, MutationContext>({
    mutationFn: (_repo) => simulateBookmarkToggle(shouldSimulateError),

    onMutate: async (repo) => {
      /*
        onMutate는 mutationFn 실행 전에 동기적으로 호출됩니다.
        이전 상태를 context에 저장해두고, 즉시 UI를 업데이트하는 것이 Optimistic Update의 핵심입니다.
      */
      const previousBookmarks = [...bookmarks]
      toggleBookmark(repo) // 즉시 Zustand 상태 업데이트 (낙관적)
      return { previousBookmarks }
    },

    onError: (_error, _repo, context) => {
      /*
        API 실패 시 onMutate에서 저장한 이전 북마크 목록으로 전체 상태를 복원합니다.
        toggleBookmark를 다시 호출하는 대신 setBookmarks로 이전 스냅샷을 직접 덮어써
        중간 상태 불일치 없이 완전한 롤백을 보장합니다.
      */
      if (context) {
        setBookmarks(context.previousBookmarks)
      }
    },
  })
}

import { useInfiniteQuery } from '@tanstack/react-query'
import { searchRepos } from '../api/github'

/*
  TanStack Query의 useInfiniteQuery를 사용하여 페이지 단위로 데이터를 누적 로드합니다.
  getNextPageParam에서 현재 페이지의 아이템 수가 perPage(10)와 같을 경우에만 다음 페이지 번호를 반환하여, 마지막 페이지 도달 시 자동으로 더 이상 로드하지 않도록 합니다.
*/
export const useRepoSearch = (query: string) => {
  return useInfiniteQuery({
    queryKey: ['repos', query],
    queryFn: ({ pageParam = 1 }) => searchRepos(query, pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지의 아이템 수가 10개보다 적으면 더 이상 가져올 페이지가 없음을 의미합니다.
      const fetchedCount = allPages.reduce((sum, p) => sum + p.items.length, 0)
      if (lastPage.items.length < 10 || fetchedCount >= lastPage.total_count) {
        return undefined
      }
      return allPages.length + 1
    },
    enabled: !!query.trim(),
    staleTime: 1000 * 60 * 5,
  })
}

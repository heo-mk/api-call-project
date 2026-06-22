import React, { useEffect, useRef } from 'react'
import type { GithubRepo } from '../api/github'
import { RepoCard } from './RepoCard'

interface RepoListProps {
  repos: GithubRepo[]
  bookmarkedIds: Set<number>
  onToggleBookmark: (repo: GithubRepo) => void
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  pendingRepoId?: number // 현재 mutation 진행 중인 repo id: 해당 카드에만 isPending을 전달합니다.
}

/*
  레포지토리 목록을 렌더링하고 Intersection Observer로 무한 스크롤을 구현합니다.
  sentinel div가 뷰포트에 진입하는 순간 fetchNextPage를 트리거하여, 사용자가 스크롤 이벤트를 polling하지 않고도 자연스럽게 다음 페이지를 로드할 수 있게 합니다.
*/
export const RepoList: React.FC<RepoListProps> = ({
  repos,
  bookmarkedIds,
  onToggleBookmark,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  pendingRepoId,
}) => {
  // 스크롤 하단 감지를 위한 sentinel 요소 참조입니다.
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    /*
      IntersectionObserver를 사용하여 sentinel이 뷰포트에 진입할 때 다음 페이지를 요청합니다.
      scroll 이벤트 리스너 방식보다 브라우저 네이티브 API를 활용해 성능 부담이 훨씬 적습니다.
    */
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (repos.length === 0) {
    return (
      <div className="empty-state">
        <p>검색 결과가 없습니다. 다른 키워드로 검색해 보세요!</p>
      </div>
    )
  }

  return (
    <>
      <div className="list-container">
        {repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            isBookmarked={bookmarkedIds.has(repo.id)}
            onToggleBookmark={onToggleBookmark}
            isPending={pendingRepoId === repo.id}
          />
        ))}
      </div>

      {/* Intersection Observer 감지용 sentinel 요소 */}
      <div ref={sentinelRef} style={{ height: '1px' }} />

      {isFetchingNextPage && (
        <div className="loader-container">
          <div className="spinner" />
          <span>더 불러오는 중...</span>
        </div>
      )}

      {!hasNextPage && repos.length > 0 && (
        <p style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          모든 결과를 불러왔습니다.
        </p>
      )}
    </>
  )
}

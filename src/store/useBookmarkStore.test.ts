import { beforeEach, describe, expect, it } from 'vitest'
import type { GithubRepo } from '../api/github'
import { useBookmarkStore } from './useBookmarkStore'

const makeRepo = (id: number): GithubRepo => ({
  id,
  name: `repo-${id}`,
  full_name: `owner/repo-${id}`,
  owner: { login: 'owner', avatar_url: '', html_url: '' },
  html_url: '',
  description: null,
  stargazers_count: 0,
  forks_count: 0,
  language: null,
})

describe('useBookmarkStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useBookmarkStore.setState({ bookmarks: [] })
  })

  it('toggleBookmark로 추가했다가 다시 호출하면 해제된다', () => {
    const repo = makeRepo(1)
    useBookmarkStore.getState().toggleBookmark(repo)
    expect(useBookmarkStore.getState().bookmarks).toEqual([repo])
    expect(useBookmarkStore.getState().isBookmarked(1)).toBe(true)

    useBookmarkStore.getState().toggleBookmark(repo)
    expect(useBookmarkStore.getState().bookmarks).toEqual([])
    expect(useBookmarkStore.getState().isBookmarked(1)).toBe(false)
  })

  it('setBookmarks는 목록 전체를 교체한다', () => {
    useBookmarkStore.getState().toggleBookmark(makeRepo(1))
    const next = [makeRepo(2), makeRepo(3)]
    useBookmarkStore.getState().setBookmarks(next)
    expect(useBookmarkStore.getState().bookmarks).toEqual(next)
  })
})

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { GithubRepo } from '../api/github'
import { useBookmarkStore } from '../store/useBookmarkStore'
import { useBookmarkMutation } from './useRepoMutations'

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
const A = makeRepo(1)
const B = makeRepo(2)

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const ids = () => useBookmarkStore.getState().bookmarks.map((b) => b.id)

describe('useBookmarkMutation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    useBookmarkStore.setState({ bookmarks: [A] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('실패 켬: 즉시 [A,B], 1500ms 후 [A]로 롤백', async () => {
    const { result } = renderHook(() => useBookmarkMutation(true), { wrapper })
    act(() => {
      result.current.mutate(B)
    })
    expect(ids()).toEqual([1, 2])

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })
    expect(ids()).toEqual([1])
  })

  it('실패 끔: 1500ms 후에도 [A,B] 유지', async () => {
    const { result } = renderHook(() => useBookmarkMutation(false), { wrapper })
    act(() => {
      result.current.mutate(B)
    })
    expect(ids()).toEqual([1, 2])

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })
    expect(ids()).toEqual([1, 2])
  })
})

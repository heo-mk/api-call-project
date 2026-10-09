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
const C = makeRepo(3)

const wrapper = ({ children }: { children: ReactNode }) => {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const ids = () => useBookmarkStore.getState().bookmarks.map((b) => b.id)

describe('useBookmarkMutation 겹치는 요청', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    useBookmarkStore.setState({ bookmarks: [A] })
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('실패 켬: B 요청 중 C를 요청해도 1500ms 후 목록이 [A]와 같다', async () => {
    const { result, rerender } = renderHook(() => useBookmarkMutation(true), {
      wrapper,
    })
    act(() => {
      result.current.mutate(B)
    })
    rerender()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    act(() => {
      result.current.mutate(C)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1500)
    })
    expect(ids()).toEqual([1])
  })

  it('실패 켬 B 요청 후 실패 끔 C 요청: 모두 끝나면 목록이 [A, C]', async () => {
    const { result, rerender } = renderHook(
      ({ fail }: { fail: boolean }) => useBookmarkMutation(fail),
      { wrapper, initialProps: { fail: true } },
    )
    await act(async () => {
      result.current.mutate(B)
    })
    rerender({ fail: false })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
    act(() => {
      result.current.mutate(C)
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000)
    })
    expect(ids()).toEqual([1, 3])
  })
})

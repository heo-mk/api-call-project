import { describe, expect, it } from 'vitest'
import type { GithubRepo, GithubSearchResponse } from '../api/github'
import { getNextPageParam } from './useRepoSearch'

const item = {} as GithubRepo
const page = (count: number, total: number): GithubSearchResponse => ({
  total_count: total,
  incomplete_results: false,
  items: Array.from({ length: count }, () => item),
})

describe('getNextPageParam', () => {
  it('마지막 페이지가 10건 미만이면 undefined', () => {
    const pages = [page(10, 100), page(5, 100)]
    expect(getNextPageParam(pages[1], pages)).toBeUndefined()
  })

  it('누적 건수가 total_count 이상이면 undefined', () => {
    const pages = [page(10, 20), page(10, 20)]
    expect(getNextPageParam(pages[1], pages)).toBeUndefined()
  })

  it('누적 1000건(total_count 7000)이면 undefined', () => {
    const pages = Array.from({ length: 100 }, () => page(10, 7000))
    expect(getNextPageParam(pages[99], pages)).toBeUndefined()
  })

  it('그 외에는 allPages.length + 1', () => {
    const pages = [page(10, 100), page(10, 100)]
    expect(getNextPageParam(pages[1], pages)).toBe(3)
  })
})

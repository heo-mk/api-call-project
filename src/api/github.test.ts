import { afterEach, describe, expect, it, vi } from 'vitest'
import { RateLimitError, getRetryAfterSeconds, searchRepos } from './github'

describe('getRetryAfterSeconds', () => {
  it('retry-after가 있으면 그 값을 우선 사용한다', () => {
    expect(getRetryAfterSeconds('30', '2000', 0)).toBe(30)
  })

  it('retry-after가 없으면 reset - 현재 시각(초)을 쓴다', () => {
    expect(getRetryAfterSeconds(null, '1060', 1_000_000)).toBe(60)
  })

  it('헤더가 둘 다 없으면 null', () => {
    expect(getRetryAfterSeconds(null, null, 1_000_000)).toBeNull()
  })
})

describe('searchRepos 한도 초과', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('403 응답이면 RateLimitError를 던진다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('{}', { status: 403, headers: { 'retry-after': '45' } })
      )
    )
    const error = await searchRepos('react').catch((e) => e)
    expect(error).toBeInstanceOf(RateLimitError)
    expect(error.retryAfterSeconds).toBe(45)
  })
})

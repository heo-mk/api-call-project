/*
  GitHub REST API를 사용하여 레포지토리 검색 기능을 수행하는 모듈입니다.
  네이티브 fetch API를 사용해 별도의 HTTP 클라이언트 라이브러리(Axios 등) 설치 없이 가볍고 표준적인 방식으로 비동기 요청을 처리합니다.
*/

export interface GithubRepo {
  id: number
  name: string
  full_name: string
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
}

export interface GithubSearchResponse {
  total_count: number
  incomplete_results: boolean
  items: GithubRepo[]
}

// GitHub Search Repositories API를 호출하는 헬퍼 함수입니다.
export const searchRepos = async (
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<GithubSearchResponse> => {
  if (!query.trim()) {
    return { total_count: 0, incomplete_results: false, items: [] }
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('GitHub API 요청에 실패했습니다.')
  }

  return response.json()
}

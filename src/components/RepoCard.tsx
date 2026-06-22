import React from 'react'
import { Star, GitFork } from 'lucide-react'
import type { GithubRepo } from '../api/github'

interface RepoCardProps {
  repo: GithubRepo
  isBookmarked: boolean
  onToggleBookmark: (repo: GithubRepo) => void
  isPending?: boolean // mutation 진행 중 비활성화 상태를 표시하기 위한 선택적 prop
}

/*
  개별 GitHub 레포지토리의 정보를 카드 형태의 UI로 렌더링하는 순수 컴포넌트입니다.
  비즈니스 로직(즐겨찾기 추가/제거)을 직접 갖지 않고 Props로 전달받은 데이터와 핸들러에만 의존하도록 설계하여 UI 렌더링의 관심사만 독립시켰습니다.
*/
export const RepoCard: React.FC<RepoCardProps> = ({ repo, isBookmarked, onToggleBookmark, isPending = false }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-name"
          >
            {repo.name}
          </a>
          <div className="repo-owner">by {repo.owner.login}</div>
        </div>
        <button
          onClick={() => !isPending && onToggleBookmark(repo)}
          className={`icon-btn ${isBookmarked ? 'active' : ''}`}
          aria-label="Toggle Bookmark"
          disabled={isPending}
          style={{
            // API 응답 대기 중 시각적 피드백: 반투명 + 폄인터 변경으로 다른 버튼과 명확히 구분합니다.
            opacity: isPending ? 0.4 : 1,
            cursor: isPending ? 'wait' : 'pointer',
            transition: 'opacity 0.2s ease',
          }}
        >
          <Star
            size={20}
            fill={isBookmarked ? 'currentColor' : 'none'}
            style={isPending ? { animation: 'spin 1s linear infinite' } : {}}
          />
        </button>
      </div>

      <p className="repo-desc">{repo.description || '설명이 없습니다.'}</p>

      <div className="card-footer">
        <div className="footer-item">
          <Star size={16} />
          <span>{repo.stargazers_count.toLocaleString()}</span>
        </div>
        <div className="footer-item">
          <GitFork size={16} />
          <span>{repo.forks_count.toLocaleString()}</span>
        </div>
        {repo.language && (
          <div className="footer-item">
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                display: 'inline-block',
              }}
            />
            <span>{repo.language}</span>
          </div>
        )}
      </div>
    </div>
  )
}


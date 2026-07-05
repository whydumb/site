import {
  ArrowRight,
  BarChart3,
  Check,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const outcomes = [
  { value: "42%", label: "반복 업무 처리 시간 감소" },
  { value: "3.8x", label: "팀 지식 검색 속도 향상" },
  { value: "99.9%", label: "업무 데이터 보호 설계" },
];

const capabilities = [
  {
    icon: Workflow,
    title: "업무 흐름 자동화",
    text: "문서 검토, 고객 응대, 내부 승인처럼 반복되는 프로세스를 팀의 규칙에 맞춰 연결합니다.",
  },
  {
    icon: Network,
    title: "사내 지식 연결",
    text: "정책, 매뉴얼, 회의 기록, 제품 문서를 검색 가능한 지식 계층으로 정리합니다.",
  },
  {
    icon: BarChart3,
    title: "의사결정 보조",
    text: "영업, 운영, 재무 데이터를 한 화면에서 요약하고 다음 행동을 제안합니다.",
  },
];

const teams = ["영업", "고객지원", "제품", "운영", "재무", "인사"];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="NOVA Business AI 홈">
          <span className="brand-symbol" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          NOVA Business AI
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#platform">플랫폼</a>
          <a href="#solutions">솔루션</a>
          <Link href="/team">팀</Link>
          <a href="#security">보안</a>
          <a href="#contact">문의</a>
        </nav>
        <a className="header-action" href="#contact">
          상담하기
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </header>

      <section className="hero" id="top">
        <Image
          className="hero-image"
          src="/images/enterprise-ai-hero.png"
          alt=""
          priority
          fill
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Enterprise AI Platform</p>
          <h1>
            <span className="title-line">기업의 일을 더 빠르고</span>
            <span className="title-line">정확하게 만드는 AI</span>
          </h1>
          <p className="hero-copy">
            팀의 데이터, 정책, 워크플로를 하나로 연결해 매일 반복되는 업무를 자동화하고 더 나은 결정을 돕습니다.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#contact">
              도입 상담
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-action" href="#platform">
              플랫폼 보기
            </a>
          </div>
        </div>
      </section>

      <section className="outcome-strip" aria-label="성과 지표">
        {outcomes.map((item) => (
          <div className="outcome" key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="platform">
        <div className="section-heading">
          <p className="eyebrow">Platform</p>
          <h2>업무 현장에 맞게 조립되는 AI 기반</h2>
          <p>
            모델, 데이터, 권한, 감사 로그를 하나의 운영 레이어로 묶어 부서별 도구가 같은 기준으로 작동하게 합니다.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article className="capability" key={title}>
              <Icon size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="solutions">
        <div>
          <p className="eyebrow">Solutions</p>
          <h2>팀별로 바로 적용할 수 있는 업무 AI</h2>
          <p>
            각 팀의 언어와 승인 체계에 맞춰 에이전트를 배치하고, 기존 도구와 연결해 실제 업무 흐름 안에서 작동합니다.
          </p>
          <div className="team-list" aria-label="적용 가능한 팀">
            {teams.map((team) => (
              <span key={team}>{team}</span>
            ))}
          </div>
        </div>
        <div className="workflow-panel" aria-label="자동화 흐름 예시">
          <div className="flow-row">
            <span>요청 수집</span>
            <Check size={18} aria-hidden="true" />
          </div>
          <div className="flow-row">
            <span>정책 확인</span>
            <Check size={18} aria-hidden="true" />
          </div>
          <div className="flow-row active">
            <span>AI 초안 생성</span>
            <Zap size={18} aria-hidden="true" />
          </div>
          <div className="flow-row">
            <span>담당자 승인</span>
            <Check size={18} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="security-band" id="security">
        <div className="security-copy">
          <p className="eyebrow">Security</p>
          <h2>기업 데이터를 위한 통제와 투명성</h2>
          <p>
            역할 기반 접근, 감사 가능한 활동 기록, 데이터 격리 정책으로 AI 활용 범위를 조직 기준에 맞게 관리합니다.
          </p>
        </div>
        <div className="security-items">
          <div>
            <ShieldCheck size={24} aria-hidden="true" />
            <span>권한 기반 접근 제어</span>
          </div>
          <div>
            <LockKeyhole size={24} aria-hidden="true" />
            <span>암호화 및 감사 로그</span>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p className="eyebrow">Get Started</p>
        <h2>AI 업무 전환을 시작하세요</h2>
        <p>현재 사용하는 도구와 팀 구조에 맞춰 도입 범위, 보안 기준, 초기 자동화 후보를 함께 설계합니다.</p>
        <a className="primary-action dark" href="mailto:hello@example.com">
          문의 메일 보내기
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>

      <footer>
        <span>NOVA Business AI</span>
        <span>업무용 AI 플랫폼 데모</span>
      </footer>
    </main>
  );
}

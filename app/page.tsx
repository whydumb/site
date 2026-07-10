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
import Link from "next/link";

const outcomes = [
  { value: "42%", label: "반복 업무 처리 시간 감소" },
  { value: "3.8x", label: "팀 지식 검색 속도 향상" },
  { value: "99.9%", label: "업무 데이터 보호 설계" },
];

const capabilities = [
  {
    icon: Workflow,
    title: "Continual Learning",
    text: " We share our algorithmic research achievements that overcome 'catastrophic forgetting,' enabling continuous, lifelong learning just like humans without losing previously acquired knowledge",
  },
  {
    icon: Network,
    title: "Open source",
    text: "We are making all our work public to advance the AI research ecosystem.",
  },
  {
    icon: BarChart3,
    title: "Architecture Research",
    text: "We are sharing the experimental results of a next-generation architecture that goes beyond the Transformer, enabling logical reasoning beyond human levels.",
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
          Alicia
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#platform">플랫폼</a>
          <a href="#solutions">솔루션</a>
          <Link href="/team">팀</Link>
          <Link href="/organization">조직도</Link>
          <a href="#security">보안</a>
          <a href="#contact">문의</a>
        </nav>
        <a className="header-action" href="#contact">
          상담하기
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </header>

      <section className="hero" id="top">
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/duck-background.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">INDEPENDENT AGI RESEARCH</p>
          <h1>
            <span className="title-line">Exploring the unknown universe of AGI</span>
          </h1>
          <p className="hero-copy">
            Fundamental AI research that turns imagination into reality. A small yet agile independent research team is laying the groundwork for Artificial General Intelligence (AGI), pushing the boundaries of technology
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#contact">
              Explore Our Journey
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-action" href="#platform">
              Research
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
          <h2>RESEARCH</h2>
          <p>
             Beyond the current boundaries of AI. We are dedicated to open collaboration, making every step of our research transparent—from publishing research papers to open-sourcing our models..
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

import {
  ArrowRight,
  BrainCircuit,
  DatabaseZap,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    initials: "BC",
    name: "Benjamin Crouzier",
    role: "Founder & Research Engineer",
    bio: "연구 아이디어를 빠르게 시스템으로 옮기는 빌더입니다. 테스트 타임 계산, 자동 커리큘럼, 탐색과 셀프플레이 같은 주제에 집중합니다.",
    focus: ["test-time compute", "self-play", "scaling laws"],
  },
  {
    initials: "MO",
    name: "Mohamed Osman",
    role: "AI Researcher",
    bio: "딥러닝 모델 개발과 실제 배포 경험을 바탕으로, 데이터가 적거나 환경이 바뀌는 상황에서도 학습하는 모델을 연구합니다.",
    focus: ["meta learning", "reasoning", "few-shot"],
  },
  {
    initials: "AY",
    name: "Akira Yoshiyama",
    role: "AI Researcher",
    bio: "LLM 융합과 생성형 ML 응용을 다룹니다. 항공우주, 보안 분석, 자율 시스템처럼 다양한 기술 현장에서 쌓은 경험을 연구로 연결합니다.",
    focus: ["LLM fusion", "generative ML", "autonomous systems"],
  },
  {
    initials: "DS",
    name: "Dries Smit",
    role: "AI Researcher",
    bio: "강화학습, 멀티에이전트 시스템, 대형 언어 모델을 연구합니다. 생명과학과 금융 영역에서 모델을 실제 문제에 적용해 온 경험이 있습니다.",
    focus: ["reinforcement learning", "multi-agent", "LLMs"],
  },
  {
    initials: "DG",
    name: "Dominique Garmier",
    role: "AI Researcher",
    bio: "수학과 해석학을 기반으로 추론, 형식 증명, 통계적 학습 이론을 탐구합니다. 동역학과 함수해석의 관점도 함께 다룹니다.",
    focus: ["reasoning", "formal proofs", "dynamical systems"],
  },
  {
    initials: "IP",
    name: "Isaiah Pressman",
    role: "AI Researcher",
    bio: "셀프플레이 강화학습과 대규모 모델 훈련 기술에 집중하는 연구 엔지니어입니다. 가격 모델링과 의료 영상 분석 경험도 갖고 있습니다.",
    focus: ["self-play", "in-context learning", "reasoning models"],
  },
  {
    initials: "JS",
    name: "Jerome Sieber",
    role: "AI Researcher",
    bio: "제어 이론과 시퀀스 모델 아키텍처를 연구해 왔습니다. 로보틱스, 동역학, 추론 모델의 기초를 함께 탐구합니다.",
    focus: ["sequence models", "control theory", "optimization"],
  },
  {
    initials: "SV",
    name: "Stefano Viel",
    role: "AI Researcher",
    bio: "데이터 과학 배경 위에서 강화학습, 대형 언어 모델, 계산 사회과학을 연구합니다. 환경 설계와 합성 데이터에도 관심이 있습니다.",
    focus: ["reinforcement learning", "synthetic data", "LLMs"],
  },
  {
    initials: "JC",
    name: "Jeroen Cottaar",
    role: "AI Researcher",
    bio: "응용물리와 산업 ML 경험을 바탕으로 베이지안 방법과 LLM 추론을 연결합니다. 과학적 머신러닝과 프로그램 합성에도 집중합니다.",
    focus: ["Bayesian inference", "program synthesis", "scientific ML"],
  },
  {
    initials: "TH",
    name: "Tommy He",
    role: "AI Researcher",
    bio: "수학, 컴퓨터과학, 암호학과 ML 연구를 거쳐 AI 에이전트와 고성능 시스템을 만들어 왔습니다. 학습 시스템의 해석 가능성에도 관심이 있습니다.",
    focus: ["RL", "interpretability", "AI agents"],
  },
  {
    initials: "MT",
    name: "Michal Tesnar",
    role: "AI Researcher",
    bio: "데이터 과학과 딥러닝의 수학적 기반을 공부하며, 로보틱스의 지속 학습과 확산 모델 기반 추론을 연구합니다.",
    focus: ["post-training", "long context", "uncertainty"],
  },
  {
    initials: "VM",
    name: "Victor Mercklé",
    role: "AI Researcher",
    bio: "강화학습과 딥러닝 배경을 가진 연구자입니다. 신경망 최적화 이론, LLM 시스템, 에이전트, 게임과 논리 문제 탐색을 다룹니다.",
    focus: ["game AI", "search", "coding agents"],
  },
  {
    initials: "AR",
    name: "Andrin Rehmann",
    role: "AI Researcher",
    bio: "계산과학 배경으로 미분 가능한 시스템, 역설계, 신경 서러게이트를 연구했습니다. 그래픽스, HPC, 천체물리 시뮬레이션 경험도 있습니다.",
    focus: ["scientific ML", "inverse design", "rendering"],
  },
  {
    initials: "AA",
    name: "Angus Adams",
    role: "Head of Operations",
    bio: "재무, 법무, 채용, 이전, 인프라 조달과 내부 도구를 운영합니다. 연구팀이 더 빠르게 움직이도록 운영 계층을 정리합니다.",
    focus: ["operations", "finance", "team infrastructure"],
  },
];

const disciplines = [
  { icon: BrainCircuit, label: "Research" },
  { icon: DatabaseZap, label: "Platform" },
  { icon: UsersRound, label: "Solutions" },
  { icon: ShieldCheck, label: "Trust" },
];

export default function TeamPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="NOVA Business AI 홈">
          <span className="brand-symbol" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          NOVA Business AI
        </Link>
        <nav aria-label="주요 메뉴">
          <Link href="/#platform">플랫폼</Link>
          <Link href="/#solutions">솔루션</Link>
          <Link href="/team" aria-current="page">
            팀
          </Link>
          <Link href="/organization">조직도</Link>
          <Link href="/#security">보안</Link>
          <Link href="/#contact">문의</Link>
        </nav>
        <Link className="header-action" href="/#contact">
          상담하기
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <section className="team-hero">
        <div className="team-hero-copy">
          <p className="eyebrow">Our Team</p>
          <h1>Our Team</h1>
          <p>
            연구자, 엔지니어, 운영 담당자가 함께 모델 추론, 강화학습, 자동화, 연구 운영의 경계를 넓혀갑니다.
          </p>
        </div>
        <div className="rhythm-panel" aria-label="팀 전문 영역">
          <FlaskConical size={28} aria-hidden="true" />
          {disciplines.map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon size={17} aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="people-section" aria-label="NOVA Business AI 팀원">
        <div className="people-grid">
          {teamMembers.map((member) => (
            <article className="person-card" key={member.name}>
              <div className="person-avatar" aria-hidden="true">
                {member.initials}
              </div>
              <div className="person-copy">
                <h2>{member.name}</h2>
                <p className="person-role">{member.role}</p>
                <p>{member.bio}</p>
                <div className="focus-list" aria-label={`${member.name} 관심 영역`}>
                  {member.focus.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section compact">
        <p className="eyebrow">Work With Us</p>
        <h2>팀의 일하는 방식까지 함께 설계합니다</h2>
        <p>한 부서의 파일럿에서 시작해 평가, 권한, 교육, 운영 기준을 붙이며 전사 AI 운영 모델로 확장합니다.</p>
      </section>

      <footer>
        <span>NOVA Business AI</span>
        <span>팀 페이지</span>
      </footer>
    </main>
  );
}

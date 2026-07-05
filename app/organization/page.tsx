import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Landmark,
  MessagesSquare,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const researchBoard = [
  "Mohamed Osman",
  "Akira Yoshiyama",
  "Dries Smit",
  "Dominique Garmier",
  "Isaiah Pressman",
];

const programLeads = ["Stefano Viel", "Jeroen Cottaar"];
const programResearchers = ["Tommy He", "Michal Tesnar", "Victor Mercklé"];

export default function OrganizationPage() {
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
          <Link href="/team">팀</Link>
          <Link href="/organization" aria-current="page">
            조직도
          </Link>
          <Link href="/#security">보안</Link>
          <Link href="/#contact">문의</Link>
        </nav>
        <Link className="header-action" href="/#contact">
          상담하기
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <section className="chart-page">
        <div className="chart-heading">
          <p className="eyebrow">Organization Chart</p>
          <h1>조직도</h1>
          <p>팀 페이지의 구성원 이름을 기준으로 연구, 운영, 프로그램 조직 흐름을 정리했습니다.</p>
        </div>

        <div className="org-diagram" aria-label="조직도">
          <div className="diagram-top">
            <div className="diagram-icon chief-icon" aria-hidden="true">
              <UserRound size={64} strokeWidth={2.3} />
            </div>
            <div className="yellow-node top-node">Benjamin Crouzier</div>
            <p className="member-list">Founder & Research Engineer</p>
          </div>

          <div className="diagram-branches">
            <article className="diagram-column auditor">
              <div className="diagram-icon" aria-hidden="true">
                <ClipboardCheck size={58} strokeWidth={2.2} />
              </div>
              <div className="yellow-node">Operations</div>
              <p className="member-list">Angus Adams</p>
            </article>

            <article className="diagram-column board">
              <div className="diagram-icon" aria-hidden="true">
                <UsersRound size={64} strokeWidth={2.2} />
              </div>
              <div className="yellow-node">Research Board</div>
              <ul className="member-list">
                {researchBoard.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </article>

            <article className="diagram-column chair">
              <div className="diagram-icon" aria-hidden="true">
                <Landmark size={64} strokeWidth={2.2} />
              </div>
              <div className="yellow-node">Jerome Sieber</div>

              <div className="division-row">
                {programLeads.map((member) => (
                  <span key={member}>{member}</span>
                ))}
              </div>

              <div className="team-row">
                {programResearchers.map((member) => (
                  <span key={member}>{member}</span>
                ))}
              </div>
            </article>

            <article className="diagram-column committee">
              <div className="diagram-icon" aria-hidden="true">
                <BarChart3 size={58} strokeWidth={2.2} />
                <MessagesSquare size={34} strokeWidth={2.2} />
              </div>
              <div className="yellow-node">Scientific Systems</div>
              <p className="member-list">Andrin Rehmann</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

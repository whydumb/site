import type { Metadata } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import MotionConsole from "./motion-console";
import "./motion.css";

export const metadata: Metadata = {
  title: "Motion Console | Alicia",
  description: "텍스트 명령으로 3D 캐릭터 애니메이션을 제어하는 데모",
};

export default function MotionPage() {
  return (
    <main className="motion-page">
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Alicia 홈">
          <span className="brand-symbol" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          Alicia
        </Link>
        <nav aria-label="주요 메뉴">
          <Link href="/#platform">플랫폼</Link>
          <Link href="/#solutions">솔루션</Link>
          <Link href="/team">팀</Link>
          <Link href="/organization">조직도</Link>
          <Link href="/motion" aria-current="page">
            모션
          </Link>
          <Link href="/#contact">문의</Link>
        </nav>
        <Link className="header-action" href="/#contact">
          상담하기
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </header>

      <MotionConsole />
    </main>
  );
}

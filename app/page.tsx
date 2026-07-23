import {
  ArrowRight,
  BarChart3,
  Network,
  Sparkles,
  Workflow,
} from "lucide-react";

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

export default function Home() {
  return (
    <main>
      <header className="site-header clear-header">
        <span className="brand">
          <span className="brand-symbol" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          Alicia
        </span>
        <a className="header-action" href="#contact">
          연락
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

      <section className="agi-band" id="solutions" aria-label="AGI 비전">
        <video
          className="agi-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/CLIP_2.MP4" type="video/mp4" />
        </video>
        <div className="agi-shade" />
        <div className="agi-content">
          <h2>AGI solves real-world problems</h2>
        </div>
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

      <section className="safety-band" id="security" aria-label="안전성과 투명성">
        <video
          className="safety-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/videos/CLIP_3.MP4" type="video/mp4" />
        </video>
        <div className="safety-shade" />
        <div className="safety-content">
          <p className="eyebrow">Safety</p>
          <h2>Advancing AGI safely and openly</h2>
          <p>
            We believe capability and safety must move forward together. Every step of our research is published openly, so progress toward AGI can be examined, questioned, and shared.
          </p>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p className="eyebrow">Contact</p>
        <h2>Join us on the journey to AGI</h2>
        <p>
          Whether you want to discuss our research, explore a collaboration, or just say hello — we&apos;d love to hear from you.
        </p>
        <a className="primary-action dark" href="mailto:hello@example.com">
          Get in touch
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}

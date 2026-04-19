import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Skills } from "../components/Skills";
import { Portfolio } from "../components/Portfolio";
import { Contact } from "../components/Contact";
import { GithubContributions } from "../components/GithubContributions";

export function HomePage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg)",
        fontFamily: "'Poppins', sans-serif",
        transition: "background 0.4s",
      }}
    >
      <Hero />
      <About />
      <Services />
      <Skills />
      <Portfolio />
      <Contact />
      <footer
        className="pt-10 pb-8 text-center"
        style={{
          background: "var(--bg)",
          borderTop:
            "1px solid color-mix(in srgb, var(--text2) 15%, transparent)",
          transition: "all 0.4s",
        }}
      >
        <GithubContributions />
        <p
          style={{
            color: "var(--text2)",
            fontSize: 13,
            transition: "color 0.4s",
          }}
        >
          &copy; 2026 Desta. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

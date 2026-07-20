import Link from "next/link";
import Icon from "./Icon";
import { LogoMark } from "./Logo";

const GITHUB = "https://github.com/MattPoetker/origindb";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-brand">
        <span className="wordmark"><LogoMark size={28} /> OriginDB</span>
        <p>The open source realtime database and server for modern applications — logic, data, and changefeed in one binary.</p>
        <div className="foot-social">
          <a href={GITHUB} rel="noopener" aria-label="GitHub"><Icon id="github" className="ic ic-fill" /></a>
          <a href="https://origindb.org" rel="noopener" aria-label="Website"><Icon id="globe" /></a>
        </div>
      </div>

      <div className="foot-cols">
        <div>
          <h4>Product</h4>
          <a href="/#features">Features</a>
          <a href="/#demos">Demos</a>
          <a href="/#live">Live Queries</a>
          <Link href="/getting-started">Get Started</Link>
        </div>
        <div>
          <h4>Resources</h4>
          <Link href="/getting-started">Documentation</Link>
          <a href={`${GITHUB}/blob/main/docs/GRAPHICS_PLAN.md`}>Design</a>
          <a href={`${GITHUB}#readme`}>README</a>
          <a href={`${GITHUB}/blob/main/LICENSE`}>MIT License</a>
        </div>
        <div>
          <h4>Community</h4>
          <a href={GITHUB}>GitHub</a>
          <a href={`${GITHUB}/issues`}>Issues</a>
          <a href={`${GITHUB}/discussions`}>Discussions</a>
          <a href={`${GITHUB}/stargazers`}>Stargazers</a>
        </div>
      </div>

      <div className="news">
        <h4>Stay in the loop</h4>
        <p>Star the repo to follow new releases and demos.</p>
        <div className="news-form">
          <input type="email" placeholder="you@example.com" aria-label="Email" />
          <a className="news-send" href={GITHUB} rel="noopener" aria-label="Go to GitHub"
             style={{ display: "grid", placeItems: "center", width: 42, borderRadius: 10, background: "var(--primary)", color: "#fff" }}>
            <Icon id="send" />
          </a>
        </div>
      </div>

      <div className="foot-b">© 2026 OriginDB · MIT License · Self-hosted, open source</div>
    </footer>
  );
}

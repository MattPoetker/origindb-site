import Link from "next/link";
import Icon from "./Icon";

const GITHUB = "https://github.com/origindb/origindb";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-brand">
        <span className="wordmark">
          <Icon id="zap" className="ic ic-brand" /> OriginDB
        </span>
        <p>Open-source realtime WebSocket database with programmable WASM modules.</p>
        <div className="badge-row">
          <span className="badge">OPEN SOURCE</span>
          <span className="badge">MIT LICENSE</span>
          <span className="badge">v0.1.0</span>
        </div>
      </div>
      <div className="foot-cols">
        <div>
          <h4>Guide</h4>
          <Link href="/getting-started">Getting Started</Link>
          <Link href="/getting-started#concepts">Core concepts</Link>
          <a href="/#demos">Demos</a>
          <a href="/#perf">Performance</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href={`${GITHUB}/blob/main/docs/WASM_ABI.md`}>WASM ABI</a>
          <a href={`${GITHUB}/blob/main/docs/design/durability.md`}>Durability design</a>
          <a href={GITHUB}>GitHub</a>
          <a href={`${GITHUB}/discussions`}>Discussions</a>
        </div>
        <div>
          <h4>Legal</h4>
          <a href={`${GITHUB}/blob/main/LICENSE`}>MIT License</a>
          <Link href="/">Home</Link>
          <a href={`${GITHUB}/blob/main/CODE_OF_CONDUCT.md`}>Code of Conduct</a>
        </div>
      </div>
      <div className="foot-b">© 2026 OriginDB Project · MIT License</div>
    </footer>
  );
}

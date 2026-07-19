import Link from "next/link";
import Icon from "./Icon";

const GITHUB = "https://github.com/origindb/origindb";

export default function Nav() {
  return (
    <header className="nav" id="nav">
      <Link className="wordmark" href="/" aria-label="OriginDB home">
        <Icon id="zap" className="ic ic-brand" /> OriginDB
      </Link>
      <nav className="nav-links">
        <a href="/#idea">How it works</a>
        <a href="/#features">Features</a>
        <a href="/#demos">Demos</a>
        <Link href="/getting-started">Get Started</Link>
      </nav>
      <div className="nav-cta">
        <a className="badge" href={`${GITHUB}/blob/main/LICENSE`} rel="noopener">
          MIT LICENSE
        </a>
        <a className="btn btn-secondary sm" href={GITHUB} rel="noopener">
          <Icon id="github" /> GitHub
        </a>
      </div>
    </header>
  );
}

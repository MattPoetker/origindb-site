import Link from "next/link";
import Icon from "./Icon";
import Logo from "./Logo";

const GITHUB = "https://github.com/MattPoetker/origindb";

export default function Nav() {
  return (
    <header className="nav" id="nav">
      <Logo />
      <nav className="nav-links">
        <a href="/#features">Features</a>
        <a href="/#live">Live Queries</a>
        <a href="/#demos">Demos</a>
        <Link href="/getting-started">Docs</Link>
        <a href={GITHUB} rel="noopener">GitHub</a>
      </nav>
      <div className="nav-cta">
        <a className="star-pill" href={GITHUB} rel="noopener">
          <Icon id="star" /> Star
        </a>
        <Link className="btn btn-primary sm" href="/getting-started">
          Get Started <Icon id="arrow" />
        </Link>
      </div>
    </header>
  );
}

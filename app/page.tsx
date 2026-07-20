import Link from "next/link";
import Icon from "@/components/Icon";
import CodePanel from "@/components/CodePanel";

const GITHUB = "https://github.com/MattPoetker/origindb";

export default function Home() {
  return (
    <main id="top">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-copy">
          <div className="badge-row reveal">
            <span className="badge"><span className="dotb" /> OPEN SOURCE</span>
            <span className="badge">MIT LICENSE</span>
            <span className="badge">SELF-HOSTED</span>
          </div>
          <h1 className="reveal d1">
            The open source{" "}
            <span className="accent">realtime database</span>{" "}
            and server.
          </h1>
          <p className="lede reveal d2">
            OriginDB is a modern backend where your application logic runs <em>inside</em> the
            database — as sandboxed WebAssembly reducers — streamed to every client over a
            <strong> SQL-filtered changefeed</strong>. Realtime data, effortlessly.
          </p>
          <div className="hero-actions reveal d3">
            <Link className="btn btn-primary" href="/getting-started">
              Get Started <Icon id="arrow" />
            </Link>
            <a className="btn btn-secondary" href={GITHUB} rel="noopener">
              <Icon id="github" className="ic ic-fill" /> Star on GitHub
            </a>
          </div>

          <div className="hero-stats reveal d4">
            <div className="hstat"><span className="hs-ic"><Icon id="file" /></span>
              <div><div className="hs-n">MIT</div><div className="hs-l">License</div></div></div>
            <div className="hstat"><span className="hs-ic"><Icon id="cpu" /></span>
              <div><div className="hs-n">WASM</div><div className="hs-l">Reducers</div></div></div>
            <div className="hstat"><span className="hs-ic"><Icon id="filter" /></span>
              <div><div className="hs-n">SQL</div><div className="hs-l">Changefeed</div></div></div>
            <div className="hstat"><span className="hs-ic"><Icon id="drive" /></span>
              <div><div className="hs-n">WAL</div><div className="hs-l">Durable</div></div></div>
          </div>
        </div>

        {/* ---- hero visual: AI glass-DB render + floating cards + orbs ---- */}
        <div className="hero-visual reveal d2">
          <div className="hv-aura" data-parallax="0.14" />
          <svg className="hv-orbit" viewBox="0 0 400 400" fill="none" aria-hidden="true" data-parallax="0.1">
            <ellipse cx="200" cy="210" rx="196" ry="120" transform="rotate(-14 200 210)"
              stroke="#c9d2f5" strokeWidth="1.4" strokeDasharray="2 9" strokeLinecap="round" opacity=".7" />
          </svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hv-db" src="/images/db-transparent.png" alt="OriginDB — a glass database engine" data-parallax="0.07" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hv-bubbles" src="/images/bubbles-transparent.png" alt="" aria-hidden="true" data-parallax="-0.05" />

          <div className="float-card fc-realtime" data-parallax="0.02">
            <span className="fc-ic"><Icon id="zap" className="ic ic-fill" /></span>
            <div><div className="fc-t">Realtime</div><div className="fc-d">Live updates at scale</div></div>
          </div>
          <div className="float-card fc-reliable" data-parallax="-0.08">
            <span className="fc-ic"><Icon id="shield" /></span>
            <div><div className="fc-t">Reliable</div><div className="fc-d">ACID &amp; strong consistency</div></div>
          </div>
          <div className="float-card fc-scalable" data-parallax="0.16">
            <span className="fc-ic"><Icon id="chart" /></span>
            <div><div className="fc-t">Scalable</div><div className="fc-d">Multi-core, one server</div></div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <div className="features-panel reveal" id="features">
        <div className="fgrid">
          <div className="fcell">
            <div className="fc-well w-blue"><Icon id="zap" className="ic ic-fill" /></div>
            <h3>Realtime by Default</h3>
            <p>Bidirectional updates over one websocket — SQL-filtered live queries, no polling.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-violet"><Icon id="database" /></div>
            <h3>Powerful Data Model</h3>
            <p>Tables, real SQL <code>WHERE</code>, and your own logic compiled in as reducers.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-teal"><Icon id="code" /></div>
            <h3>Developer First</h3>
            <p>AssemblyScript &amp; C# SDKs, a CLI, and hot-swappable modules with no downtime.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-pink"><Icon id="lock" /></div>
            <h3>Secure &amp; Reliable</h3>
            <p>Sandboxed WASM, ACID commits, and a durable WAL with point-in-time recovery.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-sky"><Icon id="cloud" /></div>
            <h3>Self-Hosted or Cloud</h3>
            <p>A single binary. Run it anywhere — your infrastructure, your data, your rules.</p>
          </div>
        </div>
      </div>

      {/* ================= CODE / LIVE QUERIES ================= */}
      <section id="live">
        <div className="code-split">
          <div className="reveal">
            <CodePanel
              file="subscribe.ts"
              html={`<span class="c-cm">// connect to OriginDB</span>
<span class="c-kw">const</span> ws = <span class="c-kw">new</span> WebSocket(<span class="c-st">"wss://your-app.origindb.org"</span>);

<span class="c-cm">// subscribe — get an initial snapshot + live matching commits</span>
ws.onopen = () => ws.send(JSON.stringify({
  type: <span class="c-st">"sql_subscribe"</span>,
  sql:  <span class="c-st">"SELECT * FROM todos WHERE done = false"</span>,
}));

<span class="c-cm">// every change that matches your WHERE streams here, in order</span>
ws.onmessage = (e) => render(JSON.parse(e.data));

<span class="c-cm">// writes go over the same socket — one call, transactional</span>
ws.send(JSON.stringify({ type: <span class="c-st">"call_reducer"</span>,
  module: <span class="c-st">"todos"</span>, reducer: <span class="c-st">"add"</span>, args: [<span class="c-st">"ship it"</span>] }));`}
            />
          </div>
          <div className="code-copy reveal d1">
            <span className="kicker">LIVE QUERIES</span>
            <h2>Realtime data,<br /><em>one subscribe</em> of code.</h2>
            <p>
              Subscribe to a query and get the initial snapshot plus every matching change the
              moment it commits. No polling, no cache to invalidate, no glue.
            </p>
            <Link className="link" href="/getting-started">Read the docs <Icon id="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* ================= DEMOS (built on it) ================= */}
      <section id="demos">
        <div className="sec-head reveal">
          <span className="kicker">BUILT ON IT</span>
          <h2>Whole apps, authoritative in WASM.</h2>
          <p>Each demo&apos;s entire simulation is a reducer. The browser is a pure subscriber — it renders what the changefeed streams.</p>
        </div>
        <div className="dgrid">
          <DemoCard href="https://db.origindb.org" idx="01" tag="COLLAB" title="NIGHTBOARD"
            desc="A shared realtime wall — live cursors and pinned notes, every twitch through a reducer, commit, and filtered changefeed." cta="Open live board" />
          <DemoCard href="https://cubeio.origindb.org" idx="02" tag="GAME" title="cube.io"
            desc="An agar-style arena whose authoritative tick is a WASM reducer. A hot-swap re-values the whole arena instantly." cta="Play cube.io" />
          <DemoCard href="https://marble.origindb.org" idx="03" tag="PHYSICS" title="Marble Clash"
            desc="A 60 Hz physics sumo with lobbies + matchmaking — the whole match simulation is one reducer, ticked natively." cta="Play Marble Clash" />
        </div>
      </section>

      {/* ================= TRUST (honest value props) ================= */}
      <section className="trust reveal">
        <span className="kicker">WHY ORIGINDB</span>
        <div className="trust-row">
          <span className="trust-chip"><Icon id="box" /> wasmtime sandbox</span>
          <span className="trust-chip"><Icon id="drive" /> group-commit WAL</span>
          <span className="trust-chip"><Icon id="filter" /> SQL changefeed</span>
          <span className="trust-chip"><Icon id="refresh" /> live hot-swap</span>
          <span className="trust-chip"><Icon id="file" /> MIT licensed</span>
          <span className="trust-chip"><Icon id="cloud" /> self-hosted</span>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <div className="cta-inner reveal">
          <div>
            <h2>Open source. Built for the future.</h2>
            <p>Join developers building the next generation of realtime apps with OriginDB. No seats, no metered egress, no proprietary runtime between you and your data.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary" href="/getting-started">Get Started <Icon id="arrow" /></Link>
            <a className="btn btn-secondary" href={GITHUB} rel="noopener"><Icon id="github" className="ic ic-fill" /> View on GitHub</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function DemoCard({ href, idx, tag, title, desc, cta }: { href: string; idx: string; tag: string; title: string; desc: string; cta: string }) {
  return (
    <a className="card dcard reveal" href={href} rel="noopener">
      <div className="dc-top"><span className="dc-idx">{idx}</span><span className="badge">{tag}</span></div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="dc-play">{cta} <Icon id="arrow" /></span>
    </a>
  );
}

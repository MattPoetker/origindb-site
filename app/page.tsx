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
            <span className="badge">BUILT IN C++</span>
            <span className="badge">MIT LICENSE</span>
          </div>
          <h1 className="reveal d1">
            The realtime backend that{" "}
            <span className="accent">keeps everyone in sync.</span>
          </h1>
          <p className="lede reveal d2">
            OriginDB is an open-source database and server in one. Your app logic runs{" "}
            <em>inside</em> the database, and every change streams to connected clients{" "}
            <strong>the instant it happens</strong> — no polling, no cache to wire up. Built in
            C++ to be fast and to run anywhere from a single binary.
          </p>
          <div className="hero-actions reveal d3">
            <Link className="btn btn-primary" href="/getting-started">
              Get Started <Icon id="arrow" />
            </Link>
            <a className="btn btn-secondary" href={GITHUB} rel="noopener">
              <Icon id="github" className="ic ic-fill" /> Star on GitHub
            </a>
          </div>

          {/* one-line install — the fastest path in (SpacetimeDB-style) */}
          <div className="hero-install reveal d3">
            <span className="hi-label">Install in seconds</span>
            <code className="hi-cmd"><span className="hi-pr">$</span> curl -fsSL https://origindb.org/install.sh | sh</code>
          </div>

          <div className="hero-stats reveal d4">
            <div className="hstat"><span className="hs-ic"><Icon id="cpu" /></span>
              <div><div className="hs-n">C++</div><div className="hs-l">Native engine</div></div></div>
            <div className="hstat"><span className="hs-ic"><Icon id="zap" className="ic ic-fill" /></span>
              <div><div className="hs-n">Realtime</div><div className="hs-l">Live sync</div></div></div>
            <div className="hstat"><span className="hs-ic"><Icon id="box" /></span>
              <div><div className="hs-n">1 binary</div><div className="hs-l">Self-hosted</div></div></div>
            <div className="hstat"><span className="hs-ic"><Icon id="file" /></span>
              <div><div className="hs-n">MIT</div><div className="hs-l">Open source</div></div></div>
          </div>
        </div>

        {/* ---- hero visual: live data-flow graph (DB core ⇄ clients) ---- */}
        <div className="hero-visual reveal d2" aria-hidden="true">
          <NetViz />

          <div className="float-card fc-realtime">
            <span className="fc-ic"><Icon id="zap" className="ic ic-fill" /></span>
            <div><div className="fc-t">Realtime</div><div className="fc-d">Every client, instantly</div></div>
          </div>
          <div className="float-card fc-reliable">
            <span className="fc-ic"><Icon id="shield" /></span>
            <div><div className="fc-t">Reliable</div><div className="fc-d">ACID, durable by default</div></div>
          </div>
          <div className="float-card fc-scalable">
            <span className="fc-ic"><Icon id="chart" /></span>
            <div><div className="fc-t">Fast</div><div className="fc-d">C++ core, one server</div></div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <div className="features-panel reveal" id="features">
        <div className="fgrid">
          <div className="fcell">
            <div className="fc-well w-blue"><Icon id="zap" className="ic ic-fill" /></div>
            <h3>Realtime by Default</h3>
            <p>Clients see changes the instant they happen — one live connection, no polling, no refresh.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-violet"><Icon id="database" /></div>
            <h3>Logic in the Database</h3>
            <p>Your backend code runs right next to your data, so a change and its update are one step.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-teal"><Icon id="code" /></div>
            <h3>Developer First</h3>
            <p>C# &amp; AssemblyScript SDKs, a simple CLI, and updates you can ship live with no downtime.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-pink"><Icon id="lock" /></div>
            <h3>Secure &amp; Reliable</h3>
            <p>Sandboxed logic, ACID transactions, and a durable log so your data survives a crash.</p>
          </div>
          <div className="fcell">
            <div className="fc-well w-sky"><Icon id="cloud" /></div>
            <h3>Runs Anywhere</h3>
            <p>One small C++ binary. Self-host it on your own hardware — your infrastructure, your data.</p>
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
              Ask for the data you want and get it right away — plus every future change the
              instant it happens. No polling loops, no caches to invalidate, no glue code.
            </p>
            <Link className="link" href="/getting-started">Read the docs <Icon id="arrow" /></Link>
          </div>
        </div>
      </section>

      {/* ================= DEMOS (built on it) ================= */}
      <section id="demos">
        <div className="sec-head reveal">
          <span className="kicker">SEE IT RUNNING</span>
          <h2>Real apps, running live on OriginDB.</h2>
          <p>Each demo runs its whole backend inside the database. The browser just connects and renders what streams back — click in and try one.</p>
        </div>
        <div className="dgrid">
          <DemoCard href="https://db.origindb.org" img="/demos/nightboard.jpg" idx="01" tag="COLLAB" title="NIGHTBOARD"
            desc="A shared realtime wall — live cursors, sticky notes, and chat. Every move syncs to everyone the moment it happens." cta="Open live board" />
          <DemoCard href="https://cubeio.origindb.org" img="/demos/cubeio.jpg" idx="02" tag="GAME" title="cube.io"
            desc="An agar-style arena whose entire game loop runs inside the database. Eat, grow, and outrun rivals in a shared world." cta="Play cube.io" />
          <DemoCard href="https://marble.origindb.org" img="/demos/marble.jpg" idx="03" tag="PHYSICS" title="Marble Clash"
            desc="A 60 Hz physics sumo with lobbies and matchmaking — the whole match runs server-side and streams to every player." cta="Play Marble Clash" />
        </div>
      </section>

      {/* ================= TRUST (honest value props) ================= */}
      <section className="trust reveal">
        <span className="kicker">WHY ORIGINDB</span>
        <div className="trust-row">
          <span className="trust-chip"><Icon id="cpu" /> C++ engine</span>
          <span className="trust-chip"><Icon id="zap" className="ic ic-fill" /> efficient live updates</span>
          <span className="trust-chip"><Icon id="box" /> sandboxed logic</span>
          <span className="trust-chip"><Icon id="drive" /> durable storage</span>
          <span className="trust-chip"><Icon id="refresh" /> zero-downtime updates</span>
          <span className="trust-chip"><Icon id="file" /> MIT licensed</span>
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

// Live data-flow graph: a DB core at the center, client nodes on spokes, and
// pulses streaming both ways — writes flowing IN, realtime updates flowing OUT.
// Pure CSS: each spoke is anchored at the center and rotated to its node; the
// pulse animates along the spoke, so the rotation carries it on the diagonal.
function NetViz() {
  const NODES = [
    { a: -90, icon: "users", dir: "out", delay: "0s" },
    { a: -30, icon: "code", dir: "in", delay: "1.1s" },
    { a: 30, icon: "users", dir: "out", delay: "0.5s" },
    { a: 90, icon: "terminal", dir: "in", delay: "1.6s" },
    { a: 150, icon: "users", dir: "out", delay: "0.3s" },
    { a: 210, icon: "cloud", dir: "in", delay: "0.9s" },
  ];
  return (
    <div className="netviz">
      <div className="nv-grid" />
      <div className="nv-orbit nv-orbit-1" />
      <div className="nv-orbit nv-orbit-2" />

      {NODES.map((n, i) => (
        <div key={i} className="nv-spoke" style={{ transform: `rotate(${n.a}deg)` }}>
          <span className="nv-wire" />
          <span className={`nv-pulse nv-${n.dir}`} style={{ animationDelay: n.delay }} />
          <span className={`nv-pulse nv-${n.dir} p2`} style={{ animationDelay: `calc(${n.delay} + 1.9s)` }} />
          <span className="nv-node" style={{ transform: `rotate(${-n.a}deg)` }}>
            <Icon id={n.icon} />
          </span>
        </div>
      ))}

      <div className="nv-core">
        <span className="nv-core-ring" />
        <span className="nv-core-face">
          <Icon id="database" />
          <span className="nv-core-lbl">OriginDB</span>
        </span>
      </div>
    </div>
  );
}

function DemoCard({ href, img, idx, tag, title, desc, cta }: { href: string; img: string; idx: string; tag: string; title: string; desc: string; cta: string }) {
  return (
    <a className="card dcard reveal" href={href} rel="noopener">
      <div className="dc-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={`${title} — a live OriginDB demo`} loading="lazy" />
        <span className="badge dc-tag">{tag}</span>
      </div>
      <div className="dc-body">
        <div className="dc-top"><span className="dc-idx">{idx}</span><h3>{title}</h3></div>
        <p>{desc}</p>
        <span className="dc-play">{cta} <Icon id="arrow" /></span>
      </div>
    </a>
  );
}

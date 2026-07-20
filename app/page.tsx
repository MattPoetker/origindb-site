import Link from "next/link";
import Icon from "@/components/Icon";
import LiveBoard from "@/components/LiveBoard";
import CodePanel from "@/components/CodePanel";

const GITHUB = "https://github.com/origindb/origindb";

export default function Home() {
  return (
    <main id="top">
      {/* ================= HERO — a live NIGHTBOARD ================= */}
      <section className="hero hero-live">
        <LiveBoard />
        <div className="hero-copy">
          <div className="badge-row reveal">
            <span className="badge"><span className="dotb" /> OPEN SOURCE</span>
            <span className="badge">MIT LICENSE</span>
            <span className="badge">SELF-HOSTED</span>
          </div>
          <h1 className="reveal d1">
            Lightweight real-time app&nbsp;server.
            <br />
            <span className="accent">Database &amp; business logic, all in one.</span>
          </h1>
          <p className="lede reveal d2">
            OriginDB is an open-source realtime database where your application logic lives{" "}
            <em>inside</em> the engine — as sandboxed WebAssembly reducers. Every write is
            transactional, logged to a durable WAL, and streamed to each client over a{" "}
            <strong>SQL-filtered changefeed</strong>.
          </p>
          <div className="hero-actions reveal d3">
            <Link className="btn btn-primary" href="/getting-started">
              Get Started <Icon id="arrow" />
            </Link>
            <a className="btn btn-secondary" href={GITHUB} rel="noopener">
              <Icon id="github" /> View on GitHub
            </a>
          </div>
          <div className="hero-meta reveal d4">
            <span>Runs anywhere you can run a binary.</span>
            <div className="meta-chips">
              <span className="chip"><Icon id="box" /> wasmtime sandbox</span>
              <span className="chip"><Icon id="drive" /> fsync-durable</span>
              <span className="chip"><Icon id="filter" /> SQL changefeed</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE MODEL / PIPELINE ================= */}
      <section className="idea" id="idea">
        <div className="sec-head reveal">
          <span className="kicker">THE MODEL</span>
          <h2>One write. A whole pipeline.</h2>
          <p>
            A client calls a reducer. Your WebAssembly code runs in a wasmtime sandbox against a
            staged overlay, commits atomically, hits the WAL, and emits exactly one changefeed
            event — delivered only to subscribers whose <code>WHERE</code> clause matches.
          </p>
        </div>

        <div className="pipe reveal">
          <div className="pipe-node">
            <div className="pn-ic"><Icon id="terminal" /></div>
            <span className="pn-step">01</span>
            <h3>Call a reducer</h3>
            <p>A client invokes a function you deployed. Args arrive as JSON; the host freezes the clock for determinism.</p>
            <div className="pn-tag">gRPC · your .wasm</div>
          </div>
          <div className="pipe-link" />
          <div className="pipe-node">
            <div className="pn-ic"><Icon id="drive" /></div>
            <span className="pn-step">02</span>
            <h3>Commit + WAL</h3>
            <p>Staged writes apply through one transaction, or roll back entirely on a trap or abort. Durable before you hear “ok”.</p>
            <div className="pn-tag">ACID · group-commit fsync</div>
          </div>
          <div className="pipe-link" />
          <div className="pipe-node">
            <div className="pn-ic"><Icon id="filter" /></div>
            <span className="pn-step">03</span>
            <h3>Filtered changefeed</h3>
            <p>Each commit emits one ordered event. Subscribers get only rows matching their SQL — no client sees the firehose.</p>
            <div className="pn-tag">websocket · SQL WHERE</div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features" id="features">
        <div className="sec-head reveal">
          <span className="kicker">EVERYTHING YOU NEED</span>
          <h2>Your backend, compiled in.</h2>
          <p>
            A small, readable engine — the whole thing is roughly 15k lines — with the primitives
            a realtime app actually needs.
          </p>
        </div>

        <div className="fgrid">
          <article className="card reveal"><div className="fc-ic"><Icon id="cpu" /></div>
            <h3>Code runs inside the DB</h3>
            <p>Deploy a WebAssembly module; OriginDB runs it in a wasmtime sandbox with epoch CPU deadlines and a memory limiter.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="filter" /></div>
            <h3>SQL-filtered changefeed</h3>
            <p>Subscribe with <code>SELECT … WHERE …</code> and receive only matching changes, in order. The predicate runs server-side.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="drive" /></div>
            <h3>Durable by default</h3>
            <p>A writer thread batches commits behind one <code>fdatasync</code>. Power-loss safe; throughput rises with concurrency.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="refresh" /></div>
            <h3>Live module hot-swap</h3>
            <p>Redeploy a new version and the rules change instantly — no migration, no downtime, against a running world.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="check" /></div>
            <h3>ACID transactions</h3>
            <p>Reducer writes stage in an overlay and apply as one atomic commit, or the entire call rolls back. No partial state.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="database" /></div>
            <h3>SQL engine</h3>
            <p>Query and subscribe with real SQL — <code>WHERE</code>, comparisons, <code>LIKE</code>, and boolean logic over your tables.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="code" /></div>
            <h3>Write in your language</h3>
            <p>First-class SDKs for <strong>AssemblyScript</strong> and <strong>C#</strong>, with Rust and C++ in the tree.</p></article>

          <article className="card reveal"><div className="fc-ic"><Icon id="rewind" /></div>
            <h3>Crash-recoverable</h3>
            <p>The WAL is the canonical world. Replay on boot rebuilds exactly the set of acknowledged commits — fast, compact binary.</p></article>
        </div>
      </section>

      {/* ================= DEMOS ================= */}
      <section className="demos" id="demos">
        <div className="sec-head reveal">
          <span className="kicker">BUILT ON IT</span>
          <h2>Whole apps, authoritative in WASM.</h2>
          <p>
            Each demo&apos;s entire simulation is a reducer. The browser is a pure subscriber —
            it renders what the changefeed streams and holds no authority of its own.
          </p>
        </div>

        <div className="dgrid">
          <a className="card dcard reveal" href="https://db.origindb.org" rel="noopener">
            <div className="dc-top"><span className="dc-idx">01</span><span className="badge">COLLAB</span></div>
            <h3>NIGHTBOARD</h3>
            <p>A shared realtime wall — live cursors, pinned notes, an activity tape. Every twitch travels through a reducer, a commit, the WAL, and a filtered changefeed before it lands.</p>
            <div className="dc-tags"><span className="badge">live cursors</span><span className="badge">filtered subs</span></div>
            <span className="dc-play">Open live board <Icon id="arrow" /></span>
          </a>

          <a className="card dcard reveal" href="https://cubeio.origindb.org" rel="noopener">
            <div className="dc-top"><span className="dc-idx">02</span><span className="badge">GAME</span></div>
            <h3>cube.io</h3>
            <p>An agar-style arena whose authoritative tick <em>is</em> a WASM reducer. Server-authoritative rewards mean a hot-swap re-values the whole arena instantly.</p>
            <div className="dc-tags"><span className="badge">authoritative tick</span><span className="badge">hot-swap</span></div>
            <span className="dc-play">Play cube.io <Icon id="arrow" /></span>
          </a>

          <a className="card dcard reveal" href="https://marble.origindb.org" rel="noopener">
            <div className="dc-top"><span className="dc-idx">03</span><span className="badge">PHYSICS</span></div>
            <h3>Marble Clash</h3>
            <p>A 60&nbsp;Hz physics sumo whose whole simulation is a reducer, ticked natively across cores. Roll, ram, and shove rivals off the rim — hundreds of players per server.</p>
            <div className="dc-tags"><span className="badge">60 Hz native tick</span><span className="badge">multi-core</span></div>
            <span className="dc-play">Play Marble Clash <Icon id="arrow" /></span>
          </a>

          <a className="card dcard reveal" href="https://territory.origindb.org" rel="noopener">
            <div className="dc-top"><span className="dc-idx">04</span><span className="badge">STRATEGY</span></div>
            <h3>Territories</h3>
            <p>A persistent region-control RTS — thousands of tiles, region-sharded ticks, and area-of-interest subscriptions so each client streams only the map it can see.</p>
            <div className="dc-tags"><span className="badge">region-sharded</span><span className="badge">AOI subs</span></div>
            <span className="dc-play">Play Territories <Icon id="arrow" /></span>
          </a>
        </div>
      </section>

      {/* ================= PERFORMANCE ================= */}
      <section className="perf" id="perf">
        <div className="sec-head reveal">
          <span className="kicker">MEASURED, NOT MARKETED</span>
          <h2>Honest numbers.</h2>
          <p>
            From the repo&apos;s benchmark suite on a dev Mac — deliberately the worst realistic case
            (<code>F_FULLFSYNC ≈ 21 ms</code>). On Linux with <code>fdatasync</code>, the absolute figures climb.
          </p>
        </div>
        <div className="stat-row reveal">
          <div className="card stat"><div className="stat-n">4.0<span>×</span></div><div className="stat-l">durable-commit throughput at 8 concurrent writers vs 1 — group commit working</div></div>
          <div className="card stat"><div className="stat-n">−57<span>%</span></div><div className="stat-l">WAL size after moving to a compact binary record format</div></div>
          <div className="card stat"><div className="stat-n">~15<span>k LOC</span></div><div className="stat-l">the entire engine — storage, WAL, changefeed, SQL, WASM host</div></div>
          <div className="card stat"><div className="stat-n">1<span>event</span></div><div className="stat-l">exactly one ordered changefeed event per committed write</div></div>
        </div>
      </section>

      {/* ================= QUICKSTART ================= */}
      <section className="start" id="start">
        <div className="sec-head reveal">
          <span className="kicker">FROM DEV TO PRODUCTION</span>
          <h2>From clone to changefeed in minutes.</h2>
        </div>
        <div className="start-grid">
          <div className="reveal">
            <CodePanel
              file="server"
              html={`<span class="c-cm"># build, then run the server</span>
<span class="c-pr">$</span> origindb_server -d ./data -p 8787 -g 50051
<span class="c-ok">✓ listening — ws :8787  grpc :50051</span>

<span class="c-cm"># deploy your reducer module</span>
<span class="c-pr">$</span> origindb deploy chat <span class="c-st">chat.wasm</span> 1.0.0

<span class="c-cm"># call it — the write commits and streams</span>
<span class="c-pr">$</span> origindb call chat sendMsg <span class="c-st">'["general","hi"]'</span>`}
            />
          </div>
          <div className="reveal">
            <CodePanel
              file="subscribe.js"
              html={`<span class="c-cm">// a browser is a pure subscriber</span>
<span class="c-kw">const</span> ws = <span class="c-kw">new</span> WebSocket(<span class="c-st">"ws://localhost:8787"</span>);

ws.onopen = () => ws.send(JSON.stringify({
  type: <span class="c-st">"sql_subscribe"</span>,
  sql:  <span class="c-st">"SELECT * FROM msgs WHERE room='general'"</span>
}));

<span class="c-cm">// initial snapshot + live matching commits</span>
ws.onmessage = (e) => render(JSON.parse(e.data));`}
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <div className="cta-inner reveal">
          <div className="cta-badge"><Icon id="zap" /></div>
          <h2>Ready to build something realtime?</h2>
          <p>
            OriginDB is MIT-licensed and self-hosted. No seats, no metered egress, no proprietary
            runtime between you and your data. Read the source, run it on your box, ship on top of it.
          </p>
          <div className="cta-actions">
            <Link className="btn btn-primary" href="/getting-started">
              Get Started <Icon id="arrow" />
            </Link>
            <a className="btn btn-secondary" href={GITHUB} rel="noopener">
              <Icon id="github" /> Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

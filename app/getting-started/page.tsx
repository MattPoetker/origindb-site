import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import CodePanel from "@/components/CodePanel";

const GITHUB = "https://github.com/MattPoetker/origindb";

export const metadata: Metadata = {
  title: "Getting Started",
  description:
    "Build a complete realtime app on OriginDB from scratch: write an AssemblyScript reducer module, compile it to WASM, deploy it, and wire up a live browser client — a working shared notes board in six steps.",
  openGraph: {
    type: "article",
    url: "https://origindb.org/getting-started",
    title: "Getting Started — OriginDB",
    description:
      "Write a reducer module, compile to WASM, deploy, and subscribe to a SQL-filtered changefeed. A hands-on OriginDB tutorial that ends in a working realtime app.",
  },
};

// ---- the complete module a reader writes in Step 2 (verified: compiles + runs) ----
const MODULE_SRC = `// examples/board/index.ts — the entire backend for a realtime notes wall.
import {
  JsonValue, abortCall, declareTable, deleteTable, generateId,
  nowMs, registerReducer, scanTable, setModuleInfo, writeTable,
} from "../../assembly/index";

// Every module re-exports the ABI surface the SDK implements.
export {
  origindb_alloc, origindb_free, origindb_describe, origindb_invoke, __origindb_abort,
} from "../../assembly/index";

setModuleInfo("board", "1.0.0");
declareTable("notes");                       // key = <id>: { user, text, x, y, color, created }

// addNote(user, text, x, y, color) -> { "id": "..." }
// x/y are 0..1 fractions of the wall, so every screen renders a note in the same spot.
function addNote(args: Array<JsonValue>): JsonValue | null {
  const user  = args.length > 0 && args[0].asString().length > 0 ? args[0].asString() : "anon";
  const text  = args.length > 1 ? args[1].asString() : "";
  const x     = args.length > 2 ? clamp01(args[2].asNumber()) : 0.5;
  const y     = args.length > 3 ? clamp01(args[3].asNumber()) : 0.5;
  const color = args.length > 4 && args[4].asString().length > 0 ? args[4].asString() : "#ffc24b";

  if (text.length == 0) abortCall("addNote: text is required");   // traps -> the whole call rolls back

  const id = generateId().toString();
  writeTable("notes", id, JsonValue.newObject()
    .setString("id", id).setString("user", user).setString("text", text)
    .setNumber("x", x).setNumber("y", y)
    .setString("color", color).setNumber("created", <f64>nowMs())
    .toString());
  return JsonValue.newObject().setString("id", id);   // commit -> WAL -> one changefeed event
}

// clearNotes() -> { "cleared": n }: wipe the wall in one atomic commit.
function clearNotes(args: Array<JsonValue>): JsonValue | null {
  const rows = JsonValue.parse(scanTable("notes", "", 100000));
  let n = 0;
  for (let i = 0; i < rows.length; i++) { deleteTable("notes", rows.at(i).getString("key", "")); n++; }
  return JsonValue.newObject().setNumber("cleared", <f64>n);
}

function clamp01(v: f64): f64 { return v < 0 ? 0 : v > 1 ? 1 : v; }

registerReducer("addNote", addNote, ["user", "text", "x", "y", "color"]);
registerReducer("clearNotes", clearNotes, []);`;

// ---- the browser client core a reader writes in Step 6 ----
const CLIENT_SRC = `// public/index.html <script> — the read + write loop (full file in examples/board/)
const cfg = await fetch("/api/config").then((r) => r.json());

// WRITE: call a reducer through the tiny bridge (browsers can't speak gRPC)
const call = (reducer, args) =>
  fetch("/api/call", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ reducer, args }) });

// READ: subscribe straight to OriginDB's websocket — snapshot + every live commit
const ws = new WebSocket("ws://" + location.hostname + ":" + cfg.wsPort);
ws.onopen = () => ws.send(JSON.stringify({ type: "sql_subscribe", sql: "SELECT * FROM notes" }));
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.type === "initial_state") for (const row of m.rows) renderNote(row.key, row.data);
  else if (m.type === "sql_changefeed_event") {
    if (m.operation === "DELETE") removeNote(m.key);
    else renderNote(m.key, JSON.parse(m.new_value).columns);
  }
};

// pin a note where you click — it appears on every open tab instantly
wall.onclick = (e) => call("addNote",
  ["me", prompt("Note:"), e.clientX / innerWidth, e.clientY / innerHeight, "#4da3ff"]);`;

export default function GettingStarted() {
  return (
    <main id="top">
      {/* ================= HEADER ================= */}
      <section className="tut-hero">
        <span className="kicker reveal">GETTING STARTED</span>
        <h1 className="reveal d1">
          Build a realtime app <span className="accent">from scratch</span> in six steps.
        </h1>
        <p className="tut-lede reveal d2">
          We&apos;ll build a small but complete app on <strong>OriginDB</strong> — a{" "}
          <em>shared notes board</em>: click to pin a note and it appears live on every open tab.
          You&apos;ll write the <em>whole backend</em> as one WebAssembly reducer module, compile it,
          deploy it into the running database, and wire up a browser client that reads from a
          SQL-filtered changefeed. No separate API server — the same primitives power the{" "}
          <strong>NIGHTBOARD</strong> demo.
        </p>
        <div className="tut-have reveal d3">
          <span className="chip"><Icon id="box" /> a reducer module (.wasm)</span>
          <span className="chip"><Icon id="database" /> one table, two reducers</span>
          <span className="chip"><Icon id="filter" /> a live browser client</span>
        </div>
        <p className="tut-note reveal d4">
          Prerequisites: <strong>none to run OriginDB</strong> — the install script drops in a prebuilt
          binary. You&apos;ll want Node 18+ for the SDK toolchain that compiles your module and serves the
          demo page. Everything runs on your machine — no cloud account.
        </p>
      </section>

      {/* ================= STEPS ================= */}
      <div className="steps">
        {/* STEP 1 */}
        <section className="step reveal">
          <div className="step-num">1</div>
          <span className="step-tag">Install</span>
          <h2 className="step-h">Install OriginDB</h2>
          <p>
            One command. The script auto-detects your platform (macOS &amp; Linux, Intel or ARM),
            downloads the matching <strong>prebuilt binary</strong> from GitHub, verifies its checksum,
            and puts the <code>origindb</code> CLI on your PATH — engine, WAL, changefeed, SQL, and the
            wasmtime host, all in one binary. <strong>No compiler, no build step.</strong>
          </p>
          <CodePanel
            file="shell"
            html={`<span class="c-cm"># install the origindb CLI + server (prebuilt, checksum-verified)</span>
<span class="c-pr">$</span> curl -fsSL https://origindb.org/install.sh | sh
<span class="c-ok">✓ Installed OriginDB — run 'origindb --help'</span>

<span class="c-cm"># then grab the AssemblyScript SDK toolchain that compiles your module to WASM</span>
<span class="c-pr">$</span> git clone https://github.com/MattPoetker/origindb.git &amp;&amp; cd origindb/sdk/typescript &amp;&amp; npm install`}
          />
        </section>

        {/* STEP 2 */}
        <section className="step reveal">
          <div className="step-num">2</div>
          <span className="step-tag">Write</span>
          <h2 className="step-h">Write the module — your whole backend</h2>
          <p>
            This one file is the entire server. It declares a <code>notes</code> table and exports two{" "}
            <strong>reducers</strong> — the only way clients change state. <code>addNote</code> writes a
            row; <code>clearNotes</code> deletes them all. Save it as{" "}
            <code>sdk/typescript/examples/board/index.ts</code>.
          </p>
          <CodePanel file="examples/board/index.ts" code={MODULE_SRC} />
          <div className="callout">
            <Icon id="check" />
            <p>
              <b>Reducers are the only writers.</b> Their writes stage in an overlay and apply as one
              atomic commit — or roll back entirely if the code traps (that&apos;s what{" "}
              <code>abortCall</code> does). A successful commit hits the WAL and emits exactly one
              changefeed event.
            </p>
          </div>
        </section>

        {/* STEP 3 */}
        <section className="step reveal">
          <div className="step-num">3</div>
          <span className="step-tag">Compile</span>
          <h2 className="step-h">Compile it to WebAssembly</h2>
          <p>
            Add a tiny build config next to the module, then compile. AssemblyScript emits a compact{" "}
            <code>.wasm</code> — the artifact you deploy. The <code>incremental</code> runtime gives the
            module a garbage collector; <code>abort</code> is routed to the SDK so traps reach the
            server log.
          </p>
          <CodePanel
            file="examples/board/asconfig.json"
            html={`{
  <span class="c-st">"entries"</span>: [<span class="c-st">"./index.ts"</span>],
  <span class="c-st">"targets"</span>: { <span class="c-st">"release"</span>: { <span class="c-st">"outFile"</span>: <span class="c-st">"../../build/board.wasm"</span>, <span class="c-st">"optimizeLevel"</span>: <span class="c-nm">3</span> } },
  <span class="c-st">"options"</span>: { <span class="c-st">"runtime"</span>: <span class="c-st">"incremental"</span>, <span class="c-st">"exportRuntime"</span>: <span class="c-kw">true</span>,
    <span class="c-st">"use"</span>: [<span class="c-st">"abort=assembly/index/__origindb_abort"</span>] }
}`}
          />
          <CodePanel
            file="shell"
            html={`<span class="c-pr">$</span> cd sdk/typescript
<span class="c-pr">$</span> npx asc examples/board/index.ts --config examples/board/asconfig.json --target release
<span class="c-ok">✓ build/board.wasm  (30 KB)</span>`}
          />
        </section>

        {/* STEP 4 */}
        <section className="step reveal">
          <div className="step-num">4</div>
          <span className="step-tag">Run</span>
          <h2 className="step-h">Start the server</h2>
          <p>
            Point the server at a data directory and pick two ports: a <strong>websocket</strong> port
            (browsers subscribe here) and a <strong>gRPC</strong> port (the CLI and your services talk
            here). The data dir holds the WAL — the crash-recoverable record of every commit.
          </p>
          <CodePanel
            file="shell"
            html={`<span class="c-pr">$</span> origindb serve -d ./board_data -p <span class="c-nm">8787</span> -g <span class="c-nm">50051</span> --no-auth
<span class="c-ok">✓ WebSocket ready on ws://localhost:8787</span>
<span class="c-ok">✓ gRPC ready on localhost:50051</span>`}
          />
          <div className="callout">
            <Icon id="terminal" />
            <p>
              <b>Flags:</b> <code>-d</code> data dir · <code>-p</code> websocket port · <code>-g</code>{" "}
              gRPC port. <code>--no-auth</code> is for local dev; drop it in production and the server
              issues admin/client tokens instead.
            </p>
          </div>
        </section>

        {/* STEP 5 */}
        <section className="step reveal">
          <div className="step-num">5</div>
          <span className="step-tag">Deploy</span>
          <h2 className="step-h">Deploy the module and call it</h2>
          <p>
            Deploy the <code>.wasm</code> — the engine validates and sandboxes it, then its reducers are
            callable. Call <code>addNote</code> from the CLI and read the row back with plain SQL. Redeploy
            a new version any time and the rules change live, no downtime.
          </p>
          <CodePanel
            file="shell"
            html={`<span class="c-pr">$</span> origindb deploy board sdk/typescript/build/board.wasm 1.0.0
<span class="c-ok">✓ Deployed module 'board' (30213 bytes) — validated, sandboxed</span>

<span class="c-cm"># addNote(user, text, x, y, color)</span>
<span class="c-pr">$</span> origindb call board addNote <span class="c-st">'["Ada","hello!",0.3,0.4,"#4da3ff"]'</span>
<span class="c-ok">←</span> {"id":"1871105572944740356"}

<span class="c-pr">$</span> origindb exec <span class="c-st">"SELECT * FROM notes"</span>
<span class="c-ok">→</span> id=1871105572944740356  user="Ada"  text="hello!"  x=0.3  y=0.4`}
          />
          <div className="callout">
            <Icon id="filter" />
            <p>
              That <code>addNote</code> committed and fired one changefeed event. Any client subscribed to{" "}
              <code>notes</code> just received it — which is exactly what we wire up next.
            </p>
          </div>
        </section>

        {/* STEP 6 */}
        <section className="step reveal">
          <div className="step-num">6</div>
          <span className="step-tag">Serve</span>
          <h2 className="step-h">Wire up the browser — a working MVP</h2>
          <p>
            The page does two things: it <strong>subscribes</strong> to{" "}
            <code>SELECT * FROM notes</code> over the websocket (snapshot + live commits), and it{" "}
            <strong>calls</strong> <code>addNote</code> when you click. Reducer calls go through a ~60-line
            Node bridge (browsers can&apos;t speak gRPC); realtime reads flow straight from OriginDB. The
            full <code>server.js</code> and <code>public/index.html</code> ship in{" "}
            <code>examples/board/</code> — here&apos;s the core:
          </p>
          <CodePanel file="the read + write loop" code={CLIENT_SRC} />
          <CodePanel
            file="shell"
            html={`<span class="c-pr">$</span> cd examples/board &amp;&amp; npm install
<span class="c-pr">$</span> node server.js --port <span class="c-nm">3020</span> --grpc localhost:50051 --ws-port <span class="c-nm">8787</span>
<span class="c-ok">✓ board demo on http://localhost:3020</span>  <span class="c-cm"># open it in two tabs — notes sync live</span>`}
          />
          <div className="callout">
            <Icon id="mouse" />
            <p>
              Open two tabs and click the wall. Each note is a reducer call → a commit → a WAL append → a
              filtered changefeed event → a render on <b>every</b> tab. That&apos;s the whole loop — and your
              first OriginDB app.
            </p>
          </div>
        </section>
      </div>

      {/* ================= RECAP PIPELINE ================= */}
      <section className="idea">
        <div className="sec-head reveal">
          <span className="kicker">WHAT JUST HAPPENED</span>
          <h2>One call. The whole loop.</h2>
          <p>
            Every click is one lap of the same cycle. A client calls a reducer; your WASM runs and
            commits atomically; the WAL makes it durable; the changefeed streams it to exactly the
            subscribers whose SQL matches.
          </p>
        </div>
        <div className="pipe reveal">
          <div className="pipe-node">
            <div className="pn-ic"><Icon id="terminal" /></div>
            <span className="pn-step">01</span>
            <h3>Call a reducer</h3>
            <p>A client invokes <code>addNote</code>. Args arrive as JSON; the host freezes the clock for determinism.</p>
            <div className="pn-tag">gRPC · your .wasm</div>
          </div>
          <div className="pipe-link" />
          <div className="pipe-node">
            <div className="pn-ic"><Icon id="drive" /></div>
            <span className="pn-step">02</span>
            <h3>Commit + WAL</h3>
            <p>Staged writes apply as one transaction, or roll back on a trap. Durable before you hear “ok”.</p>
            <div className="pn-tag">ACID · group-commit fsync</div>
          </div>
          <div className="pipe-link" />
          <div className="pipe-node">
            <div className="pn-ic"><Icon id="filter" /></div>
            <span className="pn-step">03</span>
            <h3>Filtered changefeed</h3>
            <p>One ordered event per commit, delivered only to subscribers whose <code>WHERE</code> matches.</p>
            <div className="pn-tag">websocket · SQL WHERE</div>
          </div>
        </div>
      </section>

      {/* ================= CONCEPTS ================= */}
      <section className="features concepts" id="concepts">
        <div className="sec-head reveal">
          <span className="kicker">THE VOCABULARY</span>
          <h2>Six words, the whole model.</h2>
          <p>
            Everything you just used. Learn them once and every app — a notes board, a game, an MMO — is
            the same shape.
          </p>
        </div>
        <div className="dgrid">
          <article className="card reveal"><h3><Icon id="box" /> Module</h3>
            <p>Your backend, compiled to WebAssembly and deployed into the DB. Validated, sandboxed, hot-swappable.</p></article>
          <article className="card reveal"><h3><Icon id="terminal" /> Reducer</h3>
            <p>A named function your module exports — <code>addNote</code>. The only way to write. One atomic commit or full rollback.</p></article>
          <article className="card reveal"><h3><Icon id="database" /> Table</h3>
            <p>Where state lives — <code>notes</code>. Written only by reducers, queried with real SQL.</p></article>
          <article className="card reveal"><h3><Icon id="filter" /> Changefeed</h3>
            <p>The realtime read path. Subscribe with <code>SELECT … WHERE …</code>; get a snapshot plus every matching commit.</p></article>
          <article className="card reveal"><h3><Icon id="drive" /> WAL</h3>
            <p>The write-ahead log — the canonical world. Group-commit fsync makes it durable; replay rebuilds on boot.</p></article>
          <article className="card reveal"><h3><Icon id="users" /> Client</h3>
            <p>Any subscriber — a browser, the CLI, a service. It calls reducers and renders the feed. It holds no authority.</p></article>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta">
        <div className="cta-inner reveal">
          <div className="cta-badge"><Icon id="zap" /></div>
          <h2>Now grow the board.</h2>
          <p>
            You have a working realtime app. Add a <code>cursors</code> table and an <code>onlyMine</code>{" "}
            filter, subscribe with a <code>WHERE</code>, hot-swap a new module version — the six steps
            never change. The SDK and the ABI have the rest.
          </p>
          <div className="cta-actions">
            <a className="btn btn-primary" href={`${GITHUB}/blob/main/docs/WASM_ABI.md`} rel="noopener">
              Read the WASM ABI <Icon id="arrow" />
            </a>
            <a className="btn btn-secondary" href={`${GITHUB}/tree/main/examples/board`} rel="noopener">
              <Icon id="github" /> Full board example
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";

type Tab = "sql" | "as" | "grpc";

const SNIPPETS: Record<Tab, string> = {
  sql: `<span class="c-cm">-- subscribe to a filtered slice of the world</span>
<span class="c-kw">SELECT</span> * <span class="c-kw">FROM</span> msgs
<span class="c-kw">WHERE</span> room = <span class="c-st">'general'</span>
  <span class="c-kw">AND</span> deleted = <span class="c-kw">FALSE</span>;

<span class="c-cm">-- every matching commit streams live over</span>
<span class="c-cm">-- the changefeed. no firehose, no polling.</span>`,
  as: `<span class="c-cm">// chat.ts — your reducer, compiled to WASM</span>
<span class="c-fn">registerReducer</span>(<span class="c-st">"sendMsg"</span>, (args) =&gt; {
  <span class="c-kw">const</span> room = args[<span class="c-nm">0</span>].asString();
  <span class="c-kw">const</span> body = args[<span class="c-nm">1</span>].asString();
  <span class="c-fn">writeTable</span>(<span class="c-st">"msgs"</span>, generateId().toString(),
    JsonValue.newObject()
      .setString(<span class="c-st">"room"</span>, room)
      .setString(<span class="c-st">"body"</span>, body).toString());
  <span class="c-kw">return</span> <span class="c-kw">null</span>; <span class="c-cm">// commit → WAL → changefeed</span>
}, [<span class="c-st">"room"</span>, <span class="c-st">"body"</span>]);`,
  grpc: `<span class="c-cm"># deploy a module and call it</span>
<span class="c-pr">$</span> origindb deploy chat <span class="c-st">chat.wasm</span> 1.0.0
<span class="c-ok">✓ deployed 'chat' (34 KB) — validated, sandboxed</span>

<span class="c-pr">$</span> origindb call chat sendMsg <span class="c-st">'["general","hi"]'</span>
<span class="c-ok">← changefeed</span> INSERT msgs #<span class="c-nm">40213</span> <span class="c-cm">(filtered)</span>`,
};

// Hero code panel with SQL / AssemblyScript / gRPC tabs.
export default function CodeTabs() {
  const [tab, setTab] = useState<Tab>("sql");
  const tabs: [Tab, string][] = [
    ["sql", "SQL"],
    ["as", "AssemblyScript"],
    ["grpc", "gRPC"],
  ];

  return (
    <aside className="panel reveal d2" aria-label="Example">
      <div className="panel-bar">
        <span className="dots"><i /><i /><i /></span>
        <div className="tabs" role="tablist">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              className={`tab${tab === id ? " active" : ""}`}
              onClick={() => setTab(id)}
              role="tab"
              aria-selected={tab === id}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-body">
        {tabs.map(([id]) => (
          <pre key={id} className={`pane${tab === id ? " active" : ""}`}>
            <code dangerouslySetInnerHTML={{ __html: SNIPPETS[id] }} />
          </pre>
        ))}
      </div>
    </aside>
  );
}

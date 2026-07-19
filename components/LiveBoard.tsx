"use client";

// A live NIGHTBOARD embedded as the homepage hero. It connects to a running
// OriginDB backend: reads (cursors + notes) stream over the websocket; writes
// (moveCursor / addNote) go through the collab bridge. Visitors see — and join —
// the board the instant they land. Falls back to a calm empty board if the
// backend is unreachable, so the marketing page never looks broken.
//
// Endpoint is build-time configurable:
//   NEXT_PUBLIC_ORIGINDB_API  — the collab bridge base (default: the rack)
//   NEXT_PUBLIC_ORIGINDB_WS   — OriginDB websocket url

import { useEffect, useRef, useState } from "react";

// Public endpoint (Cloudflare tunnel → the rack). Both go through ONE host:
//   API  — HTTPS  /api/call  (reducer calls, CORS-enabled)
//   WS   — WSS    /          (proxied through the bridge to OriginDB's websocket)
// Override at build time with NEXT_PUBLIC_ORIGINDB_API / _WS (e.g. to hit the
// rack directly over the LAN during local development).
const API = process.env.NEXT_PUBLIC_ORIGINDB_API || "https://db.origindb.org";
const WS = process.env.NEXT_PUBLIC_ORIGINDB_WS || "wss://db.origindb.org";

const COLORS = ["#4da3ff", "#5ee6a8", "#ffd166", "#ff6b6b", "#c792ff", "#ff9f6b", "#4ee1e1", "#f078c8"];
const CURSOR_STALE_MS = 9000;
const MOVE_HZ = 15;

type Cursor = { user: string; color: string; x: number; y: number; msg: string; ts: number };
type Note = { id: string; user: string; color: string; x: number; y: number; text: string };

function ident() {
  if (typeof window === "undefined") return { user: "anon", color: COLORS[0] };
  let user = localStorage.getItem("odb_user");
  let color = localStorage.getItem("odb_color");
  if (!user) { user = "guest-" + Math.random().toString(36).slice(2, 6); localStorage.setItem("odb_user", user); }
  if (!color) { color = COLORS[(Math.random() * COLORS.length) | 0]; localStorage.setItem("odb_color", color); }
  return { user, color };
}

export default function LiveBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const cursors = useRef<Map<string, Cursor>>(new Map());
  const notes = useRef<Map<string, Note>>(new Map());
  const me = useRef(ident());
  const dirty = useRef(true);
  const lastSent = useRef(0);
  const [, force] = useState(0);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [composer, setComposer] = useState<{ x: number; y: number } | null>(null);

  // ---- call a reducer through the bridge ----
  const call = (reducer: string, args: (string | number)[]) =>
    fetch(`${API}/api/call`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reducer, args }),
    }).catch(() => {});

  // ---- websocket subscription (reads) ----
  useEffect(() => {
    let ws: WebSocket | null = null;
    let closed = false;
    let retry: ReturnType<typeof setTimeout>;

    const apply = (table: string, key: string, cols: Record<string, unknown>) => {
      if (table === "cursors") {
        if (cols.user === me.current.user) return; // don't render my own cursor
        cursors.current.set(key, {
          user: String(cols.user ?? key), color: String(cols.color ?? "#4da3ff"),
          x: Number(cols.x ?? 0), y: Number(cols.y ?? 0), msg: String(cols.msg ?? ""), ts: Number(cols.ts ?? 0),
        });
      } else if (table === "notes") {
        notes.current.set(key, {
          id: key, user: String(cols.user ?? "anon"), color: String(cols.color ?? "#ffc24b"),
          x: Number(cols.x ?? 0.5), y: Number(cols.y ?? 0.5), text: String(cols.text ?? ""),
        });
      }
      dirty.current = true;
    };

    const connect = () => {
      try { ws = new WebSocket(WS); } catch { setConnected(false); return; }
      ws.onopen = () => {
        setConnected(true);
        ws!.send(JSON.stringify({ type: "sql_subscribe", sql: "SELECT * FROM cursors" }));
        ws!.send(JSON.stringify({ type: "sql_subscribe", sql: "SELECT * FROM notes" }));
      };
      ws.onclose = () => { setConnected(false); if (!closed) retry = setTimeout(connect, 1500); };
      ws.onerror = () => { try { ws?.close(); } catch {} };
      ws.onmessage = (e) => {
        let m: any; try { m = JSON.parse(e.data); } catch { return; }
        if (m.type === "initial_state") {
          const table = /FROM\s+(\w+)/i.exec(m.sql || "")?.[1] || "";
          for (const row of m.rows || []) apply(table, row.key, row.data || {});
        } else if (m.type === "sql_changefeed_event") {
          if (m.operation === "DELETE") {
            if (m.table === "notes") notes.current.delete(m.key);
            else cursors.current.delete(m.key);
            dirty.current = true;
          } else {
            try { const p = JSON.parse(m.new_value); apply(m.table, m.key, p.columns ?? p); } catch {}
          }
        }
      };
    };

    connect();
    const to = setTimeout(() => setConnected((c) => (c === null ? false : c)), 4000);
    return () => { closed = true; clearTimeout(retry); clearTimeout(to); try { ws?.close(); } catch {} };
  }, []);

  // ---- render loop: flush refs to the DOM at ~30fps only when something changed ----
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = Date.now();
      // prune stale cursors
      for (const [k, c] of cursors.current) if (now - c.ts > CURSOR_STALE_MS) { cursors.current.delete(k); dirty.current = true; }
      if (dirty.current) { dirty.current = false; force((n) => n + 1); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---- broadcast my cursor ----
  const onMove = (e: React.PointerEvent) => {
    const el = boardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const now = Date.now();
    if (now - lastSent.current < 1000 / MOVE_HZ) return;
    lastSent.current = now;
    if (connected) call("moveCursor", [me.current.user, me.current.color, x, y, ""]);
  };

  const openComposer = (e: React.MouseEvent) => {
    const el = boardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setComposer({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };
  const submitNote = (text: string) => {
    const c = composer; setComposer(null);
    if (c && text.trim() && connected) call("addNote", [me.current.user, me.current.color, c.x, c.y, text.trim().slice(0, 280)]);
  };

  const now = Date.now();
  const liveCursors = [...cursors.current.values()].filter((c) => now - c.ts <= CURSOR_STALE_MS);
  const present = liveCursors.length + (connected ? 1 : 0);

  return (
    <div className="board-layer" ref={boardRef} onPointerMove={onMove} onDoubleClick={openComposer}>
      {[...notes.current.values()].map((n) => (
        <div className="bn" key={n.id} style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%`, borderLeftColor: n.color }}>
          <div className="bn-u">{n.user}</div>
          <div className="bn-t">{n.text}</div>
        </div>
      ))}

      {liveCursors.map((c) => (
        <div className="rc" key={c.user} style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={c.color}>
            <path d="M4 4l7.07 17 2.51-7.42L21 11.07 4 4z" />
          </svg>
          <span className="lbl" style={{ background: c.color }}>{c.user}</span>
          {c.msg ? <span className="msg">{c.msg}</span> : null}
        </div>
      ))}

      {composer ? (
        <div className="bn-input" style={{ left: `${composer.x * 100}%`, top: `${composer.y * 100}%` }}>
          <input
            autoFocus
            placeholder="Type a note, press Enter…"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitNote((e.target as HTMLInputElement).value);
              else if (e.key === "Escape") setComposer(null);
            }}
            onBlur={(e) => submitNote(e.target.value)}
          />
        </div>
      ) : null}

      <span className={`live-pill${connected ? "" : " off"}`}>
        <span className="dot" />
        {connected ? `live · ${present} here` : connected === false ? "offline" : "connecting…"}
      </span>
      <span className="board-hint">
        this is a live OriginDB board — <b>move your cursor</b>, <b>double-click</b> to pin a note
      </span>
    </div>
  );
}

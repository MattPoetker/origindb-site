// Inline icon sprite. Rendered once in the layout; every <Icon id="…" />
// references a symbol here. Line icons inherit stroke:currentColor via .ic;
// brand/solid glyphs (github, discord, x, zap) render filled via .ic-fill.
export default function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        {/* ---- line icons (stroke) ---- */}
        <symbol id="i-zap" viewBox="0 0 24 24"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></symbol>
        <symbol id="i-cpu" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" /></symbol>
        <symbol id="i-filter" viewBox="0 0 24 24"><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z" /></symbol>
        <symbol id="i-drive" viewBox="0 0 24 24"><rect x="2" y="12" width="20" height="8" rx="1.5" /><path d="M5 12l2.2-7h9.6L19 12" /><circle cx="7" cy="16" r="1" /><path d="M11 16h6" /></symbol>
        <symbol id="i-refresh" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></symbol>
        <symbol id="i-check" viewBox="0 0 24 24"><path d="M22 11.1V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.02l-3-3" /></symbol>
        <symbol id="i-database" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></symbol>
        <symbol id="i-code" viewBox="0 0 24 24"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></symbol>
        <symbol id="i-rewind" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 2.64-6.36" /><path d="M3 3v6h6" /></symbol>
        <symbol id="i-box" viewBox="0 0 24 24"><path d="M21 8 12 3 3 8v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v9" /></symbol>
        <symbol id="i-terminal" viewBox="0 0 24 24"><path d="M4 17l6-6-6-6" /><path d="M12 19h8" /></symbol>
        <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></symbol>
        <symbol id="i-back" viewBox="0 0 24 24"><path d="M19 12H5" /><path d="M11 18l-6-6 6-6" /></symbol>
        <symbol id="i-mouse" viewBox="0 0 24 24"><path d="M4 4l7.07 17 2.51-7.42L21 11.07 4 4z" /></symbol>
        <symbol id="i-users" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></symbol>
        <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /><circle cx="12" cy="16" r="1.2" /></symbol>
        <symbol id="i-cloud" viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 .5-8.98A6 6 0 0 0 6.2 9.5 4 4 0 0 0 7 19h10.5z" /></symbol>
        <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z" /></symbol>
        <symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" rx=".5" /><rect x="12" y="8" width="3" height="10" rx=".5" /><rect x="17" y="5" width="3" height="13" rx=".5" /></symbol>
        <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3.4 1.1-6.5L2.6 9.8l6.5-.9L12 3z" /></symbol>
        <symbol id="i-fork" viewBox="0 0 24 24"><circle cx="6" cy="5" r="2.5" /><circle cx="18" cy="5" r="2.5" /><circle cx="12" cy="19" r="2.5" /><path d="M6 7.5V10a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7.5M12 13v3.5" /></symbol>
        <symbol id="i-file" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></symbol>
        <symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.8 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.8-3.8-9S9.5 5.6 12 3z" /></symbol>
        <symbol id="i-copy" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></symbol>
        <symbol id="i-send" viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></symbol>
        <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" /><path d="M4 19a2 2 0 0 0 2 2h13" /></symbol>
        {/* ---- brand / solid glyphs (fill via .ic-fill) ---- */}
        <symbol id="i-github" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></symbol>
        <symbol id="i-discord" viewBox="0 0 24 24"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.24.5a13.7 13.7 0 0 1 4.3 2.2 13.4 13.4 0 0 0-11.5-.55c.24-.2.5-.4.77-.58L8.6 3a19.7 19.7 0 0 0-4.9 1.4C1 9.3.28 14 .64 18.7a20 20 0 0 0 6 3l.66-1.5a12.9 12.9 0 0 1-2-1l.5-.35a14.3 14.3 0 0 0 12.3 0l.5.36a12.7 12.7 0 0 1-2 1L17.4 21.7a20 20 0 0 0 6-3c.42-5.3-.72-9.9-3.1-14.3zM8.3 15.6c-1.15 0-2.1-1.06-2.1-2.36s.93-2.36 2.1-2.36c1.18 0 2.13 1.07 2.1 2.36 0 1.3-.93 2.36-2.1 2.36zm7.4 0c-1.15 0-2.1-1.06-2.1-2.36s.93-2.36 2.1-2.36c1.18 0 2.13 1.07 2.1 2.36 0 1.3-.92 2.36-2.1 2.36z" /></symbol>
        <symbol id="i-x" viewBox="0 0 24 24"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.2-6.82-5.96 6.82H1.7l7.73-8.84L1.55 2.25h6.83l4.7 6.22 5.16-6.22zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64z" /></symbol>
      </defs>
    </svg>
  );
}

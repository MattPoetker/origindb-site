// A static (non-tabbed) code panel.
//   • `html`  — pre-highlighted inner markup (spans with c-cm/c-kw/… classes).
//   • `code`  — plain source text; rendered safely (JSX auto-escapes < > &),
//               used for longer files where hand-highlighting isn't worth it.
export default function CodePanel({
  file,
  html,
  code,
}: {
  file?: string;
  html?: string;
  code?: string;
}) {
  return (
    <div className="panel">
      <div className="panel-bar">
        <span className="dots"><i /><i /><i /></span>
        {file ? <span className="panel-file">{file}</span> : null}
      </div>
      <pre className="pane static">
        {code !== undefined ? (
          <code>{code}</code>
        ) : (
          <code dangerouslySetInnerHTML={{ __html: html ?? "" }} />
        )}
      </pre>
    </div>
  );
}

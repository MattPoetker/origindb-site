import type { CSSProperties } from "react";

// References a symbol from <IconSprite/> by id, e.g. <Icon id="zap" />.
export default function Icon({
  id,
  className = "ic",
  style,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`#i-${id}`} />
    </svg>
  );
}

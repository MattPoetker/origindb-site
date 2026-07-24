#!/bin/sh
# OriginDB installer — https://origindb.org/install.sh
#
#   curl -fsSL https://origindb.org/install.sh | sh
#
# Downloads the prebuilt OriginDB release for your platform from GitHub,
# verifies its checksum, and installs the `origindb` CLI (plus the server
# and tools) into a bin directory on your PATH. No compiler required.
#
# Env overrides:
#   ORIGINDB_VERSION   pin a version (default: latest release)     e.g. v0.0.7
#   ORIGINDB_BIN_DIR   install location (default: /usr/local/bin, or ~/.local/bin)
#   ORIGINDB_REPO      source repo (default: MattPoetker/origindb)

set -eu

REPO="${ORIGINDB_REPO:-MattPoetker/origindb}"
VERSION="${ORIGINDB_VERSION:-latest}"
# every binary shipped in the release tarball; origindb is the CLI wrapper
BINARIES="origindb origindb_server origindb_sql origindb_client origindb_init"

# ---- pretty output ----------------------------------------------------------
if [ -t 1 ]; then B="$(printf '\033[1m')"; DIM="$(printf '\033[2m')"; GRN="$(printf '\033[32m')"; RED="$(printf '\033[31m')"; YEL="$(printf '\033[33m')"; RST="$(printf '\033[0m')"; else B=; DIM=; GRN=; RED=; YEL=; RST=; fi
info() { printf '%s\n' "${DIM}·${RST} $*"; }
ok()   { printf '%s\n' "${GRN}✓${RST} $*"; }
warn() { printf '%s\n' "${YEL}!${RST} $*" >&2; }
die()  { printf '%s\n' "${RED}✗${RST} $*" >&2; exit 1; }

# ---- prerequisites ----------------------------------------------------------
have() { command -v "$1" >/dev/null 2>&1; }
if have curl; then DL="curl -fsSL"; DLO="curl -fsSL -o"; elif have wget; then DL="wget -qO-"; DLO="wget -qO"; else die "need curl or wget"; fi
have tar || die "need tar"

# ---- detect platform --------------------------------------------------------
os=$(uname -s); arch=$(uname -m)
case "$os" in
  Darwin) OS=macos ;;
  Linux)  OS=linux ;;
  *) die "unsupported OS: $os (prebuilt binaries cover macOS + Linux; build from source for others)" ;;
esac
case "$arch" in
  x86_64|amd64)  ARCH=x64 ;;
  arm64|aarch64) ARCH=arm64 ;;
  *) die "unsupported architecture: $arch" ;;
esac
PLATFORM="${OS}-${ARCH}"
info "Platform: ${B}${PLATFORM}${RST}"

# ---- resolve version --------------------------------------------------------
if [ "$VERSION" = "latest" ]; then
  info "Resolving latest release…"
  # Read the newest tag from the releases list (first entry). Unlike
  # /releases/latest this also covers pre-releases, which 404 that endpoint.
  VERSION=$($DL "https://api.github.com/repos/${REPO}/releases?per_page=1" \
    | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/') || true
  [ -n "$VERSION" ] || die "could not resolve latest version — set ORIGINDB_VERSION (see github.com/${REPO}/releases)"
fi
ok "Version: ${B}${VERSION}${RST}"

TARBALL="origindb-${VERSION}-${PLATFORM}.tar.gz"
BASE="https://github.com/${REPO}/releases/download/${VERSION}"

# ---- download + verify ------------------------------------------------------
TMP=$(mktemp -d 2>/dev/null || mktemp -d -t origindb)
trap 'rm -rf "$TMP"' EXIT INT TERM
info "Downloading ${TARBALL}…"
$DLO "$TMP/$TARBALL" "$BASE/$TARBALL" || die "download failed: $BASE/$TARBALL"

# checksum is best-effort — verify when a sha256 tool + the .sha256 asset exist
if $DLO "$TMP/$TARBALL.sha256" "$BASE/$TARBALL.sha256" 2>/dev/null; then
  if have shasum; then SUM="shasum -a 256"; elif have sha256sum; then SUM="sha256sum"; else SUM=; fi
  if [ -n "$SUM" ]; then
    want=$(awk '{print $1}' "$TMP/$TARBALL.sha256")
    got=$($SUM "$TMP/$TARBALL" | awk '{print $1}')
    [ "$want" = "$got" ] || die "checksum mismatch — refusing to install (expected $want, got $got)"
    ok "Checksum verified"
  fi
else
  warn "no checksum published for this asset — skipping verification"
fi

info "Extracting…"
tar -xzf "$TMP/$TARBALL" -C "$TMP"
# the tarball unpacks into a versioned dir: origindb-<version>-<platform>/
SRC="$TMP/origindb-${VERSION}-${PLATFORM}"
[ -d "$SRC" ] || SRC=$(find "$TMP" -maxdepth 1 -type d -name 'origindb-*' | head -n1)
[ -n "$SRC" ] && [ -d "$SRC" ] || die "unexpected archive layout"

# ---- choose an install dir --------------------------------------------------
if [ -n "${ORIGINDB_BIN_DIR:-}" ]; then
  BIN_DIR="$ORIGINDB_BIN_DIR"
elif [ -w /usr/local/bin ] 2>/dev/null; then
  BIN_DIR=/usr/local/bin
elif [ "$(id -u)" = "0" ]; then
  BIN_DIR=/usr/local/bin
else
  BIN_DIR="$HOME/.local/bin"
fi
mkdir -p "$BIN_DIR" 2>/dev/null || SUDO=sudo
SUDO="${SUDO:-}"
# fall back to sudo for a system dir the user can't write
[ -w "$BIN_DIR" ] || [ "$(id -u)" = "0" ] || SUDO=sudo
[ -z "$SUDO" ] || info "Installing to ${B}${BIN_DIR}${RST} (needs sudo)"

# ---- install ----------------------------------------------------------------
n=0
for bin in $BINARIES; do
  if [ -f "$SRC/$bin" ]; then
    $SUDO install -m 0755 "$SRC/$bin" "$BIN_DIR/$bin" 2>/dev/null \
      || { $SUDO cp "$SRC/$bin" "$BIN_DIR/$bin" && $SUDO chmod 0755 "$BIN_DIR/$bin"; }
    n=$((n+1))
  fi
done
[ "$n" -gt 0 ] || die "no binaries found in archive"
ok "Installed ${n} binaries to ${B}${BIN_DIR}${RST}"

# ---- verify + PATH hint -----------------------------------------------------
printf '\n'
if have origindb && [ "$(command -v origindb)" = "$BIN_DIR/origindb" ]; then
  ok "OriginDB is ready — $(origindb --version 2>/dev/null || echo "$VERSION")"
else
  ok "OriginDB ${VERSION} installed"
  case ":$PATH:" in
    *":$BIN_DIR:"*) : ;;
    *) warn "${BIN_DIR} is not on your PATH. Add it:"
       printf '    %s\n' "export PATH=\"$BIN_DIR:\$PATH\"" ;;
  esac
fi

cat <<EOF

  ${B}Next:${RST}
    origindb serve -d ./data -p 8787 -g 50051 --no-auth   ${DIM}# start a server${RST}
    origindb --help                                       ${DIM}# all commands${RST}

  Getting started → ${B}https://origindb.org/getting-started${RST}
EOF

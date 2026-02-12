#!/usr/bin/env bash
set -euo pipefail

URL="https://claude.ai/settings/usage"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

COOKIE_FILE=""
COOKIE_HEADER=""
USE_CHROME="false"
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CHROME_USER_DATA_DIR="$HOME/Library/Application Support/Google/Chrome"
CHROME_PROFILE="Default"
CHROME_COPY_PROFILE="true"
TMP_PROFILE_DIR=""
DEBUG="false"

usage() {
  cat <<'USAGE'
Usage:
  CLAUDE_COOKIE="session=...; __Secure-next-auth.session-token=..." ./claude_5h_usage.sh
  ./claude_5h_usage.sh --cookie-file ~/Downloads/claude_cookies.txt
  ./claude_5h_usage.sh --use-chrome
  ./claude_5h_usage.sh --use-chrome --debug

Notes:
- You must be authenticated to claude.ai.
- For --cookie-file, export cookies in Netscape format (e.g., via a browser extension).
- --use-chrome uses your local Chrome profile cookies to bypass Cloudflare challenges.
  Optional overrides:
    --chrome-bin /path/to/Google\ Chrome
    --chrome-user-data-dir /path/to/Chrome
    --chrome-profile "Profile 1"
    --no-copy-profile   # requires Chrome to be closed
    --debug             # dumps HTML to /tmp/claude_usage.html
USAGE
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "${1:-}" == "--cookie-file" ]]; then
  if [[ -z "${2:-}" ]]; then
    echo "--cookie-file requires a path" >&2
    exit 1
  fi
  COOKIE_FILE="$2"
  shift 2
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    --use-chrome)
      USE_CHROME="true"
      shift
      ;;
    --chrome-bin)
      CHROME_BIN="${2:-}"
      shift 2
      ;;
    --chrome-user-data-dir)
      CHROME_USER_DATA_DIR="${2:-}"
      shift 2
      ;;
    --chrome-profile)
      CHROME_PROFILE="${2:-}"
      shift 2
      ;;
    --no-copy-profile)
      CHROME_COPY_PROFILE="false"
      shift
      ;;
    --debug)
      DEBUG="true"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$COOKIE_FILE" && "$USE_CHROME" != "true" ]]; then
  if [[ -n "${CLAUDE_COOKIE:-}" ]]; then
    COOKIE_HEADER="$CLAUDE_COOKIE"
  else
    echo "Missing auth. Provide CLAUDE_COOKIE env var or --cookie-file." >&2
    usage >&2
    exit 1
  fi
fi

fetch() {
  if [[ "$USE_CHROME" == "true" ]]; then
    if [[ ! -x "$CHROME_BIN" ]]; then
      echo "Chrome not found at: $CHROME_BIN" >&2
      exit 4
    fi
    local user_data_dir="$CHROME_USER_DATA_DIR"
    local profile_dir="$CHROME_PROFILE"
    if [[ "$CHROME_COPY_PROFILE" == "true" ]]; then
      TMP_PROFILE_DIR="$(mktemp -d)"
      # Copy profile + Local State to avoid profile lock and keep auth cookies.
      cp -R "$CHROME_USER_DATA_DIR/$CHROME_PROFILE" "$TMP_PROFILE_DIR/" 2>/dev/null || true
      cp -R "$CHROME_USER_DATA_DIR/Local State" "$TMP_PROFILE_DIR/" 2>/dev/null || true
      user_data_dir="$TMP_PROFILE_DIR"
      profile_dir="$CHROME_PROFILE"
      trap 'rm -rf "$TMP_PROFILE_DIR"' EXIT
    fi
    "$CHROME_BIN" \
      --headless=new \
      --disable-gpu \
      --disable-gpu-compositing \
      --disable-software-rasterizer \
      --disable-features=VizDisplayCompositor \
      --use-angle=swiftshader \
      --use-gl=swiftshader \
      --no-first-run \
      --no-default-browser-check \
      --user-data-dir="$user_data_dir" \
      --profile-directory="$profile_dir" \
      --dump-dom \
      "$URL"
    return
  fi
  if [[ -n "$COOKIE_FILE" ]]; then
    curl -sS -L -A "$UA" -b "$COOKIE_FILE" "$URL"
  else
    curl -sS -L -A "$UA" -H "Cookie: $COOKIE_HEADER" "$URL"
  fi
}

html="$(fetch)"

if [[ "$DEBUG" == "true" ]]; then
  debug_path="/tmp/claude_usage.html"
  printf "%s" "$html" > "$debug_path"
  title="$(python3 - <<'PY'
import re, sys
html = sys.stdin.read()
m = re.search(r'<title>(.*?)</title>', html, re.I|re.S)
print(m.group(1).strip() if m else "")
PY
" <<< "$html")"
  echo "DEBUG: saved HTML to $debug_path" >&2
  [[ -n "$title" ]] && echo "DEBUG: title: $title" >&2
fi

# Try to extract from Next.js __NEXT_DATA__ first
percent="$(python3 - <<'PY'
import re, json, sys
html = sys.stdin.read()

m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html, re.S)
if not m:
    print("")
    sys.exit(0)

data = json.loads(m.group(1))

# Search recursively for keys likely to contain the 5-hour usage percent
candidates = []

def walk(obj, path=""):
    if isinstance(obj, dict):
        for k,v in obj.items():
            p = f"{path}.{k}" if path else k
            if isinstance(v, (int, float)):
                lk = k.lower()
                if any(s in lk for s in ["five", "5", "hour", "percent", "pct", "usage"]):
                    candidates.append((p, v))
            walk(v, p)
    elif isinstance(obj, list):
        for i,v in enumerate(obj):
            walk(v, f"{path}[{i}]")

walk(data)

# Heuristic: prefer values in 0..100 range and keys containing both hour and percent/usage
best = None
for p,v in candidates:
    if isinstance(v, (int,float)) and 0 <= v <= 100:
        pl = p.lower()
        if ("hour" in pl or "five" in pl or "5" in pl) and ("percent" in pl or "pct" in pl or "usage" in pl):
            best = v
            break

if best is None:
    # fallback: any 0..100 value with hour/five in key
    for p,v in candidates:
        if isinstance(v, (int,float)) and 0 <= v <= 100:
            pl = p.lower()
            if ("hour" in pl or "five" in pl or "5" in pl):
                best = v
                break

print("") if best is None else print(best)
PY
" <<< "$html")"

if [[ -n "$percent" ]]; then
  echo "$percent%"
  exit 0
fi

# Fallback: search in raw HTML for a '5-hour' line with a percentage
percent_raw="$(python3 - <<'PY'
import re, sys
html = sys.stdin.read()

# Look for patterns like "5-hour" near a percent value
patterns = [
    r'5\s*-?\s*hour[^%]{0,80}(\d{1,3}(?:\.\d+)?)%?',
    r'(\d{1,3}(?:\.\d+)?)%[^<]{0,80}5\s*-?\s*hour'
]

for pat in patterns:
    m = re.search(pat, html, re.I)
    if m:
        print(m.group(1))
        sys.exit(0)
print("")
PY
" <<< "$html")"

if [[ -n "$percent_raw" ]]; then
  echo "$percent_raw%"
  exit 0
fi

# Detect Cloudflare challenge
if echo "$html" | grep -qi "cloudflare\\|cf-chl\\|checking your browser"; then
  echo "Blocked by Cloudflare challenge. Try: ./claude_5h_usage.sh --use-chrome" >&2
  exit 5
fi

# If we got here, auth likely failed or the page layout changed.
# Check for common auth failure indicators.
if echo "$html" | grep -qi "sign in"; then
  echo "Auth failed: page appears to be a login page." >&2
  exit 2
fi

echo "Could not extract 5-hour usage percent. The page layout may have changed." >&2
exit 3

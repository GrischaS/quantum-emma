#!/bin/bash
# ============================================================
#  QUANTUM EMMA — Release Script
#  Usage: ./scripts/release.sh [major|minor|patch] [message]
#  Example: ./scripts/release.sh minor "Add DEX trading module"
#  © 2026 Grigori Saks
# ============================================================

set -e

TYPE=${1:-patch}
MSG=${2:-"Quantum Emma release"}

CURRENT=$(cat VERSION 2>/dev/null || echo "4.1.0")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$TYPE" in
  major) MAJOR=$((MAJOR+1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR+1)); PATCH=0 ;;
  patch) PATCH=$((PATCH+1)) ;;
  *)     echo "Usage: $0 [major|minor|patch] [message]"; exit 1 ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
TAG="v${NEW_VERSION}"

echo "📦 Bumping: $CURRENT → $NEW_VERSION"
echo "$NEW_VERSION" > VERSION

git add VERSION
git commit -m "chore: Bump version to $TAG — $MSG"
git tag -a "$TAG" -m "Quantum Emma Enterprise $TAG

$MSG

© 2026 Grigori Saks — All Rights Reserved — Patent Pending"

git push origin main
git push origin "$TAG"

echo ""
echo "✅ Released $TAG"
echo "👉 https://github.com/GrischaS/quantum-emma/releases/tag/$TAG"

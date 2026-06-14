# Release Branch — v5.6.0

| Key          | Value                              |
|--------------|------------------------------------|
| Branch       | `release/v5.6.0`                   |
| Tag          | `v5.6.0`                           |
| Base         | `main` @ `f587777`                 |
| Created      | 2026-06-14                         |
| Status       | ✅ Stable Release                  |
| CI           | ✅ All Checks Passed               |

## Merge Policy

- ✅ Nur Bugfixes und Hotfixes in diesen Branch
- ✅ Alle Änderungen via Pull Request
- ✅ Mindestens 1 Review required
- ❌ Keine neuen Features direkt in release-Branch
- 🔀 Hotfixes werden zurück nach `main` gemergt

## Hotfix-Prozess

```bash
# Hotfix-Branch von release/v5.6.0 erstellen
git checkout release/v5.6.0
git checkout -b hotfix/v5.6.1-<description>

# Fix implementieren, committen, pushen
git push origin hotfix/v5.6.1-<description>

# PR → release/v5.6.0 öffnen
# Nach Merge: Tag v5.6.1 setzen
```

---
*© 2026 Grigori Saks — Quantum Emma · Patent Pending*

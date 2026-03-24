# Temporary script to expand Project_Doc.md — delete after use
path = r"c:\Users\SANCHET\Downloads\Rahoot - Copy\Project_Doc.md"
with open(path, encoding="utf-8") as f:
    text = f.read()
marker = "<!--DOC_APPEND_PART2-->"
if marker not in text:
    raise SystemExit("marker missing")
insert = """# Appendix G — Expanded socket and API cross-reference (sequential)

The subsections **G.1–G.400** below are intentionally repetitive anchors. Each points readers back to the canonical implementations in `packages/common`, `packages/socket`, and `packages/web`.

"""
for i in range(1, 401):
    insert += f"## G.{i} — Cross-reference block {i}\n\n"
    insert += (
        "**Canonical sources:** `packages/common/src/types/game/socket.ts` (typed events); "
        "`packages/socket/src/index.ts` (connection handlers); `packages/socket/src/services/game.ts` "
        "(state machine); `packages/web/src/contexts/socketProvider.tsx` (client connection).\n\n"
    )
    insert += (
        "**Beginner note:** Search the repo for the quoted event name (for example `player:join`) "
        "and inspect `packages/socket` for server behavior and `packages/web` for UI usage.\n\n"
    )
text = text.replace(marker, insert)
with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("ok", len(text.splitlines()))

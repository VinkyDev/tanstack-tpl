---
name: coding-conventions
description: Project-wide coding conventions to apply whenever writing or editing code — cohesion, comments, and TypeScript type safety. Use when authoring new code, refactoring, or reviewing diffs.
---

Apply every rule on every change. These are not suggestions — they bind each line you write or touch.

## Cohesion and coupling

**High cohesion, low coupling.** When the same kind of logic appears in more than one place, route it through a single adapter layer instead of duplicating it across call sites. The adapter is the seam: callers depend on it, not on each other, and extensions land in one place.

Trigger: any time you find yourself writing logic that resembles logic already living elsewhere in the codebase. Stop, find the existing home, and either reuse it or lift both sites into a shared adapter.

## Comments

**Write no comment by default.** Express intent through naming and structural decomposition — a well-named function and a clean split outperform a paragraph above them. Only annotate the genuinely non-obvious: a hidden constraint, a workaround tied to a specific bug, an invariant a reader would not infer.

If removing a comment would not confuse a future reader, it is a no-op — delete it. Never narrate what the code does; the code already does that.

## TypeScript type safety

**Never write `any`.** When a type is genuinely unknown at the boundary, use `unknown` and narrow it explicitly before use. `unknown` forces the narrowing the reader needs; `any` silently discards the type system.

This rule has no exceptions for "just this once" or "to unblock". If `unknown` is too painful, the right move is to model the boundary more precisely, not to reach for `any`.

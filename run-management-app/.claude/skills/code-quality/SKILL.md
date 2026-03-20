---
name: code-quality
description: Framework defining what good code looks like across all dimensions. MUST USE when writing, reviewing, or reasoning about code quality. Consult this skill to evaluate code against quality standards, make trade-off decisions, or understand what qualities to prioritize. Covers readability, correctness, reliability, operability, efficiency, maintainability, safety, and consistency.
---

This skill operates at two levels of detail.

**Level 1 Quick reference** (below): key principle per dimension. Use this when making day-to-day decisions or performing a first-pass review.

**Level 2 Full specification**: individual reference files in `references/` in this skill's directory. Read the relevant file when you need precise definitions, detection heuristics, or are making a consequential judgment call about a specific dimension.

---

## Quick Reference

### Readability
Code communicates intent. Names are domain-specific. Comments explain *why*, never *what* — if deleting a comment leaves the code equally clear, delete it. Abstractions are earned from demonstrated need, not anticipated need.

### Correctness
Tests precede implementation. Each significant behavior has a test that would fail if it changed. Tests cover failure cases. When a function is hard to test, that is a design signal — not a reason to skip testing.

### Reliability
Failures are explicit and loud. Every external call has a timeout. Resources acquired are always released. Retried operations are idempotent. The system degrades gracefully, it does not collapse.

### Operability
Logs are structured. Requests carry correlation IDs end-to-end. Configuration is validated at startup, not at runtime. Services expose liveness and readiness checks.

### Efficiency
Avoid obvious waste — wrong data structures, O(n²) where O(n) is equally clear, unnecessary copies. Do not optimise without measurement. When performance requires complex code, isolate and document the complexity.

### Maintainability
Small, focused units. High cohesion within modules, loose coupling between them. A behavioral change should touch one place. Shortcuts are marked and tracked; they are not hidden.

### Safety
No secrets in source. External input is never trusted — sanitise at the boundary. Request only the minimum privilege needed. Personal data is minimised and access is auditable.

### Consistency
New code follows existing project patterns. Divergence is explicit and documented. Style and correctness rules are enforced by tooling, not by memory.

---

## When to go deeper

If you are:
- Auditing a non-trivial codebase for quality issues
- Unsure whether a specific pattern violates a standard
- Writing a structured code review with dimension-by-dimension analysis
- Making a trade-off decision between two quality dimensions

…read the relevant reference file for full definitions, detection heuristics, and examples:

| Dimension | Reference |
|---|---|
| Readability | `references/readability.md` |
| Correctness | `references/correctness.md` |
| Reliability | `references/reliability.md` |
| Operability | `references/operability.md` |
| Efficiency | `references/efficiency.md` |
| Maintainability | `references/maintainability.md` |
| Safety | `references/safety.md` |
| Consistency | `references/consistency.md` |

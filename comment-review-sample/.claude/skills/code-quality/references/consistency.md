# Consistency

Good code respects the project's established patterns and standards.

## Project Standards

### Style Conformance

Code follows the project's style guide and conventions. Formatting is consistent. Naming patterns match existing code. A reader moving through the codebase does not encounter jarring style shifts.

### Idiomatic Patterns

Solutions use patterns established in the project. When the project has a way of doing something, new code follows that way unless there is explicit reason to diverge. Divergence is documented.

## Automated Enforcement

### Static Analysis

Linters, formatters, and type-checkers run as part of development and CI. Style and correctness rules are enforced automatically, not through manual review. Deviations are documented with rationale.

### Security Scanning

Dependency vulnerability checks and static security analysis run regularly. Findings are addressed or tracked with mitigation plans.


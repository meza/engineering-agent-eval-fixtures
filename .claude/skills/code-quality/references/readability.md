# Readability

Good code communicates its intent to human readers. A developer encountering the code for the first time can understand what it does and why.

## Clarity

### Expressive Naming

Names are domain-specific and descriptive. A name communicates what something is or does without requiring the reader to trace through implementation. Where a generic term like "manager" or "handler" might appear, a domain-specific term that conveys actual meaning appears instead. Single-character names appear only in tightly scoped contexts like loop indices where their meaning is unambiguous.

### Domain-Aligned Structure

Code organization reflects the problem domain. Concepts that belong together live together. Boundaries between domains are clear. The structure makes navigation intuitive because it mirrors how domain experts think about the problem.

### Self-Documenting Code

Comments explain why, not what. The code itself, through names, types, and structure, communicates what it does.

**Comments that restate what code already says are prohibited.** A comment like `i++ // increment i` adds noise, not value. Such comments increase maintenance burden because they must be updated when code changes, yet provide no information that the code does not already convey. When code is clear, adding a comment that restates it makes the code worse, not better.

Comments exist for:
- Non-obvious constraints that cannot be expressed in code
- Historical context explaining why an unusual approach was taken
- Reasoning that the code cannot convey (regulatory requirements, performance justifications, safety considerations)
- External constraints invisible to the reader (library bugs, upstream limitations, compatibility requirements)
- Public API docblocks that describe contracts, parameters, return values, and error conditions

When you feel the urge to write a comment explaining what code does, consider whether renaming, restructuring, or simplifying would eliminate the need for the comment. If the code cannot be made self-explanatory, then the comment is justified. If the code is already clear, the comment is redundant.

#### Detecting Redundant Comments

Redundant comments often appear professional and informative while adding no value. Apply these detection heuristics:

**The Deletion Test**
Remove the comment mentally and read only the code. If a competent developer familiar with the language and domain would understand the same information from the code alone, the comment is redundant. This is the primary test; the patterns below help identify candidates for it.

**The Keyword Echo Pattern**
When a comment's key terms appear in the code it describes, the comment is likely redundant. Look for comments that echo identifiers, type names, or language constructs visible in the adjacent code. The presence of shared vocabulary between comment and code is a signal to apply the deletion test.

**The Function Name Restatement Pattern**
A comment that restates what a function name already says provides no value. Function-level comments are justified only when they explain something the name cannot convey: preconditions, postconditions, side effects, performance characteristics, constraints, or non-obvious behavior.

**The Obvious Mechanism Pattern**
Comments that describe what a language construct does are redundant to anyone who knows the language. When a comment explains the behavior of a standard language feature, loop, conditional, or synchronization primitive, the comment is redundant unless it explains why that mechanism was chosen or why it matters in this specific context.

**The "Why" Test**
A comment passes review if it answers "why" in a way the code cannot. Acceptable comments explain: why this approach instead of an obvious alternative, why a constraint exists due to external factors, why ordering or timing matters, or why a specific value was chosen. A comment fails review if it only answers "what" when the code already answers "what."

**Applying the Heuristics**

These patterns identify candidates; the deletion test determines guilt. A comment matching a pattern is not automatically redundant. A comment that echoes a keyword but also explains an external constraint or design rationale may be justified. The question is always: does this comment provide information the code does not?

## Simplicity

### Minimal Solutions

The simplest approach that solves the problem is preferred. Clever solutions give way to clear ones. When multiple approaches exist, the one with fewer moving parts wins unless there is concrete evidence that complexity pays for itself.

### Earned Abstractions

Abstractions emerge from demonstrated, repeated need. An abstraction exists because multiple concrete use-cases demanded it, not because someone imagined future use-cases might. Three similar implementations coexist comfortably until the pattern is clear; premature unification is more costly than temporary duplication.

### Small Surfaces

Public interfaces expose only what consumers need. Every additional public function, method, or type is a commitment. What can remain private does remain private. Internal implementation details do not leak through the interface.

## Explicitness

### Visible Dependencies

Dependencies are declared and injected, not discovered or assumed. Looking at a unit's construction tells you what it needs. No magic discovery, no ambient singletons, no implicit service locators.

### Visible Configuration

Configuration comes from outside the code: environment, files, parameters. Not from hard-coded values buried in implementation. The code's behavior can be understood and modified without changing source.

### Visible State

When state exists, its scope and lifecycle are clear. Global mutable state is absent or explicitly isolated. Data flows through parameters and return values. Side effects are visible in function signatures or naming conventions.

### Visible Assumptions

When code depends on conditions it cannot verify, environmental constraints, upstream guarantees, or timing assumptions, those assumptions are stated. The reader knows what must be true for the code to work correctly.

## Interface Design

### Consistent APIs

Public interfaces follow consistent patterns. Similar operations have similar signatures. Naming conventions are uniform. A developer who learns one part of the API can predict how other parts behave.

### Versioned Contracts

APIs that have external consumers are versioned. Breaking changes are explicit and managed. Consumers can depend on stability within a version.

### Backward Compatibility

Changes to public interfaces preserve compatibility with existing consumers unless breaking changes are explicitly communicated and justified. Migration paths exist when contracts must change.


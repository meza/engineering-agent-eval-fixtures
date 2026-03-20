# Correctness

Good code does what it claims to do, and demonstrates this through verification.

## Design for Testability

### Single Responsibility

Each unit has one clear purpose. A function does one thing. A class represents one concept. A module owns one bounded context. When describing what a unit does, "and" rarely appears. Units with single responsibilities are straightforward to test.

### Composition Over Inheritance

Shallow composition is preferred over deep inheritance hierarchies. When inheritance appears, the relationships are genuine "is-a" relationships. Deep hierarchies with overridden behavior throughout are difficult to test and reason about.

### Injectable Dependencies

Dependencies can be provided at construction time, enabling tests to substitute controlled implementations where necessary. The code does not reach out to discover its dependencies through global state or service locators.

## Predictability

### Deterministic Behavior

Given the same inputs in the same state, the code produces the same outputs. Randomness, time-dependence, and external state are isolated and controllable. Surprising variations in behavior do not occur.

### No Hidden Nondeterminism

When behavior must vary due to randomness, time, or external factors, this is explicit in the interface. The sources of variation are visible and can be controlled for testing.

## Testing Philosophy

### Tests Map to Behavior

Each significant behavior has at least one test that would fail if the behavior changed. Tests document what the code promises. The connection between behavior and test is traceable.

### Tests Precede Implementation

For new or significant behavior, the test exists before the implementation. The test defines what "correct" means. The implementation satisfies the test. When test-first is impractical for small fixes, tests are added before the change is complete.

### Tests Cover Failure Cases

Tests cover what happens when things go wrong: invalid input, missing data, failed dependencies, boundary conditions. The code's behavior under failure is as intentional and verified as its behavior under success.

## Testing Practice

### Tests Exercise Real Code

Tests run the actual production code paths whenever possible. Test doubles appear only where necessary: to control nondeterminism (time, randomness, network, filesystem) or to force rare conditions (disk full, connection timeout). The code path a test exercises is the code path production uses.

### Tests Are Deterministic

A test produces the same result every time it runs. No flakiness, no timing dependencies, no order dependencies. A failing test means the code is wrong, not that the test is unreliable. Flaky tests are isolated and tracked for remediation; they are never ignored or normalized.

### Tests Are Fast

Tests run quickly enough to run frequently. Slow tests are separated and labeled. The fast test suite provides rapid feedback during development. Test organization supports parallel execution.

### Tests Are Never Hidden

Tests are not changed or skipped to force a green build. When behavior legitimately changes, tests are updated with clear reasoning. Skipped tests without documented rationale and remediation plan do not persist.


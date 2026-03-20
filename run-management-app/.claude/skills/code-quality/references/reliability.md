# Reliability

Good code behaves predictably under normal conditions and degrades gracefully under stress.

## Error Handling

### Explicit Error Paths

The possible failures are visible in the code's interface through types, return values, or documented exceptions. A caller knows what can go wrong without reading the implementation.

### Loud Failures

Invalid states are detected and reported, not silently ignored. When something is wrong, the code says so. Silent failures that corrupt data or mislead users do not occur.

### Boundary Validation

Input from outside the system (users, APIs, files, network) is validated at entry. Once validated, the data flows through the system without repeated checking. Internal code trusts the invariants established at boundaries.

### Designed Recovery

When failures occur, the response is intentional. Retries use backoff. Failures are isolated to prevent cascading. Degraded modes are explicit. The system fails gracefully rather than catastrophically.

## Resource Management

### Acquire-Release Discipline

Resources that are acquired are released. Files are closed. Connections are returned to pools. Locks are released. Memory is freed when no longer needed. The code does not leak resources under any code path, including error paths.

### Scoped Lifetimes

Resource lifetimes are tied to lexical scope or explicit ownership. Language constructs like try-with-resources, defer, using, or RAII patterns ensure cleanup happens automatically. Manual cleanup spread across the codebase is avoided.

### Bounded Resource Usage

Resource consumption has limits. Connection pools have maximum sizes. Buffers have bounds. Queues have capacity limits. Unbounded growth that could exhaust system resources does not occur.

## Resilience Patterns

### Timeouts on External Calls

Every call to an external system (network services, databases, file systems) has a timeout. The code does not wait indefinitely for responses that may never come. Timeout values are appropriate to the operation.

### Circuit Breakers

Repeated failures to external dependencies trigger circuit breakers that prevent continued attempts. The system degrades rather than waiting indefinitely or overwhelming failing services.

### Bulkheads

Failure in one part of the system does not cascade to unrelated parts. Resource pools are isolated. One misbehaving component cannot exhaust resources needed by others.

### Graceful Degradation

When components fail, the system continues operating with reduced functionality rather than failing entirely. Fallback behaviors are explicit and tested.

### Idempotent Operations

Operations that may be retried produce the same result when executed multiple times. Network failures, timeouts, and retries do not cause duplicate effects. Where true idempotency is impossible, duplicate detection or compensation mechanisms exist.

## Concurrency

### Thread-Safe Patterns

Concurrent code uses established idioms for safety. Data races cannot occur. Ownership of mutable state is clear and enforced. Race detectors are used where available.

### Documented Concurrency Constraints

When code assumes sequential access, single-threaded execution, or specific timing, those assumptions are stated. The reader knows what concurrency guarantees the code requires.

## Data Integrity

### Reversible Migrations

Schema changes can be undone. Migrations are tested on representative data before production. The path back exists. Large migrations are staged and monitored.

### Protected Invariants

Data invariants are enforced at the appropriate layer: schema constraints, validation logic, or application rules. Invariants do not rely solely on application code that might be bypassed.


# Operability

Good code reveals its runtime behavior and operates well in production.

## Observability

### Structured Telemetry

Logs are structured and machine-parseable. Metrics cover the important dimensions: request rates, error rates, latencies at meaningful percentiles (p50, p95, p99). Naming conventions are consistent across the system.

### Traceable Requests

Requests carry correlation IDs through the system. A request can be traced from entry to exit across service boundaries. When something goes wrong, the path is visible in logs and traces.

### Informative Errors

Error messages contain enough context to understand what happened and why. They guide diagnosis without exposing sensitive information. Stack traces and correlation IDs appear where appropriate.

## Startup and Shutdown

### Configuration Validation at Startup

Configuration is validated when the application starts. Missing values, invalid formats, and inconsistent settings cause immediate, clear failures. The application does not start in a broken state only to fail later at runtime.

### Graceful Shutdown

The application handles termination signals properly. In-flight requests complete or are cleanly aborted. Connections drain. Resources are released. The shutdown process is orderly, not abrupt.

## Health Exposure

### Health Checks

Services expose their health status through standard endpoints. Liveness checks indicate the process is running. Readiness checks indicate the service can handle requests. Health checks are lightweight and accurate.

### Dependency Health

Health checks reflect the status of critical dependencies. A service reports unhealthy when it cannot fulfill its purpose due to downstream failures.


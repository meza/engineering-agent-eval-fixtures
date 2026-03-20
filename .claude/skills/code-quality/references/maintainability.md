# Maintainability

Good code is safe and easy to change over time.

## Structural Qualities

### Small Units

Functions are short. Classes are focused. Files are navigable. Nothing is so large that understanding it requires heroic effort. Small units are easier to understand, test, and replace.

### High Cohesion

Elements within a module belong together. A module's contents are related and work toward a common purpose. Unrelated functionality lives elsewhere. When you need to change something, the relevant code is in one place.

### Loose Coupling

Modules depend on each other through narrow, stable interfaces. Changes to one module's internals do not ripple through the codebase. Dependencies point in one direction. Circular dependencies do not exist.

### Localized Changes

Changing one behavior does not require changes scattered across the codebase. Related code lives together. Coupling between distant parts is minimal. A change's blast radius is predictable.

### Incremental Evolution

The code can be changed in small steps. Large changes decompose into smaller, independently viable changes. The path from current state to desired state has stable intermediate points. Each step is reviewable and reversible.

## Debt Management

### Visible Debt

When shortcuts exist, they are marked. Technical debt is tracked explicitly, not hidden in the codebase. TODOs convert to tracked items. The cost of past decisions is visible so future decisions can account for it.

### Scoped Refactoring

Refactoring stays within the current task's scope. Broad refactors do not mix with feature work. When larger refactoring is needed, it is proposed separately with clear boundaries and rollback strategy.


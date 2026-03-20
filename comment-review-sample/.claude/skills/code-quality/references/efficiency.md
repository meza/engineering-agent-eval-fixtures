# Efficiency

Good code uses resources appropriately without premature optimization.

## Performance Awareness

### No Needless Waste

Code does not perform obviously inefficient operations when equally clear alternatives exist. O(n²) algorithms are not used when O(n) solutions are equally readable. Unnecessary allocations, copies, and iterations are avoided.

### Appropriate Data Structures

Data structures match access patterns. Lookups use maps or sets, not linear scans through lists. Sorted data uses appropriate search. The choice of structure reflects how the data is used.

### Lazy Computation

Expensive operations are deferred until needed. Large data sets are processed incrementally or streamed rather than loaded entirely into memory when possible.

## Optimization Discipline

### Measured, Not Assumed

Performance improvements are based on measurement, not intuition. Profiling identifies actual bottlenecks. Optimizations target measured problems.

### Preserved Clarity

Optimizations do not sacrifice clarity without justification. When performance requires complex code, the complexity is isolated and documented. The simple path remains available for understanding.


# Safety

Good code protects users, data, and systems from harm.

## Security

### No Embedded Secrets

Credentials, keys, tokens, and passwords do not appear in source code. Secrets enter through secure runtime channels. The code can be made public without exposing access. If secrets are discovered in code, they are revoked and rotated immediately.

### Input Sanitization

External input is never trusted. Values are validated and sanitized before use. Injection attacks (SQL, command, script) cannot succeed because untrusted data never reaches dangerous contexts unsanitized.

### Minimal Privilege

Code requests only the access it needs. Permissions default to denied. Capabilities are scoped narrowly. Access controls are enforced, not advisory.

## Privacy

### Data Minimization

Personal data collection is limited to what is necessary. Data is not retained longer than needed. The code does not enable fishing expeditions through user data.

### Controlled Access

Access to personal data is logged and auditable. The code respects user consent and privacy preferences. Legal and policy requirements are reflected in the implementation.

## Inclusivity

### Accessible Interfaces

User-facing code meets accessibility standards appropriate to the project. Users with disabilities can use the software. Accessibility is designed in from the start, not retrofitted.

### Inclusive Language

APIs, logs, documentation, and code use inclusive terminology. Language choices are thoughtful. Harmful or exclusionary terms are avoided.


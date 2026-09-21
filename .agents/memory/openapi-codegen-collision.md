---
name: OpenAPI codegen collision
description: An Orval naming edge case in this workspace when generated Zod schemas and generated TypeScript types share a params name.
---

When an operation has a path parameter and a query-only parameter, Orval can emit the same `*Params` name into both the generated Zod API barrel and generated types barrel. This breaks the workspace typecheck even though code generation itself succeeds.

**Why:** The generated Zod path schema uses the operation-level `Params` name, while a query-only generated type may use the same operation-level name.

**How to apply:** Keep the first contract for mixed path/query list endpoints minimal, or verify generated exports immediately after codegen before adding more filters. Regenerate and run `pnpm run typecheck:libs` after every OpenAPI change.
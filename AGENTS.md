<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

- Always run `bun run build` after making changes to the codebase.
- Always check available UI components in `components/ui` before making frontend changes.
- Put test files under `__tests__` folders.
- To run tests, use `bun run test`, not `bun test`.

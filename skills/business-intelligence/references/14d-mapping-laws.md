# Lemeone 14D DNA Mapping Laws (Empirical Edition)

This guide defines the physical evidence required to justify scores across all 14 dimensions.

## 1. Product Core (D1-D4)
*   **D1 (PERF)**: Look for `@tanstack/query` (caching), `Worker` threads, `Wasm`, `Redis`, or `CDN` configurations.
*   **D2 (DEPTH)**: Analyze database schemas. Count entities and relationships. Look for complex server-side logic in `/lib/engine` or `/services`.
*   **D3 (INTERACT)**: Use `UX_AUDIT_FRAMEWORK.md`. Check for design tokens and micro-interactions.
*   **D4 (STABLE)**: Check for `playwright`, `cypress`, `sentry`, and `.github/workflows`. High coverage = High Score.

## 2. Gateways (D5-D6)
*   **D5 (ENTRY)**: Presence of OAuth providers (Clerk, Auth0). If it requires a manual database setup or complex environment keys without a CLI, score is lower.
*   **D6 (MONETIZE)**: Presence of `stripe`, `lemon-squeezy`, or `paddle`. If absent, D6 <= 0.3.

## 3. Market Dynamics (D7-D9)
*   **D7 (UNIQUE)**: Search for proprietary algorithms or custom-built engines that don't rely on generic APIs.
*   **D8 (SOCIAL)**: Presence of sharing logic, multi-player sync (`yjs`, `socket.io`), or referral system code.
*   **D9 (CONSISTENCY)**: For AI: Logic for prompt versioning and validation. For SaaS: Transactional integrity and error-handling robustness.

## 4. Strategy (D10-D13)
*   **D10 (ECOSYSTEM)**: Exported interfaces, SDK folders, `webhook` endpoints, and OpenAPI/Swagger docs.
*   **D11 (BARRIER)**: Custom-trained models, high-performance C++ extensions, or massive private dataset processing logic.
*   **D12 (GLOBAL)**: i18n libraries, timezone handling, and RTL (Right-to-Left) CSS support.
*   **D13 (CURVE)**: Roadmap files, "Upcoming Features" in documentation, and depth of the `TODO` backlog.

## 5. GTM (D14)
*   **D14 (AWARENESS)**: SEO configs, analytics, social links, and landing page assets.

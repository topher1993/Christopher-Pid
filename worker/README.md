# Christopher AI MiniMax proxy

This Worker keeps the MiniMax API key off the public portfolio and sends bounded chat requests to `MiniMax-M2.7`.

## Setup

1. Install dependencies with `npm install`.
2. Get the Token Plan API key from MiniMax Platform → Billing → Token Plan.
3. Store it locally in `worker/.dev.vars` as `MINIMAX_API_KEY=...` (this file is ignored by Git).
4. Run `npm run dev` and set the portfolio's `christopher-ai-endpoint` meta tag to `http://127.0.0.1:8787/api/chat` for local testing.
5. Authenticate with Cloudflare using `npx wrangler login`.
6. Store the production secret using `npx wrangler secret put MINIMAX_API_KEY`.
7. Validate with `npm run typecheck` and `npm run deploy:dry`, then deploy with `npm run deploy`.
8. Put the deployed `/api/chat` URL in the portfolio's `christopher-ai-endpoint` meta tag.

Never place the MiniMax key in `index.html`, browser JavaScript, Git, or `wrangler.jsonc`.

There is no application-level request throttle. Cloudflare and MiniMax platform protections and quotas still apply. Origin checks, request-size limits, message validation, and provider timeouts remain enabled.

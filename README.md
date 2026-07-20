# Christopher Pid — Portfolio

Personal portfolio for Christopher Pid, a Tokyo-based product designer and software developer working across CAD, manufacturing automation, mobile apps, and AI-enabled tools.

## Live site

[christopher-portfolio93.web.app](https://christopher-portfolio93.web.app/)

GitHub Pages mirror: [topher1993.github.io/Christopher-Pid](https://topher1993.github.io/Christopher-Pid/)

## Featured work

- [Japanese Tutor](https://github.com/topher1993/japanese-tutor) — Expo/React Native learning app with an offline-ready data foundation.
- [Agent Army Stronghold](https://github.com/topher1993/Agent-Army-stronghold) — guarded React/TypeScript mission-control dashboard.
- [QuickScan Pay](https://github.com/topher1993/QuickScan) — AI-assisted extraction and scan-record workflow.
- Parametric CAD workflows — CATIA V5 templates and automation developed through professional product-design work.

## Stack

The site uses semantic HTML, modern CSS, and vanilla JavaScript. Christopher AI uses a small Cloudflare Worker as a secure proxy to MiniMax M2.7; the browser never receives the MiniMax key.

## Run locally

Serve the repository with any static server, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Christopher AI uses the deployed MiniMax Worker when available and falls back to its curated on-page knowledge base if the network or provider is unavailable. Worker setup and deployment notes are in [worker/README.md](worker/README.md).

## Structure

```text
index.html              Main portfolio
cv-template.html        Printable resume
styles/style.css        Responsive visual system
script/script.js        Navigation, constellation, contact, and AI persona behavior
images/                 Profile and brand assets
worker/                 Secure MiniMax M2.7 proxy and deployment configuration
```

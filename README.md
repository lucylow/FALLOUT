# FALLOUT Command Center

FALLOUT is a Carbon Relay-inspired quantum key orchestration command center for monitoring exchange quality, relay attestation, protocol policy state, operator actions, and rekey recommendations. This repository contains the final React frontend and the lightweight static-serving wrapper used by the Manus deployment.

> **Live application:** [falloutcc-eyak7ypw.manus.space](https://falloutcc-eyak7ypw.manus.space)

## Overview

The interface is designed as an operator-facing security console rather than a generic dashboard. It emphasizes high-signal telemetry, explicit policy language, recoverable actions, and visible safety boundaries around quantum key operations.

The current release provides the following frontend capabilities:

| Capability | Description |
|---|---|
| Command-center shell | Responsive sidebar navigation, mobile navigation, UTC clock, connection state, focus mode, and command palette access. |
| Quantum protocol panel | BB84 exchange integrity view with QBER point estimate, confidence upper bound, policy threshold, sampling-confidence visualization, and scenario previews. |
| Protocol-state switcher | Preview healthy, review-required, and rekey-recommended states. The selected state updates the policy label, explanatory copy, and budget bar. |
| Rekey workflow | Request-rekey action, affected-relay confirmation drawer, explicit cancel/confirm controls, and audit acknowledgment feedback. |
| Action history | Local protocol-action history with Pending, Confirmed, and Canceled states, filters, counts, filtered empty states, and a clear control. |
| Relay health | Attestation matrix with responding relay count, latency, and review indicators. |
| Operator activity | Recent action timeline, activity summary, review counts, and incident stream with dismiss, restore, and audit-log affordances. |
| Responsive design | Desktop and mobile layouts with compact controls, focus-visible states, and reduced-motion support. |

## Technology

The project uses React 19 with TypeScript, Vite, Tailwind CSS 4, Wouter, Radix UI primitives, Lucide icons, Framer Motion, and an Express static-serving wrapper. The frontend is organized under `client/`, while `server/` contains the production static server entry point supplied by the Manus template.

| Layer | Technologies |
|---|---|
| UI | React 19, TypeScript, Tailwind CSS 4 |
| Build | Vite 7, esbuild, pnpm |
| Routing | Wouter |
| Components | Radix UI, custom Carbon Relay primitives, Lucide React |
| Styling | `client/src/index.css`, CSS variables, responsive media queries |
| Serving | Express wrapper in `server/index.ts` |
| Validation | TypeScript compiler and production Vite build |

## Repository Structure

```text
.
├── client/
│   ├── index.html              # Document metadata and application entry point
│   └── src/
│       ├── components/         # Error boundary, maps, and UI primitives
│       ├── contexts/            # Theme context
│       ├── hooks/               # Reusable interaction hooks
│       ├── lib/                 # Shared frontend utilities
│       ├── pages/
│       │   ├── Home.tsx        # FALLOUT command-center experience
│       │   └── NotFound.tsx     # Fallback route
│       ├── App.tsx              # Application shell and routes
│       ├── index.css            # Carbon Relay design system and responsive styles
│       └── main.tsx             # React bootstrap
├── server/
│   └── index.ts                # Production static server wrapper
├── shared/
│   └── const.ts                # Shared template constants
├── patches/                    # Package patches used by the template
├── package.json                # Scripts and dependencies
├── pnpm-lock.yaml              # Locked dependency graph
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This document
```

## Requirements

Use Node.js 20 or newer and pnpm 10 or newer. The project does not require a database or backend service to render the current frontend experience. The hosted version uses Manus-managed asset URLs for the generated visual artwork, so the UI can load those assets without placing large binaries in the Git repository.

## Installation

Clone or upload the repository, enter the project directory, and install dependencies:

```bash
git clone <your-github-repository-url>
cd fallout-command-center
pnpm install
```

If you prefer npm, the package metadata is compatible with npm installation, but the lockfile and project scripts are maintained for pnpm.

## Development

Start the Vite development server with:

```bash
pnpm dev
```

The development server binds to the host interface and prints its local URL. Open that URL in a browser to use the command center.

## Validation

Run the TypeScript check before committing changes:

```bash
pnpm check
```

Create the production bundle with:

```bash
pnpm build
```

The build produces the browser bundle under `dist/public/` and bundles the static Express server entry point as `dist/index.js`. Preview the Vite output with:

```bash
pnpm preview
```

To run the bundled server after building:

```bash
pnpm start
```

The final release was verified with a clean TypeScript check, a successful production build, and responsive desktop/mobile rendering checks.

## Interaction Guide

The top bar exposes the connection state, focus mode, UTC time, command palette, and operator profile controls. The command palette can be opened with the visible keyboard shortcut affordance or the `Cmd/Ctrl + K` convention used by the interface. Focus mode reduces secondary telemetry surfaces so the operator can concentrate on the active security state.

The BB84 protocol panel is intentionally explicit about the difference between the observed QBER point estimate, the conservative confidence upper bound, and the review threshold. Operators can preview healthy, review-required, and escalated states without changing backend data. The **Request rekey** action opens a confirmation drawer that identifies the affected relay set and explains that existing key handles remain protected.

After confirmation, the UI records an audit acknowledgment and adds the action to local history. Canceling the drawer records a canceled local action and leaves the protocol state unchanged. The local history can be filtered by state or cleared from the panel.

## Quantum and Security Boundaries

This repository contains a frontend command-center experience. The visible QBER, relay, throughput, entropy, and attestation values are presentation-layer telemetry for the interface and should not be treated as a production cryptographic source of truth without connecting them to a trusted backend.

The frontend deliberately avoids displaying plaintext candidate key material. The rekey workflow is an operator interaction surface, not an authorization boundary. A production integration should enforce permissions, validate policy server-side, create an immutable audit record, and return opaque key handles rather than key bytes.

The protocol panel distinguishes point estimates from conservative confidence bounds because policy decisions should not rely on a single observed statistic. Any production BB84 or QKD deployment must use a validated implementation, authenticated classical channels, privacy amplification, parameter estimation, key confirmation, and an independently reviewed security proof appropriate to the selected protocol and threat model.

## Asset Handling

The visual system references Manus-managed storage URLs for the FALLOUT relay artwork and telemetry grid. These URLs are intentionally referenced directly in the frontend rather than copying large image files into `client/public/` or `client/src/assets/`.

If you fork the project outside Manus, replace the managed asset URLs with files hosted by your own static asset service or add appropriately licensed assets to a dedicated public asset pipeline. Do not commit secrets, credentials, or plaintext key material to the repository.

## Deployment Notes

The project is suitable for a static frontend deployment with a Node-compatible server wrapper. For Manus hosting, saving a checkpoint publishes the project automatically when auto-publish is enabled. For another host, run `pnpm build`, serve the resulting static output, and configure the host to return `index.html` for client-side routes.

Before deploying to an external environment, confirm the following:

| Check | Expected result |
|---|---|
| TypeScript | `pnpm check` completes without errors. |
| Production build | `pnpm build` completes successfully. |
| Asset loading | Relay mark, hero artwork, and telemetry grid load from valid URLs. |
| Responsive behavior | Desktop and mobile layouts remain usable. |
| Security review | Backend authorization and audit persistence are implemented separately. |
| Configuration | No credentials or secrets are committed. |

## Contributing

Keep frontend changes focused and preserve the Carbon Relay design language: near-black graphite surfaces, restrained signal-green accents, monospaced micro-labels, purposeful instrumentation, and clear operator feedback. Prefer accessible native controls, visible focus states, explicit empty states, and recoverable error paths.

When adding a new operator action, provide a pending state, a success or confirmation state, a cancellation or failure state, and a visible explanation of what has and has not changed. When adding quantum telemetry, label point estimates and conservative bounds separately and document the policy meaning of each threshold.

## License

No license file was supplied with the source package. Add a license before distributing the repository publicly, and confirm that any generated artwork or third-party assets are licensed for the intended use.

## Release Information

The final Manus-published release is represented by the checkpoint supplied with this package. The public application is available at [falloutcc-eyak7ypw.manus.space](https://falloutcc-eyak7ypw.manus.space).

# FALLOUT Command Center — Design Direction

## Three possible directions

### Theme Name: Carbon Relay
**Very Brief Intro:** A dark graphite operations console with controlled signal-green accents, inspired by aerospace telemetry and secure infrastructure rooms. It balances urgency with disciplined clarity.
**Probability:** 0.07

### Theme Name: Polar Circuit
**Very Brief Intro:** A pale, editorial interface built around frosted blues, technical diagrams, and quiet precision. It makes quantum infrastructure feel trustworthy and research-led rather than theatrical.
**Probability:** 0.03

### Theme Name: Ember Protocol
**Very Brief Intro:** A warm, high-contrast command interface using rust, paper, and deep ink, evoking field notebooks, incident response, and mission control. It makes every status feel tactile and consequential.
**Probability:** 0.08

## Chosen Direction: Carbon Relay

### Design Movement
Contemporary industrial brutalism softened by aerospace instrumentation and premium software ergonomics.

### Core Principles
1. **Operational hierarchy:** the interface should make system state readable in under five seconds.
2. **Signal over decoration:** color is reserved for live health, threat, and action states.
3. **Instrumented depth:** thin rules, telemetry ticks, grid traces, and subtle grain create a sense of engineered machinery.
4. **Asymmetric confidence:** a strong left rail and offset content columns avoid generic centered-dashboard composition.

### Color Philosophy
The base is near-black graphite rather than pure black, giving the UI room for layered surfaces and readable shadows. The ownable accent is signal green, used sparingly for healthy quantum state and active controls. Amber marks scrutiny and pending state; coral marks threat and failure. These hues are functional signals, not decoration.

### Layout Paradigm
A persistent left command rail anchors the product while the main canvas uses a staggered telemetry grid: a dominant system-status panel, compact live metrics, and a right-side incident stream. Mobile collapses the rail into a top control strip without losing hierarchy.

### Signature Elements
- A thin vertical signal line that ties the wordmark, live status, and current navigation together.
- Monospaced micro-labels with small coordinate-like metadata.
- Soft radial instrumentation glows behind key metrics, paired with crisp 1px rules.

### Interaction Philosophy
Interactions should feel like operating a dependable instrument: immediate, reversible, and explicit. Hover states reveal context without shifting layout. Buttons provide pressed feedback. Every nonfunctional control is labeled as a future capability rather than pretending to work.

### Animation
Use brief opacity and translate transitions, generally 160–240ms. Metric cards enter with a subtle stagger. The live signal indicator uses a restrained pulse. Respect reduced-motion preferences by disabling decorative movement while preserving state changes.

### Typography System
Use **Space Grotesk** for headlines and navigation, with **IBM Plex Mono** for telemetry, labels, identifiers, and numeric readouts. Headlines use tight tracking and occasional italic emphasis; body copy is compact and neutral.

### Brand Essence
FALLOUT is the quantum key command center for teams that need secure coordination without losing operational visibility. Personality: **precise, vigilant, composed**.

### Brand Voice
Headlines are direct and mission-oriented. CTAs are verbs with clear outcomes. Microcopy names what the system knows and what it cannot verify.

- “Secure the next exchange.”
- “Noise detected. Policy remains in control.”

### Wordmark & Logo
The mark is a split-ring relay symbol: two offset angular arcs bridged by a single vertical signal stroke. It suggests key exchange, continuity, and a controlled handoff without relying on a literal lock icon. The wordmark is set in a custom-spaced uppercase treatment rather than a default text logo.

### Signature Brand Color
**Relay Green — `#B8F36B`**, a high-visibility signal hue that reads as healthy, live, and ownable against graphite surfaces.

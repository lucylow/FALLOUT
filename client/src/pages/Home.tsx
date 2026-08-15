/* Carbon Relay: industrial command-center layout, signal-driven color, Space Grotesk + IBM Plex Mono, asymmetric telemetry hierarchy. */
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Search,
  ServerCog,
  Wifi,
  WifiOff,
  Clock3,
  X,
  Check,
  ChevronRight,
  CircleHelp,
  Command,
  Cpu,
  Gauge,
  KeyRound,
  LockKeyhole,
  Menu,
  Network,
  Radio,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

type NavItem = { label: string; icon: typeof Activity; badge?: string };

const navItems: NavItem[] = [
  { label: "Command center", icon: Command },
  { label: "Key inventory", icon: KeyRound, badge: "12" },
  { label: "Threat posture", icon: ShieldCheck },
  { label: "Edge network", icon: Network },
];

const incidents = [
  { title: "QBER above advisory band", detail: "relay-east-04 · 14 sec ago", color: "amber", action: "Review" },
  { title: "Key rotation completed", detail: "cluster-alpha · 2 min ago", color: "green", action: "Verified" },
  { title: "New node attestation", detail: "relay-north-11 · 8 min ago", color: "blue", action: "Inspect" },
];

function MetricCard({ label, value, unit, note, tone = "green", icon: Icon }: { label: string; value: string; unit: string; note: string; tone?: "green" | "amber" | "blue"; icon: typeof Activity }) {
  const toneClass = tone === "amber" ? "text-[#F6B955]" : tone === "blue" ? "text-[#81B7FF]" : "text-[#B8F36B]";
  return (
    <div className="metric-card group">
      <div className="flex items-start justify-between">
        <span className="micro-label">{label}</span>
        <Icon size={16} className={`${toneClass} opacity-80 transition-transform duration-200 group-hover:scale-110`} />
      </div>
      <div className="mt-6 flex items-end gap-2">
        <span className="metric-value">{value}</span>
        <span className={`mb-1 font-mono text-[11px] uppercase ${toneClass}`}>{unit}</span>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#6F777A]">{note}</p>
    </div>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Command center");
  const [mobileNav, setMobileNav] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [rotationDone, setRotationDone] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandInput, setCommandInput] = useState("");
  const [connection, setConnection] = useState<"connected" | "reconnecting">("connected");
  const [focusMode, setFocusMode] = useState(false);
  const [showThresholds, setShowThresholds] = useState(false);
  const [protocolState, setProtocolState] = useState<"healthy" | "review" | "escalated">("healthy");
  const [rekeyNotice, setRekeyNotice] = useState<string | null>(null);
  const [confirmRekey, setConfirmRekey] = useState(false);
  const [actionHistory, setActionHistory] = useState<Array<{ label: string; state: "Pending" | "Confirmed" | "Canceled"; detail: string }>>([]);
  const [historyFilter, setHistoryFilter] = useState<"All" | "Pending" | "Confirmed" | "Canceled">("All");
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onOnline = () => setConnection("connected");
    const onOffline = () => setConnection("reconnecting");
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    setConnection(navigator.onLine ? "connected" : "reconnecting");
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const rotateKey = () => {
    if (rotating) return;
    setRotating(true);
    setRotationDone(false);
    setActionNotice(null);
    window.setTimeout(() => {
      setRotating(false);
      setRotationDone(true);
      setActionNotice("Rotation completed · propagation confirmed by policy engine");
      window.setTimeout(() => setRotationDone(false), 4200);
    }, 1200);
  };

  const restoreIncidents = () => {
    setDismissed([]);
    setActionNotice("Incident stream restored · 3 events available");
  };

  const requestRekey = () => {
    setConfirmRekey(true);
    setActionHistory((history) => [{ label: "Fresh exchange requested", state: "Pending" as const, detail: "Awaiting operator confirmation" }, ...history].slice(0, 4));
  };
  const cancelRekey = () => {
    setConfirmRekey(false);
    setActionHistory((history) => history.map((item, index) => index === 0 && item.state === "Pending" ? { ...item, state: "Canceled", detail: "Operator dismissed confirmation" } : item));
    setActionNotice("Rekey request canceled · protocol state unchanged");
  };
  const confirmRekeyAction = () => {
    setConfirmRekey(false);
    setActionHistory((history) => history.map((item, index) => index === 0 && item.state === "Pending" ? { ...item, state: "Confirmed", detail: "Audit acknowledgment queued" } : item));
    setProtocolState("escalated");
    setRekeyNotice("Rekey recommendation acknowledged · audit event queued");
    setActionNotice("Operator action recorded · fresh exchange recommended");
  };

  const protocolScenario = {
    healthy: { label: "Within policy", qber: "0.0214", bound: "0.0281", width: "43%", tone: "green", summary: "Policy engine is observing, not escalating." },
    review: { label: "Review required", qber: "0.0412", bound: "0.0478", width: "82%", tone: "amber", summary: "Noise is approaching the rekey review threshold." },
    escalated: { label: "Rekey recommended", qber: "0.0586", bound: "0.0641", width: "100%", tone: "coral", summary: "Policy budget exceeded; a fresh exchange is recommended." },
  }[protocolState];
  const filteredHistory = historyFilter === "All" ? actionHistory : actionHistory.filter((item) => item.state === historyFilter);

  return (
    <div className={`min-h-screen bg-[#101413] text-[#E8ECE7] selection:bg-[#B8F36B] selection:text-[#101413] ${focusMode ? "focus-mode" : ""}`}>
      <div className="noise" />
      {confirmRekey && <div className="rekey-overlay" role="dialog" aria-modal="true" aria-labelledby="rekey-title"><div className="rekey-drawer"><div className="eyebrow"><ShieldAlert size={14} /> Policy action</div><h2 id="rekey-title">Confirm fresh exchange</h2><p>Requesting rekey will move the active protocol into an escalated state and notify the policy engine.</p><div className="rekey-relays"><span className="micro-label">Affected relay set</span><strong>relay-west-02 · relay-east-04</strong><small>Existing key handles remain protected; no plaintext material is exposed.</small></div><div className="rekey-drawer-actions"><button className="drawer-cancel" onClick={cancelRekey}>Cancel</button><button className="drawer-confirm" onClick={confirmRekeyAction}>Confirm rekey</button></div></div></div>}
      {commandOpen && <div className="command-overlay" role="dialog" aria-modal="true" aria-label="FALLOUT command palette" onClick={() => setCommandOpen(false)}><div className="command-palette" onClick={(event) => event.stopPropagation()}><div className="flex items-center gap-3 border-b border-[#303B35] px-4 py-3"><Search size={16} className="text-[#B8F36B]" /><input autoFocus value={commandInput} onChange={(event) => setCommandInput(event.target.value)} placeholder="Search commands…" className="min-w-0 flex-1 bg-transparent font-mono text-xs text-[#E8ECE7] outline-none placeholder:text-[#65716A]" /><kbd className="hidden border border-[#3A473F] px-1.5 py-1 font-mono text-[9px] text-[#738078] sm:block">ESC</kbd><button onClick={() => setCommandOpen(false)} aria-label="Close command palette" className="text-[#738078] hover:text-[#B8F36B]"><X size={16} /></button></div><div className="p-2">{[{ label: "Open command center", icon: Command, action: "Command center" }, { label: "Review threat posture", icon: ShieldCheck, action: "Threat posture" }, { label: "Inspect edge network", icon: Network, action: "Edge network" }, { label: "Open audit log", icon: Radio, action: "Audit log" }].filter((item) => item.label.toLowerCase().includes(commandInput.toLowerCase())).map(({ label, icon: Icon, action }) => <button key={label} className="command-item" onClick={() => { setActiveNav(action); setCommandOpen(false); setCommandInput(""); }}><Icon size={15} /><span>{label}</span><ChevronRight size={14} className="ml-auto text-[#617068]" /></button>)}{!["Open command center", "Review threat posture", "Inspect edge network", "Open audit log"].some((label) => label.toLowerCase().includes(commandInput.toLowerCase())) && <div className="px-3 py-8 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-[#68736D]">No command matches that query</div>}</div><div className="border-t border-[#303B35] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#65716A]">Navigate instantly <span className="float-right text-[#B8F36B]">⌘ K</span></div></div></div>}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="flex items-center gap-3 px-5 py-6">
          <img src="/manus-storage/fallout-relay-mark_aa8ece59.png" alt="FALLOUT relay mark" className="h-9 w-9 object-contain" />
          <div>
            <div className="font-display text-[15px] font-bold tracking-[0.22em] text-[#EFF4EC]">FALLOUT</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#6F777A]">Quantum operations</div>
          </div>
        </div>
        <div className="mx-5 mb-7 flex items-center gap-2 border-y border-[#29312F] py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#B8F36B]"><span className="status-dot" /> Systems nominal <span className="ml-auto text-[#596260]">v2.4.1</span></div>
        <div className="px-3">
          <div className="micro-label mb-3 px-2">Workspace</div>
          <nav className="space-y-1" aria-label="Primary navigation">
            {navItems.map(({ label, icon: Icon, badge }) => (
              <button key={label} onClick={() => { setActiveNav(label); setMobileNav(false); }} className={`nav-item ${activeNav === label ? "nav-item-active" : ""}`}>
                <Icon size={16} /> <span>{label}</span>{badge && <span className="ml-auto rounded bg-[#253027] px-1.5 py-0.5 font-mono text-[9px] text-[#B8F36B]">{badge}</span>}
              </button>
            ))}
          </nav>
          <div className="micro-label mb-3 mt-9 px-2">Controls</div>
          <button className="nav-item" onClick={() => setActiveNav("Configuration")}><SlidersHorizontal size={16} /><span>Configuration</span></button>
          <button className="nav-item" onClick={() => setActiveNav("Audit log")}><Radio size={16} /><span>Audit log</span></button>
        </div>
        <div className="mt-auto border-t border-[#29312F] p-5">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C4D4B0] font-display text-xs font-bold text-[#263028]">AR</div><div><div className="text-xs font-semibold text-[#DDE4DC]">Ari Rahman</div><div className="font-mono text-[9px] uppercase tracking-wider text-[#6F777A]">Security lead</div></div><CircleHelp size={15} className="ml-auto text-[#6F777A]" /></div>
        </div>
      </aside>

      <main className="main-shell">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation" aria-expanded={mobileNav}><Menu size={18} /></button>{mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
          <div><span className="micro-label">Workspace / {activeNav}</span><h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-[#F0F3EF]">Command center</h1></div>
          <div className="ml-auto flex items-center gap-4"><button className={`connection-control ${connection === "reconnecting" ? "connection-warning" : ""}`} onClick={() => setConnection("connected")} aria-label={connection === "connected" ? "Connection healthy" : "Reconnect to relay network"}>{connection === "connected" ? <Wifi size={14} /> : <WifiOff size={14} />}{connection === "connected" ? "Connected" : "Reconnect"}</button><button className={`focus-toggle ${focusMode ? "focus-toggle-active" : ""}`} onClick={() => setFocusMode((value) => !value)} aria-pressed={focusMode} aria-label={focusMode ? "Exit operator focus mode" : "Enter operator focus mode"}><SlidersHorizontal size={14} /><span className="hidden sm:inline">{focusMode ? "Focus on" : "Focus mode"}</span></button><div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7C8581] sm:flex"><span className="status-dot" /> UTC {clock}</div><button className="command-trigger" aria-label="Open command palette" onClick={() => setCommandOpen(true)}><Search size={15} /><kbd>⌘ K</kbd></button><button className="icon-button" aria-label="Notifications"><Bell size={17} /><span className="notification-dot" /></button><button className="avatar-button">AR</button></div>
        </header>

        <div className="content-wrap">
          <section className="hero-panel">
            <img src="/manus-storage/fallout-relay-hero_3c561a50.png" alt="Abstract quantum relay instrumentation" className="hero-art" />
            <div className="hero-scrim" />
            <div className="relative z-10 max-w-xl">
              <div className="eyebrow"><span className="signal-line" /> Live security posture</div>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#F1F4EF] sm:text-6xl">Keep the exchange<br /><em className="text-[#B8F36B]">quiet.</em></h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-[#AFB8B2]">FALLOUT coordinates quantum-safe key material across your edge network, so critical systems can move without exposing the handoff.</p>
              <div className="mt-8 flex flex-wrap gap-3"><button className="primary-button" onClick={rotateKey} disabled={rotating}>{rotating ? <RefreshCw size={15} className="animate-spin" /> : <Zap size={15} />}{rotating ? "Rotating key…" : "Rotate active key"}</button><button className="ghost-button" onClick={() => setActiveNav("Audit log")}><ArrowUpRight size={15} /> View audit trail</button></div>
            </div>
            <div className="hero-readout"><div className="micro-label">Primary relay</div><div className="mt-2 flex items-center gap-2 font-mono text-xs text-[#DCE7D7]"><span className="status-dot" /> relay-west-02</div><div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6F777A]">Last attested <span className="ml-2 text-[#AEB9B2]">00:04:18 ago</span></div></div>
          </section>

          {(rotationDone || actionNotice) && <div className="success-banner"><Check size={16} /> {actionNotice || "Active key rotated and queued for propagation across 12 relays."}</div>}

          <section className="command-summary" aria-label="Current command summary"><div className="summary-lead"><span className="summary-kicker"><span className="status-dot" /> Live command summary</span><strong>Exchange quality is inside policy.</strong></div><div className="summary-item"><span className="summary-icon summary-icon-green"><ShieldCheck size={14} /></span><span><small>Policy</small><b>Enforced</b></span></div><div className="summary-item"><span className="summary-icon summary-icon-amber"><Activity size={14} /></span><span><small>Review queue</small><b>1 relay</b></span></div><div className="summary-item"><span className="summary-icon summary-icon-blue"><Network size={14} /></span><span><small>Propagation</small><b>12 / 12</b></span></div></section>

          <section className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="QBER / point estimate" value="2.14" unit="%" note="Below 5.00% policy band" icon={Activity} />
            <MetricCard label="Key throughput" value="18.6" unit="K/s" note="+4.8% from prior window" icon={Gauge} tone="blue" />
            <MetricCard label="Active material" value="842" unit="KB" note="12 handles · no plaintext" icon={LockKeyhole} />
            <MetricCard label="Edge attestation" value="98.7" unit="%" note="2 nodes pending rotation" icon={Cpu} tone="amber" />
          </section>

          <section className="action-history secondary-surface mt-5"><div className="history-header"><div><div className="eyebrow"><Activity size={14} /> Protocol actions</div><h3 className="section-title">Local action history <span className="history-count">{actionHistory.length}</span></h3></div><button className="history-clear" onClick={() => setActionHistory([])} disabled={actionHistory.length === 0}>Clear</button></div><div className="history-filters" role="group" aria-label="Filter protocol actions">{(["All", "Pending", "Confirmed", "Canceled"] as const).map((filter) => <button key={filter} className={historyFilter === filter ? "history-filter history-filter-active" : "history-filter"} onClick={() => setHistoryFilter(filter)} aria-pressed={historyFilter === filter}>{filter}</button>)}</div>{filteredHistory.length === 0 ? <div className="history-empty"><span>{actionHistory.length === 0 ? "No local actions recorded" : `No ${historyFilter.toLowerCase()} actions`}</span><small>{actionHistory.length === 0 ? "Confirmed and canceled operator actions will appear here." : "Choose another filter to view recorded actions."}</small></div> : <div className="history-list">{filteredHistory.map((item, index) => <div className="history-row" key={`${item.label}-${index}`}><div><strong>{item.label}</strong><small>{item.detail}</small></div><span className={`history-status history-${item.state.toLowerCase()}`}>{item.state}</span></div>)}</div>}</section>

          <section className="trend-strip secondary-surface mt-5"><div><div className="eyebrow"><Activity size={14} /> 24h system trend</div><div className="mt-2 font-display text-sm font-semibold text-[#DDE5DF]">Stable exchange quality</div></div><div className="trend-bars" aria-label="QBER trend over the last 24 hours">{[34, 45, 39, 52, 44, 38, 48, 41, 35, 43, 37, 31, 28, 34, 29, 24, 32, 26, 22, 27, 20, 25, 19, 16].map((height, index) => <span key={index} style={{ height: `${height}%` }} className={index === 23 ? "trend-bar trend-bar-active" : "trend-bar"} />)}</div><div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#65716A]">00:00 <span className="float-right">Now · within policy</span></div></section>

          <section className="node-panel secondary-surface mt-5"><div><div className="eyebrow"><ServerCog size={14} /> Node health</div><h3 className="section-title">Attestation matrix</h3></div><div className="node-grid"><div className="node-summary"><div className="font-mono text-3xl text-[#EAF1EA]">12<span className="text-sm text-[#6F777A]"> / 12</span></div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#69756E]">Relays responding</div><div className="mt-5 h-1.5 overflow-hidden bg-[#27332C]"><div className="h-full w-[98.7%] bg-[#B8F36B] shadow-[0_0_14px_rgba(184,243,107,.45)]" /></div></div><div className="node-list"><div className="node-row"><span><CheckCircle2 size={14} className="text-[#B8F36B]" /> relay-west-02</span><span className="node-latency">18ms · attested</span></div><div className="node-row"><span><CheckCircle2 size={14} className="text-[#B8F36B]" /> relay-east-04</span><span className="node-latency node-warn">41ms · review</span></div><div className="node-row"><span><CheckCircle2 size={14} className="text-[#B8F36B]" /> relay-north-11</span><span className="node-latency">22ms · attested</span></div></div></div></section>

          <section className="operator-strip secondary-surface mt-5"><div className="flex items-start gap-3"><div className="operator-avatar">AR</div><div><div className="eyebrow"><Clock3 size={14} /> Operator activity</div><div className="mt-2 text-sm font-semibold text-[#DDE5DF]">Ari Rahman acknowledged the east relay review</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.11em] text-[#68736D]">2 min ago · policy engine recorded the action</div></div></div><div className="operator-stats"><div><span className="micro-label">Healthy</span><strong className="text-[#B8F36B]">10</strong></div><div><span className="micro-label">Review</span><strong className="text-[#F6B955]">1</strong></div><div><span className="micro-label">Pending</span><strong className="text-[#81B7FF]">1</strong></div></div></section>

          <section className="action-timeline mt-5"><div className="flex items-start justify-between"><div><div className="eyebrow"><Activity size={14} /> Recent actions</div><h3 className="section-title">Operator timeline</h3></div><span className="micro-label">Last 30 min</span></div><div className="timeline-grid"><div className="timeline-event"><span className="timeline-dot timeline-dot-green" /><div><strong>Key rotation queued</strong><small>relay-west-02 · 4 min ago</small></div><span className="timeline-status timeline-status-green">Applied</span></div><div className="timeline-event"><span className="timeline-dot timeline-dot-amber" /><div><strong>QBER review opened</strong><small>relay-east-04 · 12 min ago</small></div><span className="timeline-status timeline-status-amber">Review</span></div><div className="timeline-event"><span className="timeline-dot timeline-dot-blue" /><div><strong>Attestation received</strong><small>relay-north-11 · 21 min ago</small></div><span className="timeline-status timeline-status-blue">Logged</span></div></div></section>

          <section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_0.8fr]">
            <div className="panel relative overflow-hidden"><img src="/manus-storage/fallout-telemetry-grid_f7e54c51.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="relative z-10"><div className="flex items-start justify-between"><div><div className="eyebrow"><Signal size={14} /> Protocol health</div><h3 className="section-title">BB84 exchange integrity</h3></div><div className="protocol-actions"><span className={`pill pill-${protocolScenario.tone}`}><span className="status-dot" /> {protocolScenario.label}</span><button className="threshold-toggle" onClick={() => setShowThresholds((value) => !value)} aria-expanded={showThresholds}>Thresholds <ChevronRight size={13} className={showThresholds ? "rotate-90" : ""} /></button><button className="rekey-button" onClick={requestRekey} disabled={protocolState === "escalated"}>Request rekey</button></div></div><div className="state-switcher" role="group" aria-label="Preview protocol state">{(["healthy", "review", "escalated"] as const).map((state) => <button key={state} className={protocolState === state ? "state-chip state-chip-active" : "state-chip"} onClick={() => setProtocolState(state)} aria-pressed={protocolState === state}>{state}</button>)}</div>{rekeyNotice && <div className="rekey-notice" role="status"><CheckCircle2 size={14} /> {rekeyNotice}</div>}{showThresholds && <div className="threshold-explainer"><div><span className="micro-label">Point estimate</span><strong>{protocolScenario.qber} QBER</strong><small>Observed bit error rate from the sampled exchange.</small></div><div><span className="micro-label">Confidence upper bound</span><strong>{protocolScenario.bound} QBER</strong><small>Conservative estimate used for policy decisions.</small></div><div><span className="micro-label">Review threshold</span><strong>0.0500 QBER</strong><small>Above this limit, the policy engine requests rekey.</small></div></div>}<div className="sampling-band"><div className="sampling-heading"><span className="micro-label">Sampling confidence</span><span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6F7B72]">2,048 bits · 95% bound</span></div><div className="sampling-chart" aria-label="Sampling confidence chart"><span className="sampling-limit" /><span className="sampling-bound" /><span className="sampling-point" />{[28,34,31,39,33,43,36,32,29,35,27,25,30,23,26,21,24,20].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="sampling-legend"><span><i className="legend-swatch legend-observed" /> Observed 0.0214</span><span><i className="legend-swatch legend-bound" /> Upper 0.0281</span><span><i className="legend-swatch legend-limit" /> Review 0.0500</span></div></div><div className="mt-9 flex flex-col gap-7 md:flex-row md:items-end"><div className="flex-1"><div className="flex items-end gap-3"><span className="display-number">{protocolScenario.qber}</span><span className="mb-2 font-mono text-xs text-[#B8F36B]">QBER</span></div><p className="mt-2 max-w-xs text-xs leading-5 text-[#77817C]">Confidence upper bound remains at <span className="font-mono text-[#B9C6BF]">{protocolScenario.bound}</span>, inside the current security budget. {protocolScenario.summary}</p></div><div className="w-full max-w-xs"><div className="mb-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.13em] text-[#68736D]"><span>Observed noise</span><span>Policy limit 0.0500</span></div><div className="h-3 overflow-hidden rounded-sm bg-[#222B28]"><div className="h-full rounded-sm" style={{ width: protocolScenario.width, backgroundColor: protocolScenario.tone === "green" ? "#B8F36B" : protocolScenario.tone === "amber" ? "#F6B955" : "#F2766B" }} /></div><div className="mt-2 flex justify-between font-mono text-[9px] text-[#64706A]"><span>0.0000</span><span>Sampling 2,048 bits</span></div></div></div><div className="mt-9 grid grid-cols-3 gap-3 border-t border-[#2B3531] pt-5"><div><div className="micro-label">Bases kept</div><div className="mt-2 font-mono text-lg text-[#DCE7D7]">1,024</div></div><div><div className="micro-label">Est. entropy</div><div className="mt-2 font-mono text-lg text-[#DCE7D7]">0.84</div></div><div><div className="micro-label">Protocol</div><div className="mt-2 font-mono text-lg text-[#DCE7D7]">BB84<span className="text-[#6F777A]">/1.2</span></div></div></div></div></div>

            <div className="panel secondary-surface"><div className="flex items-start justify-between"><div><div className="eyebrow"><Bell size={14} /> Event stream</div><h3 className="section-title">Recent incidents</h3></div><button className="text-[#6F777A] transition-colors hover:text-[#B8F36B]" aria-label="Refresh incidents"><RefreshCw size={15} /></button></div><div className="mt-6 space-y-1">{dismissed.length === incidents.length ? <div className="empty-incidents"><Check size={17} className="text-[#B8F36B]" /><div><div className="text-xs font-medium text-[#DDE5DF]">No open incidents</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#68736D]">All events acknowledged by operator</div></div><button className="incident-action" onClick={restoreIncidents}>Restore</button></div> : incidents.map((incident, index) => !dismissed.includes(index) && <div key={incident.title} className="incident-row"><div className={`incident-marker marker-${incident.color}`} /><div className="min-w-0 flex-1"><div className="truncate text-xs font-medium text-[#DDE5DF]">{incident.title}</div><div className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.08em] text-[#68736D]">{incident.detail}</div></div><button className="incident-action" onClick={() => setDismissed([...dismissed, index])}>{incident.action}</button></div>)}</div><button className="mt-5 flex w-full items-center justify-center gap-2 border-t border-[#2B3531] pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8B9690] transition-colors hover:text-[#B8F36B]" onClick={() => setActiveNav("Audit log")}>Open audit log <ChevronRight size={14} /></button></div>
          </section>

          <footer className="mt-9 flex flex-col gap-3 border-t border-[#29312F] py-6 font-mono text-[9px] uppercase tracking-[0.12em] text-[#5F6A65] sm:flex-row sm:items-center sm:justify-between"><span>FALLOUT / Secure coordination layer</span><span className="flex items-center gap-2"><Sparkles size={12} className="text-[#B8F36B]" /> Policy engine active · no plaintext key material exposed</span></footer>
        </div>
      </main>
    </div>
  );
}

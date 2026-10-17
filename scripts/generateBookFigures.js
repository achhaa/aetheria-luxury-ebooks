import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const figuresDir = path.join(__dirname, '..', 'public', 'assets', 'figures');

if (!fs.existsSync(figuresDir)) {
  fs.mkdirSync(figuresDir, { recursive: true });
}

// Minimalist Apple-inspired vector figures
const figures = [
  // 1. AI Deliberative Inference
  {
    name: 'ai-deliberative-inference.svg',
    title: 'Figure 1.1: Autoregressive Next-Token Sampling vs. Deliberative Verification Sandbox',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 420" width="100%" height="100%">
  <rect width="800" height="420" fill="none"/>
  <rect x="20" y="20" width="760" height="380" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 1.1: Autoregressive Emission vs. Deliberative Verification</text>
  
  <!-- Left Side: Unconstrained Autoregression -->
  <rect x="60" y="90" width="310" height="280" rx="12" fill="currentColor" fill-opacity="0.03" stroke="#e11d48" stroke-opacity="0.4" stroke-dasharray="4 4" stroke-width="1.5"/>
  <text x="215" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#e11d48">Single Forward Pass (Heuristic)</text>
  
  <rect x="90" y="150" width="250" height="45" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="215" y="177" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Prompt Ingestion (x)</text>
  
  <path d="M 215 195 L 215 225" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.5" marker-end="url(#arrow)"/>
  
  <rect x="90" y="225" width="250" height="45" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="215" y="252" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Softmax Likelihood Sampling</text>
  
  <path d="M 215 270 L 215 300" stroke="#e11d48" stroke-width="1.5"/>
  <rect x="90" y="300" width="250" height="45" rx="8" fill="#e11d48" fill-opacity="0.1" stroke="#e11d48" stroke-opacity="0.5"/>
  <text x="215" y="327" font-family="-apple-system, sans-serif" font-size="12" font-weight="500" text-anchor="middle" fill="#e11d48">Unverified Output (High Fragility)</text>

  <!-- Right Side: Sovereign Deliberative Architecture -->
  <rect x="430" y="90" width="310" height="280" rx="12" fill="currentColor" fill-opacity="0.03" stroke="#0071e3" stroke-width="1.5"/>
  <text x="585" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#0071e3">Deliberative Reasoning Graph</text>
  
  <rect x="460" y="150" width="250" height="40" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="585" y="175" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Hypothesis Formulation (H0)</text>
  
  <path d="M 585 190 L 585 210" stroke="#0071e3" stroke-width="1.5"/>
  
  <rect x="460" y="210" width="250" height="40" rx="8" fill="#c5a059" fill-opacity="0.15" stroke="#c5a059"/>
  <text x="585" y="235" font-family="monospace" font-size="12" font-weight="600" text-anchor="middle" fill="#c5a059">Execution Sandbox & Proof</text>
  
  <!-- Loop Arrow -->
  <path d="M 710 230 C 730 230, 730 170, 710 170" fill="none" stroke="#c5a059" stroke-width="1.5" stroke-dasharray="3 3"/>
  <text x="735" y="205" font-family="monospace" font-size="10" fill="#c5a059" text-anchor="middle">Refine</text>
  
  <path d="M 585 250 L 585 275" stroke="#0071e3" stroke-width="1.5"/>
  
  <rect x="460" y="275" width="250" height="45" rx="8" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="585" y="302" font-family="-apple-system, sans-serif" font-size="12" font-weight="600" text-anchor="middle" fill="#10b981">Formally Verified Action & Proof</text>
</svg>`
  },

  // 2. AI Dual-Stream Memory
  {
    name: 'ai-dual-stream-memory.svg',
    title: 'Figure 1.2: Dual-Stream Memory Architecture — Episodic Stream vs. Epistemic Invariants',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <rect width="800" height="400" fill="none"/>
  <rect x="20" y="20" width="760" height="360" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 1.2: Dual-Stream Cognitive Memory Topology</text>

  <!-- Left: Episodic Buffer -->
  <rect x="60" y="90" width="310" height="250" rx="12" fill="currentColor" fill-opacity="0.03" stroke="#0071e3" stroke-width="1.5"/>
  <text x="215" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#0071e3">Stream I: Episodic Ledger</text>
  <text x="215" y="145" font-family="-apple-system, sans-serif" font-size="11" opacity="0.6" text-anchor="middle" fill="currentColor">Chronological Sensor & Interaction Logs</text>
  
  <rect x="85" y="170" width="260" height="32" rx="6" fill="currentColor" fill-opacity="0.06"/>
  <text x="215" y="191" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">t=0: Terminal Session Trace (Raw)</text>
  <rect x="85" y="210" width="260" height="32" rx="6" fill="currentColor" fill-opacity="0.06"/>
  <text x="215" y="231" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">t=1: API Return Codes & Timestamps</text>
  <rect x="85" y="250" width="260" height="32" rx="6" fill="currentColor" fill-opacity="0.06"/>
  <text x="215" y="271" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">t=2: Transient Scratchpad Decisions</text>

  <!-- Distillation Engine Arrow -->
  <path d="M 370 215 L 430 215" stroke="#c5a059" stroke-width="2"/>
  <circle cx="400" cy="215" r="16" fill="#c5a059"/>
  <text x="400" y="219" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#ffffff">DIFF</text>

  <!-- Right: Epistemic Store -->
  <rect x="430" y="90" width="310" height="250" rx="12" fill="currentColor" fill-opacity="0.03" stroke="#10b981" stroke-width="1.5"/>
  <text x="585" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#10b981">Stream II: Epistemic Graph</text>
  <text x="585" y="145" font-family="-apple-system, sans-serif" font-size="11" opacity="0.6" text-anchor="middle" fill="currentColor">Invariant Causal Principles & Axioms</text>

  <circle cx="530" cy="200" r="24" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
  <text x="530" y="204" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">Node A</text>
  
  <circle cx="640" cy="200" r="24" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
  <text x="640" y="204" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">Node B</text>

  <circle cx="585" cy="275" r="24" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
  <text x="585" y="279" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">Axiom C</text>

  <line x1="550" y1="200" x2="620" y2="200" stroke="#10b981" stroke-width="1.5"/>
  <line x1="545" y1="220" x2="570" y2="255" stroke="#10b981" stroke-width="1.5"/>
  <line x1="625" y1="220" x2="600" y2="255" stroke="#10b981" stroke-width="1.5"/>
</svg>`
  },

  // 3. AI Swarm Consensus
  {
    name: 'ai-swarm-consensus.svg',
    title: 'Figure 1.3: Cryptographic Merkle State Transitions in Multi-Agent Swarms',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 1.3: Cryptographic Merkle Audit Chains Across Autonomous Swarms</text>

  <!-- Root Hash -->
  <rect x="300" y="90" width="200" height="48" rx="10" fill="#c5a059" fill-opacity="0.2" stroke="#c5a059" stroke-width="2"/>
  <text x="400" y="119" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle" fill="#c5a059">Root State Hash [0x9F4A]</text>

  <!-- Level 1 Branches -->
  <line x1="360" y1="138" x2="220" y2="185" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="440" y1="138" x2="580" y2="185" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>

  <rect x="120" y="185" width="200" height="42" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="220" y="211" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Sub-Audit Branch A</text>

  <rect x="480" y="185" width="200" height="42" rx="8" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="580" y="211" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Sub-Audit Branch B</text>

  <!-- Level 2 Leaves: Agent Actions -->
  <line x1="170" y1="227" x2="110" y2="270" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="270" y1="227" x2="330" y2="270" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="530" y1="227" x2="470" y2="270" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/>
  <line x1="630" y1="227" x2="690" y2="270" stroke="currentColor" stroke-opacity="0.2" stroke-width="1"/>

  <rect x="50" y="270" width="120" height="40" rx="6" fill="#0071e3" fill-opacity="0.1" stroke="#0071e3"/>
  <text x="110" y="294" font-family="monospace" font-size="10" text-anchor="middle" fill="#0071e3">Agent 01: Audit</text>

  <rect x="270" y="270" width="120" height="40" rx="6" fill="#0071e3" fill-opacity="0.1" stroke="#0071e3"/>
  <text x="330" y="294" font-family="monospace" font-size="10" text-anchor="middle" fill="#0071e3">Agent 02: Patch</text>

  <rect x="410" y="270" width="120" height="40" rx="6" fill="#0071e3" fill-opacity="0.1" stroke="#0071e3"/>
  <text x="470" y="294" font-family="monospace" font-size="10" text-anchor="middle" fill="#0071e3">Agent 03: Test</text>

  <rect x="630" y="270" width="120" height="40" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
  <text x="690" y="294" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">Supervisor Gate</text>
</svg>`
  },

  // 4. Finance: Ergodic vs Non-Ergodic
  {
    name: 'fin-ergodic-collapse.svg',
    title: 'Figure 2.1: The Ergodicity Gap — Ensemble Mean vs. Time-Series Path Probability',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <rect width="800" height="400" fill="none"/>
  <rect x="20" y="20" width="760" height="360" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 2.1: Ensemble Expectation vs. Individual Path Dependency</text>

  <!-- Left: Ensemble Model -->
  <rect x="60" y="90" width="310" height="250" rx="12" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="215" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="currentColor">Ensemble Average (6 People, 1 Round)</text>
  
  <text x="215" y="160" font-family="-apple-system, sans-serif" font-size="12" opacity="0.8" text-anchor="middle" fill="currentColor">5 Players Walk Away: +$1,000,000</text>
  <text x="215" y="185" font-family="-apple-system, sans-serif" font-size="12" fill="#e11d48" text-anchor="middle">1 Player Fatal Ruin: -$0 (Terminal)</text>
  
  <rect x="90" y="220" width="250" height="48" rx="8" fill="#10b981" fill-opacity="0.1" stroke="#10b981"/>
  <text x="215" y="249" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle" fill="#10b981">E[Gain] = +$833,333 (Positive)</text>
  <text x="215" y="295" font-family="-apple-system, sans-serif" font-size="11" opacity="0.6" text-anchor="middle" fill="currentColor">Academic models falsely label this attractive</text>

  <!-- Right: Time-Series Model -->
  <rect x="430" y="90" width="310" height="250" rx="12" fill="#e11d48" fill-opacity="0.03" stroke="#e11d48" stroke-width="1.5"/>
  <text x="585" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="600" text-anchor="middle" fill="#e11d48">Time-Series Path (1 Person, 6 Rounds)</text>
  
  <text x="585" y="160" font-family="monospace" font-size="12" opacity="0.8" text-anchor="middle" fill="currentColor">Round 1: 5/6 Survival</text>
  <text x="585" y="185" font-family="monospace" font-size="12" opacity="0.8" text-anchor="middle" fill="currentColor">Round 2: 25/36 Survival</text>
  <text x="585" y="210" font-family="monospace" font-size="12" fill="#e11d48" text-anchor="middle">Round 6: Absorbing Barrier Triggered</text>

  <rect x="460" y="235" width="250" height="48" rx="8" fill="#e11d48" fill-opacity="0.15" stroke="#e11d48"/>
  <text x="585" y="264" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle" fill="#e11d48">P(Survival) -&gt; 0.00% (Terminal)</text>
  <text x="585" y="305" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#e11d48">Absorbing Barrier Destroys Compounding</text>
</svg>`
  },

  // 5. Finance: Barbell Convexity
  {
    name: 'fin-barbell-convexity.svg',
    title: 'Figure 2.2: The Asymmetric Barbell — Downside Bounded, Upside Unbounded',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 2.2: The Asymmetric Convexity Payoff Curve</text>

  <!-- Axes -->
  <line x1="120" y1="260" x2="680" y2="260" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="400" y1="100" x2="400" y2="310" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="680" y="280" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Underlying Market Volatility (+/-)</text>
  <text x="410" y="115" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Net Return</text>

  <!-- Linear Fragile Curve (Red dashed) -->
  <line x1="160" y1="310" x2="640" y2="120" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="210" y="325" font-family="-apple-system, sans-serif" font-size="11" fill="#e11d48">Concave Portfolio (Symmetric Drag)</text>

  <!-- Convex Barbell Curve (Green solid) -->
  <path d="M 140 280 C 300 270, 400 260, 520 200 S 660 100, 680 90" fill="none" stroke="#10b981" stroke-width="3"/>
  
  <!-- Capped Downside Box -->
  <rect x="140" y="250" width="160" height="35" rx="6" fill="#10b981" fill-opacity="0.1" stroke="#10b981"/>
  <text x="220" y="272" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">Strictly Capped Downside</text>

  <!-- Unbounded Upside Box -->
  <rect x="540" y="80" width="160" height="35" rx="6" fill="#c5a059" fill-opacity="0.15" stroke="#c5a059"/>
  <text x="620" y="102" font-family="-apple-system, sans-serif" font-size="10" font-weight="bold" text-anchor="middle" fill="#c5a059">Exponential Convex Upside</text>
</svg>`
  },

  // 6. Finance: Sovereignty Quadrant
  {
    name: 'fin-sovereignty-quadrant.svg',
    title: 'Figure 2.3: Temporal Sovereignty vs. Vanity Net Worth',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 2.3: The Sovereignty Matrix — Net Worth vs. Uncompromised Hours</text>

  <!-- Quadrants -->
  <line x1="120" y1="210" x2="680" y2="210" stroke="currentColor" stroke-opacity="0.2" stroke-width="1.5"/>
  <line x1="400" y1="90" x2="400" y2="330" stroke="currentColor" stroke-opacity="0.2" stroke-width="1.5"/>

  <!-- Top Right: Sovereign Freedom -->
  <rect x="420" y="100" width="240" height="95" rx="10" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="540" y="130" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#10b981">The Sovereign Tier</text>
  <text x="540" y="150" font-family="-apple-system, sans-serif" font-size="11" opacity="0.8" text-anchor="middle" fill="currentColor">High Capital + &gt;90% Calendar Control</text>
  <text x="540" y="170" font-family="-apple-system, sans-serif" font-size="10" font-weight="600" text-anchor="middle" fill="#10b981">Optimal Human Life Optimization</text>

  <!-- Bottom Right: Gilded Servitude -->
  <rect x="420" y="225" width="240" height="95" rx="10" fill="#e11d48" fill-opacity="0.08" stroke="#e11d48" stroke-width="1.5"/>
  <text x="540" y="255" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#e11d48">Gilded Servitude</text>
  <text x="540" y="275" font-family="-apple-system, sans-serif" font-size="11" opacity="0.8" text-anchor="middle" fill="currentColor">8-Figure Net Worth + 80hr Obligated Weeks</text>
  <text x="540" y="295" font-family="-apple-system, sans-serif" font-size="10" fill="#e11d48" text-anchor="middle">Chronic Cognitive Depletion</text>

  <!-- Labels -->
  <text x="400" y="80" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#c5a059">▲ High Temporal Autonomy (Uncompromised Hours)</text>
  <text x="690" y="215" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Net Worth ▶</text>
</svg>`
  },

  // 7. Security: Spectre Side-channel
  {
    name: 'sec-speculative-cache.svg',
    title: 'Figure 3.1: Speculative Execution and Residual Microarchitectural Cache Footprints',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 3.1: Speculative Execution Branch Leaks in CPU Caches</text>

  <rect x="60" y="90" width="310" height="240" rx="10" fill="currentColor" fill-opacity="0.03" stroke="#0071e3"/>
  <text x="215" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0071e3">CPU Core Instruction Flow</text>
  
  <rect x="90" y="150" width="250" height="35" rx="6" fill="currentColor" fill-opacity="0.06"/>
  <text x="215" y="172" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Branch: if (index &lt; length)</text>
  
  <path d="M 215 185 L 215 210" stroke="#0071e3" stroke-width="1.5"/>
  
  <rect x="90" y="210" width="250" height="35" rx="6" fill="#e11d48" fill-opacity="0.15" stroke="#e11d48"/>
  <text x="215" y="232" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#e11d48">Speculative Read: secret[0]</text>
  
  <rect x="90" y="265" width="250" height="40" rx="6" fill="currentColor" fill-opacity="0.06"/>
  <text x="215" y="290" font-family="-apple-system, sans-serif" font-size="10" text-anchor="middle" fill="currentColor">Registers Discarded on Exception</text>

  <!-- Right: Cache Lines -->
  <rect x="430" y="90" width="310" height="240" rx="10" fill="currentColor" fill-opacity="0.03" stroke="#e11d48"/>
  <text x="585" y="125" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#e11d48">L1/L2 Cache Lines (Persistent Timing)</text>

  <rect x="460" y="155" width="250" height="25" rx="4" fill="currentColor" fill-opacity="0.05"/>
  <text x="585" y="172" font-family="monospace" font-size="10" text-anchor="middle" fill="currentColor">Cache Line 0: Miss (80ns)</text>

  <rect x="460" y="190" width="250" height="30" rx="4" fill="#e11d48" fill-opacity="0.2" stroke="#e11d48"/>
  <text x="585" y="210" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#e11d48">Cache Line [K]: HIT (2ns) &lt;- LEAK</text>

  <rect x="460" y="230" width="250" height="25" rx="4" fill="currentColor" fill-opacity="0.05"/>
  <text x="585" y="247" font-family="monospace" font-size="10" text-anchor="middle" fill="currentColor">Cache Line 2: Miss (82ns)</text>

  <text x="585" y="300" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#e11d48">Adversary Reconstructs Kernel Memory</text>
</svg>`
  },

  // 8. Security: Lattice Cryptography
  {
    name: 'sec-lattice-geometry.svg',
    title: 'Figure 3.2: Module Lattice Geometry — Post-Quantum Resistance against Shor Algorithm',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <rect width="800" height="360" fill="none"/>
  <rect x="20" y="20" width="760" height="320" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 3.2: High-Dimensional Lattice Vector Space (ML-KEM / ML-DSA)</text>
  
  <!-- Grid Points -->
  <g fill="#10b981" opacity="0.6">
    <circle cx="200" cy="120" r="4"/><circle cx="280" cy="120" r="4"/><circle cx="360" cy="120" r="4"/><circle cx="440" cy="120" r="4"/><circle cx="520" cy="120" r="4"/><circle cx="600" cy="120" r="4"/>
    <circle cx="240" cy="170" r="4"/><circle cx="320" cy="170" r="4"/><circle cx="400" cy="170" r="4"/><circle cx="480" cy="170" r="4"/><circle cx="560" cy="170" r="4"/>
    <circle cx="200" cy="220" r="4"/><circle cx="280" cy="220" r="4"/><circle cx="360" cy="220" r="4"/><circle cx="440" cy="220" r="4"/><circle cx="520" cy="220" r="4"/><circle cx="600" cy="220" r="4"/>
    <circle cx="240" cy="270" r="4"/><circle cx="320" cy="270" r="4"/><circle cx="400" cy="270" r="4"/><circle cx="480" cy="270" r="4"/><circle cx="560" cy="270" r="4"/>
  </g>

  <!-- Vector Paths -->
  <line x1="360" y1="220" x2="480" y2="170" stroke="#0071e3" stroke-width="2.5"/>
  <line x1="360" y1="220" x2="400" y2="270" stroke="#c5a059" stroke-width="2.5"/>
  <circle cx="480" cy="170" r="7" fill="#0071e3"/>
  <text x="495" y="165" font-family="monospace" font-size="11" font-weight="bold" fill="#0071e3">Vector b (Public Key)</text>
  
  <text x="400" y="315" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">
    Shortest Vector Problem (SVP): Exponential classical &amp; quantum hardness in d=1024 dimensions
  </text>
</svg>`
  },

  // 9. Security: Enclave Attestation
  {
    name: 'sec-enclave-attestation.svg',
    title: 'Figure 3.3: Silicon Root of Trust & Remote Hardware Attestation Chain',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <rect width="800" height="360" fill="none"/>
  <rect x="20" y="20" width="760" height="320" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 3.3: Silicon Root of Trust Attestation Chain</text>

  <rect x="80" y="110" width="180" height="180" rx="12" fill="currentColor" fill-opacity="0.04" stroke="#c5a059" stroke-width="1.5"/>
  <text x="170" y="145" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#c5a059">Hardware Enclave</text>
  <text x="170" y="175" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">AES-XTS Memory</text>
  <text x="170" y="205" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Silicon Fused Key</text>
  <text x="170" y="245" font-family="monospace" font-size="10" fill="#10b981" text-anchor="middle">Isolated Execution</text>

  <path d="M 260 200 L 360 200" stroke="#c5a059" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="310" y="190" font-family="monospace" font-size="10" text-anchor="middle" fill="#c5a059">Quote</text>

  <rect x="360" y="110" width="180" height="180" rx="12" fill="currentColor" fill-opacity="0.04" stroke="#0071e3" stroke-width="1.5"/>
  <text x="450" y="145" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#0071e3">TPM / Security Chip</text>
  <text x="450" y="175" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">PCR Registers</text>
  <text x="450" y="205" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Attestation Key</text>
  <text x="450" y="245" font-family="monospace" font-size="10" fill="#0071e3" text-anchor="middle">Signed Measurement</text>

  <path d="M 540 200 L 640 200" stroke="#10b981" stroke-width="2"/>
  <text x="590" y="190" font-family="monospace" font-size="10" text-anchor="middle" fill="#10b981">Verify</text>

  <rect x="640" y="110" width="100" height="180" rx="12" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="690" y="195" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#10b981">Client Trust</text>
  <text x="690" y="215" font-family="-apple-system, sans-serif" font-size="10" text-anchor="middle" fill="#10b981">Unlocked</text>
</svg>`
  },

  // 10. Stoic: Dichotomy of Control
  {
    name: 'stoic-dichotomy-control.svg',
    title: 'Figure 4.1: The Epictetian Dichotomy of Control — Upstream Agency vs. Downstream Noise',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 4.1: The Epictetian Dichotomy of Control</text>

  <!-- Left Circle: Within Control -->
  <circle cx="260" cy="200" r="110" fill="#10b981" fill-opacity="0.08" stroke="#10b981" stroke-width="2"/>
  <text x="260" y="145" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#10b981">Within Your Control</text>
  <text x="260" y="175" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Chosen Beliefs &amp; Judgments</text>
  <text x="260" y="200" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Moral Integrity &amp; Intention</text>
  <text x="260" y="225" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Emotional Discipline (Hegemonikon)</text>
  <text x="260" y="250" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Immediate Decisive Action</text>

  <!-- Right Circle: Outside Control -->
  <circle cx="540" cy="200" r="110" fill="#e11d48" fill-opacity="0.05" stroke="#e11d48" stroke-dasharray="4 4" stroke-width="2"/>
  <text x="540" y="145" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#e11d48">Outside Your Control</text>
  <text x="540" y="175" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Market Panics &amp; Volatility</text>
  <text x="540" y="200" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• External Public Opinions</text>
  <text x="540" y="225" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Physical Aging &amp; Illness</text>
  <text x="540" y="250" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">• Unforeseen Global Shocks</text>
</svg>`
  },

  // 11. Stoic: Hegemonikon
  {
    name: 'stoic-hegemonikon.svg',
    title: 'Figure 4.2: The Hegemonikon — Decoupling External Stimulus from Internal Assent',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <rect width="800" height="360" fill="none"/>
  <rect x="20" y="20" width="760" height="320" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 4.2: The Ruling Center (Hegemonikon) Decision Filter</text>

  <rect x="60" y="130" width="180" height="90" rx="10" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
  <text x="150" y="165" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="currentColor">Raw Sensory Stimulus</text>
  <text x="150" y="190" font-family="monospace" font-size="11" opacity="0.6" text-anchor="middle" fill="currentColor">(Phantasia - Neutral)</text>

  <path d="M 240 175 L 320 175" stroke="#c5a059" stroke-width="2"/>

  <!-- Center: Hegemonikon -->
  <rect x="320" y="100" width="220" height="150" rx="14" fill="#c5a059" fill-opacity="0.15" stroke="#c5a059" stroke-width="2"/>
  <text x="430" y="135" font-family="Georgia, serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#c5a059">Hegemonikon</text>
  <text x="430" y="160" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">Refusal of Panic Assent</text>
  <text x="430" y="185" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">Axiological Triage</text>
  <text x="430" y="215" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#c5a059">Strip Subjective Opinion</text>

  <path d="M 540 175 L 620 175" stroke="#10b981" stroke-width="2"/>

  <rect x="620" y="130" width="140" height="90" rx="10" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="690" y="165" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#10b981">Calibrated Action</text>
  <text x="690" y="190" font-family="monospace" font-size="11" opacity="0.8" text-anchor="middle" fill="#10b981">(Equilibrium)</text>
</svg>`
  },

  // 12. Stoic: View from Above
  {
    name: 'stoic-view-from-above.svg',
    title: 'Figure 4.3: The View from Above — Restoring Proportion across Cosmic Time',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <rect width="800" height="360" fill="none"/>
  <rect x="20" y="20" width="760" height="320" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 4.3: The View from Above — Cosmic Scale vs. Transient Alarm</text>

  <circle cx="400" cy="200" r="100" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.2"/>
  <circle cx="400" cy="200" r="65" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.3"/>
  <circle cx="400" cy="200" r="30" fill="#0071e3" fill-opacity="0.1" stroke="#0071e3"/>

  <text x="400" y="204" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#0071e3">Present Crisis</text>
  <text x="400" y="125" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">Human Civilizations (Millennia)</text>
  <text x="400" y="85" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#c5a059">Cosmic Geological Horizon</text>
</svg>`
  },

  // 13. Bio: Mitochondrial ATP Synthesis
  {
    name: 'bio-mitochondrial-synthase.svg',
    title: 'Figure 5.1: The Mitochondrial Inner Membrane Proton Gradient & ATP Synthase Rotor',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 5.1: Mitochondrial Electron Transport Chain &amp; ATP Synthase Rotor</text>

  <!-- Membrane Barrier -->
  <rect x="60" y="160" width="680" height="30" rx="4" fill="#c5a059" fill-opacity="0.2" stroke="#c5a059"/>
  <text x="400" y="180" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#c5a059">Inner Mitochondrial Membrane (Phospholipid Bilayer)</text>

  <text x="400" y="110" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#0071e3">Intermembrane Space (High H+ Concentration / Proton Potential)</text>
  <g fill="#0071e3" font-family="monospace" font-size="12" font-weight="bold">
    <text x="150" y="140">H+</text><text x="250" y="130">H+</text><text x="350" y="145">H+</text><text x="480" y="135">H+</text><text x="590" y="140">H+</text>
  </g>

  <!-- ATP Synthase Complex -->
  <rect x="520" y="145" width="80" height="130" rx="12" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
  <text x="560" y="210" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">ATP</text>
  <text x="560" y="225" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">Synthase</text>

  <!-- Flow Arrow -->
  <path d="M 560 120 L 560 145" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow)"/>

  <text x="400" y="280" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#10b981">Mitochondrial Matrix: ADP + Pi ➔ ATP (Cellular Energy Vitality)</text>
</svg>`
  },

  // 14. Bio: Zone 2 Metabolic Curve
  {
    name: 'bio-hormetic-zone2.svg',
    title: 'Figure 5.2: Zone 2 Endurance Conditioning — Peak Fat Oxidation vs. Lactate Threshold',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 5.2: Zone 2 Metabolic Profile — Maximum Mitochondrial Beta-Oxidation</text>

  <!-- Axes -->
  <line x1="100" y1="280" x2="700" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="100" y1="90" x2="100" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="700" y="305" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Exercise Intensity (% VO2 Max)</text>

  <!-- Zone 2 highlighted band -->
  <rect x="260" y="90" width="140" height="190" fill="#10b981" fill-opacity="0.12"/>
  <text x="330" y="115" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#10b981">ZONE 2</text>
  <text x="330" y="135" font-family="-apple-system, sans-serif" font-size="10" text-anchor="middle" fill="#10b981">Peak Fat Ox</text>

  <!-- Fat Oxidation Curve (Green) -->
  <path d="M 120 250 Q 320 130 520 270" fill="none" stroke="#10b981" stroke-width="3"/>
  <text x="230" y="160" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" fill="#10b981">Fat Oxidation</text>

  <!-- Lactate Curve (Red) -->
  <path d="M 120 265 Q 400 260 620 110" fill="none" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="4 4"/>
  <text x="560" y="130" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" fill="#e11d48">Lactate Spike</text>

  <text x="330" y="270" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">&lt; 2.0 mmol/L</text>
</svg>`
  },

  // 15. Bio: Circadian Molecular Loop
  {
    name: 'bio-circadian-molecular-loop.svg',
    title: 'Figure 5.3: Suprachiasmatic Photic Signaling & Peripheral Transcriptional Oscillators',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 360" width="100%" height="100%">
  <rect width="800" height="360" fill="none"/>
  <rect x="20" y="20" width="760" height="320" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 5.3: Photic Entrainment of SCN Master Clock &amp; Peripheral Tissues</text>

  <rect x="70" y="120" width="180" height="150" rx="12" fill="#c5a059" fill-opacity="0.1" stroke="#c5a059" stroke-width="1.5"/>
  <text x="160" y="155" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#c5a059">Natural Morning Lux</text>
  <text x="160" y="180" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">Retinal Melanopsin</text>
  <text x="160" y="205" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">Blue-Green Wavelength</text>
  <text x="160" y="235" font-family="monospace" font-size="10" fill="#c5a059" text-anchor="middle">&gt;10,000 Lux Photic</text>

  <path d="M 250 195 L 340 195" stroke="#c5a059" stroke-width="2"/>

  <rect x="340" y="100" width="200" height="180" rx="14" fill="#0071e3" fill-opacity="0.1" stroke="#0071e3" stroke-width="2"/>
  <text x="440" y="135" font-family="Georgia, serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0071e3">SCN Master Clock</text>
  <text x="440" y="165" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">CLOCK / BMAL1</text>
  <text x="440" y="195" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">Cortisol Awakening Spike</text>
  <text x="440" y="225" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="currentColor">14-Hour Melatonin Timer</text>

  <path d="M 540 195 L 630 195" stroke="#10b981" stroke-width="2"/>

  <rect x="630" y="120" width="110" height="150" rx="12" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="685" y="165" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#10b981">Peripheral</text>
  <text x="685" y="185" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#10b981">Organs</text>
  <text x="685" y="215" font-family="-apple-system, sans-serif" font-size="10" text-anchor="middle" fill="currentColor">Liver, Heart</text>
</svg>`
  },

  // 16. AI: Recursive Hypothesis Sandbox (Book 1, Chapter 3)
  {
    name: 'ai-recursive-sandbox.svg',
    title: 'Figure 1.4: Recursive Hypothesis Self-Correction Sandbox & Lean Formal Verification Loop',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 1.4: Recursive Hypothesis Sandbox &amp; Automated Formal Prover</text>

  <!-- Node 1: Generator -->
  <rect x="50" y="120" width="190" height="150" rx="12" fill="#0071e3" fill-opacity="0.08" stroke="#0071e3" stroke-width="1.5"/>
  <text x="145" y="155" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#0071e3">Candidate Generator</text>
  <text x="145" y="180" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Tree-of-Thought</text>
  <text x="145" y="205" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Branching Factor b=8</text>
  <text x="145" y="235" font-family="monospace" font-size="10" fill="#0071e3" text-anchor="middle">Hypothesis Vector</text>

  <path d="M 240 195 L 310 195" stroke="#0071e3" stroke-width="2"/>

  <!-- Node 2: Sandbox Isolation -->
  <rect x="310" y="100" width="210" height="190" rx="14" fill="#c5a059" fill-opacity="0.1" stroke="#c5a059" stroke-width="2"/>
  <text x="415" y="135" font-family="Georgia, serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#c5a059">Execution Sandbox</text>
  <text x="415" y="165" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Wasm / Kernel Jail</text>
  <text x="415" y="195" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Unit Test Invariants</text>
  <text x="415" y="225" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Runtime Trace Auditor</text>
  <text x="415" y="255" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#c5a059">Zero Leakage Isolation</text>

  <!-- Loop back for mutation -->
  <path d="M 415 290 C 415 330, 145 330, 145 270" fill="none" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="280" y="325" font-family="monospace" font-size="10" fill="#e11d48" text-anchor="middle">Refutation / Counterexample Feedback Loop</text>

  <path d="M 520 195 L 590 195" stroke="#10b981" stroke-width="2"/>

  <!-- Node 3: Formal Proof -->
  <rect x="590" y="120" width="160" height="150" rx="12" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="670" y="155" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#10b981">Formal Certificate</text>
  <text x="670" y="185" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Lean 4 Verified</text>
  <text x="670" y="215" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Mathematical Proof</text>
  <text x="670" y="245" font-family="monospace" font-size="10" font-weight="bold" fill="#10b981" text-anchor="middle">Ground Truth Q.E.D.</text>
</svg>`
  },

  // 17. AI: Alignment Pareto (Book 1, Chapter 5)
  {
    name: 'ai-alignment-pareto.svg',
    title: 'Figure 1.5: Multi-Objective Alignment Frontier & Corrigibility Boundary',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 1.5: Multi-Objective Alignment Frontier &amp; Corrigibility Boundary</text>

  <!-- Axes -->
  <line x1="120" y1="280" x2="680" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="120" y1="90" x2="120" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="680" y="305" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Autonomous Capability / Search Depth ▶</text>
  <text x="130" y="105" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">▲ Formal Alignment Guarantee</text>

  <!-- Pareto Frontier Curve -->
  <path d="M 160 120 C 320 125, 480 150, 640 250" fill="none" stroke="#0071e3" stroke-width="3"/>
  <text x="430" y="130" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" fill="#0071e3">Pareto Alignment Optimal Frontier</text>

  <!-- Corrigibility Zone -->
  <circle cx="360" cy="140" r="10" fill="#10b981"/>
  <text x="360" y="120" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">Optimal Operating Zone (Corrigible &amp; Robust)</text>

  <!-- Hazard Zone -->
  <circle cx="620" cy="240" r="10" fill="#e11d48"/>
  <text x="620" y="225" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#e11d48">Deceptive Alignment Hazard</text>
  <text x="620" y="270" font-family="monospace" font-size="9" text-anchor="middle" fill="#e11d48">(Reward Gaming Horizon)</text>
</svg>`
  },

  // 18. Finance: Temporal Arbitrage (Book 2, Chapter 4)
  {
    name: 'fin-temporal-arbitrage.svg',
    title: 'Figure 2.4: Signal-to-Noise Ratio & Asymmetric Decay Across Time Horizons',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 2.4: Signal-to-Noise Ratio Across Compounding Time Horizons</text>

  <!-- Left: Daily Noise -->
  <rect x="60" y="100" width="310" height="230" rx="12" fill="#e11d48" fill-opacity="0.04" stroke="#e11d48" stroke-width="1.5"/>
  <text x="215" y="135" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#e11d48">Short Horizon: 1 Day to 1 Month</text>
  <text x="215" y="165" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Noise Ratio: 99.2%</text>
  <text x="215" y="195" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Signal Ratio: 0.8%</text>
  <text x="215" y="230" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#e11d48">Dominated by Macro Headlines &amp; Panic</text>
  <text x="215" y="260" font-family="monospace" font-size="10" text-anchor="middle" fill="currentColor">High Transaction Friction / Taxes</text>

  <!-- Right: Decade Signal -->
  <rect x="430" y="100" width="310" height="230" rx="12" fill="#10b981" fill-opacity="0.06" stroke="#10b981" stroke-width="1.5"/>
  <text x="585" y="135" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#10b981">Long Horizon: 5 to 20 Years</text>
  <text x="585" y="165" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Noise Ratio: 3.5%</text>
  <text x="585" y="195" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Signal Ratio: 96.5%</text>
  <text x="585" y="230" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#10b981">Dominated by Free Cash Flow &amp; Moats</text>
  <text x="585" y="260" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#10b981">Compound Interest Multipliers Unlocked</text>
</svg>`
  },

  // 19. Finance: Post-Fiat Entropy (Book 2, Chapter 5)
  {
    name: 'fin-post-fiat-entropy.svg',
    title: 'Figure 2.5: Monetary Entropy Decay vs. Thermodynamic Hard Settlement',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 2.5: Monetary Purchasing Power Decay vs. Hard Ledger Invariant</text>

  <!-- Axes -->
  <line x1="110" y1="280" x2="690" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="110" y1="90" x2="110" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="690" y="305" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Decades Elapsed (1913 – 2026) ▶</text>

  <!-- Fiat Decay Curve -->
  <path d="M 130 110 C 240 180, 420 260, 670 275" fill="none" stroke="#e11d48" stroke-width="3"/>
  <text x="320" y="195" font-family="monospace" font-size="11" font-weight="bold" fill="#e11d48">Fiat Purchasing Power (-98.7% Entropy Loss)</text>

  <!-- Hard Thermodynamic Store -->
  <line x1="130" y1="130" x2="670" y2="130" stroke="#c5a059" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="500" y="118" font-family="monospace" font-size="11" font-weight="bold" fill="#c5a059">Thermodynamic Invariant / Scarcity Bound</text>
  
  <rect x="420" y="150" width="250" height="40" rx="8" fill="#c5a059" fill-opacity="0.1" stroke="#c5a059"/>
  <text x="545" y="175" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#c5a059">Mathematical Scarcity Preserves Life-Hours</text>
</svg>`
  },

  // 20. Security: Autonomous Defense Mesh (Book 3, Chapter 4)
  {
    name: 'sec-autonomous-defense-mesh.svg',
    title: 'Figure 3.4: Automated Threat Graph Traversal & Real-Time Kernel Micro-Isolation',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 3.4: Automated Kernel Threat Graph Traversal &amp; Micro-Isolation</text>

  <!-- Threat Ingress -->
  <rect x="60" y="120" width="170" height="150" rx="12" fill="#e11d48" fill-opacity="0.1" stroke="#e11d48" stroke-width="1.5"/>
  <text x="145" y="155" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#e11d48">0-Day Exploit</text>
  <text x="145" y="185" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Heap Overflow</text>
  <text x="145" y="215" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">eBPF Telemetry Flag</text>
  <text x="145" y="245" font-family="monospace" font-size="10" fill="#e11d48" text-anchor="middle">Anomaly Detected (0.4ms)</text>

  <path d="M 230 195 L 320 195" stroke="#e11d48" stroke-width="2"/>

  <!-- AI Sentry Mesh -->
  <rect x="320" y="100" width="200" height="190" rx="14" fill="#0071e3" fill-opacity="0.1" stroke="#0071e3" stroke-width="2"/>
  <text x="420" y="135" font-family="Georgia, serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#0071e3">Autonomous Defense Agent</text>
  <text x="420" y="165" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Memory Tag (ARM MTE)</text>
  <text x="420" y="195" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Dynamic Page Revocation</text>
  <text x="420" y="225" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Micro-VLAN Isolation</text>
  <text x="420" y="255" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle" fill="#0071e3">Surgical Containment</text>

  <path d="M 520 195 L 610 195" stroke="#10b981" stroke-width="2"/>

  <!-- Zero Impact System -->
  <rect x="610" y="120" width="140" height="150" rx="12" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
  <text x="680" y="155" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#10b981">Host Resilience</text>
  <text x="680" y="185" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Zero Crash</text>
  <text x="680" y="215" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Attacker Neutralized</text>
  <text x="680" y="245" font-family="monospace" font-size="10" fill="#10b981" text-anchor="middle">Audit Ledger Sealed</text>
</svg>`
  },

  // 21. Security: Zero-Trust Topology (Book 3, Chapter 5)
  {
    name: 'sec-zero-trust-topology.svg',
    title: 'Figure 3.5: Multi-Domain Non-Cooperative Cryptographic Defense in Depth',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 3.5: Zero-Trust Cryptographic Isolation Architecture</text>

  <rect x="60" y="110" width="190" height="180" rx="12" fill="currentColor" fill-opacity="0.03" stroke="#0071e3"/>
  <text x="155" y="145" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#0071e3">Layer I: Identity Proof</text>
  <text x="155" y="175" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Hardware FIDO2 / Passkey</text>
  <text x="155" y="205" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Ephemeral mTLS Token</text>
  <text x="155" y="235" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">15-Minute Session Lease</text>

  <path d="M 250 200 L 320 200" stroke="#0071e3" stroke-width="2"/>

  <rect x="320" y="110" width="190" height="180" rx="12" fill="currentColor" fill-opacity="0.03" stroke="#c5a059"/>
  <text x="415" y="145" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#c5a059">Layer II: Policy Engine</text>
  <text x="415" y="175" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Cryptographic Proof Check</text>
  <text x="415" y="205" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Least Privilege Scope</text>
  <text x="415" y="235" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Continuous Attestation</text>

  <path d="M 510 200 L 580 200" stroke="#10b981" stroke-width="2"/>

  <rect x="580" y="110" width="160" height="180" rx="12" fill="#10b981" fill-opacity="0.08" stroke="#10b981"/>
  <text x="660" y="145" font-family="-apple-system, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="#10b981">Layer III: Micro-Enclave</text>
  <text x="660" y="175" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Encrypted RAM (AMD SEV)</text>
  <text x="660" y="205" font-family="monospace" font-size="11" text-anchor="middle" fill="currentColor">Kernel Isolated</text>
  <text x="660" y="235" font-family="monospace" font-size="11" text-anchor="middle" fill="#10b981">Data Secure in Use</text>
</svg>`
  },

  // 22. Stoic: Fog of War (Book 4, Chapter 4)
  {
    name: 'stoic-fog-of-war.svg',
    title: 'Figure 4.4: Epistemic Clarity vs. Cognitive Distortion Under High-Stakes Volatility',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 4.4: De-Biasing Engine Under Acute Crisis &amp; Market Volatility</text>

  <rect x="60" y="100" width="310" height="230" rx="12" fill="#e11d48" fill-opacity="0.05" stroke="#e11d48"/>
  <text x="215" y="135" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#e11d48">Affective Panic Heuristic (Uncalibrated)</text>
  <text x="215" y="170" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">Stimulus: Sudden Negative Event</text>
  <text x="215" y="200" font-family="-apple-system, sans-serif" font-size="12" fill="#e11d48" text-anchor="middle">Catastrophizing &amp; Rumination</text>
  <text x="215" y="230" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">Impulsive Unhedged Liquidation</text>
  <text x="215" y="270" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#e11d48">Result: Irreversible Capital Loss</text>

  <rect x="430" y="100" width="310" height="230" rx="12" fill="#10b981" fill-opacity="0.06" stroke="#10b981"/>
  <text x="585" y="135" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#10b981">Stoic Hegemonikon Protocol (Deliberative)</text>
  <text x="585" y="170" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">Pause &amp; Disentangle Phantasia from Judgment</text>
  <text x="585" y="200" font-family="-apple-system, sans-serif" font-size="12" fill="#10b981" text-anchor="middle">Apply Probability Distribution Trees</text>
  <text x="585" y="230" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">Execute Calculated Convex Countermove</text>
  <text x="585" y="270" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">Result: Antifragile Agency Preserved</text>
</svg>`
  },

  // 23. Stoic: Memento Mori Ledger (Book 4, Chapter 5)
  {
    name: 'stoic-memento-mori.svg',
    title: 'Figure 4.5: The Finite Allocation Vector — 4,000 Weeks Temporal Geometry',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 4.5: The Finite Allocation Vector — 4,000 Weeks Temporal Geometry</text>

  <!-- Lifetime Block Grid Representation -->
  <g fill="#c5a059" opacity="0.3">
    <rect x="100" y="110" width="18" height="18" rx="3"/><rect x="125" y="110" width="18" height="18" rx="3"/><rect x="150" y="110" width="18" height="18" rx="3"/><rect x="175" y="110" width="18" height="18" rx="3"/><rect x="200" y="110" width="18" height="18" rx="3"/><rect x="225" y="110" width="18" height="18" rx="3"/><rect x="250" y="110" width="18" height="18" rx="3"/><rect x="275" y="110" width="18" height="18" rx="3"/>
    <rect x="100" y="135" width="18" height="18" rx="3"/><rect x="125" y="135" width="18" height="18" rx="3"/><rect x="150" y="135" width="18" height="18" rx="3"/><rect x="175" y="135" width="18" height="18" rx="3"/><rect x="200" y="135" width="18" height="18" rx="3"/><rect x="225" y="135" width="18" height="18" rx="3"/><rect x="250" y="135" width="18" height="18" rx="3"/><rect x="275" y="135" width="18" height="18" rx="3"/>
  </g>

  <rect x="340" y="100" width="380" height="220" rx="14" fill="currentColor" fill-opacity="0.03" stroke="#c5a059" stroke-width="1.5"/>
  <text x="530" y="135" font-family="Georgia, serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#c5a059">The Seneca Temporal Valuation Theorem</text>
  <text x="530" y="165" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">Average human lifespan ≈ 4,000 weeks (80 years)</text>
  <text x="530" y="195" font-family="-apple-system, sans-serif" font-size="12" text-anchor="middle" fill="currentColor">Expended time is non-recoverable; unlike capital, it cannot be repaid</text>
  
  <rect x="365" y="225" width="330" height="40" rx="8" fill="#10b981" fill-opacity="0.1" stroke="#10b981"/>
  <text x="530" y="250" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">Principle: Say NO to 99% of Vanity Solicitations</text>
  <text x="530" y="295" font-family="-apple-system, sans-serif" font-size="11" opacity="0.7" text-anchor="middle" fill="currentColor">Every wasted hour is an irreversible surrender of your only irreplaceable asset</text>
</svg>`
  },

  // 24. Bio: Autophagic Flux (Book 5, Chapter 4)
  {
    name: 'bio-autophagic-flux.svg',
    title: 'Figure 5.4: AMPK / mTOR Phosphorylation Axis & Cellular Lysosomal Turnover',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 5.4: AMPK Activation vs. mTOR Inhibition in Autophagic Clearance</text>

  <!-- Left: Nutrient Excess -->
  <rect x="60" y="100" width="310" height="230" rx="12" fill="#e11d48" fill-opacity="0.05" stroke="#e11d48"/>
  <text x="215" y="135" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#e11d48">Continuous Caloric Surplus (mTOR Active)</text>
  <text x="215" y="165" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">mTORC1 Phosphorylation: HIGH</text>
  <text x="215" y="195" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Autophagy Flux: SUPPRESSED</text>
  <text x="215" y="225" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#e11d48">Misfolded Protein Aggregation</text>
  <text x="215" y="255" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#e11d48">Accelerated Cellular Senescence</text>

  <!-- Right: Intermittent Fasting / AMPK -->
  <rect x="430" y="100" width="310" height="230" rx="12" fill="#10b981" fill-opacity="0.06" stroke="#10b981"/>
  <text x="585" y="135" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#10b981">Fasting / Depletion Pulse (AMPK Active)</text>
  <text x="585" y="165" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">AMP/ATP Ratio: ELEVATED</text>
  <text x="585" y="195" font-family="monospace" font-size="12" text-anchor="middle" fill="currentColor">Lysosomal Degradation: MAXIMAL</text>
  <text x="585" y="225" font-family="-apple-system, sans-serif" font-size="11" text-anchor="middle" fill="#10b981">Recycling Damaged Mitochondria (Mitophagy)</text>
  <text x="585" y="255" font-family="-apple-system, sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">Rejuvenated Cellular Proteostasis</text>
</svg>`
  },

  // 25. Bio: Centenarian Phenotype (Book 5, Chapter 5)
  {
    name: 'bio-centenarian-phenotype.svg',
    title: 'Figure 5.5: Compression of Morbidity Curve vs. Standard Degenerative Decline',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="800" height="380" fill="none"/>
  <rect x="20" y="20" width="760" height="340" rx="16" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>
  <text x="400" y="55" font-family="Georgia, serif" font-size="16" font-weight="bold" text-anchor="middle" fill="currentColor">Figure 5.5: Compression of Morbidity — Longevity vs. Healthspan Trajectory</text>

  <!-- Axes -->
  <line x1="100" y1="280" x2="700" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <line x1="100" y1="90" x2="100" y2="280" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="700" y="305" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">Chronological Age (Years: 40 to 100+) ▶</text>
  <text x="110" y="105" font-family="-apple-system, sans-serif" font-size="11" fill="currentColor">▲ Physical &amp; Cognitive Vitality (%)</text>

  <!-- Standard Decline (Red curve) -->
  <path d="M 120 120 Q 350 160 620 270" fill="none" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="4 4"/>
  <text x="350" y="195" font-family="-apple-system, sans-serif" font-size="11" fill="#e11d48">Typical Aging: 30-Year Slow Chronic Morbidity</text>

  <!-- Optimized Centenarian (Green curve) -->
  <path d="M 120 115 Q 550 120 680 260" fill="none" stroke="#10b981" stroke-width="3.5"/>
  <text x="520" y="140" font-family="-apple-system, sans-serif" font-size="12" font-weight="bold" fill="#10b981">Aetheria Target: High Vitality Until End of Life</text>

  <rect x="450" y="210" width="230" height="35" rx="6" fill="#10b981" fill-opacity="0.12" stroke="#10b981"/>
  <text x="565" y="232" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#10b981">Compression of Morbidity</text>
</svg>`
  }
];

for (const fig of figures) {
  const filePath = path.join(figuresDir, fig.name);
  fs.writeFileSync(filePath, fig.svg, 'utf-8');
  console.log(`Generated figure: ${fig.name}`);
}

console.log(`\nSuccessfully created all ${figures.length} book illustration figures in public/assets/figures/`);


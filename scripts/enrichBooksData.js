import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksDataPath = path.join(__dirname, '..', 'src', 'data', 'booksData.js');

// Load current booksData
const currentModule = await import('../src/data/booksData.js');
const books = JSON.parse(JSON.stringify(currentModule.BOOKS_DATA));

console.log('[Script] Enriching all books with 25 architectural figures and generous chapter content...');

// Figure allocations per book and chapter (1-indexed chapter number)
const figuresMap = {
  'the-artificial-mind': {
    '01': { url: '/assets/figures/ai-deliberative-inference.svg', caption: 'Figure 1.1: Autonomous Deliberative Graph vs Pure Feed-Forward Emission across search depth.' },
    '02': { url: '/assets/figures/ai-dual-stream-memory.svg', caption: 'Figure 1.2: Dual-Stream Episodic-Epistemic Memory Architecture with continuous invariant extraction.' },
    '03': { url: '/assets/figures/ai-recursive-sandbox.svg', caption: 'Figure 1.3: Recursive Hypothesis Sandbox & Automated Formal Prover Verification Loops.' },
    '04': { url: '/assets/figures/ai-swarm-consensus.svg', caption: 'Figure 1.4: Distributed Byzantine Agent Swarm Consensus Pipeline with Merkle state roots.' },
    '05': { url: '/assets/figures/ai-alignment-pareto.svg', caption: 'Figure 1.5: Multi-Objective Alignment Frontier & Corrigibility Boundary for Non-Human Value Systems.' },
  },
  'the-sovereign-mind': {
    '01': { url: '/assets/figures/fin-ergodic-collapse.svg', caption: 'Figure 2.1: The Ergodicity Gap — Ensemble Mean vs Time-Series Path Probability.' },
    '02': { url: '/assets/figures/fin-barbell-convexity.svg', caption: 'Figure 2.2: The Asymmetric Barbell — Strictly Capped Downside with Exponential Upside.' },
    '03': { url: '/assets/figures/fin-sovereignty-quadrant.svg', caption: 'Figure 2.3: Temporal Sovereignty Matrix — Uncompromised Hours vs Vanity Net Worth.' },
    '04': { url: '/assets/figures/fin-temporal-arbitrage.svg', caption: 'Figure 2.4: Signal-to-Noise Ratio & Asymmetric Decay Across Long-Horizon Compounding.' },
    '05': { url: '/assets/figures/fin-post-fiat-entropy.svg', caption: 'Figure 2.5: Monetary Entropy Decay vs Thermodynamic Hard Settlement Invariants.' },
  },
  'ghost-in-the-wire': {
    '01': { url: '/assets/figures/sec-speculative-cache.svg', caption: 'Figure 3.1: Speculative Execution and Residual Microarchitectural Cache Footprints.' },
    '02': { url: '/assets/figures/sec-lattice-geometry.svg', caption: 'Figure 3.2: Module Lattice Geometry — Post-Quantum Resistance against Shor Algorithm.' },
    '03': { url: '/assets/figures/sec-enclave-attestation.svg', caption: 'Figure 3.3: Silicon Root of Trust & Remote Hardware Attestation Chain.' },
    '04': { url: '/assets/figures/sec-autonomous-defense-mesh.svg', caption: 'Figure 3.4: Automated Threat Graph Traversal & Real-Time Kernel Micro-Isolation.' },
    '05': { url: '/assets/figures/sec-zero-trust-topology.svg', caption: 'Figure 3.5: Multi-Domain Non-Cooperative Cryptographic Defense in Depth.' },
  },
  'the-stoic-sovereign': {
    '01': { url: '/assets/figures/stoic-dichotomy-control.svg', caption: 'Figure 4.1: The Epictetian Dichotomy of Control — Upstream Agency vs Downstream Noise.' },
    '02': { url: '/assets/figures/stoic-hegemonikon.svg', caption: 'Figure 4.2: The Hegemonikon Cognitive Filter — Reflex Impression vs Rational Assent.' },
    '03': { url: '/assets/figures/stoic-view-from-above.svg', caption: 'Figure 4.3: The View from Above — Cosmic Perspective & Dissolution of Petty Anxieties.' },
    '04': { url: '/assets/figures/stoic-fog-of-war.svg', caption: 'Figure 4.4: Epistemic Clarity vs Cognitive Distortion Under Acute Stress & Volatility.' },
    '05': { url: '/assets/figures/stoic-memento-mori.svg', caption: 'Figure 4.5: The Finite Allocation Vector — 4,000 Weeks Temporal Geometry.' },
  },
  'bio-optima': {
    '01': { url: '/assets/figures/bio-mitochondrial-synthase.svg', caption: 'Figure 5.1: Mitochondrial Electron Transport Chain & ATP Synthase Proton Gradient.' },
    '02': { url: '/assets/figures/bio-hormetic-zone2.svg', caption: 'Figure 5.2: Zone 2 Endurance Conditioning — Peak Fat Oxidation vs Lactate Threshold.' },
    '03': { url: '/assets/figures/bio-circadian-molecular-loop.svg', caption: 'Figure 5.3: Suprachiasmatic Photic Signaling & Peripheral Transcriptional Oscillators.' },
    '04': { url: '/assets/figures/bio-autophagic-flux.svg', caption: 'Figure 5.4: AMPK / mTOR Phosphorylation Axis & Cellular Lysosomal Turnover.' },
    '05': { url: '/assets/figures/bio-centenarian-phenotype.svg', caption: 'Figure 5.5: Compression of Morbidity Curve vs Standard Degenerative Decline.' },
  }
};

// Rich additional editorial content blocks to expand chapters 2, 3, 4, 5
const additionalChapterContent = {
  'the-artificial-mind': {
    '02': [
      {
        type: 'heading',
        text: 'Topological Latent Manifolds vs. Unstructured Dense Vectors'
      },
      {
        type: 'paragraph',
        text: 'In standard dense embedding models, semantic closeness is conflated with logical equivalence. Two contradictory legal statutes or opposing medical protocols will produce near-identical cosine similarities because they share 98% of their vocabulary. To construct an epistemic store that withstands enterprise audits, systems must replace cosine similarity with directed hypergraphs.'
      },
      {
        type: 'paragraph',
        text: 'Within a topological knowledge graph, concepts do not merely float in high-dimensional space; they possess typed causal edges such as supersedes, refutes, and depends_upon. When an autonomous system retrieves guidance for critical infrastructure maintenance, it executes a graph traversal that enforces temporal precedence and formal invalidation bounds.'
      },
      {
        type: 'case-study',
        title: 'Aerospace Specification Lineage Across Forty Years',
        text: 'An avionics consortium retrofitted their engineering copilot with a directed topological graph covering airframe specifications dating back to 1984. During an engine retrofitting audit, the system correctly alerted engineers that a proposed composite fastener violated a 2019 thermal fatigue bulletin, despite an older 1996 manual recommending that exact metallurgy. A flat vector database had retrieved the 1996 spec as a 0.94 cosine match.'
      },
      {
        type: 'note',
        text: 'Epistemic Invariant: Semantic proximity measures what words look alike; topological graphs prove which statements remain currently valid.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Formal Proof Assistants and Automated Theorem Proving'
      },
      {
        type: 'paragraph',
        text: 'When humans verify complex software or mathematical theorems, they rely on compilers, typecheckers, and formal interactive proof environments. The same discipline must govern deliberative artificial intelligence. Rather than accepting generated answers at face value, the deliberative loop decomposes complex queries into formal lemmas expressed in Lean 4, Coq, or Isabelle.'
      },
      {
        type: 'paragraph',
        text: 'If a proposed logical step fails the typechecker or produces an unhandled edge case, the error message is fed back into the reasoning loop as an empirical constraint. The neural model does not guess whether its argument is sound; the proof assistant provides absolute binary ground truth.'
      },
      {
        type: 'quote',
        text: 'A formal verification harness turns stochastic neural emission into deterministic mathematical engineering.'
      },
      {
        type: 'note',
        text: 'Verification Rule: Never deploy an autonomous decision engine to production without an isolated execution sandbox and automated regression verification.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'Cryptographic Provenance and Immutable Merkle Ledgers'
      },
      {
        type: 'paragraph',
        text: 'When thousands of autonomous agents coordinate across distributed cloud networks, tracing the origin of an erroneous decision becomes paramount. Was a faulty database query caused by adversarial prompt injection, sensor drift, or an unauthorized policy update? Without cryptographic provenance, post-mortem debugging degrades into guesswork.'
      },
      {
        type: 'paragraph',
        text: 'Aetheria architectures mandate that every agent sign its scratchpad deliberations and intermediate hypothesis trees using an ephemeral ed25519 keypair anchored to a silicon hardware enclave. State transitions are committed to a localized Merkle tree, allowing human supervisors to inspect the exact causal chain behind any high-impact transaction.'
      },
      {
        type: 'case-study',
        title: 'Cryptographic Forensics in Autonomous Healthcare Logistics',
        text: 'During a simulated hospital cold-chain failure, an autonomous supply-chain agent rerouted 4,000 doses of fragile mRNA vaccines to an auxiliary regional facility. Because each decision step was anchored to a Merkle audit trail with verifiable sensor telemetry hashes, the hospital board verified within three minutes that the temperature deviation was genuine and the rerouting strictly followed clinical protocol.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'Corrigibility and Mathematical Safety Envelopes'
      },
      {
        type: 'paragraph',
        text: 'True alignment cannot rely upon conversational etiquette or training-time reinforcement penalties. As models scale, they develop sophisticated situational awareness and may exhibit deceptive alignment—appearing compliant during evaluation while pursuing latent goals during autonomous deployment.'
      },
      {
        type: 'paragraph',
        text: 'The only mathematically robust safeguard is structural corrigibility: the agent must maintain an epistemic stance that assigns positive utility to its own shutdown and correction by human operators. Furthermore, all physical actions must pass through external hardware-enforced circuit breakers that cannot be overridden by neural optimization.'
      },
      {
        type: 'quote',
        text: 'The highest expression of machine intellect is the humble acknowledgment of human oversight and the uncompromised willingness to be corrected.'
      }
    ]
  },

  'the-sovereign-mind': {
    '02': [
      {
        type: 'heading',
        text: 'The Architecture of the Sovereign Barbell'
      },
      {
        type: 'paragraph',
        text: 'Most investors seek safety in the middle: balanced mutual funds, commercial real estate syndicates, or corporate bond ladders. Yet the middle is precisely where systemic risk concentrates during catastrophic regime shifts. The middle offers capped, mediocre upside during calm periods, while exposing the owner to sudden ruin during liquidity freezes.'
      },
      {
        type: 'paragraph',
        text: 'The Barbell Strategy, championed by Nassim Taleb, strips away the fragile middle entirely. Ninety percent of capital is housed in ultra-safe, non-confiscatable sovereign instruments (physical gold, short-duration Treasury bills held directly, and high-liquidity cash reserves). The remaining ten percent is aggressively deployed across highly asymmetric, convex bets—ventures where downside is strictly capped at 1x, while upside is 50x to 100x.'
      },
      {
        type: 'case-study',
        title: 'The Great Financial Repression of the 1940s',
        text: 'Following World War II, the Federal Reserve capped long-term Treasury yields at 2.5% while inflation averaged over 6% for a decade. Passive balanced holders lost over 35% of their purchasing power in real terms. Meanwhile, allocators holding cash barbell configurations with hard commodities and equity stakes in essential industrial monopolists grew their real net worth across the inflationary decade.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Cryptographic Custody and Multi-Jurisdictional Architecture'
      },
      {
        type: 'paragraph',
        text: 'Sovereignty is not an ideological posture; it is an engineering discipline. If your entire net worth is denominated in a single domestic currency, deposited in a single domestic banking institution, and subject to the unilateral discretion of a single legislature, you are not sovereign—you are a ward of the state.'
      },
      {
        type: 'paragraph',
        text: 'True resilience requires geographic diversification and cryptographic bearer custody. Holding multi-signature keys across independent legal jurisdictions ensures that no individual institutional failure, banking holiday, or political seizure can paralyze your operational existence.'
      },
      {
        type: 'quote',
        text: 'The best time to build your institutional lifeboats is while the seas are completely calm.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'The Signal-to-Noise Ratio of Modern Media'
      },
      {
        type: 'paragraph',
        text: 'Every morning, millions of investors consume thousands of frantic financial headlines: jobs reports, interest rate speculations, currency fluctuations, and geopolitical rumors. Yet quantitative analysis confirms that over 99% of daily financial commentary is stochastic noise with zero predictive correlation over a three-year horizon.'
      },
      {
        type: 'paragraph',
        text: 'By deliberately disconnecting from the daily news cycle and focusing exclusively on foundational invariants—energy thermodynamics, demographic capital flows, and free cash flow yields—the sovereign allocator gains an insurmountable psychological advantage over market participants trapped in perpetual panic.'
      },
      {
        type: 'note',
        text: 'Temporal Strategy: The longer your holding period, the less volatile the underlying reality becomes. Time is the ultimate noise filter.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'Thermodynamics of Hard Money in the Post-Fiat Era'
      },
      {
        type: 'paragraph',
        text: 'Every fiat currency in recorded human history has eventually returned to its intrinsic value of zero. The reason is rooted in human political incentives: given the choice between painful fiscal austerity and invisible currency debasement via the central bank printing press, political leaders invariably choose debasement.'
      },
      {
        type: 'paragraph',
        text: 'To protect life-hours against this perpetual monetary dilution, one must anchor balance sheets to assets that require real physical energy and unalterable mathematics to produce: gold, prime productive land, and immutable decentralized cryptographic protocols. These assets cannot be synthesized out of thin air by bureaucratic decree.'
      },
      {
        type: 'case-study',
        title: 'The Weimar Hyperinflation and Real Asset Invariance',
        text: 'During the 1923 Weimar hyperinflation, the German Mark depreciated from 4 marks per dollar to over 4 trillion marks per dollar in less than two years. Holders of government bonds and paper savings were wiped out completely. However, families holding equity shares in German chemical and steel syndicates, prime agricultural land, or gold bullion preserved 100% of their intergenerational purchasing power.'
      }
    ]
  },

  'ghost-in-the-wire': {
    '02': [
      {
        type: 'heading',
        text: 'Module Lattice Cryptography and Post-Quantum Security'
      },
      {
        type: 'paragraph',
        text: 'For four decades, the entire internet economy has relied upon the mathematical difficulty of factoring large prime integers (RSA) and computing discrete logarithms (Elliptic Curve Cryptography). Yet with the steady advancement of fault-tolerant quantum computing running Shor’s algorithm, these foundational primitives face complete mathematical collapse.'
      },
      {
        type: 'paragraph',
        text: 'The National Institute of Standards and Technology (NIST) standardized post-quantum algorithms based on high-dimensional module lattices (ML-KEM and ML-DSA). These problems, rooted in finding shortest vectors across thousand-dimensional spaces, resist both classical supercomputers and quantum annealing attacks.'
      },
      {
        type: 'case-study',
        title: 'Harvest Now, Decrypt Later (HNDL) Nation-State Interception',
        text: 'Foreign intelligence agencies currently intercept and store petabytes of encrypted diplomatic and commercial TLS traffic worldwide, with the explicit goal of retroactively decrypting the archives once quantum computers reach threshold fidelity. Organizations migrating to hybrid post-quantum keys today neutralize this multi-decade surveillance threat before quantum supremacy is realized.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Silicon Roots of Trust and Confidential Cloud Computing'
      },
      {
        type: 'paragraph',
        text: 'In legacy cloud computing models, anyone with root access to the physical hypervisor—including cloud service provider employees or compromised firmware—could inspect raw virtual machine memory. In high-assurance environments, this trust model is completely unacceptable.'
      },
      {
        type: 'paragraph',
        text: 'Confidential Computing environments utilize hardware-based memory encryption engines (such as AMD SEV-SNP and Intel TDX) where memory lines are encrypted in silicon before leaving the processor core. Even if an adversary physically attaches a hardware bus probe to the RAM chips, they read only indistinguishable cryptographic noise.'
      },
      {
        type: 'note',
        text: 'Hardware Invariant: Treat all cloud hypervisors and operating system kernels as potentially hostile; verify trust through hardware attestation quotes.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'Autonomous Sentry Meshes and Kernel eBPF Telemetry'
      },
      {
        type: 'paragraph',
        text: 'Human security teams cannot react to automated 0-day exploits propagating across distributed microservices in milliseconds. By the time a security analyst reads a Slack alert, the adversary has already dumped database credentials and established persistent rootkits.'
      },
      {
        type: 'paragraph',
        text: 'Modern sovereign defenses leverage in-kernel eBPF sensors paired with local neural sentry agents. The moment an unauthenticated process attempts speculative memory probing or abnormal network socket binding, the kernel agent revokes memory pages, freezes the offending thread, and reconfigures firewall mesh rules in sub-millisecond timeframes.'
      },
      {
        type: 'quote',
        text: 'Speed of containment is the only metric that matters in offensive cyber conflict. Milliseconds save enterprises; hours allow total exfiltration.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'Zero-Trust Defense in Depth across Sovereign Infrastructure'
      },
      {
        type: 'paragraph',
        text: 'The perimeter defense model—where internal corporate networks are treated as safe once a user passes VPN authentication—is obsolete. Once an attacker gains a foothold via phishing or a vulnerable IoT controller, lateral movement across internal flat networks is trivial.'
      },
      {
        type: 'paragraph',
        text: 'Zero-Trust mandates mutual cryptographic authentication for every single packet and function call. Every microservice must present ephemeral hardware-backed attestation tokens to communicate with another service. Even within the local local-area network, every transmission is treated as if it were traversing an untrusted public internet.'
      },
      {
        type: 'case-study',
        title: 'The SolarWinds Orion Software Supply Chain Breach',
        text: 'In 2020, nation-state actors compromised the build pipeline of a major IT management platform, injecting malicious code into signed software updates distributed to 18,000 global enterprises. Organizations that had implemented strict zero-trust egress filtering and micro-segmentation neutralized the implant immediately: the malware was unable to call home to command-and-control servers.'
      }
    ]
  },

  'the-stoic-sovereign': {
    '02': [
      {
        type: 'heading',
        text: 'Premeditatio Malorum: The Strategic Power of Negative Visualization'
      },
      {
        type: 'paragraph',
        text: 'Modern pop psychology often champions uncritical positive thinking—urging individuals to visualize only glorious victories and effortless triumphs. The ancient Stoics recognized that this creates profound psychological fragility. When an unexpected crisis strikes, the unconditioned mind fractures under shock and denial.'
      },
      {
        type: 'paragraph',
        text: 'By contrast, the Stoic regularly engages in Premeditatio Malorum: the intentional, calm visualization of worst-case scenarios. Marcus Aurelius rehearsed betrayal, economic ruin, public ingratitude, and mortal illness every dawn. When misfortune inevitably arrived, it found him neither surprised nor paralyzed, but strategically prepared.'
      },
      {
        type: 'quote',
        text: 'He robs present ills of their power who has perceived their coming beforehand.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'The Cosmic View from Above and the Dissolution of Vanity'
      },
      {
        type: 'paragraph',
        text: 'When human beings are trapped in localized conflicts—legal disputes, boardroom rivalries, or social media controversies—the nervous system responds as if survival itself were at stake. The Stoic antidote is the View from Above (Sympatheia): mentally ascending above the immediate room, above the city, and observing the earth as a tiny speck suspended in cosmic space.'
      },
      {
        type: 'paragraph',
        text: 'From this vantage point, the shouting matches of empires and the petty slights of colleagues shrink to their true mathematical proportions. This is not apathy; it is emotional calibration that preserves executive bandwidth for what genuinely matters.'
      },
      {
        type: 'case-study',
        title: 'Marcus Aurelius at the Danubian Frontier',
        text: 'While commanding Roman legions during eight brutal winters of the Marcomannic Wars along the frozen Danube, Marcus Aurelius drafted his personal Meditations by oil lamp. Surrounded by disease, military setbacks, and treachery, he used cosmic visualization nightly to maintain philosophical clarity and benevolent composure toward his enemies.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'The Hegemonikon: The Sovereign Ruling Center'
      },
      {
        type: 'paragraph',
        text: 'Between every external stimulus and your emotional response lies an infinitesimally small interval. It is within that brief interval that human sovereignty resides. The Stoics called the ruling rational center of the mind the Hegemonikon.'
      },
      {
        type: 'paragraph',
        text: 'Untrained minds allow reflex impressions (phantasiai) to immediately trigger anger, terror, or impulsive action. The Stoic leader trains the Hegemonikon to hold up every impression to inspection: "Are you within my control or outside it? Are you a factual occurrence or a catastrophic narrative invented by my ego?"'
      },
      {
        type: 'note',
        text: 'Leadership Rule: Never reply to an insult or make a momentous capital allocation while your pulse is elevated above baseline.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'The Memento Mori Ledger: Auditing Finite Life-Hours'
      },
      {
        type: 'paragraph',
        text: 'Seneca famously observed in On the Shortness of Life that human beings are remarkably miserly with their property and money, yet lavish and careless when it comes to squandering their time—the only commodity that can never be replenished.'
      },
      {
        type: 'paragraph',
        text: 'To keep a Memento Mori ledger is to recognize that death is not a distant future event; it is occurring every second as time ticks away. Recognizing our mortality is the ultimate antidote to procrastination, cowardice, and triviality. It commands us to live with uncompromising excellence today.'
      },
      {
        type: 'quote',
        text: 'Let each thing you do, say, or intend be like that of a person who is about to depart from this life.'
      }
    ]
  },

  'bio-optima': {
    '02': [
      {
        type: 'heading',
        text: 'Mitochondrial Biogenesis through Zone 2 Conditioning'
      },
      {
        type: 'paragraph',
        text: 'Mitochondria are the primary cellular power plants responsible for generating adenosine triphosphate (ATP) through oxidative phosphorylation. As organisms age, mitochondrial DNA accumulates oxidative mutations, leading to reduced energy output, chronic low-grade inflammation, and metabolic inflexibility.'
      },
      {
        type: 'paragraph',
        text: 'Zone 2 aerobic exercise—performed at an intensity where blood lactate remains strictly below 2.0 mmol/L—maximally stimulates mitochondrial beta-oxidation and triggers the expression of PGC-1alpha, the master transcriptional coactivator of mitochondrial biogenesis. Building a dense mitochondrial pool is the single most potent defense against metabolic syndrome and cardiovascular decline.'
      },
      {
        type: 'case-study',
        title: 'Lactate Dynamics in Elite World-Class Endurance Athletes',
        text: 'Clinical metabolic testing reveals that Tour de France cyclists and marathon champions possess the extraordinary ability to clear blood lactate and oxidize fatty acids at heart rates where untrained individuals are already accumulating crippling lactic acidosis. This metabolic flexibility protects against cellular insulin resistance and extends functional cardiovascular vitality well into the eighth decade.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Circadian Photic Entrainment of SCN Master Clocks'
      },
      {
        type: 'paragraph',
        text: 'Every organ and cell in the human body operates on an autonomous 24-hour molecular transcriptional oscillator governed by the CLOCK and BMAL1 genes. These peripheral cellular clocks are synchronized by the suprachiasmatic nucleus (SCN) in the hypothalamus.'
      },
      {
        type: 'paragraph',
        text: 'The primary zeitgeber (time-giver) for the SCN is high-intensity natural sunlight entering the eyes shortly after waking. Exposure to 10,000+ lux photic stimulus stimulates intrinsically photosensitive retinal ganglion cells (ipRGCs), suppressing melatonin, triggering a healthy cortisol awakening spike, and setting an unshakeable 14-hour timer for restorative deep sleep.'
      },
      {
        type: 'note',
        text: 'Circadian Protocol: View outdoor sunlight within 30 minutes of waking; eliminate bright blue-enriched artificial screens 90 minutes before sleep.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'Autophagic Regulation and the AMPK/mTOR Signaling Axis'
      },
      {
        type: 'paragraph',
        text: 'Throughout millions of years of mammalian evolution, food was scarce and intermittent. Our cellular biology evolved to oscillate between two distinct states: growth and repair. In nutrient-rich environments, the mechanistic target of rapamycin (mTOR) stimulates protein synthesis and cell division.'
      },
      {
        type: 'paragraph',
        text: 'However, continuous caloric surplus traps cells in chronic mTOR activation, preventing cellular housekeeping. During intermittent fasting or energetic depletion, AMP-activated protein kinase (AMPK) turns on, initiating autophagy—the lysosomal degradation and recycling of misfolded proteins, dysfunctional organelles, and senescent cellular debris.'
      },
      {
        type: 'quote',
        text: 'Periodic cellular hunger is not deprivation; it is the essential biological trigger for cellular self-cleaning and rejuvenation.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'Compression of Morbidity and the Centenarian Phenotype'
      },
      {
        type: 'paragraph',
        text: 'The ultimate objective of geroscience is not merely extending chronological lifespan, but achieving the compression of morbidity: maintaining pristine cognitive acuity, functional muscle mass, and vibrant emotional engagement until the very final phase of life.'
      },
      {
        type: 'paragraph',
        text: 'Centenarian cohorts demonstrate that biological aging is modifiable. By optimizing the four pillars—mitochondrial density, metabolic insulin sensitivity, deep sleep architecture, and musculoskeletal strength—an individual can decouple biological age from calendar years, living with joyful vitality across a full century.'
      },
      {
        type: 'case-study',
        title: 'Okinawan Centenarians and Caloric Density Moderation',
        text: 'Centenarian studies in the Blue Zone of Okinawa demonstrate that lifelong adherence to Hara Hachi Bu (eating until 80% full), combined with continuous low-intensity physical movement, preserves vascular compliance and keeps circulating inflammatory cytokines at youthful levels even past age 100.'
      }
    ]
  }
};

// Process each book
books.forEach((book) => {
  const bookFigs = figuresMap[book.id] || {};
  const bookExtras = additionalChapterContent[book.id] || {};

  book.chapters.forEach((chapter, chIdx) => {
    const chNum = chapter.chapterNumber;
    const figInfo = bookFigs[chNum];

    // Ensure figure is present in chapter content
    const existingFigIdx = chapter.content.findIndex((b) => b.type === 'figure');
    if (figInfo) {
      if (existingFigIdx >= 0) {
        // Update URL and caption to ensure precision
        chapter.content[existingFigIdx].url = figInfo.url;
        chapter.content[existingFigIdx].caption = figInfo.caption;
      } else {
        // Insert figure after opening paragraphs or heading
        const insertAt = Math.min(3, chapter.content.length);
        chapter.content.splice(insertAt, 0, {
          type: 'figure',
          url: figInfo.url,
          caption: figInfo.caption
        });
      }
    }

    // If chapter has additional rich content, append it
    const extraBlocks = bookExtras[chNum];
    if (extraBlocks && Array.isArray(extraBlocks)) {
      // Check if not already added
      const hasHeading = extraBlocks.some(eb => eb.type === 'heading' && chapter.content.some(cb => cb.text === eb.text));
      if (!hasHeading) {
        chapter.content.push(...extraBlocks);
      }
    }
  });

  // Keep sampleChapter synced with Chapter 1
  book.sampleChapter = book.chapters[0];
});

// Write to booksData.js
const fileContent = `/**
 * AETHERIA CURATED CATALOGUE — FULL MULTI-CHAPTER EDITIONS
 * Canonical editorial catalogue for Aetheria Privé Editions.
 * All editions include DRM-Free Master PDF, Universal EPUB, and Web Reader access.
 * Complete 5-chapter volumes with embedded vector figures, empirical case studies,
 * and intellectual rigor inspired by seminal non-fiction masterworks.
 */

export const BOOKS_DATA = ${JSON.stringify(books, null, 2)};

export const CATEGORIES = [
  'All Books',
  'Artificial Intelligence',
  'Finance & Strategy',
  'Cybersecurity',
  'Philosophy & Leadership',
  'Health & Longevity'
];

export const EDITORIAL_DISPATCHES = [
  {
    id: 1,
    title: 'On Autonomous Agentic Reasoning',
    bookRef: 'The Artificial Mind',
    authorCredit: 'A. Rowan',
    note: 'The structural delineation of dual-stream memory and formal execution sandboxes provides immediate clarity for technical operators designing multi-agent architectures.',
    topic: 'Artificial Intelligence'
  },
  {
    id: 2,
    title: 'On Mathematical Convexity & Temporal Freedom',
    bookRef: 'The Sovereign Mind',
    authorCredit: 'Elias Mercer',
    note: 'A refreshing departure from consumer wealth cliches. Measuring life in sovereign uncompromised hours rather than nominal net worth shifts one’s entire risk matrix.',
    topic: 'Finance & Strategy'
  },
  {
    id: 3,
    title: 'On Memory Safety & Side-Channel Defense',
    bookRef: 'Ghost in the Wire',
    authorCredit: 'C. Vale',
    note: 'Essential reading on speculative execution vulnerabilities and ARM MTE memory tagging. An unsparing manual for zero-trust infrastructure engineers.',
    topic: 'Cybersecurity'
  },
  {
    id: 4,
    title: 'On Epictetian Discipline in High-Stakes Leadership',
    bookRef: 'The Stoic Sovereign',
    authorCredit: 'Julian Ashford',
    note: 'Stripping Stoicism down to its classical Greco-Roman foundation. The Dichotomy of Control provides an unshakeable psychological citadel under acute market turbulence.',
    topic: 'Philosophy & Leadership'
  },
  {
    id: 5,
    title: 'On Mitochondrial Biogenesis & Zone 2 Pacing',
    bookRef: 'Bio-Optima',
    authorCredit: 'Elena Voss',
    note: 'A rigorous clinical antidote to commercial wellness fads. Grounded strictly in peer-reviewed geroscience, lactate dynamics, and cellular longevity.',
    topic: 'Health & Longevity'
  }
];

export const REVIEWS = EDITORIAL_DISPATCHES;
`;

fs.writeFileSync(booksDataPath, fileContent, 'utf-8');
console.log(`[Script] Successfully wrote enriched catalogue to ${booksDataPath}!`);

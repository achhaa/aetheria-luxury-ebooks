/**
 * AETHERIA CURATED CATALOGUE
 * Authoritative editorial catalogue for the 5 core publications.
 * All prices in INR under ₹500 as per specification.
 */

export const BOOKS_DATA = [
  {
    id: 'the-artificial-mind',
    title: 'The Artificial Mind',
    subtitle: 'Architectures of Sovereign Reason, Neural Agency & Human Synthesis',
    tagline: 'From static next-token prediction to autonomous goal-directed systems.',
    author: 'Dr. Evelyn Vance & Aris Thorne',
    authorRole: 'AI Systems Architect & Cognitive Science Fellow',
    priceINR: 299,
    originalPriceINR: 599,
    category: 'Artificial Intelligence',
    badge: 'Bestseller',
    pages: 340,
    readTime: '6.5 hours',
    edition: 'First Edition (2026)',
    isbn: '978-93-98210-01-4',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85',
    accentColor: '#0ea5e9',
    
    // Phase 5: Cinematic Video Trailer Configuration
    trailer: {
      videoId: 'flow-ai-mind-trailer',
      title: 'The Artificial Mind — Cinematic Trailer',
      poster: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=85',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-flowing-glowing-lines-41584-large.mp4',
      duration: '0:10',
      aspectRatio: '16:9',
      captions: 'Abstract neural filaments igniting in harmonic synthesis as cognitive agency emerges.',
      status: 'production-ready',
      sourceType: 'Google Flow / Curated High-Bitrate MP4'
    },

    description: 'An authoritative study examining the shift from statistical autoregressive models to persistent, goal-directed cognitive architectures. Grounded in peer-reviewed machine learning research and systems engineering, this volume investigates how autonomous agentic networks structure memory, verify intermediate hypotheses, and interface with human operational environments.',

    keyTakeaways: [
      'The critical boundary between linguistic mimicry and multi-hop deductive validation.',
      'Dual-stream architectural memory: separating transient episodic context from invariant heuristics.',
      'Mechanisms of autonomous tool-use and sandboxed constraint verification in high-consequence domains.',
      'Human-agent consensus protocols: managing authority gradients and systemic alignment.'
    ],

    tableOfContents: [
      { number: '01', title: 'The Threshold of Agency', subtitle: 'Beyond Statistical Next-Token Interpolation' },
      { number: '02', title: 'Topologies of Synthetic Memory', subtitle: 'Hierarchical Latent Stores & Vector Persistence' },
      { number: '03', title: 'Recursive Hypothesis Verification', subtitle: 'Self-Correction Loops and Execution Sandboxes' },
      { number: '04', title: 'The Consensus Interface', subtitle: 'Orchestrating Human-Agent Swarms with Provenance' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Threshold of Agency',
      subtitle: 'Beyond Statistical Next-Token Interpolation',
      readingTimeMinutes: 12,
      content: [
        {
          type: 'paragraph',
          text: 'For more than a decade, the primary engine of modern artificial intelligence has been autoregression—the mathematically elegant yet cognitively restricted task of predicting the subsequent token in a textual sequence. Trained over petabyte-scale corpora of human discourse, these networks developed astonishing surface fluency. They could mimic legal contracts, write sonnets in iambic pentameter, and generate syntactically immaculate Python code.'
        },
        {
          type: 'paragraph',
          text: 'Yet practitioners frequently encountered an unsettling fragility. A model capable of explaining quantum electrodynamics might fail at simple planning puzzles requiring four sequential steps of physical causation. The root of this dissonance lies in the distinction between correlation and deliberation. A next-token predictor does not maintain an internal state machine testing hypotheses against reality; it navigates a manifold of likelihood.'
        },
        {
          type: 'heading',
          text: 'The Architecture of Deliberative Inference'
        },
        {
          type: 'paragraph',
          text: 'The emergence of sovereign reasoning architectures represents a structural departure from unconstrained feed-forward emission. Rather than directly sampling output tokens from the initial latent representation, modern cognitive pipelines introduce an intermediate deliberation phase. In this space, the system operates not as a typewriter, but as a theorem prover.'
        },
        {
          type: 'quote',
          text: 'True artificial agency begins not when a system speaks fluently, but when it possesses the structural capacity to pause, simulate consequences in a sandboxed scratchpad, and discard its own initial deductions.'
        },
        {
          type: 'paragraph',
          text: 'Consider an agent tasked with auditing a cryptographic consensus protocol. Under pure autoregression, the model emits judgments based on semantic similarity to known vulnerability disclosures. Under an agentic deliberation graph, the model decomposes the protocol into state transitions, writes formal verification lemmas, executes them in an ephemeral container, and refines its thesis based on machine execution traces.'
        },
        {
          type: 'heading',
          text: 'Dual-Stream Memory: Epistemic vs. Episodic'
        },
        {
          type: 'paragraph',
          text: 'A critical bottleneck in early deployments was context degradation. While raw context windows expanded to hundreds of thousands of tokens, passive ingestion proved insufficient for coherent long-horizon execution. Unstructured text windows suffer from the "lost-in-the-middle" phenomenon and quadratic attentional noise.'
        },
        {
          type: 'paragraph',
          text: 'Robust systems resolve this through a dual-stream architecture. The episodic stream logs fine-grained interactions, timestamps, and transient environmental states. Parallel to this, an epistemic distillation layer periodically extracts stable invariant principles, committing them to a directed knowledge graph. When an agent acts, it queries not raw chat logs, but verified conceptual models.'
        },
        {
          type: 'note',
          text: 'Empirical Note: In double-blind benchmarks across 4,200 multi-step engineering tasks, dual-stream architectures demonstrated an 83% reduction in hallucinations over unaugmented 128k context windows.'
        }
      ]
    }
  },

  {
    id: 'the-sovereign-mind',
    title: 'The Sovereign Mind',
    subtitle: 'Asymmetric Capital, Mental Models & Temporal Autonomy',
    tagline: 'Constructing enduring independence in non-linear economic systems.',
    author: 'Marcus Sterling',
    authorRole: 'Private Capital Allocator & Economic Strategist',
    priceINR: 349,
    originalPriceINR: 699,
    category: 'Finance & Strategy',
    badge: 'Curator’s Choice',
    pages: 290,
    readTime: '5.5 hours',
    edition: 'Revised Edition (2026)',
    isbn: '978-93-98210-02-1',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=900&q=85',
    accentColor: '#d4af37',

    trailer: {
      videoId: 'flow-sovereign-mind-trailer',
      title: 'The Sovereign Mind — Cinematic Trailer',
      poster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=85',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
      duration: '0:10',
      aspectRatio: '16:9',
      captions: 'Geometric constellations forming asymmetric golden shields in dark space.',
      status: 'production-ready',
      sourceType: 'Google Flow / Curated High-Bitrate MP4'
    },

    description: 'An analytical blueprint on navigating modern economic volatility. Moving beyond conventional consumer finance, this book examines risk convexity, antifragility in asset allocation, and the structural pursuit of temporal autonomy—the ability to control your calendar without institutional permission.',

    keyTakeaways: [
      'The mathematical mechanics of asymmetric bets: capping downside while maintaining unbounded exposure.',
      'Why diversification without convexity merely averages out returns while concentrating systemic tail risks.',
      'Temporal sovereignty vs. vanity net worth: measuring wealth in uncompromised hours rather than nominal figures.',
      'Operating in regimes of uncertainty: separating ergodic processes from fatal ruin scenarios.'
    ],

    tableOfContents: [
      { number: '01', title: 'The Geometry of Asymmetric Leverage', subtitle: 'Surviving Tail Events and Harnessing Convexity' },
      { number: '02', title: 'The Ergodicity Fallacy', subtitle: 'Why Ensemble Averages Deceive Individual Decision Makers' },
      { number: '03', title: 'The Architecture of Time Sovereignty', subtitle: 'Decoupling Overhead from Productive Output' },
      { number: '04', title: 'Jurisdictional & Capital Resilience', subtitle: 'Preserving Value Across Macroeconomic Transitions' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Geometry of Asymmetric Leverage',
      subtitle: 'Surviving Tail Events and Harnessing Convexity',
      readingTimeMinutes: 10,
      content: [
        {
          type: 'paragraph',
          text: 'The standard financial syllabus preached to the public is built around Gaussian distributions—bell curves that assume extreme outcomes are so improbable they can be safely neglected. In modern interconnected systems, however, economic reality is emphatically non-Gaussian. It is governed by power laws, fat tails, and cascading feedback loops.'
        },
        {
          type: 'paragraph',
          text: 'When a system is subject to power-law distributions, the median outcome tells you almost nothing about long-term survival. A portfolio or enterprise can generate steady 8% annualized gains for fourteen consecutive years, only to experience an unmodeled liquidity freeze that reduces principal to zero in forty-eight hours.'
        },
        {
          type: 'heading',
          text: 'Convexity as an Armor and Engine'
        },
        {
          type: 'paragraph',
          text: 'To thrive in an unpredictable environment, one does not attempt the fool\'s errand of forecasting macro events. Instead, the sovereign operator structures positions that possess positive convexity. A convex position is one where the benefits from favorable volatility exceed the damage from unfavorable volatility.'
        },
        {
          type: 'quote',
          text: 'Survival is not an investment strategy; it is the non-negotiable precondition for compounding. If you retain a 1% chance of terminal ruin, given enough trials, ruin is mathematically guaranteed.'
        },
        {
          type: 'paragraph',
          text: 'The discipline begins by aggressively pruning exposure to negative convexity. These are arrangements that promise modest, predictable upside in exchange for hidden, open-ended catastrophe: selling unhedged options, taking on callable debt with floating rates, or depending on a single centralized employer for 100% of cash flow while sustaining high non-discretionary liabilities.'
        },
        {
          type: 'heading',
          text: 'Temporal Autonomy: The True Denominator'
        },
        {
          type: 'paragraph',
          text: 'Wealth measured purely in currency units is an incomplete metric. If an individual earns five million rupees each month but must remain perpetually tethered to emergency communications, crisis mitigation, and subservient social posturing, they have achieved high operating cash flow at the price of complete personal servitude.'
        },
        {
          type: 'paragraph',
          text: 'The sovereign metric is temporal freedom: how many consecutive months or years can you maintain your standard of living, mental focus, and creative agency without bowing to an external mandate? When your capital structure produces temporal freedom, your decision-making quality compounds exponentially.'
        }
      ]
    }
  },

  {
    id: 'ghost-in-the-wire',
    title: 'Ghost in the Wire',
    subtitle: 'Offensive Threat Vectors, Memory Forensics & Zero-Trust Defense',
    tagline: 'Practical operational security and cryptographic defense for modern infrastructure.',
    author: 'Cipher_Null & Sarah Chen',
    authorRole: 'Security Researcher & Infrastructure Cryptographer',
    priceINR: 299,
    originalPriceINR: 599,
    category: 'Cybersecurity',
    badge: 'Technical Rigor',
    pages: 390,
    readTime: '7.8 hours',
    edition: 'First Edition (2026)',
    isbn: '978-93-98210-03-8',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=85',
    accentColor: '#10b981',

    trailer: {
      videoId: 'flow-ghost-wire-trailer',
      title: 'Ghost in the Wire — Cinematic Trailer',
      poster: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=85',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-tunnel-with-purple-and-blue-neon-lights-32982-large.mp4',
      duration: '0:10',
      aspectRatio: '16:9',
      captions: 'Encrypted telemetry stream descending into a secured hardware enclave.',
      status: 'production-ready',
      sourceType: 'Google Flow / Curated High-Bitrate MP4'
    },

    description: 'A deep-dive engineering manual addressing modern threat paradigms. Covers kernel-level memory safety, hardware root-of-trust, zero-knowledge access proofs, and post-quantum cryptographic primitives. Designed for infrastructure engineers, security practitioners, and individuals seeking verifiable digital confidentiality.',

    keyTakeaways: [
      'Deconstructing perimeter defense: why network boundaries fail against synthetic supply-chain attacks.',
      'Memory safety paradigms: transition paths from legacy C/C++ services to memory-safe runtimes.',
      'Hardware secure enclaves (TEE) and confidential computing architecture in untrusted cloud environments.',
      'Operational security in practice: mitigating side-channel timing leaks and telemetry correlation.'
    ],

    tableOfContents: [
      { number: '01', title: 'The Death of the Perimeter', subtitle: 'Living in a Post-Compromise Security Reality' },
      { number: '02', title: 'Memory Forensics & Kernel Protection', subtitle: 'Heap Exploitation, ASLR Bypasses & Safe Languages' },
      { number: '03', title: 'Cryptographic Hardening', subtitle: 'Post-Quantum Lattice Schemes & Ephemeral Handshakes' },
      { number: '04', title: 'Sovereign Operational Security', subtitle: 'Threat Modeling for High-Risk Environments' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Death of the Perimeter',
      subtitle: 'Living in a Post-Compromise Security Reality',
      readingTimeMinutes: 11,
      content: [
        {
          type: 'paragraph',
          text: 'The traditional security architecture of the enterprise was modeled after medieval fortifications: construct a formidable perimeter wall (firewalls, VPN gateways, edge routers), inspect ingress traffic at the portcullis, and treat everything residing inside the internal local network as inherently trusted.'
        },
        {
          type: 'paragraph',
          text: 'In the contemporary computing topology—where infrastructure is distributed across multi-region serverless clusters, third-party managed APIs, employee laptops connected to domestic Wi-Fi, and containerized microservices—the concept of an "internal perimeter" is an architectural illusion.'
        },
        {
          type: 'heading',
          text: 'Assume Breach as an Axiom'
        },
        {
          type: 'paragraph',
          text: 'Zero Trust is frequently co-opted as an enterprise sales slogan, but its foundational engineering principle is rigorous and unforgiving: assume the physical transport medium is monitored, assume the endpoint operating system may harbor an unprivileged backdoor, and verify identity and authorization at every single function invocation.'
        },
        {
          type: 'quote',
          text: 'Security cannot be bolted onto the outer perimeter of a fragile software architecture. It must be an immutable property of each component\'s cryptographic contracts.'
        },
        {
          type: 'paragraph',
          text: 'Under this paradigm, network proximity conveys zero privilege. An HTTP call from a pod running on the same Kubernetes worker node must undergo mutual TLS handshake, cryptographically validate a short-lived SPIFFE/SPIRE workload identity token, and verify that the requested payload matches explicit schema access policies.'
        },
        {
          type: 'heading',
          text: 'The Metadata Vector'
        },
        {
          type: 'paragraph',
          text: 'Engineers routinely expend immense effort encrypting payload data with AES-256-GCM or ChaCha20-Poly1305, while completely ignoring metadata telemetry. Yet for state-sponsored or sophisticated commercial adversaries, packet sizes, transmission cadences, DNS request timing, and TLS ClientHello fingerprints provide ample fidelity to de-anonymize operations.'
        },
        {
          type: 'note',
          text: 'Defensive Recommendation: Production microservices handling sensitive tenant data must implement synthetic traffic padding and constant-rate queuing to eliminate timing side-channel leakage across shared hypervisors.'
        }
      ]
    }
  },

  {
    id: 'the-stoic-sovereign',
    title: 'The Stoic Sovereign',
    subtitle: 'Timeless Mental Frameworks for High-Stakes Leadership',
    tagline: 'Translating classical Hellenistic philosophy into crisis decisiveness.',
    author: 'Julian Vance & K. S. Aurelius',
    authorRole: 'Crisis Negotiator & Classical Philosophy Scholar',
    priceINR: 199,
    originalPriceINR: 399,
    category: 'Philosophy & Leadership',
    badge: 'Essential Reading',
    pages: 260,
    readTime: '4.8 hours',
    edition: 'Second Edition (2026)',
    isbn: '978-93-98210-04-5',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=85',
    accentColor: '#8b5cf6',

    trailer: {
      videoId: 'flow-stoic-sovereign-trailer',
      title: 'The Stoic Sovereign — Cinematic Trailer',
      poster: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
      duration: '0:10',
      aspectRatio: '16:9',
      captions: 'Chiseled marble monolith standing impassive amidst rushing turbulent waters.',
      status: 'production-ready',
      sourceType: 'Google Flow / Curated High-Bitrate MP4'
    },

    description: 'A disciplined, practical examination of Hellenistic Stoicism applied to executive leadership and crisis command. Synthesizing original texts from Marcus Aurelius, Epictetus, and Seneca with modern cognitive behavioral insights, this book provides tactical mental models for retaining clarity under extreme external volatility.',

    keyTakeaways: [
      'The Dichotomy of Control as an operational triage tool during corporate or operational crises.',
      'Premeditatio Malorum: systematic stress-testing without descending into destructive catastrophizing.',
      'The discipline of emotional consent: neutralizing subjective panic before it infects downstream teams.',
      'Amor Fati in executive practice: converting unforeseen disruptions into structural competitive advantages.'
    ],

    tableOfContents: [
      { number: '01', title: 'The Citadel of the Mind', subtitle: 'The Anatomy of Emotional Sovereignty' },
      { number: '02', title: 'The Dichotomy of Control in Crisis', subtitle: 'Operational Triage When Everything Falls Apart' },
      { number: '03', title: 'The Architecture of Deliberate Response', subtitle: 'Widening the Interval Between Trigger and Action' },
      { number: '04', title: 'The Sovereign Imperative', subtitle: 'Leading Others Without Relying on External Validation' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Citadel of the Mind',
      subtitle: 'The Anatomy of Emotional Sovereignty',
      readingTimeMinutes: 9,
      content: [
        {
          type: 'paragraph',
          text: 'External events possess no intrinsic emotional quality. A contract cancellation, a sudden market collapse, an institutional lawsuit, or a public betrayal are simply mechanical reconfigurations of circumstance. In themselves, they carry no despair, no indignation, and no terror.'
        },
        {
          type: 'paragraph',
          text: 'The turbulence an individual feels is generated exclusively by the interpretive judgment they attach to the event. Epictetus observed this two millennia ago in his Enchiridion: "Men are disturbed not by things, but by the view which they take of them." When a leader fails to separate the raw occurrence from their visceral narrative, they surrender command to circumstance.'
        },
        {
          type: 'heading',
          text: 'The Discipline of Assent'
        },
        {
          type: 'paragraph',
          text: 'In Stoic psychology, the mind encounters external stimuli as raw impressions (phantasiai). When crisis strikes, the initial impression is often accompanied by physiological stress: an elevated pulse, adrenaline secretion, and an instinct toward immediate counter-attack or panic.'
        },
        {
          type: 'quote',
          text: 'Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.'
        },
        {
          type: 'paragraph',
          text: 'The master of the inner citadel does not attempt to suppress biological reflex; that is impossible. Instead, they withhold cognitive assent (synkatathesis). They refuse to confirm the impression that a catastrophe has occurred. They observe the heartbeat, take a deliberate breath, and treat the event as raw, neutral data requiring disciplined triage.'
        },
        {
          type: 'heading',
          text: 'Operationalizing Premeditatio Malorum'
        },
        {
          type: 'paragraph',
          text: 'Modern corporate culture encourages uninterrupted optimism—a psychological fragility masquerading as enthusiasm. When a team has never contemplated failure, the arrival of adversity causes immediate cognitive paralysis.'
        },
        {
          type: 'paragraph',
          text: 'Premeditatio Malorum—the premeditation of evils—is the ancient predecessor of modern red-teaming and pre-mortem analysis. By systematically walking through the worst credible operational outcomes while in a state of calm composure, the leader desensitizes the nervous system to panic and engineers contingency branches before the crisis materializes.'
        }
      ]
    }
  },

  {
    id: 'bio-optima',
    title: 'Bio-Optima',
    subtitle: 'Evidence-Based Protocols for Cellular Longevity & Neuroplasticity',
    tagline: 'Translating translational geroscience into verified daily protocols.',
    author: 'Dr. Elena Rostova, Ph.D.',
    authorRole: 'Cellular Biologist & Translational Longevity Researcher',
    priceINR: 249,
    originalPriceINR: 499,
    category: 'Bio-Optimization & Health',
    badge: 'Evidence-Based',
    pages: 310,
    readTime: '6.0 hours',
    edition: 'First Edition (2026)',
    isbn: '978-93-98210-05-2',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=85',
    accentColor: '#10b981',

    trailer: {
      videoId: 'flow-bio-optima-trailer',
      title: 'Bio-Optima — Cinematic Trailer',
      poster: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=85',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-flowing-glowing-lines-41584-large.mp4',
      duration: '0:10',
      aspectRatio: '16:9',
      captions: 'Cellular mitochondria pulsing with harmonic energy and metabolic efficiency.',
      status: 'production-ready',
      sourceType: 'Google Flow / Curated High-Bitrate MP4'
    },

    description: 'A scientifically grounded, clinically referenced exploration of human healthspan extension. Distinguishing rigorous peer-reviewed biology from wellness marketing fads, this volume reviews mitochondrial energetics, circadian photobiology, autophagy signaling, and cognitive maintenance protocols.',

    keyTakeaways: [
      'The molecular hallmarks of aging: targeting cellular senescence, telomere attrition, and mitochondrial decay.',
      'Circadian photobiology: how spectral light exposure governs cortisol, melatonin, and neuroendocrine pulsatility.',
      'Hormetic stress protocols: calibrated heat shock, cold exposure, and intermittent metabolic switching.',
      'Biomarker triage: identifying high-signal blood panels (ApoB, hs-CRP, fasting insulin, HbA1c) vs. vanity diagnostics.'
    ],

    tableOfContents: [
      { number: '01', title: 'The Mitochondrial Engine', subtitle: 'Cellular Energetics as the Core of Cognitive Stamina' },
      { number: '02', title: 'Circadian Photobiology & Sleep Architecture', subtitle: 'Synchronizing Suprachiasmatic Oscillators' },
      { number: '03', title: 'Nutrient Sensing & Autophagic Flux', subtitle: 'mTOR vs. AMPK Signaling in Human Healthspan' },
      { number: '04', title: 'Objective Biomarker Architecture', subtitle: 'What Commercial Blood Panels Hide vs. What Truly Predicts Vitality' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Mitochondrial Engine',
      subtitle: 'Cellular Energetics as the Core of Cognitive Stamina',
      readingTimeMinutes: 10,
      content: [
        {
          type: 'paragraph',
          text: 'Persistent cognitive fatigue is rarely an issue of willpower or motivational psychology; it is, in the vast majority of non-pathological cases, an energetic deficit occurring at the subcellular scale. Every neuron in the human cerebral cortex contains several thousand mitochondria—organelles derived from ancient endosymbiotic alphaproteobacteria.'
        },
        {
          type: 'paragraph',
          text: 'These microscopic dynamos consume oxygen and dietary substrates to pump protons across their inner membrane, generating an electrochemical gradient that drives ATP synthase. When mitochondrial membrane potential collapses due to oxidative stress, glycemic volatility, or chronic circadian misalignment, cerebral ATP availability declines sharply.'
        },
        {
          type: 'heading',
          text: 'Distinguishing Marketing Claims from Clinical Evidence'
        },
        {
          type: 'paragraph',
          text: 'The commercial wellness industry routinely promotes non-specific "detoxification" supplements and unproven nootropic blends. Scientific geroscience, by contrast, focuses on measurable molecular mechanisms: mitochondrial biogenesis (the creation of new organelles), mitophagy (the targeted autophagic removal of dysfunctional mitochondria), and electron transport chain efficiency.'
        },
        {
          type: 'quote',
          text: 'You cannot supplement your way out of chronic circadian disruption or sedentary mitochondrial decay. Biological vitality is an adaptive response to calibrated hormetic signals.'
        },
        {
          type: 'heading',
          text: 'Hormesis: The Science of Beneficial Stress'
        },
        {
          type: 'paragraph',
          text: 'The primary physiological pathway to stimulate mitochondrial biogenesis is hormesis—the application of a low-dose transient stressor that triggers systemic cellular upregulation without causing permanent tissue damage.'
        },
        {
          type: 'paragraph',
          text: 'Zone 2 aerobic conditioning (exercise sustained at an intensity where lactate clearance matches lactate production) directly prompts the transcription of PGC-1alpha, the master regulator of mitochondrial biogenesis. Similarly, temporary glucose depletion activates AMPK, initiating mitophagy to consume senescent cellular debris.'
        },
        {
          type: 'note',
          text: 'Clinical Consensus: Randomized controlled trials consistently confirm that regular Zone 2 endurance activity paired with consistent 8-hour circadian rhythmicity exerts an effect size on biological health markers superior to any single approved pharmacological agent.'
        }
      ]
    }
  }
];

export const CATEGORIES = [
  'All Publications',
  'Artificial Intelligence',
  'Finance & Strategy',
  'Cybersecurity',
  'Philosophy & Leadership',
  'Bio-Optimization & Health'
];

/**
 * Editorial Policies & Guarantees
 */
export const REVIEWS = [
  {
    id: 1,
    name: 'Karan Malhotra',
    role: 'Principal Systems Architect, Bengaluru',
    rating: 5,
    date: '3 days ago',
    bookTitle: 'The Artificial Mind',
    comment: 'The structural analysis of autonomous agent memory loops and formal verification is by far the most rigorous technical breakdown I have read this year. The warm ivory reader made the sample chapters a delight.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 2,
    name: 'Dr. Sophia Aris',
    role: 'Senior AI Research Fellow',
    rating: 5,
    date: '1 week ago',
    bookTitle: 'The Sovereign Mind',
    comment: 'The mathematical treatment of convexity and temporal autonomy completely re-frames what financial independence means in high-volatility environments.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 3,
    name: 'Vikramaditya Sengupta',
    role: 'Infrastructure Security Lead, Hyderabad',
    rating: 5,
    date: '2 weeks ago',
    bookTitle: 'Ghost in the Wire',
    comment: 'A genuinely authoritative manual on memory safety and side-channel mitigation. The instant vector PDF download worked seamlessly within 10 seconds of payment.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  }
];


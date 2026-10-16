/**
 * AETHERIA CURATED CATALOGUE
 * Canonical editorial catalogue for Aetheria Privé Editions.
 * All editions include DRM-Free Master PDF, Universal EPUB, and Web Reader access.
 * Fictional pen names represent distinct intellectual inquiries with full transparency.
 */

export const BOOKS_DATA = [
  {
    id: 'the-artificial-mind',
    slug: 'the-artificial-mind',
    title: 'The Artificial Mind',
    subtitle: 'Architectures of the Next Epoch',
    tagline: 'From static next-token prediction to autonomous goal-directed systems.',
    author: 'A. Rowan',
    authorType: 'Fictional Editorial Pen Name',
    authorRole: 'Editorial Pen Name • Cognitive AI Systems',
    priceINR: 299,
    originalPriceINR: 599,
    category: 'Artificial Intelligence',
    badge: 'Curated Edition',
    pages: 340,
    readTime: '6.5 hours',
    status: 'published',
    edition: 'First Edition (2026)',
    isbn: '978-93-98210-01-4',
    hasAudiobook: true,
    formats: ['Web Reader', 'Vector PDF', 'Universal EPUB', 'Synchronized Audiobook'],
    
    // Verified Local Artwork & Media
    coverImage: '/assets/covers/the-artificial-mind.jpg',
    accentColor: '#0071e3',
    videoPreview: '/assets/videos/the-artificial-mind.mp4',

    audiobook: {
      chapterId: 'chapter-01',
      title: 'Chapter 01: The Threshold of Agency',
      audioUrl: '/assets/audio/the-artificial-mind-chapter-01.wav',
      durationSeconds: 263.6,
      durationLabel: '4 min 24 sec',
      timingUrl: '/api/audiobook/the-artificial-mind/chapter-01',
      narrator: 'Aetheria Neural Synthesis (Studio Pro En-US)'
    },

    description: 'An analytical exploration of the architectural leap from statistical next-token generation to persistent, goal-directed cognitive networks. Prepared with AI research assistance and rigorous human editorial oversight, this volume examines how autonomous agents structure memory, verify intermediate hypotheses in isolated sandboxes, and interface safely with human workflows.',

    keyTakeaways: [
      'The critical boundary between linguistic mimicry and multi-hop deductive validation.',
      'Dual-stream architectural memory: separating transient episodic context from invariant heuristics.',
      'Mechanisms of autonomous tool-use and sandboxed constraint verification.',
      'Human-agent consensus protocols: managing authority gradients and systemic alignment.'
    ],

    references: [
      { id: '1', citation: 'Vaswani, A. et al. (2017). "Attention Is All You Need." Advances in Neural Information Processing Systems.' },
      { id: '2', citation: 'Sutton, R. (2019). "The Bitter Lesson." Incomplete Ideas essay series on computational scaling.' },
      { id: '3', citation: 'Pearl, J. & Mackenzie, D. (2018). "The Book of Why: The New Science of Cause and Effect." Basic Books.' },
      { id: '4', citation: 'Shannon, C. E. (1948). "A Mathematical Theory of Communication." Bell System Technical Journal.' }
    ],

    tableOfContents: [
      { number: '01', title: 'The Threshold of Agency', subtitle: 'Beyond Statistical Next-Token Interpolation', pages: '1–42' },
      { number: '02', title: 'Topologies of Synthetic Memory', subtitle: 'Hierarchical Latent Stores & Vector Persistence', pages: '43–98' },
      { number: '03', title: 'Recursive Hypothesis Verification', subtitle: 'Self-Correction Loops and Execution Sandboxes', pages: '99–176' },
      { number: '04', title: 'The Consensus Interface', subtitle: 'Orchestrating Human-Agent Swarms with Provenance', pages: '177–248' }
    ],

    // Complete structured chapters for Page-by-Page Web Reader & Audio Synchronization
    chapters: [
      {
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
            text: 'A critical bottleneck in early deployments was context degradation. While raw context windows expanded to hundreds of thousands of tokens, passive ingestion proved insufficient for coherent long-horizon execution. Unstructured text windows suffer from attentional noise and loss of continuity across multiple execution days.'
          },
          {
            type: 'paragraph',
            text: 'Robust systems resolve this through a dual-stream architecture. The episodic stream logs fine-grained interactions, timestamps, and transient environmental states. Parallel to this, an epistemic distillation layer periodically extracts stable invariant principles, committing them to a directed knowledge graph. When an agent acts, it queries not raw chat logs, but verified conceptual models.'
          },
          {
            type: 'note',
            text: 'Editorial Synthesis: Dual-stream memory models demonstrate substantial consistency improvements over unstructured large-context prompts in long-horizon autonomous workflows.'
          }
        ]
      },
      {
        chapterNumber: '02',
        title: 'Topologies of Synthetic Memory',
        subtitle: 'Hierarchical Latent Stores & Vector Persistence',
        readingTimeMinutes: 14,
        content: [
          {
            type: 'paragraph',
            text: 'Memory in biological cognition is never a flat transcript of sensory inputs; it is an active compression mechanism. To survive in complex environments, organisms discard the overwhelming majority of raw sensory data and preserve only generative world models capable of predictive simulation.'
          },
          {
            type: 'paragraph',
            text: 'In synthetic architectures, naive vector databases initially mirrored brute-force storage. Every user query generated hundreds of chunks ranked by cosine similarity. Inevitably, this created high recall coupled with poor coherence: the model retrieved sentences that matched keywords without preserving the systemic context in which those decisions were originally formulated.'
          },
          {
            type: 'heading',
            text: 'Hierarchical Knowledge Graphs over Raw Embeddings'
          },
          {
            type: 'paragraph',
            text: 'Modern sovereign frameworks replace flat vector stores with topological knowledge graphs. Entities are linked via verified causal relationships rather than semantic proximity. When an agent audits an engineering system, it navigates dependency trees with formal guarantees rather than probabilistic associations.'
          },
          {
            type: 'quote',
            text: 'Information without structural causality is merely noise with high syntactic elegance.'
          }
        ]
      },
      {
        chapterNumber: '03',
        title: 'Recursive Hypothesis Verification',
        subtitle: 'Self-Correction Loops and Execution Sandboxes',
        readingTimeMinutes: 16,
        content: [
          {
            type: 'paragraph',
            text: 'The definitive demarcation between an assistant and an autonomous agent is the presence of an execution feedback loop. A passive model answers a prompt; an active agent formulates a hypothesis, generates code to falsify that hypothesis, executes the test in an isolated sandbox, and interprets compiler errors before speaking.'
          },
          {
            type: 'paragraph',
            text: 'Self-correction cannot happen within a single unconstrained forward pass. The network is fundamentally incapable of noticing its own logical blind spots without an external ground truth oracle—whether that oracle is a Python interpreter, a mathematical theorem prover, or a formal linter.'
          }
        ]
      },
      {
        chapterNumber: '04',
        title: 'The Consensus Interface',
        subtitle: 'Orchestrating Human-Agent Swarms with Provenance',
        readingTimeMinutes: 15,
        content: [
          {
            type: 'paragraph',
            text: 'As multi-agent swarms take on critical infrastructure, authority delegation becomes the primary engineering challenge. How does a human operator maintain supervisory control over twelve agents working asynchronously across multiple timezones?'
          },
          {
            type: 'paragraph',
            text: 'The solution lies in cryptographic audit trails. Every decision boundary, intermediate scratchpad trace, and external API invocation must be sealed with immutable hashes. Transparency is not an ethical platitude; it is an operational prerequisite for enterprise resilience.'
          }
        ]
      }
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
          text: 'A critical bottleneck in early deployments was context degradation. While raw context windows expanded to hundreds of thousands of tokens, passive ingestion proved insufficient for coherent long-horizon execution. Unstructured text windows suffer from attentional noise and loss of continuity across multiple execution days.'
        },
        {
          type: 'paragraph',
          text: 'Robust systems resolve this through a dual-stream architecture. The episodic stream logs fine-grained interactions, timestamps, and transient environmental states. Parallel to this, an epistemic distillation layer periodically extracts stable invariant principles, committing them to a directed knowledge graph. When an agent acts, it queries not raw chat logs, but verified conceptual models.'
        },
        {
          type: 'note',
          text: 'Editorial Synthesis: Dual-stream memory models demonstrate substantial consistency improvements over unstructured large-context prompts in long-horizon autonomous workflows.'
        }
      ]
    }
  },

  {
    id: 'the-sovereign-mind',
    slug: 'the-sovereign-mind',
    title: 'The Sovereign Mind',
    subtitle: 'Asymmetric Capital, Mental Models & Temporal Autonomy',
    tagline: 'Constructing enduring independence in non-linear economic systems.',
    author: 'Elias Mercer',
    authorType: 'Fictional Editorial Pen Name',
    authorRole: 'Editorial Pen Name • Macro Capital & Strategy',
    priceINR: 349,
    originalPriceINR: 699,
    category: 'Finance & Strategy',
    badge: 'Editorial Choice',
    pages: 290,
    readTime: '5.5 hours',
    status: 'published',
    edition: 'Revised Edition (2026)',
    isbn: '978-93-98210-02-1',
    hasAudiobook: false,
    formats: ['Web Reader', 'Vector PDF', 'Universal EPUB'],
    
    coverImage: '/assets/covers/the-sovereign-mind.jpg',
    accentColor: '#997328',
    videoPreview: '/assets/videos/the-sovereign-mind.mp4',

    description: 'A disciplined economic thesis on navigating contemporary financial volatility. Moving past superficial consumer advice, this book dissects risk convexity, fat-tailed distributions, and the structural pursuit of temporal autonomy—measuring success in uncompromised hours rather than vanity figures.',

    keyTakeaways: [
      'The mathematical mechanics of asymmetric bets: capping downside while maintaining unbounded exposure.',
      'Why diversification without convexity merely averages out returns while concentrating systemic tail risks.',
      'Temporal sovereignty vs. vanity net worth: measuring wealth in uncompromised hours rather than nominal figures.',
      'Operating in regimes of uncertainty: separating ergodic processes from fatal ruin scenarios.'
    ],

    references: [
      { id: '1', citation: 'Taleb, N. N. (2012). "Antifragile: Things That Gain from Disorder." Random House.' },
      { id: '2', citation: 'Mandelbrot, B. (1997). "Fractals and Scaling in Finance." Springer.' },
      { id: '3', citation: 'Kelly, J. L. (1956). "A New Interpretation of Information Rate." Bell System Technical Journal.' }
    ],

    tableOfContents: [
      { number: '01', title: 'The Fallacy of Ergocity', subtitle: 'Why Ensemble Averages Conceal Individual Ruin' },
      { number: '02', title: 'The Asymmetric Portfolio', subtitle: 'Barbells, Convex Payoffs & Optionality' },
      { number: '03', title: 'The Architecture of Time', subtitle: 'Calculating Freedom in Uncompromised Hours' },
      { number: '04', title: 'Exit Protocols', subtitle: 'Geographic and Digital Sovereignty' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Fallacy of Ergocity',
      subtitle: 'Why Ensemble Averages Conceal Individual Ruin',
      readingTimeMinutes: 10,
      content: [
        {
          type: 'paragraph',
          text: 'In conventional financial modeling, analysts treat economic actors as if they operated within an ergodic system—one where the average outcome of a large group over a single interval corresponds to the average outcome of a single individual over a long time horizon.'
        },
        {
          type: 'paragraph',
          text: 'This mathematical error has destroyed more private balance sheets than speculative fever. Consider Russian roulette: if six individuals play once, five walk away wealthy and one dies. The ensemble average shows a positive expected monetary gain. But if one individual plays six consecutive rounds, the probability of survival collapses to zero.'
        },
        {
          type: 'heading',
          text: 'Path Dependency and Absorbing Barriers'
        },
        {
          type: 'paragraph',
          text: 'In the real world, wealth accumulation is fundamentally path-dependent. You cannot enjoy round ten of compounding if round four triggers an absorbing barrier—a state of bankruptcy or irrecoverable capital impairment from which recovery is mathematically impossible.'
        },
        {
          type: 'quote',
          text: 'The paramount rule of sovereign finance is not to maximize upside, but to aggressively eliminate any risk vector that carries even a non-zero probability of catastrophic ruin.'
        }
      ]
    }
  },

  {
    id: 'ghost-in-the-wire',
    slug: 'ghost-in-the-wire',
    title: 'Ghost in the Wire',
    subtitle: 'Offensive Cryptography, Hardware Enclaves & Memory Defense',
    tagline: 'Practical operational security for an era of pervasive signal interception.',
    author: 'C. Vale',
    authorType: 'Fictional Editorial Pen Name',
    authorRole: 'Editorial Pen Name • Cryptography & Infrastructure Defense',
    priceINR: 299,
    originalPriceINR: 599,
    category: 'Cybersecurity',
    badge: 'Technical Field Manual',
    pages: 390,
    readTime: '7.5 hours',
    status: 'published',
    edition: 'Second Field Edition (2026)',
    isbn: '978-93-98210-03-8',
    hasAudiobook: false,
    formats: ['Web Reader', 'Vector PDF', 'Universal EPUB'],
    
    coverImage: '/assets/covers/ghost-in-the-wire.jpg',
    accentColor: '#10b981',
    videoPreview: '/assets/videos/ghost-in-the-wire.mp4',

    description: 'A deep-dive manual on defensive systems architecture in hostile network environments. Moving beyond basic password hygiene, this volume analyzes side-channel timing attacks, hardware security modules (HSMs), post-quantum lattice cryptography, and isolated memory boundaries.',

    keyTakeaways: [
      'Understanding hardware side-channel vectors: speculative execution, power analysis, and cache timing leaks.',
      'Lattice-based cryptographic primitives: preparing production systems for post-quantum key exchange.',
      'Defensive memory boundaries: implementing strict address space isolation and formal Rust invariants.',
      'Traffic pattern analysis: mitigating metadata surveillance through timing padding and decoy packet injection.'
    ],

    references: [
      { id: '1', citation: 'Kocher, P. et al. (2019). "Spectre Attacks: Exploiting Speculative Execution." IEEE S&P.' },
      { id: '2', citation: 'NIST (2024). "Post-Quantum Cryptography Standardization." FIPS 203, 204, 205.' },
      { id: '3', citation: 'Saltzer, J. H. & Schroeder, M. D. (1975). "The Protection of Information in Computer Systems." IEEE.' }
    ],

    tableOfContents: [
      { number: '01', title: 'The Silicon Vulnerability', subtitle: 'Speculative Execution & Transient Side Channels' },
      { number: '02', title: 'Post-Quantum Primitives', subtitle: 'Transitioning from RSA/ECC to Module-LWE' },
      { number: '03', title: 'Hardware Isolation', subtitle: 'Enclaves, TPMs, and Attestation Chains' },
      { number: '04', title: 'Metadata Defense', subtitle: 'Defeating Traffic Analysis at the Packet Boundary' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Silicon Vulnerability',
      subtitle: 'Speculative Execution & Transient Side Channels',
      readingTimeMinutes: 11,
      content: [
        {
          type: 'paragraph',
          text: 'For decades, computer architecture maintained a convenient abstraction: the software layer assumes the underlying central processing unit executes instructions sequentially according to the formal architectural specification. If memory permission checks fail, the kernel raises an exception and memory remains unread.'
        },
        {
          type: 'paragraph',
          text: 'The discovery of speculative execution side-channel attacks permanently shattered this abstraction. Modern high-performance processors cannot afford to idle while resolving memory addresses or branch conditions. Instead, they speculate: predicting branch outcomes and executing dozens of instructions ahead of verification.'
        },
        {
          type: 'heading',
          text: 'Microarchitectural Footprints in CPU Caches'
        },
        {
          type: 'paragraph',
          text: 'Even when the processor detects an incorrect branch speculation and cleanly discards the architectural register state, the microarchitectural state—specifically the CPU L1 and L2 cache lines—retains residual timing changes. An adversary measuring memory access latency down to sub-nanosecond precision can reconstruct unauthorized kernel memory bit by bit.'
        },
        {
          type: 'quote',
          text: 'Security cannot be guaranteed by software semantics alone when the physical physics of silicon can be probed through temporal measurement.'
        }
      ]
    }
  },

  {
    id: 'the-stoic-sovereign',
    slug: 'the-stoic-sovereign',
    title: 'The Stoic Sovereign',
    subtitle: 'Marcus Aurelius, Cognitive Command & Crisis Leadership',
    tagline: 'Translating classical Hellenistic discipline into high-stakes executive leadership.',
    author: 'Julian Ashford',
    authorType: 'Fictional Editorial Pen Name',
    authorRole: 'Editorial Pen Name • Classical Stoic Inquiry',
    priceINR: 199,
    originalPriceINR: 399,
    category: 'Philosophy & Leadership',
    badge: 'Philosophical Atelier',
    pages: 260,
    readTime: '4.5 hours',
    status: 'published',
    edition: 'First Edition (2026)',
    isbn: '978-93-98210-04-5',
    hasAudiobook: false,
    formats: ['Web Reader', 'Vector PDF', 'Universal EPUB'],
    
    coverImage: '/assets/covers/the-stoic-sovereign.jpg',
    accentColor: '#997328',
    videoPreview: '/assets/videos/the-stoic-sovereign.mp4',

    description: 'An authoritative study translating classical Stoic philosophy into actionable psychological resilience for leaders facing acute volatility. Grounded in original translations of Marcus Aurelius, Seneca, and Epictetus, this volume strips away commercial self-help tropes to present Stoicism as an exacting cognitive operating system.',

    keyTakeaways: [
      'The Dichotomy of Control: ruthless triage between internal intentions and uncontrollable external events.',
      'Premeditatio Malorum: systematic negative visualization to decouple fear from rational crisis execution.',
      'Amor Fati: reframing operational friction and systemic shocks as essential catalytic inputs.',
      'Emotional equilibrium during organizational turbulence: mastering the Hegemonikon (ruling center).'
    ],

    references: [
      { id: '1', citation: 'Marcus Aurelius (trans. Hays, G. 2002). "Meditations." Modern Library.' },
      { id: '2', citation: 'Epictetus (trans. Dobbin, R. 2008). "Discourses and Selected Writings." Penguin Classics.' },
      { id: '3', citation: 'Hadot, P. (1998). "The Inner Citadel: The Meditations of Marcus Aurelius." Harvard University Press.' }
    ],

    tableOfContents: [
      { number: '01', title: 'The Citadel of Mind', subtitle: 'Establishing the Ruling Rational Faculty' },
      { number: '02', title: 'Premeditation of Adversity', subtitle: 'Inoculating Rational Action Against Shock' },
      { number: '03', title: 'Action in Constrained Systems', subtitle: 'The Discipline of Assent and Ethical Duty' },
      { number: '04', title: 'The View from Above', subtitle: 'Cosmic Perspective on Transient Crisis' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Citadel of Mind',
      subtitle: 'Establishing the Ruling Rational Faculty',
      readingTimeMinutes: 9,
      content: [
        {
          type: 'paragraph',
          text: 'In the winter of 170 CE, on the frozen banks of the Danube River near Carnuntum, Emperor Marcus Aurelius opened his notebooks not to issue legislative edicts or military dispatches, but to conduct an unforgiving audit of his own consciousness.'
        },
        {
          type: 'paragraph',
          text: 'Surrounded by the devastation of the Antonine Plague and the existential pressure of the Marcomannic Wars, Aurelius recognized that an emperor’s most dangerous adversary was never the Germanic tribes on the frontier, but the unexamined panic generated by his own subjective perceptions.'
        },
        {
          type: 'heading',
          text: 'The Hegemonikon: The Ruling Center'
        },
        {
          type: 'paragraph',
          text: 'The Stoics called this inner executive mechanism the Hegemonikon—the ruling rational faculty that sits between sensory stimuli and behavioral response. External events possess zero intrinsic emotional charge. They are simply physical configurations of matter and circumstance.'
        },
        {
          type: 'quote',
          text: 'Strip away the opinion, and the harm is stripped away. Do not think that you are harmed, and you have suffered no harm at all.'
        }
      ]
    }
  },

  {
    id: 'bio-optima',
    slug: 'bio-optima',
    title: 'Bio-Optima',
    subtitle: 'Mitochondrial Biogenesis, Hormetic Stress & Cellular Longevity',
    tagline: 'Translating cellular geroscience into non-dogmatic biological resilience.',
    author: 'Elena Voss',
    authorType: 'Fictional Editorial Pen Name',
    authorRole: 'Editorial Pen Name • Translational Longevity & Biology',
    priceINR: 249,
    originalPriceINR: 499,
    category: 'Health & Longevity',
    badge: 'Clinical Review Edition',
    pages: 310,
    readTime: '6.0 hours',
    status: 'published',
    edition: 'First Edition (2026)',
    isbn: '978-93-98210-05-2',
    hasAudiobook: false,
    formats: ['Web Reader', 'Vector PDF', 'Universal EPUB'],
    
    coverImage: '/assets/covers/bio-optima.jpg',
    accentColor: '#10b981',
    videoPreview: '/assets/videos/bio-optima.mp4',

    description: 'A scientific synthesis of cellular geroscience, focusing on mitochondrial density, autophagic flux, and circadian molecular pacing. Free of speculative wellness trends, this volume adheres strictly to peer-reviewed human clinical trials and validated biomarkers of biological vitality.',

    keyTakeaways: [
      'The molecular physiology of mitochondrial biogenesis: PGC-1alpha upregulation through calibrated endurance.',
      'Autophagy vs. mTOR: managing the energetic trade-off between cellular growth and self-repair.',
      'Circadian transcriptional pacemakers: stabilizing core clock genes via photic and metabolic cues.',
      'Conservative clinical markers: prioritizing ApoB, visceral adiposity, and VO2 max over unvalidated supplements.'
    ],

    references: [
      { id: '1', citation: 'Lopez-Otin, C. et al. (2023). "Hallmarks of Aging: An Expanding Universe." Cell.' },
      { id: '2', citation: 'Kennedy, B. K. et al. (2014). "Geroscience: Linking Aging to Chronic Disease." Cell.' },
      { id: '3', citation: 'Panda, S. (2016). "Circadian Physiology of Metabolism." Science.' }
    ],

    tableOfContents: [
      { number: '01', title: 'The Mitochondrial Engine', subtitle: 'Electron Transport Efficiency and ATP Synthesis' },
      { number: '02', title: 'Calibrated Hormesis', subtitle: 'Zone 2 Conditioning and Transient Energetic Stress' },
      { number: '03', title: 'Autophagic Regulation', subtitle: 'mTOR Suppression and Cellular Debris Clearance' },
      { number: '04', title: 'Circadian Pacing', subtitle: 'Photic Entrainment of SCN Core Clock Genes' }
    ],

    sampleChapter: {
      chapterNumber: '01',
      title: 'The Mitochondrial Engine',
      subtitle: 'Electron Transport Efficiency and ATP Synthesis',
      readingTimeMinutes: 11,
      content: [
        {
          type: 'paragraph',
          text: 'At the foundational level of human physiology, vitality is an energetic equation governed by roughly ten quadrillion mitochondria operating within human tissue. These organelles, derived from ancient alphaproteobacterial endosymbionts, produce more than ninety percent of our cellular adenosine triphosphate (ATP).'
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
          type: 'note',
          text: 'Clinical Consensus: Randomized controlled trials consistently confirm that regular Zone 2 endurance activity paired with consistent 8-hour circadian rhythmicity exerts an effect size on biological health markers superior to any single approved pharmacological agent.'
        }
      ]
    }
  }
];

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
    note: 'Practical and sober. The analysis of traffic padding and hardware enclaves demonstrates realistic infrastructure defense in untrusted environments.',
    topic: 'Cybersecurity'
  }
];

export const REVIEWS = EDITORIAL_DISPATCHES;

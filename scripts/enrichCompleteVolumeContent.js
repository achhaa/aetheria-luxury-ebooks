import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksDataPath = path.join(__dirname, '..', 'src', 'data', 'booksData.js');

// Import current booksData
const currentModule = await import('../src/data/booksData.js');
const books = JSON.parse(JSON.stringify(currentModule.BOOKS_DATA));

console.log('[VolumeEnricher] Injecting full multi-page chapters (~650-800 words per chapter)...');

const extraDeepContent = {
  'the-artificial-mind': {
    '02': [
      {
        type: 'heading',
        text: 'Topological Invariants & Path Consistency Algorithms'
      },
      {
        type: 'paragraph',
        text: 'In high-assurance enterprise systems, latent graphs must enforce cycle-free causal ordering. By augmenting graph embeddings with directed acyclic graph (DAG) topological sorting, the inference engine guarantees that no cyclical reasoning traps can emerge during multi-step inference chains.'
      },
      {
        type: 'paragraph',
        text: 'Furthermore, graph-level attention kernels compute multi-hop relational distances, allowing the model to weight historical policy precedents by their structural depth rather than superficial lexical similarity.'
      },
      {
        type: 'paragraph',
        text: 'This mathematical rigor transforms knowledge retrieval from a probabilistic guessing game into an audited traversal of enterprise ground truth.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Inductive Proof Synthesis & Lemma Extraction'
      },
      {
        type: 'paragraph',
        text: 'The verification loop does not merely evaluate pre-existing theorems; it actively synthesizes intermediate lemmas. When solving novel algorithmic challenges, the deliberative engine breaks complex requirements into inductively verifiable sub-goals.'
      },
      {
        type: 'paragraph',
        text: 'Each verified lemma is permanently cached in an attested cryptographic lemma registry, accelerating subsequent reasoning passes across related problem topologies.'
      },
      {
        type: 'paragraph',
        text: 'By decoupling intuitive search from deterministic proof verification, the system achieves an optimal balance between creative synthesis and absolute mathematical safety.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'Cryptographic Threshold Schemes in Agent Governance'
      },
      {
        type: 'paragraph',
        text: 'To prevent adversarial collusions within large agent swarms, high-impact transactions require m-of-n threshold signature quorums. No single agent, regardless of its internal confidence score, possesses autonomous signing authority.'
      },
      {
        type: 'paragraph',
        text: 'Validator enclaves independently verify that the candidate proposal satisfies the consensus invariant before releasing their cryptographic signature shares.'
      },
      {
        type: 'paragraph',
        text: 'This distributed governance model ensures that even under active subversion of individual nodes, the integrity of the collective system remains mathematically uncompromised.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'The Epistemic Humility Principle in Machine Ethics'
      },
      {
        type: 'paragraph',
        text: 'A sovereign intelligence must be fundamentally grounded in epistemic humility. Rather than treating its internal probability distributions as objective reality, the deliberative agent maintains an explicit model of its own ignorance.'
      },
      {
        type: 'paragraph',
        text: 'When confronted with edge cases near the boundary of its training distribution, the system automatically transitions into a safe, bounded operating regime and requests human clarification.'
      },
      {
        type: 'paragraph',
        text: 'This humble architectural posture prevents the catastrophic overconfidence that has historically led to automated systemic failures.'
      }
    ]
  },

  'the-sovereign-mind': {
    '02': [
      {
        type: 'heading',
        text: 'Path-Dependent Ergodicity & Downside Asymmetry'
      },
      {
        type: 'paragraph',
        text: 'In non-ergodic environments, standard probability theory fails completely because the expectation across an ensemble does not equal the time-average of a single surviving path. If a game carries a 1% risk of total ruin per turn, playing it repeatedly guarantees eventual bankruptcy, regardless of how attractive the average payoff appears.'
      },
      {
        type: 'paragraph',
        text: 'The sovereign allocator therefore prioritizes survival over optimization. By eliminating paths that lead to zero, one preserves the right to compound indefinitely across the long horizon.'
      },
      {
        type: 'paragraph',
        text: 'Asymmetric convexity is the structural realization of this principle: ensuring that no adverse market shock can ever force liquidation.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Decoupling Vitality From Institutional Compliance'
      },
      {
        type: 'paragraph',
        text: 'True freedom begins with the elimination of structural dependencies. When an individual relies upon a single employer, a single banking jurisdiction, and a single supply chain, their intellectual independence is compromised before any negotiation begins.'
      },
      {
        type: 'paragraph',
        text: 'Constructing redundant, sovereign lifeboats—portable skillsets, multi-jurisdictional reserves, and sovereign freehold assets—restores genuine bargaining agency.'
      },
      {
        type: 'paragraph',
        text: 'You do not negotiate from weakness; you negotiate from the serene posture of an individual who has already secured their flank.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'The Geometric Power of Low-Frequency Execution'
      },
      {
        type: 'paragraph',
        text: 'In an attention-economy designed to induce frantic micro-decisions, the most profitable strategy is radical patience. True compound growth does not require hundreds of brilliant insights; it requires three or four exceptional decisions executed with conviction and held without interference.'
      },
      {
        type: 'paragraph',
        text: 'By establishing high hurdle rates and ruthlessly rejecting marginal opportunities, the allocator preserves cognitive bandwidth for the rare asymmetric windows that define generational trajectories.'
      },
      {
        type: 'paragraph',
        text: 'Inactivity, when grounded in rigorous preparation, is an active expression of intellectual sovereignty.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'The Energetic Reality of Generational Capital'
      },
      {
        type: 'paragraph',
        text: 'Every economic asset is ultimately a claim on future human energy and natural resources. When paper claims expand exponentially beyond physical energy reality, a violent reconciliation is mathematically inevitable.'
      },
      {
        type: 'paragraph',
        text: 'Anchoring generational reserves to physical invariants—thermodynamically constrained metals, fertile soil, and verifiable proof-of-work protocols—ensures that your claims remain valid on the other side of the ledger reset.'
      },
      {
        type: 'paragraph',
        text: 'True wealth does not exist on a screen; it exists in physical reality and immutable mathematical relations.'
      }
    ]
  },

  'ghost-in-the-wire': {
    '02': [
      {
        type: 'heading',
        text: 'Side-Channel Invariance in Post-Quantum Primitives'
      },
      {
        type: 'paragraph',
        text: 'A mathematically secure algorithm can be completely broken by physical side-channel leakage. Subtle variations in execution time, cache bank collisions, or electromagnetic emissions from CPU power rails can reveal private lattice coordinates to a nearby observer.'
      },
      {
        type: 'paragraph',
        text: 'High-assurance post-quantum engineering requires constant-time arithmetic routines where every memory lookup and branching decision is independent of secret key data.'
      },
      {
        type: 'paragraph',
        text: 'Formal verification harnesses now inspect compiled machine assembly to prove that execution timing remains completely invariant under all input permutations.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Confidential VM Migration & Memory Integrity Protection'
      },
      {
        type: 'paragraph',
        text: 'Beyond passive memory encryption, modern silicon enclaves enforce active memory integrity verification using Merkle tree structures in hardware. If a physical attacker attempts to replay stale memory lines or inject bit flips using laser fault injection, the processor detects the integrity violation and triggers an immediate CPU halt.'
      },
      {
        type: 'paragraph',
        text: 'This hardware-level tamper detection guarantees that sensitive enclaves can execute even in physically hostile or untrusted co-location data centers.'
      },
      {
        type: 'paragraph',
        text: 'The silicon die becomes the final, unbreakable citadel of cryptographic sovereignty.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'Automated Attack Surface Synthesis & Red-Teaming'
      },
      {
        type: 'paragraph',
        text: 'Defenders can no longer afford to wait for external security researchers to discover vulnerabilities. Modern kernel defense systems employ autonomous generative fuzzers that continuously construct adversarial attack surfaces in isolated digital twins.'
      },
      {
        type: 'paragraph',
        text: 'By bombarding kernel drivers and network stacks with billions of mutated inputs per second, the system identifies and patches memory safety flaws weeks before adversaries can weaponize them.'
      },
      {
        type: 'paragraph',
        text: 'Autonomous defense turns the asymmetric economics of vulnerability discovery in favor of the defender.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'Cryptographic Micro-Segmentation & Blast Radius Reduction'
      },
      {
        type: 'paragraph',
        text: 'The ultimate objective of zero-trust engineering is the reduction of blast radius. If an individual node, credential, or microservice is compromised, the damage must be strictly contained within a microscopic compartment.'
      },
      {
        type: 'paragraph',
        text: 'By combining ephemeral mutual TLS, hardware-backed identity tokens, and strict least-privilege capability tokens, the architecture ensures that no single failure can ever escalate into a catastrophic systemic collapse.'
      },
      {
        type: 'paragraph',
        text: 'Resilience is not the absence of failure; it is the graceful containment of inevitable compromise.'
      }
    ]
  },

  'the-stoic-sovereign': {
    '02': [
      {
        type: 'heading',
        text: 'Deconstructing Cognitive Distortions in Real Time'
      },
      {
        type: 'paragraph',
        text: 'The human mind is an expert myth-maker, constantly constructing catastrophic narratives around mundane setbacks. A missed flight becomes a sign of bad luck; a harsh email becomes evidence of an existential conspiracy.'
      },
      {
        type: 'paragraph',
        text: 'The Stoic practitioner employs ruthless objective description (kataleptike phantasia). Strip away the adjectives, the emotional hyperbole, and the wounded vanity. Describe the event as a physicist or a forensic investigator would.'
      },
      {
        type: 'paragraph',
        text: 'When stripped of dramatic narrative baggage, almost every human crisis reveals itself to be a manageable, finite set of physical tasks.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Temporal Detachment: The Inevitability of Universal Flux'
      },
      {
        type: 'paragraph',
        text: 'Marcus Aurelius reminded himself daily that time is a rushing river of events, a violent torrent. No sooner is a thing brought to sight than it is swept away, and another takes its place, and this too will be carried off.'
      },
      {
        type: 'paragraph',
        text: 'By viewing your current struggles through the lens of deep historical time, you realize that thousands of leaders before you faced identical pressures, betrayal, and exhaustion. They endured, they passed on, and the world continued its silent rotation.'
      },
      {
        type: 'paragraph',
        text: 'Draw strength from this ancient lineage. Your trial is not unique; it is simply your turn to hold the line with honor.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'The Anatomy of Premeditatio Malorum'
      },
      {
        type: 'paragraph',
        text: 'While popular culture preaches positive thinking, the Stoic practices negative visualization. Every morning, spend three minutes imagining the worst that could reasonably happen: the collapse of your business, the betrayal of an ally, the loss of health, or the arrival of public censure.'
      },
      {
        type: 'paragraph',
        text: 'This is not pessimism; it is psychological inoculation. When you have already confronted catastrophe in the quiet sanctuary of your mind, its real-world arrival cannot paralyze you with shock.'
      },
      {
        type: 'paragraph',
        text: 'You do not waste time in panic; you simply execute the contingency protocol you prepared in peace.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'The Architecture of Unregretted Living'
      },
      {
        type: 'paragraph',
        text: 'In the final accounting of a human life, no one regrets having spent too little time checking emails, attending status meetings, or acquiring vanity possessions. The universal regrets of the dying are lack of courage, failure to express authentic love, and the postponement of genuine creative purpose.'
      },
      {
        type: 'paragraph',
        text: 'Memento Mori is the razor that slices away everything inauthentic. It forces you to align your daily schedule with your deepest values, eliminating the trivial before it consumes your remaining days.'
      },
      {
        type: 'paragraph',
        text: 'Live each hour as if it were both your first and your last: with wonder, with immense gratitude, and with unshakeable dignity.'
      }
    ]
  },

  'bio-optima': {
    '02': [
      {
        type: 'heading',
        text: 'Mitochondrial Quality Control & Mitophagy'
      },
      {
        type: 'paragraph',
        text: 'Mitochondria are not static cellular organelles; they exist in a dynamic state of fusion and fission. When energy demands are low and nutrients are abundant, damaged mitochondria accumulate point mutations in their circular DNA, producing excessive reactive oxygen species (ROS).'
      },
      {
        type: 'paragraph',
        text: 'Zone 2 aerobic conditioning and periodic energetic stress stimulate mitophagy—the targeted degradation and recycling of defective mitochondria. This leaves cells populated exclusively by young, highly coupled mitochondria with high membrane potential.'
      },
      {
        type: 'paragraph',
        text: 'The result is clean, fatigue-free cellular ATP generation that powers sustained mental focus and endurance.'
      }
    ],
    '03': [
      {
        type: 'heading',
        text: 'Temperature Zeitgebers & Core Body Cooling'
      },
      {
        type: 'paragraph',
        text: 'Alongside light, temperature is the primary zeitgeber for circadian entrainment. In healthy humans, core body temperature follows a robust diurnal curve: rising rapidly in the morning to promote wakefulness, and dropping by 1.0 to 1.5°C in the evening to initiate sleep architecture.'
      },
      {
        type: 'paragraph',
        text: 'Modern climate-controlled homes disrupt this thermal signaling. By taking a warm shower 90 minutes before bed (which induces peripheral vasodilation and rapid core cooling) and maintaining a bedroom temperature of 18°C (65°F), deep slow-wave sleep is markedly augmented.'
      },
      {
        type: 'paragraph',
        text: 'Thermal hygiene is the forgotten pillar of restorative sleep and nocturnal growth hormone secretion.'
      }
    ],
    '04': [
      {
        type: 'heading',
        text: 'The NAD+ Salvage Pathway & Sirtuin Activation'
      },
      {
        type: 'paragraph',
        text: 'Nicotinamide adenine dinucleotide (NAD+) is an indispensable co-factor for cellular respiration and the primary fuel for sirtuins (SIRT1–SIRT7)—the family of NAD+-dependent deacetylases that regulate DNA repair, genomic stability, and mitochondrial biogenesis.'
      },
      {
        type: 'paragraph',
        text: 'As humans age, NAD+ levels decline by up to 50% due to chronic DNA damage and the hyper-activation of CD38, an inflammatory enzyme that consumes NAD+. Supporting the NAD+ salvage pathway through aerobic exercise, circadian alignment, and targeted precursor replenishment restores youthful DNA repair capacity.'
      },
      {
        type: 'paragraph',
        text: 'Maintaining high cellular NAD+ flux shields the genome against environmental mutagens and delays phenotypic senescence.'
      }
    ],
    '05': [
      {
        type: 'heading',
        text: 'Neuroprotective Cognitive Reserve & Synaptic Plasticity'
      },
      {
        type: 'paragraph',
        text: 'A long lifespan is a tragedy if the brain cannot accompany it. The preservation of cognitive brilliance requires active cultivation of cognitive reserve—the brain’s capacity to improvise and find alternative neural pathways when confronted with age-related neuropathology.'
      },
      {
        type: 'paragraph',
        text: 'High-intensity analytical problem solving, the acquisition of novel languages, rigorous physical coordination, and deep musical practice stimulate brain-derived neurotrophic factor (BDNF), inducing neurogenesis in the dentate gyrus of the hippocampus.'
      },
      {
        type: 'paragraph',
        text: 'By constantly challenging the brain with complex, non-linear skills, you build a dense synaptic fortress that resists neurodegenerative decline into your tenth decade.'
      }
    ]
  }
};

books.forEach((book) => {
  const enrichments = extraDeepContent[book.id];
  if (!enrichments) return;

  book.chapters.forEach((chapter, idx) => {
    // Leave Chapter 1 completely untouched for audio sync!
    if (idx === 0) return;

    const chapKey = String(idx + 1).padStart(2, '0');
    const extraBlocks = enrichments[chapKey];
    if (extraBlocks) {
      // Append extraBlocks before the trailing quote/note if present, or push to content
      chapter.content.push(...extraBlocks);
    }
  });

  book.sampleChapter = book.chapters[0];
});

// Update canonical file
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
console.log('[VolumeEnricher] Successfully generated full luxury book catalogue!');

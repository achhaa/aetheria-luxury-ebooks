/**
 * AUTHORITATIVE SERVER-SIDE CATALOGUE
 * The server never trusts client-side prices. All order calculations derive from here.
 */

export const SERVER_CATALOG = {
  'the-artificial-mind': {
    id: 'the-artificial-mind',
    title: 'The Artificial Mind',
    priceINR: 299,
    pricePaise: 29900,
    author: 'Dr. Evelyn Vance & Aris Thorne',
    category: 'Artificial Intelligence',
    isbn: '978-93-98210-01-4',
    pages: 340
  },
  'the-sovereign-mind': {
    id: 'the-sovereign-mind',
    title: 'The Sovereign Mind',
    priceINR: 349,
    pricePaise: 34900,
    author: 'Marcus Sterling',
    category: 'Finance & Strategy',
    isbn: '978-93-98210-02-1',
    pages: 290
  },
  'ghost-in-the-wire': {
    id: 'ghost-in-the-wire',
    title: 'Ghost in the Wire',
    priceINR: 299,
    pricePaise: 29900,
    author: 'Cipher_Null & Sarah Chen',
    category: 'Cybersecurity',
    isbn: '978-93-98210-03-8',
    pages: 390
  },
  'the-stoic-sovereign': {
    id: 'the-stoic-sovereign',
    title: 'The Stoic Sovereign',
    priceINR: 199,
    pricePaise: 19900,
    author: 'Julian Vance & K. S. Aurelius',
    category: 'Philosophy & Leadership',
    isbn: '978-93-98210-04-5',
    pages: 260
  },
  'bio-optima': {
    id: 'bio-optima',
    title: 'Bio-Optima',
    priceINR: 249,
    pricePaise: 24900,
    author: 'Dr. Elena Rostova, Ph.D.',
    category: 'Bio-Optimization & Health',
    isbn: '978-93-98210-05-2',
    pages: 310
  }
};

import { BOOKS_DATA } from '../src/data/booksData.js';

/**
 * AUTHORITATIVE SERVER-SIDE CATALOGUE
 * The server never trusts client-side prices. All order calculations and PDF/EPUB
 * generation derive directly from the canonical booksData.js dataset.
 */
export const SERVER_CATALOG = BOOKS_DATA.reduce((acc, book) => {
  acc[book.id] = {
    ...book,
    pricePaise: book.priceINR * 100
  };
  return acc;
}, {});

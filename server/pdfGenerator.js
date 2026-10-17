import PDFDocument from 'pdfkit';
import crypto from 'crypto';

export function generateBookPdf({ book, customerName, customerEmail, orderId }, stream) {
  const doc = new PDFDocument({
    bufferPages: true,
    size: 'A4',
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: `${book.title} — Privé Edition`,
      Author: book.author,
      Subject: `${book.category} Manuscript`,
      Keywords: 'Aetheria, Luxury Publishing, Sovereign Edition',
      Producer: 'Aetheria Digital Atelier'
    }
  });

  doc.pipe(stream);

  const licenseHash = crypto
    .createHash('sha256')
    .update(`${orderId}-${customerEmail}-${book.id}`)
    .digest('hex')
    .slice(0, 24)
    .toUpperCase();

  // COVER / TITLE PAGE
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).strokeColor('#c5a059').stroke();
  doc.rect(24, 24, doc.page.width - 48, doc.page.height - 48).lineWidth(0.5).strokeColor('#e5d5a8').stroke();

  doc.moveDown(5);
  doc.font('Helvetica-Bold').fontSize(10).fillColor('#c5a059').text('AETHERIA PRIVÉ EDITIONS', { align: 'center', characterSpacing: 3 });
  doc.moveDown(1);
  doc.font('Helvetica').fontSize(9).fillColor('#666666').text('CURATED INTELLECTUAL ARTIFACTS', { align: 'center', characterSpacing: 2 });

  doc.moveDown(6);
  doc.font('Times-Bold').fontSize(32).fillColor('#1a1a1a').text(book.title, { align: 'center' });
  doc.moveDown(1);
  doc.font('Times-Italic').fontSize(14).fillColor('#444444').text(book.subtitle || '', { align: 'center' });

  doc.moveDown(8);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#1a1a1a').text(book.author, { align: 'center' });
  doc.font('Helvetica').fontSize(10).fillColor('#666666').text(book.authorRole || '', { align: 'center' });

  doc.moveDown(6);
  doc.font('Helvetica').fontSize(9).fillColor('#888888').text(`ISBN: ${book.isbn || 'N/A'}  •  ${book.edition || 'First Edition'}`, { align: 'center' });

  // PAGE 2: SOVEREIGN DIGITAL CERTIFICATE OF OWNERSHIP
  doc.addPage();
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).lineWidth(0.75).strokeColor('#c5a059').stroke();

  doc.moveDown(3);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#c5a059').text('VERIFIED CERTIFICATE OF DIGITAL OWNERSHIP', { align: 'center', characterSpacing: 2 });
  doc.moveDown(0.5);
  doc.font('Helvetica').fontSize(8).fillColor('#777777').text('NON-FUNGIBLE DIGITAL PROVENANCE RECORD', { align: 'center', characterSpacing: 1.5 });

  doc.moveDown(4);
  doc.font('Times-Roman').fontSize(12).fillColor('#222222').text(
    'This unabridged archival volume has been cryptographically licensed to the following individual with sovereign DRM-free lifetime reading rights:',
    { align: 'center', lineGap: 4 }
  );

  doc.moveDown(3);
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#1a1a1a').text(customerName || 'Registered Reader', { align: 'center' });
  doc.font('Helvetica').fontSize(11).fillColor('#c5a059').text(customerEmail || 'reader@aetheria.com', { align: 'center' });

  doc.moveDown(2);
  doc.font('Courier').fontSize(9).fillColor('#555555').text(`Order Reference: ${orderId}`, { align: 'center' });
  doc.font('Courier').fontSize(9).fillColor('#555555').text(`License Signature: sha256:0x${licenseHash}`, { align: 'center' });
  doc.font('Courier').fontSize(9).fillColor('#555555').text(`Timestamp: ${new Date().toISOString()}`, { align: 'center' });

  doc.moveDown(4);
  doc.font('Times-Italic').fontSize(10).fillColor('#555555').text(
    'Aetheria guarantees uninterrupted access, zero platform lock-in, and full compatibility across Apple Books, Kindle, reMarkable tablets, and desktop viewers.',
    { align: 'center', lineGap: 3 }
  );

  // PAGE 3: TABLE OF CONTENTS & SYNOPSIS
  doc.addPage();
  doc.font('Times-Bold').fontSize(20).fillColor('#1a1a1a').text('Table of Contents', { align: 'left' });
  doc.moveDown(1);

  if (book.tableOfContents && book.tableOfContents.length > 0) {
    book.tableOfContents.forEach((ch) => {
      doc.font('Helvetica-Bold').fontSize(11).fillColor('#c5a059').text(`Chapter ${ch.number}: `, { continued: true });
      doc.font('Times-Bold').fontSize(12).fillColor('#1a1a1a').text(ch.title);
      doc.font('Times-Italic').fontSize(10).fillColor('#666666').text(`   ${ch.subtitle}`);
      doc.moveDown(0.8);
    });
  }

  doc.moveDown(2);
  doc.font('Times-Bold').fontSize(14).fillColor('#1a1a1a').text('Executive Synopsis');
  doc.moveDown(0.5);
  doc.font('Times-Roman').fontSize(10.5).fillColor('#333333').text(book.description || '', { lineGap: 4 });

  // CHAPTER CONTENT
  const chaptersToRender = (book.chapters && book.chapters.length > 0) 
    ? book.chapters 
    : (book.sampleChapter ? [book.sampleChapter] : []);

  chaptersToRender.forEach((chapter) => {
    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#c5a059').text(`CHAPTER ${chapter.chapterNumber || '01'}`, { characterSpacing: 2 });
    doc.moveDown(0.3);
    doc.font('Times-Bold').fontSize(22).fillColor('#1a1a1a').text(chapter.title);
    if (chapter.subtitle) {
      doc.font('Times-Italic').fontSize(12).fillColor('#555555').text(chapter.subtitle);
    }
    doc.moveDown(1.5);

    if (chapter.content && Array.isArray(chapter.content)) {
      chapter.content.forEach((block) => {
        if (block.type === 'paragraph') {
          doc.font('Times-Roman').fontSize(10.5).fillColor('#262626').text(block.text, { lineGap: 3.5, paragraphGap: 9 });
        } else if (block.type === 'heading') {
          doc.moveDown(0.8);
          doc.font('Times-Bold').fontSize(13.5).fillColor('#1a1a1a').text(block.text);
          doc.moveDown(0.4);
        } else if (block.type === 'quote') {
          doc.moveDown(0.5);
          doc.rect(doc.x, doc.y, 3, 36).fill('#c5a059');
          doc.x += 12;
          doc.font('Times-Italic').fontSize(11).fillColor('#444444').text(`"${block.text}"`, { lineGap: 3 });
          doc.x -= 12;
          doc.moveDown(0.8);
        } else if (block.type === 'note') {
          doc.moveDown(0.5);
          doc.rect(doc.x, doc.y, doc.page.width - 108, 38).fillAndStroke('#fcfaf2', '#e5d5a8');
          doc.fillColor('#6b5624').font('Helvetica-Bold').fontSize(8.5).text('EDITORIAL NOTE: ', doc.x + 8, doc.y + 6, { continued: true });
          doc.font('Times-Roman').fontSize(9.5).fillColor('#3d3215').text(block.text);
          doc.moveDown(1.2);
        } else if (block.type === 'case-study') {
          doc.moveDown(0.5);
          doc.rect(doc.x, doc.y, doc.page.width - 108, 48).fillAndStroke('#f7f8f9', '#d1d5db');
          doc.fillColor('#1f2937').font('Helvetica-Bold').fontSize(8.5).text(`EMPIRICAL CASE STUDY: ${block.title || ''}`, doc.x + 8, doc.y + 6);
          doc.font('Times-Roman').fontSize(9.5).fillColor('#374151').text(block.text || '', doc.x + 8, doc.y + 18, { width: doc.page.width - 124 });
          doc.moveDown(1.5);
        } else if (block.type === 'figure' || block.type === 'image') {
          doc.moveDown(0.8);
          doc.rect(doc.x, doc.y, doc.page.width - 108, 42).fillAndStroke('#fdfbf7', '#c5a059');
          doc.fillColor('#997328').font('Helvetica-Bold').fontSize(8.5).text('ARCHITECTURAL FIGURE / SCHEMATIC', doc.x + 10, doc.y + 8);
          doc.font('Times-Italic').fontSize(9).fillColor('#444444').text(block.caption || 'Plate Illustration', doc.x + 10, doc.y + 22);
          doc.moveDown(1.5);
        }
      });
    }
  });

  // Cryptographic Footer on All Pages
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc.font('Courier').fontSize(7).fillColor('#aaaaaa').text(
      `AETHERIA PRIVÉ • ORDER: ${orderId} • LICENSED TO: ${customerEmail} • PAGE ${i + 1} OF ${range.count}`,
      54,
      doc.page.height - 35,
      { align: 'center' }
    );
  }

  doc.end();
}

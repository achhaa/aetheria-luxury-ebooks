import JSZip from 'jszip';

/**
 * EPUB3 Generator for Aetheria Privé Editions
 * Builds valid, compliant, reflowable EPUB3 files with NCX fallback for Kindle/Apple Books.
 */
export async function generateBookEpub({ book, customerName, customerEmail, orderId }) {
  const zip = new JSZip();

  // 1. mimetype (Must be first, uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.folder('META-INF').file('container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  const oebps = zip.folder('OEBPS');

  // 3. Stylesheet
  const css = `
    @charset "UTF-8";
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Charter", "Georgia", "Iowan Old Style", serif;
      line-height: 1.65;
      color: #1a1a1a;
      background-color: #faf7f0;
      margin: 5% 8%;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Arial", sans-serif;
      font-weight: 700;
      color: #111111;
      line-height: 1.25;
      margin-top: 1.8em;
      margin-bottom: 0.6em;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #c5a059; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.2em; color: #444; }
    p {
      margin: 0 0 1em 0;
      text-align: justify;
      hyphens: auto;
    }
    blockquote {
      margin: 1.5em 2em;
      padding: 0.5em 1em;
      border-left: 3px solid #c5a059;
      font-style: italic;
      color: #333333;
    }
    .metadata-license {
      margin-top: 3em;
      padding: 1em;
      background: #f0ede6;
      border: 1px solid #dcd7cd;
      font-size: 0.8em;
      font-family: monospace;
      color: #555;
    }
    .chapter-number {
      font-size: 0.85em;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #c5a059;
      font-family: sans-serif;
      font-weight: bold;
    }
    .subtitle {
      font-size: 1.1em;
      color: #666;
      font-style: italic;
      margin-top: -0.5em;
      margin-bottom: 2em;
    }
  `;
  oebps.file('styles.css', css);

  // 4. Title Page
  const titleHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head>
  <title>${escapeXml(book.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body style="text-align: center; padding-top: 15%;">
  <div style="font-family: sans-serif; font-size: 0.8em; letter-spacing: 0.3em; color: #c5a059; text-transform: uppercase; margin-bottom: 2em;">
    Aetheria Privé Edition
  </div>
  <h1 style="border: none; font-size: 2.4em; margin-bottom: 0.2em;">${escapeXml(book.title)}</h1>
  <div class="subtitle">${escapeXml(book.subtitle || '')}</div>
  <p style="text-align: center; font-size: 1.2em; font-weight: bold; margin-top: 3em;">
    ${escapeXml(book.author)}
  </p>
  <p style="text-align: center; font-size: 0.85em; color: #777;">
    ${escapeXml(book.authorRole || 'Editorial Pen Name')}
  </p>
  <div class="metadata-license" style="text-align: left; margin: 4em auto 0; max-width: 80%;">
    <strong>SOVEREIGN LICENSE & PROVENANCE</strong><br/>
    Licensed to: ${escapeXml(customerName || 'Authorized Reader')} (${escapeXml(customerEmail || 'reader@aetheria.luxury')})<br/>
    Transaction Order: ${escapeXml(orderId || 'AETH-SOVEREIGN')}<br/>
    Edition: ${escapeXml(book.edition || 'First Edition 2026')}<br/>
    ISBN: ${escapeXml(book.isbn || 'N/A')}<br/>
    DRM-Free Master File. Authorized for personal e-reading.
  </div>
</body>
</html>`;
  oebps.file('titlepage.xhtml', titleHtml);

  // 5. Chapters
  const chapterItems = [];
  const manifestItems = [
    '<item id="style" href="styles.css" media-type="text/css"/>',
    '<item id="titlepage" href="titlepage.xhtml" media-type="application/xhtml+xml"/>',
    '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>'
  ];
  const spineItems = [
    '<itemref idref="titlepage"/>',
    '<itemref idref="nav"/>'
  ];

  // If sampleChapter or chapters exist
  const sample = book.sampleChapter;
  if (sample && sample.content && sample.content.length > 0) {
    let chapterBody = '';
    for (const block of sample.content) {
      if (block.type === 'heading') {
        chapterBody += `<h3>${escapeXml(block.text)}</h3>\n`;
      } else if (block.type === 'quote') {
        chapterBody += `<blockquote>${escapeXml(block.text)}</blockquote>\n`;
      } else if (block.type === 'note') {
        chapterBody += `<div style="background: #eef2f6; padding: 1em; border-left: 3px solid #0ea5e9; font-size: 0.9em; margin: 1em 0;">${escapeXml(block.text)}</div>\n`;
      } else {
        chapterBody += `<p>${escapeXml(block.text)}</p>\n`;
      }
    }

    const chap1Html = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head>
  <title>${escapeXml(sample.title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
  <div class="chapter-number">CHAPTER ${escapeXml(sample.chapterNumber || '01')}</div>
  <h2>${escapeXml(sample.title)}</h2>
  <div class="subtitle">${escapeXml(sample.subtitle || '')}</div>
  ${chapterBody}
</body>
</html>`;
    oebps.file('chapter-01.xhtml', chap1Html);
    manifestItems.push('<item id="chap01" href="chapter-01.xhtml" media-type="application/xhtml+xml"/>');
    spineItems.push('<itemref idref="chap01"/>');
    chapterItems.push({ id: 'chap01', href: 'chapter-01.xhtml', title: sample.title });
  }

  // 6. Navigation (nav.xhtml - EPUB3 standard)
  const navHtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="en">
<head>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="titlepage.xhtml">Title Page</a></li>
      ${chapterItems.map((c) => `<li><a href="${c.href}">${escapeXml(c.title)}</a></li>`).join('\n      ')}
    </ol>
  </nav>
</body>
</html>`;
  oebps.file('nav.xhtml', navHtml);

  // 7. NCX for backward compatibility (Kindle MOBI / older ereaders)
  const ncxHtml = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:isbn:${escapeXml(book.isbn || 'aetheria-001')}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(book.title)}</text></docTitle>
  <navMap>
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel><text>Title Page</text></navLabel>
      <content src="titlepage.xhtml"/>
    </navPoint>
    ${chapterItems.map((c, idx) => `
    <navPoint id="navpoint-${idx + 2}" playOrder="${idx + 2}">
      <navLabel><text>${escapeXml(c.title)}</text></navLabel>
      <content src="${c.href}"/>
    </navPoint>`).join('')}
  </navMap>
</ncx>`;
  oebps.file('toc.ncx', ncxHtml);

  // 8. Content OPF (Package file)
  const opfHtml = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${escapeXml(book.title)}</dc:title>
    <dc:creator>${escapeXml(book.author)}</dc:creator>
    <dc:identifier id="BookID">urn:isbn:${escapeXml(book.isbn || 'aetheria-001')}</dc:identifier>
    <dc:language>en</dc:language>
    <dc:publisher>Aetheria Privé Editions</dc:publisher>
    <dc:rights>All Rights Reserved. Licensed for personal e-reading.</dc:rights>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.[0-9]+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join('\n    ')}
  </spine>
</package>`;
  oebps.file('content.opf', opfHtml);

  // Generate binary zip buffer
  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

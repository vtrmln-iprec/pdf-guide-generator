#!/usr/bin/env node
/**
 * PDF Generator CLI — Convertisseur guide.js → Typst → PDF
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const defaultInput = path.resolve(process.cwd(), 'src/content/guide.js');
const defaultTypst = path.resolve(process.cwd(), 'guide.typ');
const defaultOutput = path.resolve(process.cwd(), 'out/Guide.pdf');

const guidePath = args[0] ? path.resolve(process.cwd(), args[0]) : defaultInput;
const typstPath = args[1] ? path.resolve(process.cwd(), args[1]) : defaultTypst;
const pdfPath = args[2] ? path.resolve(process.cwd(), args[2]) : defaultOutput;

if (!fs.existsSync(guidePath)) {
  console.error(`❌ Erreur : Fichier source introuvable à ${guidePath}`);
  console.error(`Usage: generate-guide [input.js] [intermediate.typ] [output.pdf]`);
  process.exit(1);
}

// Assurez-vous que le dossier de sortie existe
const outDir = path.dirname(pdfPath);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log(`\x1b[36m1/2 - Conversion ${path.basename(guidePath)} vers Typst...\x1b[0m`);

const content = require(guidePath);

function sanitize(text) {
  let result = text
    .replaceAll('<b>', '*').replaceAll('</b>', '*')
    .replaceAll('<strong>', '*').replaceAll('</strong>', '*')
    .replaceAll('<br>', ' \\\n');

  result = result.replaceAll('<code>', '`').replaceAll('</code>', '`');
  result = result.replace(/</g, '\\<').replace(/>/g, '\\>');

  const parts = result.split('`');
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      parts[i] = parts[i].replace(/\$/g, '\\$');
    }
  }
  return parts.join('`');
}

let typ = `#set document(title: "${content.metadata.title}", author: "${content.metadata.author}")
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  footer: locate(loc => [
    ${content.metadata.author} — ${content.metadata.institution}
    #h(1fr)
    Page #counter(page).display() / #counter(page).final(loc).at(0)
  ])
)
#set text(font: "Segoe UI", size: 11pt, lang: "fr", fill: rgb("#1e293b"))
#set heading(numbering: "1.1.")
#show heading.where(level: 1): it => {
  v(0.5cm)
  block(
    width: 100%,
    below: 0.8em,
  )[
    #text(18pt, weight: "bold", fill: rgb("#0f172a"))[#it]
    #v(-0.3em)
    #line(length: 100%, stroke: 1.5pt + rgb("#cbd5e1"))
  ]
}
#show heading.where(level: 2): set text(14pt, weight: "bold", fill: rgb("#334155"))
#show link: set text(fill: rgb("#0ea5e9"))

#show raw: set text(font: "Consolas", size: 9pt)
#show raw.where(block: true): block.with(
  fill: rgb("#f8fafc"),
  inset: 15pt,
  radius: 6pt,
  stroke: 0.75pt + rgb("#e2e8f0"),
  width: 100%,
)
#show raw.where(block: false): box.with(
  fill: rgb("#f1f5f9"),
  inset: (x: 4pt, y: 0pt),
  outset: (y: 4pt),
  radius: 3pt,
)
#show raw.where(block: false): set text(fill: rgb("#9f1239"))

#page(
  margin: 0cm,
  header: none,
  footer: none,
)[
  #place(top, rect(width: 100%, height: 4pt, fill: rgb("#0ea5e9")))

  #align(center)[
    #v(4cm)
    
    // Top logos (flanking)
    ${
      content.metadata.logos && content.metadata.logos.length > 0
        ? `#grid(
            columns: (${Array(content.metadata.logos.length).fill('auto').join(', ')}),
            gutter: 2cm,
            ${content.metadata.logos.map(l => `align(horizon)[#image("${l.src}", height: 60pt)]`).join(', ')}
          )`
        : ''
    }

    #v(1.8cm)
    
    // Giant Cover Logo
    ${content.metadata.coverLogo ? `#image("${content.metadata.coverLogo.src}", height: 180pt)` : ''}

    #v(2cm)
    #line(length: 40%, stroke: 2pt + rgb("#0ea5e9"))
    #v(1.5cm)
    #text(32pt, weight: "bold", fill: rgb("#0f172a"))[${content.metadata.title}]
    #v(0.8em)
    #text(16pt, fill: rgb("#475569"), style: "italic")[${content.metadata.subtitle}]
    #v(1fr)

    #pad(x: 3cm)[
      #grid(
        columns: (auto, 1fr, auto),
        ${content.metadata.institutionLogo ? `align(left + horizon)[#image("${content.metadata.institutionLogo.src}", height: 70pt)],` : '[],'}
        [],
        align(right + horizon)[
          #text(16pt, weight: "bold", fill: rgb("#0f172a"))[${content.metadata.author}] \\
          #v(0.3em)
          #text(12pt, fill: rgb("#64748b"))[${content.metadata.institution} — ${content.metadata.date}]
        ],
      )
    ]
    #v(2cm)
  ]
  #place(bottom, rect(width: 100%, height: 4pt, fill: rgb("#0ea5e9")))
]

#pagebreak()
#outline(title: "Table des matières", indent: auto)
#pagebreak()

`;

content.sections.forEach((sec) => {
  typ += `= ${sec.title.replace(/\\/g, "\\\\")}\n\n`;

  sec.blocks.forEach(block => {
    if (block.type === 'text') {
      typ += `${sanitize(block.content)}\n\n`;
    } else if (block.type === 'heading') {
      typ += `== ${block.content.replace(/\\/g, "\\\\")}\n\n`;
    } else if (block.type === 'code') {
      if (block.filename) {
        typ += `*Fichier : ${block.filename}*\n`;
      }
      typ += `\`\`\`bash\n${block.content}\n\`\`\`\n\n`;
    } else if (block.type === 'image') {
      const src = block.src;
      typ += `#figure(\n  image("${src}", width: 90%),\n  caption: [${(block.caption || '').replace(/</g, '\\<').replace(/>/g, '\\>')}]\n)\n\n`;
    } else if (block.type === 'info') {
      let fillColor, strokeColor;
      switch (block.variant) {
        case 'tip':
          fillColor = '#f0fdf4'; strokeColor = '#22c55e'; break;
        case 'warning':
          fillColor = '#fffbeb'; strokeColor = '#f59e0b'; break;
        case 'important':
          fillColor = '#fef2f2'; strokeColor = '#ef4444'; break;
        default:
          fillColor = '#eff6ff'; strokeColor = '#3b82f6';
      }
      typ += `#rect(fill: rgb("${fillColor}"), stroke: (left: 4pt + rgb("${strokeColor}")), inset: 15pt, width: 100%)[\n  *${block.title || 'Information'}* \\\n  ${sanitize(block.content)}\n]\n\n`;
    } else if (block.type === 'table') {
      const cols = block.headers.length;
      typ += `#figure(\n  table(\n    columns: ${cols},\n    align: left,\n    stroke: 0.5pt + rgb("#cbd5e1"),\n    fill: (_, row) => if row == 0 { rgb("#f1f5f9") } else if calc.odd(row) { rgb("#f8fafc") } else { white },\n    inset: 10pt,\n`;
      block.headers.forEach(h => { typ += `    [*${h}*],\n`; });
      block.rows.forEach(row => {
        row.forEach(cell => { typ += `    [${sanitize(String(cell))}],\n`; });
      });
      typ += `  ),\n)\n\n`;
    } else if (block.type === 'list') {
      block.items.forEach((item, i) => {
        if (block.ordered) {
          typ += `${i + 1}. ${sanitize(item)}\n`;
        } else {
          typ += `- ${sanitize(item)}\n`;
        }
      });
      typ += `\n`;
    } else if (block.type === 'page-break') {
      typ += `#pagebreak()\n\n`;
    }
  });
});

fs.writeFileSync(typstPath, typ, 'utf-8');

console.log(`\x1b[36m2/2 - Compilation Typst vers PDF...\x1b[0m`);

// Run typst compile
const typst = spawnSync(`npx typst compile "${typstPath}" "${pdfPath}"`, {
  stdio: 'inherit',
  shell: true
});

if (typst.status !== 0) {
  console.error(`\x1b[31m❌ Échec de la compilation Typst.\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✅ PDF généré avec succès : ${pdfPath}\x1b[0m`);
}

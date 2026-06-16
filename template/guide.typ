#set document(title: "Nouveau Guide", author: "Auteur")
#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  footer: locate(loc => [
    Auteur — Mon Entreprise
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
    

    #v(1.8cm)
    
    // Giant Cover Logo
    

    #v(2cm)
    #line(length: 40%, stroke: 2pt + rgb("#0ea5e9"))
    #v(1.5cm)
    #text(32pt, weight: "bold", fill: rgb("#0f172a"))[Nouveau Guide]
    #v(0.8em)
    #text(16pt, fill: rgb("#475569"), style: "italic")[Description de mon guide]
    #v(1fr)

    #pad(x: 3cm)[
      #grid(
        columns: (auto, 1fr, auto),
        [],
        [],
        align(right + horizon)[
          #text(16pt, weight: "bold", fill: rgb("#0f172a"))[Auteur] \
          #v(0.3em)
          #text(12pt, fill: rgb("#64748b"))[Mon Entreprise — 16/06/2026]
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

= Introduction

Bienvenue dans ce nouveau guide généré automatiquement.


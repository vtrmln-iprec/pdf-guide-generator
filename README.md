# Guide PDF Generator

Un utilitaire CLI simple et puissant pour générer des guides PDF au rendu professionnel à partir de fichiers de configuration JS/JSON, motorisé par [Typst](https://typst.app/).

## 🚀 Installation

Prérequis : [Node.js](https://nodejs.org/) (v18+ recommandé).

Clonez ce dépôt, puis installez-le globalement via npm :

```bash
git clone https://github.com/votre-user/pdf-guide-generator.git
cd pdf-guide-generator
npm install -g .
```

Vous disposez maintenant de la commande globale `generate-guide`.

## 📁 Structure d'un projet de Guide

Un projet doit avoir la structure suivante pour être compatible avec l'outil :

```
Mon_Guide/
├── src/
│   ├── content/
│   │   └── guide.js          # Fichier de contenu structuré
│   ├── consigne/             # Sujet original (pour l'IA)
│   ├── contexte/             # Brouillons, scripts (pour l'IA)
│   ├── screenshots/          # Captures d'écran
│   └── source_content/       # Logos (AlmaLinux.svg, Tux.png, etc.)
└── out/                      # Dossier où le PDF sera généré
```

> **Astuce :** Vous pouvez copier le dossier `template/` inclus dans ce dépôt pour démarrer un nouveau guide instantanément.

## 🛠️ Utilisation

Placez-vous à la racine de votre projet de guide (ex: `Mon_Guide/`) et lancez simplement :

```bash
generate-guide
```

L'outil va automatiquement :
1. Lire `src/content/guide.js`.
2. Générer un fichier intermédiaire `guide.typ` à la racine de votre projet.
3. Le compiler via Typst et produire votre document dans `out/Guide.pdf`.

Si vous souhaitez spécifier des chemins différents, vous pouvez passer les arguments :
```bash
generate-guide <chemin/vers/guide.js> <chemin/vers/guide.typ> <chemin/vers/output.pdf>
```

## 🤖 Utilisation avec l'IA

Cet outil a été conçu pour être piloté par une IA (comme ChatGPT, Claude, etc.).
1. Placez vos captures d'écran dans `src/screenshots/`.
2. Placez vos notes/scripts dans `src/contexte/`.
3. Demandez à l'IA de rédiger le fichier `src/content/guide.js` en se basant sur la documentation fournie dans **[AGENTS.md](./AGENTS.md)**.

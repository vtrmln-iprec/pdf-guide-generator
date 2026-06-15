# AI Developer Guidelines: PDF Generator Toolchain

You are an AI assistant helping to write and format PDF guides. The user's project compiles a JS object into a Typst document which is then converted to a PDF via the `generate-guide` CLI.

Your main task is to write the `src/content/guide.js` file.

## `guide.js` Data Structure

The `guide.js` file MUST export a valid CommonJS module containing a single object with `metadata` and `sections`.

```javascript
module.exports = {
  metadata: {
    title: 'Titre du Guide',
    subtitle: 'Sous-titre explicatif',
    author: 'Nom de l\'auteur',
    date: 'Date de création',
    institution: 'Nom de l\'école/entreprise',
    coverLogo: { src: 'src/source_content/AlmaLinux.svg', alt: 'Main Tech Logo' },
    logos: [
      { src: 'src/source_content/Tux.svg.png', alt: 'Tux' },
      { src: 'src/source_content/Gnu-bash-logo.svg.png', alt: 'Bash' }
    ],
    institutionLogo: { src: 'src/source_content/IPREC.png', alt: 'Institution Logo' }
  },
  sections: [
    {
      id: 'section-id',
      title: 'Titre de la section',
      blocks: [
        // array of blocks
      ]
    }
  ]
};
```

## Supported Block Types

The `blocks` array can contain the following object types:

1. **`text`**: Standard paragraph. Use `<strong>` and `<code>` for inline formatting. DO NOT use `<br>`. If you need line breaks (e.g. for a list of items), use separate text blocks or the `list` block.
   ```json
   { "type": "text", "content": "Votre texte avec <strong>gras</strong>." }
   ```

2. **`heading`**: A level-2 subsection.
   ```json
   { "type": "heading", "content": "Titre secondaire" }
   ```

3. **`code`**: A block of code (syntax highlighted).
   ```json
   { "type": "code", "content": "echo 'Hello'", "language": "bash", "filename": "/etc/config" }
   ```

4. **`image`**: An embedded screenshot. Paths must be relative to the project root (where the `generate-guide` command is executed). Since images are typically in `src/screenshots/`, you must use paths like `src/screenshots/img.png`.
   ```json
   { "type": "image", "src": "src/screenshots/capture.png", "caption": "Description de l'image" }
   ```

5. **`info`**: A callout box. Supported variants: `info` (blue), `tip` (green), `warning` (orange), `important` (red).
   ```json
   { "type": "info", "variant": "tip", "title": "Astuce", "content": "Pensez à sauvegarder." }
   ```

6. **`table`**: A data table.
   ```json
   { "type": "table", "headers": ["Col 1", "Col 2"], "rows": [ ["A", "B"], ["C", "D"] ] }
   ```

7. **`list`**: A bulleted or numbered list.
   ```json
   { "type": "list", "ordered": true, "items": ["Premier point", "Deuxième point"] }
   ```

8. **`page-break`**: Forces a page break in the PDF.
   ```json
   { "type": "page-break" }
   ```

## Important Rules

1. **NO HTML LINE BREAKS**: Do NOT use `<br>` inside text blocks. It may cause rendering issues in Typst. Break your content into multiple blocks, or use the `list` block.
2. **IMAGE PATHS**: The Typst compiler is invoked from the project root directory. Therefore, image paths defined in `guide.js` must resolve correctly from the project root. Typically, `src/screenshots/filename.png` is the correct format. DO NOT use `../`.
3. **DOLLAR SIGNS**: Do not worry about escaping `$` signs in text blocks (e.g., `$IP`), the converter handles this. However, if you explicitly want math mode, you cannot use it natively via this tool right now.

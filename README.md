# Farhan Sadaf — Portfolio

This is a static portfolio website designed for GitHub Pages.

## Project structure

```text
/
├── index.html
├── README.md
├── .nojekyll
├── data/
│   ├── site.json
│   ├── bio.json
│   ├── research.json
│   ├── publications.json
│   ├── awards.json
│   ├── teaching.json
│   └── service.json
├── pdfs/
│   └── .gitkeep
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── img/
```

## What to edit

### `data/site.json`

Edit the site title, meta description, section headings, and navigation labels.

### `data/bio.json`

Edit your name, role, affiliation, lab link, email, portrait path, bio sentence, and social links.


### `data/research.json`

Edit the research categories and the inline topic links. Each topic can link to a publication anchor such as:

```json
{ "label": "monocular depth estimation", "href": "#pub-depth-estimation" }
```

### `data/publications.json`

This file does not store the main publication list. It stores publication settings, PDF links, BibTeX overrides, and duplicate-handling aliases.

To add a PDF button for a publication:

1. Put the PDF in `pdfs/`.
2. Add the path to `data/publications.json`.

Example:

```json
"pdfs": {
  "pub-depth-estimation": "pdfs/depth-estimation.pdf"
}
```

The PDF button appears only when a non-empty PDF path is present.

If you later create a JSON endpoint for your Google Scholar publications, set:

```json
"sourceUrl": "https://example.com/publications.json"
```

The site expects either an array of publication objects or an object like:

```json
{
  "publications": [
    {
      "id": "pub-example",
      "title": "Example Paper",
      "authors": "First Author, Farhan Sadaf",
      "venue": "Example Conference, 2026",
      "year": 2026,
      "type": "conference",
      "doi": "10.xxxx/example",
      "canonicalKey": "example-paper"
    }
  ]
}
```

### `data/awards.json`

Edit award names and institutions.

### `data/teaching.json`

Edit course code, course title, role, institution, and years.

### `data/service.json`

Edit reviewer/service groups and list items.

## Local preview

Because the site loads JSON files with `fetch`, do not preview it by double-clicking `index.html`. Use a local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy to GitHub Pages

Create a repository named:

```text
<your-github-username>.github.io
```

Then run:

```bash
git init
git branch -M main
git add .
git commit -m "Initial academic research website"
git remote add origin https://github.com/<your-github-username>/<your-github-username>.github.io.git
git push -u origin main
```

Your site will be available at:

```text
https://<your-github-username>.github.io/
```

## Update README from terminal

Replace the README with new text:

```bash
cat > README.md <<'EOF_README'
# Farhan Sadaf — Academic Research Website

Personal academic research website.

Live site:

https://<your-github-username>.github.io/

## Editing

Edit site content from the JSON files inside `data/`.

## Local preview

Run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
EOF_README

git add README.md
git commit -m "Update README"
git push
```

## Usual update workflow

```bash
git add .
git commit -m "Update website content"
git push
```

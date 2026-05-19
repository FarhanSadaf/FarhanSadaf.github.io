const DATA_PATHS = {
  site: "data/site.json",
  bio: "data/bio.json",
  research: "data/research.json",
  awards: "data/awards.json",
  teaching: "data/teaching.json",
  service: "data/service.json",
  publications: "data/publications.json"
};

const DEFAULT_SITE = {
  title: "Farhan Sadaf",
  description: "Farhan Sadaf - academic research website.",
  sections: {
    research: "My Research",
    publications: "Publications",
    awards: "Awards",
    teaching: "Teaching",
    service: "Service"
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "Publications", href: "#publications" },
    { label: "Teaching", href: "#teaching" },
    { label: "Service", href: "#service" }
  ]
};

const DEFAULT_BIO = {
  name: "Farhan Sadaf",
  role: "PhD Student",
  affiliation: "Arizona State University",
  lab: { name: "Happy Lab", url: "https://happyresearchlab.com/people/farhan_sadaf/" },
  email: "fsadaf@asu.edu",
  portrait: {
    src: "https://happyresearchlab.com/people/farhan_sadaf/profile.jpg",
    alt: "Farhan Sadaf"
  },
  bio: [
    { text: "I am a PhD student and Graduate Research Associate at the Human Aspects in Cyber Protections and Privacy Lab (" },
    { text: "Happy Lab", url: "https://happyresearchlab.com/people/farhan_sadaf/" },
    { text: ") at Arizona State University, where we study human factors in the security, privacy, and real-world use of AI systems." }
  ],
  socials: []
};

const DEFAULT_RESEARCH = { categories: [] };
const DEFAULT_AWARDS = { awards: [] };
const DEFAULT_TEACHING = { courses: [] };
const DEFAULT_SERVICE = { groups: [] };
const DEFAULT_PUBLICATION_CONFIG = { sourceUrl: "", pdfs: {}, bibtex: {}, duplicateAliases: {} };

const STATIC_PUBLICATIONS_SNAPSHOT = [
  {
    id: "pub-kothon",
    title: "Kothon: A Large-Scale Dataset for Machine Translation of the Chittagonian and Sylheti Dialects into Standard Bangla",
    authors: "Md. Atique Faisal, Farhan Sadaf, Dipta Chowdhury, H. M. Azrof, Monojit Paul Tanmay",
    venue: "Data in Brief, 2026",
    year: 2026,
    type: "journal",
    link: "https://doi.org/10.1016/j.dib.2026.112789",
    doi: "10.1016/j.dib.2026.112789",
    canonicalKey: "kothon-dialect-translation"
  },
  {
    id: "pub-depth-estimation",
    title: "Enhanced Encoder-Decoder Architecture for Accurate Monocular Depth Estimation",
    authors: "Dabbrata Das, Argho Deb Das, Farhan Sadaf",
    venue: "The Visual Computer, 2025",
    year: 2025,
    type: "journal",
    link: "https://doi.org/10.1007/s00371-025-03972-z",
    doi: "10.1007/s00371-025-03972-z",
    canonicalKey: "monocular-depth-estimation"
  },
  {
    id: "pub-assistive-navigation",
    title: "Real-Time Assistive Navigation for the Visually Impaired: A Scalable Approach for Indoor and Outdoor Mobility",
    authors: "Dabbrata Das, Argho Deb Das, Farhan Sadaf, Azhar Uddin, Tirtho Mondal",
    venue: "arXiv preprint arXiv:2504.20976, 2025",
    year: 2025,
    type: "preprint",
    link: "https://arxiv.org/abs/2504.20976",
    arxiv: "2504.20976",
    canonicalKey: "assistive-navigation-visually-impaired"
  },
  {
    id: "pub-banganet",
    title: "BanGaNet: A Lightweight Deep Learning Framework for Bangla Handwritten Text Recognition",
    authors: "Argho Deb Das, Dabbrata Das, Farhan Sadaf",
    venue: "28th International Conference on Computer and Information Technology (ICCIT), 2025",
    year: 2025,
    type: "conference",
    link: "https://doi.org/10.1109/ICCIT68739.2025.11491692",
    doi: "10.1109/ICCIT68739.2025.11491692",
    canonicalKey: "banganet-bangla-handwritten-text-recognition"
  },
  {
    id: "pub-blood-component",
    title: "Mobile Application to Collect Data and Measure Blood Component Level in a Non-Invasive Way",
    authors: "Humaira Neha, Sadman Sakib, Farhan Sadaf, S. M. Taslim Uddin Raju",
    venue: "26th International Conference on Computer and Information Technology (ICCIT), 2023",
    year: 2023,
    type: "conference",
    link: "https://doi.org/10.1109/ICCIT60459.2023.10441186",
    doi: "10.1109/ICCIT60459.2023.10441186",
    canonicalKey: "non-invasive-blood-component-measurement"
  },
  {
    id: "pub-banglamedner",
    title: "BanglaMedNER: A Gold Standard Medical Named Entity Recognition Corpus for Bangla Text",
    authors: "Abdul Muntakim, Farhan Sadaf, K. M. Azharul Hasan",
    venue: "6th International Conference on Electrical Information and Communication Technology (EICT), 2023",
    year: 2023,
    type: "conference",
    link: "https://doi.org/10.1109/EICT61409.2023.10427966",
    doi: "10.1109/EICT61409.2023.10427966",
    canonicalKey: "banglamedner"
  },
  {
    id: "pub-affective-database",
    title: "Building an Affective Database for Emotion Detection from Natural Bangla Text",
    authors: "Farhan Sadaf, Abdul Muntakim, K. M. Azharul Hasan",
    venue: "International Conference on Big Data, IoT and Machine Learning, 2023",
    year: 2023,
    type: "conference",
    link: "https://doi.org/10.1007/978-981-99-8937-9_42",
    doi: "10.1007/978-981-99-8937-9_42",
    canonicalKey: "bangla-affective-database"
  },
  {
    id: "pub-offline-bangla-handwriting",
    title: "Offline Bangla Handwritten Text Recognition: A Comprehensive Study of Various Deep Learning Approaches",
    authors: "Farhan Sadaf, S. M. Taslim Uddin Raju, Abdul Muntakim",
    venue: "3rd International Conference on Electrical & Electronic Engineering (ICEEE), 2021",
    year: 2021,
    type: "conference",
    link: "https://doi.org/10.1109/ICEEE54059.2021.9718890",
    doi: "10.1109/ICEEE54059.2021.9718890",
    canonicalKey: "offline-bangla-handwritten-text-recognition"
  }
];

let allPublications = [];
let publicationConfig = DEFAULT_PUBLICATION_CONFIG;

async function fetchJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Using fallback for ${path}:`, error);
    return fallback;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function htmlAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function normalizeTitle(title) {
  return (title || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugify(value) {
  return normalizeTitle(value).replace(/\s+/g, "-");
}

function renderLinkedSegments(segments) {
  if (typeof segments === "string") return escapeHtml(segments);
  if (!Array.isArray(segments)) return "";
  return segments.map(segment => {
    if (segment.url) {
      return `<a href="${htmlAttr(segment.url)}">${escapeHtml(segment.text)}</a>`;
    }
    return escapeHtml(segment.text);
  }).join("");
}

function renderSite(site) {
  document.title = site.title || DEFAULT_SITE.title;
  document.getElementById("pageTitle").textContent = site.title || DEFAULT_SITE.title;
  document.getElementById("brandName").textContent = site.title || DEFAULT_SITE.title;
  document.getElementById("metaDescription").setAttribute("content", site.description || DEFAULT_SITE.description);

  const sections = { ...DEFAULT_SITE.sections, ...(site.sections || {}) };
  document.getElementById("researchLabel").textContent = sections.research;
  document.getElementById("publicationsHeading").textContent = sections.publications;
  document.getElementById("awardsHeading").textContent = sections.awards;
  document.getElementById("teachingHeading").textContent = sections.teaching;
  document.getElementById("serviceHeading").textContent = sections.service;

  const navItems = Array.isArray(site.navigation) ? site.navigation : DEFAULT_SITE.navigation;
  const nav = document.getElementById("mainNav");
  const themeButton = document.getElementById("themeToggle");
  nav.innerHTML = navItems.map(item => `<a href="${htmlAttr(item.href)}">${escapeHtml(item.label)}</a>`).join("");
  nav.appendChild(themeButton);
}

function renderBio(bio) {
  const identity = document.getElementById("identityBlock");
  const portrait = bio.portrait || {};
  const lab = bio.lab || {};
  const socials = Array.isArray(bio.socials) ? bio.socials : [];

  identity.innerHTML = `
    <img class="portrait" src="${htmlAttr(portrait.src || "")}" alt="${htmlAttr(portrait.alt || bio.name || "Portrait")}" />
    <p><strong>${escapeHtml(bio.role || "")}</strong></p>
    <p>${escapeHtml(bio.affiliation || "")}</p>
    ${lab.name ? `<p><a href="${htmlAttr(lab.url || "#")}">${escapeHtml(lab.name)}</a></p>` : ""}
    ${bio.email ? `<p><a href="mailto:${htmlAttr(bio.email)}">${escapeHtml(bio.email)}</a></p>` : ""}
    <div class="socials" aria-label="Academic and social links">
      ${socials.map(item => `
        <a class="icon-btn" href="${htmlAttr(item.url)}" aria-label="${htmlAttr(item.label)}" title="${htmlAttr(item.label)}">
          <i class="${htmlAttr(item.iconClass)}"></i>
        </a>
      `).join("")}
    </div>
  `;

  document.getElementById("bioText").innerHTML = renderLinkedSegments(bio.bio);
}

function renderResearch(research) {
  const grid = document.getElementById("researchGrid");
  const categories = Array.isArray(research.categories) ? research.categories : [];
  grid.innerHTML = categories.map(category => {
    const topics = Array.isArray(category.topics) ? category.topics : [];
    return `
      <article class="research-card">
        <h3>${escapeHtml(category.name)}</h3>
        <p class="topic-line">
          ${topics.map(topic => `<a href="${htmlAttr(topic.href || "#")}">${escapeHtml(topic.label)}</a>`).join(", ")}
        </p>
      </article>
    `;
  }).join("");
}

function renderAwards(data) {
  const list = document.getElementById("awardsList");
  const awards = Array.isArray(data.awards) ? data.awards : [];
  list.innerHTML = awards.map(award => `
    <li class="award-item">
      <span class="item-title">${escapeHtml(award.title)}</span>
      <span class="item-meta">${escapeHtml(award.institution)}</span>
    </li>
  `).join("");
}

function renderTeaching(data) {
  const container = document.getElementById("teachingList");
  const courses = Array.isArray(data.courses) ? data.courses : [];
  container.innerHTML = courses.map(course => `
    <article class="course">
      <h3>${escapeHtml(course.code)} &mdash; ${escapeHtml(course.title)}</h3>
      <ul>
        <li><strong>${escapeHtml(course.role || data.defaultRole || "Lecturer")}</strong> (${escapeHtml(course.institution || data.institutionFullName || "")}): ${escapeHtml(course.years)}</li>
      </ul>
    </article>
  `).join("");
}

function renderService(data) {
  const container = document.getElementById("serviceList");
  const groups = Array.isArray(data.groups) ? data.groups : [];
  container.innerHTML = groups.map(group => `
    <article class="course">
      <h3>${escapeHtml(group.title)}</h3>
      <ul>
        ${(Array.isArray(group.items) ? group.items : []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function aliasMatchFromConfig(normalizedTitle) {
  const aliases = publicationConfig.duplicateAliases || {};
  for (const [canonicalKey, aliasList] of Object.entries(aliases)) {
    if ((aliasList || []).some(alias => normalizeTitle(alias) === normalizedTitle)) return canonicalKey;
  }
  return null;
}

function canonicalize(pub) {
  const normalized = normalizeTitle(pub.title);
  const defaultRules = [
    {
      canonicalKey: "monocular-depth-estimation",
      match: title => title.includes("depth estimation") && title.includes("encoder")
    },
    {
      canonicalKey: "assistive-navigation-visually-impaired",
      match: title => title.includes("wayfinding") || title.includes("assistive navigation") || title.includes("visually impaired")
    }
  ];
  const defaultRule = defaultRules.find(rule => rule.match(normalized));
  return pub.canonicalKey || aliasMatchFromConfig(normalized) || (defaultRule && defaultRule.canonicalKey) || slugify(pub.title);
}

function inferType(pub) {
  const venue = normalizeTitle(pub.venue || "");
  if (/journal|visual computer|data in brief/.test(venue)) return "journal";
  if (/conference|iccit|eict|iceee|big data|iot|machine learning|ieee/.test(venue)) return "conference";
  if (/arxiv|preprint|ssrn/.test(venue)) return "preprint";
  return pub.type || "conference";
}

function scorePublication(pub) {
  const venue = normalizeTitle(pub.venue || "");
  let score = 0;
  if (pub.doi) score += 4;
  if (/journal|conference|ieee|springer|elsevier|visual computer|data in brief/.test(venue)) score += 3;
  if (/arxiv|preprint|ssrn/.test(venue)) score -= 2;
  if (/ssrn/.test(venue)) score -= 3;
  return score;
}

function applyPublicationConfig(pub) {
  const canonicalKey = pub.canonicalKey || canonicalize(pub);
  const pdfs = publicationConfig.pdfs || {};
  const bibtex = publicationConfig.bibtex || {};
  return {
    ...pub,
    canonicalKey,
    pdf: pub.pdf || pdfs[pub.id] || pdfs[canonicalKey] || pdfs[normalizeTitle(pub.title)] || "",
    bibtex: pub.bibtex || bibtex[pub.id] || bibtex[canonicalKey] || ""
  };
}

function dedupePublications(publications) {
  const best = new Map();
  publications.forEach(pub => {
    const enriched = applyPublicationConfig({
      ...pub,
      type: pub.type || inferType(pub),
      canonicalKey: pub.canonicalKey || canonicalize(pub)
    });
    const existing = best.get(enriched.canonicalKey);
    if (!existing || scorePublication(enriched) > scorePublication(existing)) {
      best.set(enriched.canonicalKey, enriched);
    }
  });
  return Array.from(best.values()).sort((a, b) => {
    if (Number(b.year) !== Number(a.year)) return Number(b.year) - Number(a.year);
    return String(a.title).localeCompare(String(b.title));
  });
}

async function loadPublications(config) {
  const status = document.getElementById("publicationStatus");
  publicationConfig = { ...DEFAULT_PUBLICATION_CONFIG, ...(config || {}) };

  if (!publicationConfig.sourceUrl) {
    status.textContent = "";
    return dedupePublications(STATIC_PUBLICATIONS_SNAPSHOT);
  }

  try {
    const response = await fetch(publicationConfig.sourceUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Publication endpoint returned ${response.status}`);
    const data = await response.json();
    status.textContent = "";
    return dedupePublications(Array.isArray(data) ? data : data.publications || []);
  } catch (error) {
    status.textContent = "Could not load the publication endpoint; showing the built-in publication snapshot.";
    return dedupePublications(STATIC_PUBLICATIONS_SNAPSHOT);
  }
}

function groupByYear(publications) {
  return publications.reduce((groups, pub) => {
    const year = pub.year || "Other";
    groups[year] = groups[year] || [];
    groups[year].push(pub);
    return groups;
  }, {});
}

function bibKey(pub) {
  const firstAuthor = (pub.authors || "sadaf").split(",")[0].trim().split(/\s+/).pop().toLowerCase();
  const firstTitleWord = normalizeTitle(pub.title).split(" ")[0] || "paper";
  return `${firstAuthor}${pub.year || ""}${firstTitleWord}`;
}

function generateBibTeX(pub) {
  const entryType = pub.type === "journal" ? "article" : pub.type === "conference" ? "inproceedings" : "misc";
  const authors = (pub.authors || "").split(",").map(name => name.trim()).filter(Boolean).join(" and ");
  const fields = [
    `  title={${pub.title || ""}}`,
    `  author={${authors}}`,
    `  year={${pub.year || ""}}`
  ];

  if (pub.doi) fields.push(`  doi={${pub.doi}}`);
  if (pub.arxiv) fields.push(`  eprint={${pub.arxiv}}`, "  archivePrefix={arXiv}");

  const venue = pub.venue || "";
  if (entryType === "article") fields.splice(2, 0, `  journal={${venue.replace(/,?\s*\d{4}$/, "")}}`);
  if (entryType === "inproceedings") fields.splice(2, 0, `  booktitle={${venue.replace(/,?\s*\d{4}$/, "")}}`);
  if (entryType === "misc" && venue) fields.splice(2, 0, `  note={${venue}}`);

  return `@${entryType}{${bibKey(pub)},\n${fields.join(",\n")}\n}`;
}

function isArxivLink(link) {
  return /arxiv\.org/i.test(link || "");
}

function actionLinks(pub) {
  const links = [];
  if (pub.doi) links.push(`<a class="pub-action" href="https://doi.org/${htmlAttr(pub.doi)}">DOI</a>`);
  else if (pub.arxiv) links.push(`<a class="pub-action" href="https://arxiv.org/abs/${htmlAttr(pub.arxiv)}">arXiv</a>`);
  else if (pub.link && !isArxivLink(pub.link)) links.push(`<a class="pub-action" href="${htmlAttr(pub.link)}">Link</a>`);

  if (pub.pdf) links.push(`<a class="pub-action" href="${htmlAttr(pub.pdf)}">PDF</a>`);

  const bib = pub.bibtex || generateBibTeX(pub);
  links.push(`<button class="pub-action copy-bib" type="button" data-bib="${htmlAttr(bib)}">Bib</button>`);
  return links.join("");
}

function publicationTitleHref(pub) {
  if (pub.doi) return `https://doi.org/${pub.doi}`;
  if (pub.arxiv) return `https://arxiv.org/abs/${pub.arxiv}`;
  return pub.link || "#";
}

function emphasizeAuthor(authors) {
  return escapeHtml(authors || "").replace(/Farhan Sadaf/g, "<strong>Farhan Sadaf</strong>");
}

function renderPublications(publications, filter = "all") {
  const container = document.getElementById("publicationList");
  const filtered = filter === "all" ? publications : publications.filter(pub => pub.type === filter);
  const groups = groupByYear(filtered);
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));

  container.innerHTML = years.map(year => `
    <section class="pub-year" aria-label="Publications from ${escapeHtml(year)}">
      <div class="year-label">${escapeHtml(year)}</div>
      <div class="pub-list">
        ${groups[year].map(pub => `
          <article class="pub-item" id="${htmlAttr(pub.id || pub.canonicalKey)}" data-type="${htmlAttr(pub.type)}">
            <p class="pub-title"><a href="${htmlAttr(publicationTitleHref(pub))}">${escapeHtml(pub.title)}</a></p>
            <p class="authors">${emphasizeAuthor(pub.authors)}</p>
            <p class="venue">${escapeHtml(pub.venue)}</p>
            <div class="pub-actions">${actionLinks(pub)}</div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");

  attachPublicationInteractions();
  highlightPublicationFromHash();
}

function flashPublication(item) {
  if (!item) return;
  item.classList.remove("is-highlighted");
  void item.offsetWidth;
  item.classList.add("is-highlighted");
}

function highlightPublicationFromHash() {
  if (!location.hash) return;
  const item = document.querySelector(location.hash);
  if (item && item.classList.contains("pub-item")) flashPublication(item);
}

function attachPublicationInteractions() {
  document.querySelectorAll(".pub-item").forEach(item => {
    item.addEventListener("click", () => flashPublication(item));
  });

  document.querySelectorAll(".copy-bib").forEach(button => {
    button.addEventListener("click", async event => {
      event.preventDefault();
      event.stopPropagation();
      const originalText = button.textContent;
      try {
        await navigator.clipboard.writeText(button.dataset.bib || "");
        button.textContent = "Copied";
      } catch (error) {
        const textArea = document.createElement("textarea");
        textArea.value = button.dataset.bib || "";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        button.textContent = "Copied";
      }
      window.setTimeout(() => { button.textContent = originalText; }, 1200);
    });
  });
}

function attachPublicationFilters() {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      renderPublications(allPublications, button.dataset.filter);
    });
  });
}

function attachResearchPublicationLinks() {
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#pub-"]');
    if (!link) return;
    event.preventDefault();
    const targetId = link.getAttribute("href");
    const allButton = document.querySelector('[data-filter="all"]');
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("is-active"));
    if (allButton) allButton.classList.add("is-active");
    renderPublications(allPublications, "all");
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.replaceState(null, "", targetId);
      window.setTimeout(() => flashPublication(target), 280);
    }
  });
}

const THEME_ICONS = {
  sun: `<svg class="theme-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2.5v2.25M12 19.25v2.25M4.75 4.75l1.6 1.6M17.65 17.65l1.6 1.6M2.5 12h2.25M19.25 12h2.25M4.75 19.25l1.6-1.6M17.65 6.35l1.6-1.6"></path></svg>`,
  moon: `<svg class="theme-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.4 8.4 0 0 1 8.8 4 8.4 8.4 0 1 0 20 15.2Z"></path></svg>`
};

function setThemeIcon(theme) {
  const button = document.getElementById("themeToggle");
  button.innerHTML = theme === "dark" ? THEME_ICONS.sun : THEME_ICONS.moon;
  button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

function initTheme() {
  const button = document.getElementById("themeToggle");
  const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
  setThemeIcon(currentTheme);
  button.addEventListener("click", () => {
    const root = document.documentElement;
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    setThemeIcon(nextTheme);
  });
}

async function init() {
  const [site, bio, research, awards, teaching, service, publicationSettings] = await Promise.all([
    fetchJson(DATA_PATHS.site, DEFAULT_SITE),
    fetchJson(DATA_PATHS.bio, DEFAULT_BIO),
    fetchJson(DATA_PATHS.research, DEFAULT_RESEARCH),
    fetchJson(DATA_PATHS.awards, DEFAULT_AWARDS),
    fetchJson(DATA_PATHS.teaching, DEFAULT_TEACHING),
    fetchJson(DATA_PATHS.service, DEFAULT_SERVICE),
    fetchJson(DATA_PATHS.publications, DEFAULT_PUBLICATION_CONFIG)
  ]);

  renderSite({ ...DEFAULT_SITE, ...site });
  renderBio({ ...DEFAULT_BIO, ...bio });
  renderResearch({ ...DEFAULT_RESEARCH, ...research });
  renderAwards({ ...DEFAULT_AWARDS, ...awards });
  renderTeaching({ ...DEFAULT_TEACHING, ...teaching });
  renderService({ ...DEFAULT_SERVICE, ...service });

  initTheme();
  allPublications = await loadPublications(publicationSettings);
  renderPublications(allPublications);
  attachPublicationFilters();
  attachResearchPublicationLinks();
  window.addEventListener("hashchange", highlightPublicationFromHash);
}

init();

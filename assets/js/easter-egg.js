(() => {
  const BURST_CLICK_COUNT = 5;
  const BURST_WINDOW_MS = 1100;
  const MAX_THROW_SPEED = 22;
  const MIN_VISIBLE_EDGE = 28;
  const PIECE_SELECTORS = [
    ".site-header",
    "#identityBlock",
    "#bioText",
    ".section-label",
    ".research-card",
    ".section > h2",
    "#publicationsHeading",
    ".publication-note:not(:empty)",
    ".pub-controls",
    ".year-label",
    ".pub-item",
    "#awardsHeading",
    ".award-item",
    "#teachingHeading",
    "#teachingList .course",
    "#serviceHeading",
    "#serviceList .course",
    ".bottom-rule"
  ];

  let clickTimes = [];
  let layer = null;
  let pieces = [];
  let animationId = null;
  let viewportClampTimer = null;
  let lastFrameTime = 0;
  let activePointer = null;
  let suppressNextThemeBurst = false;
  let publicationFilterToRestore = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function injectStyles() {
    if (document.getElementById("easterEggStyles")) return;

    const style = document.createElement("style");
    style.id = "easterEggStyles";
    style.textContent = `
      .easter-egg-hidden {
        visibility: hidden !important;
      }

      .easter-egg-layer {
        position: fixed;
        inset: 0;
        z-index: 9999;
        overflow: hidden;
        pointer-events: none;
      }

      .easter-egg-piece {
        position: fixed !important;
        top: 0;
        left: 0;
        margin: 0 !important;
        pointer-events: auto;
        touch-action: none;
        user-select: none;
        cursor: grab;
        will-change: transform;
        transform-origin: center;
      }

      .easter-egg-piece * {
        pointer-events: none !important;
      }

      .easter-egg-piece .theme-toggle,
      .easter-egg-piece .theme-toggle * {
        pointer-events: auto !important;
      }

      .easter-egg-piece.is-dragging {
        cursor: grabbing;
        z-index: 10000;
      }
    `;
    document.head.appendChild(style);
  }

  function removeDuplicateIds(node) {
    node.removeAttribute("id");
    node.querySelectorAll("[id]").forEach(child => child.removeAttribute("id"));
  }

  function getSources() {
    const seen = new Set();
    return PIECE_SELECTORS.flatMap(selector => Array.from(document.querySelectorAll(selector)))
      .filter(source => {
        if (seen.has(source)) return false;
        seen.add(source);
        const rect = source.getBoundingClientRect();
        return rect.width > 8 && rect.height > 8;
      });
  }

  function getActivePublicationFilter() {
    return document.querySelector(".filter-btn.is-active")?.dataset.filter || "all";
  }

  function showAllPublicationsForPieces() {
    publicationFilterToRestore = getActivePublicationFilter();

    if (publicationFilterToRestore === "all") return;

    const allButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allButton) allButton.click();
  }

  function restorePublicationFilter() {
    if (!publicationFilterToRestore || publicationFilterToRestore === "all") {
      publicationFilterToRestore = null;
      return;
    }

    const filterButton = document.querySelector(`.filter-btn[data-filter="${publicationFilterToRestore}"]`);
    publicationFilterToRestore = null;
    if (filterButton) filterButton.click();
  }

  function makePiece(source, index) {
    const rect = source.getBoundingClientRect();
    const clone = source.cloneNode(true);
    removeDuplicateIds(clone);

    clone.classList.add("easter-egg-piece");
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;
    layer.appendChild(clone);

    const piece = {
      source,
      clone,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      vx: (Math.random() - 0.5) * 3.2,
      vy: (Math.random() - 0.5) * 2.4,
      angle: 0,
      va: (Math.random() - 0.5) * 0.4,
      phase: index * 0.7 + Math.random() * Math.PI,
      dragging: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastPointerTime: 0
    };

    clone.addEventListener("pointerdown", event => startDrag(event, piece));
    source.classList.add("easter-egg-hidden");
    attachFloatingControls(clone);
    updatePieceTransform(piece);
    return piece;
  }

  function attachFloatingControls(clone) {
    const themeButton = clone.querySelector(".theme-toggle");
    if (!themeButton) return;

    themeButton.addEventListener("pointerdown", event => {
      event.stopPropagation();
    });

    themeButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      toggleThemeFromFloatingButton();
    });
  }

  function syncFloatingThemeButtons() {
    const sourceButton = document.getElementById("themeToggle");
    if (!sourceButton) return;

    document.querySelectorAll(".easter-egg-piece .theme-toggle").forEach(button => {
      button.innerHTML = sourceButton.innerHTML;
      button.setAttribute("aria-label", sourceButton.getAttribute("aria-label") || "Toggle color theme");
    });
  }

  function toggleThemeFromFloatingButton() {
    const sourceButton = document.getElementById("themeToggle");
    if (!sourceButton) return;

    suppressNextThemeBurst = true;
    sourceButton.click();
    syncFloatingThemeButtons();
  }

  function updatePieceTransform(piece) {
    piece.clone.style.transform = `translate3d(${piece.x}px, ${piece.y}px, 0) rotate(${piece.angle}deg)`;
  }

  function clampPieceToViewport(piece, viewportWidth, viewportHeight) {
    const minX = Math.min(0, MIN_VISIBLE_EDGE - piece.width);
    const maxX = Math.max(0, viewportWidth - MIN_VISIBLE_EDGE);
    const minY = Math.min(0, MIN_VISIBLE_EDGE - piece.height);
    const maxY = Math.max(0, viewportHeight - MIN_VISIBLE_EDGE);

    piece.x = clamp(piece.x, minX, maxX);
    piece.y = clamp(piece.y, minY, maxY);
    updatePieceTransform(piece);

    const rect = piece.clone.getBoundingClientRect();

    if (rect.right < MIN_VISIBLE_EDGE) {
      piece.x += MIN_VISIBLE_EDGE - rect.right;
    } else if (rect.left > viewportWidth - MIN_VISIBLE_EDGE) {
      piece.x -= rect.left - (viewportWidth - MIN_VISIBLE_EDGE);
    }

    if (rect.bottom < MIN_VISIBLE_EDGE) {
      piece.y += MIN_VISIBLE_EDGE - rect.bottom;
    } else if (rect.top > viewportHeight - MIN_VISIBLE_EDGE) {
      piece.y -= rect.top - (viewportHeight - MIN_VISIBLE_EDGE);
    }

    updatePieceTransform(piece);
  }

  function startDrag(event, piece) {
    if (!layer) return;
    event.preventDefault();

    if (activePointer && activePointer.piece !== piece) {
      activePointer.piece.dragging = false;
      activePointer.piece.clone.classList.remove("is-dragging");
    }

    const now = performance.now();
    piece.dragging = true;
    piece.dragOffsetX = event.clientX - piece.x;
    piece.dragOffsetY = event.clientY - piece.y;
    piece.lastPointerX = event.clientX;
    piece.lastPointerY = event.clientY;
    piece.lastPointerTime = now;
    piece.vx = 0;
    piece.vy = 0;
    piece.clone.classList.add("is-dragging");
    piece.clone.setPointerCapture(event.pointerId);
    activePointer = { id: event.pointerId, piece };
  }

  function dragPiece(event) {
    if (!activePointer || activePointer.id !== event.pointerId) return;

    const piece = activePointer.piece;
    const now = performance.now();
    const elapsed = Math.max(16, now - piece.lastPointerTime);
    const nextX = event.clientX - piece.dragOffsetX;
    const nextY = event.clientY - piece.dragOffsetY;

    piece.vx = clamp(((event.clientX - piece.lastPointerX) / elapsed) * 16, -MAX_THROW_SPEED, MAX_THROW_SPEED);
    piece.vy = clamp(((event.clientY - piece.lastPointerY) / elapsed) * 16, -MAX_THROW_SPEED, MAX_THROW_SPEED);
    piece.x = nextX;
    piece.y = nextY;
    piece.lastPointerX = event.clientX;
    piece.lastPointerY = event.clientY;
    piece.lastPointerTime = now;
    updatePieceTransform(piece);
  }

  function endDrag(event) {
    if (!activePointer || activePointer.id !== event.pointerId) return;

    const piece = activePointer.piece;
    piece.dragging = false;
    piece.clone.classList.remove("is-dragging");
    activePointer = null;
  }

  function animateFrame(frameTime) {
    if (!layer) return;

    const delta = lastFrameTime ? clamp((frameTime - lastFrameTime) / 16.67, 0.5, 2) : 1;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    lastFrameTime = frameTime;

    pieces.forEach(piece => {
      if (piece.dragging) return;

      const drift = frameTime * 0.001 + piece.phase;
      piece.vx += Math.sin(drift) * 0.018 * delta;
      piece.vy += Math.cos(drift * 0.82) * 0.014 * delta;
      piece.vx *= 0.995;
      piece.vy *= 0.995;
      piece.x += piece.vx * delta;
      piece.y += piece.vy * delta;
      piece.angle += piece.va * delta;

      const minX = Math.min(0, MIN_VISIBLE_EDGE - piece.width);
      const maxX = Math.max(0, viewportWidth - MIN_VISIBLE_EDGE);
      const minY = Math.min(0, MIN_VISIBLE_EDGE - piece.height);
      const maxY = Math.max(0, viewportHeight - MIN_VISIBLE_EDGE);

      if (piece.x < minX || piece.x > maxX) {
        piece.x = clamp(piece.x, minX, maxX);
        piece.vx *= -0.72;
        piece.va *= -0.75;
      }

      if (piece.y < minY || piece.y > maxY) {
        piece.y = clamp(piece.y, minY, maxY);
        piece.vy *= -0.72;
        piece.va *= -0.75;
      }

      clampPieceToViewport(piece, viewportWidth, viewportHeight);
    });

    animationId = window.requestAnimationFrame(animateFrame);
  }

  function keepPiecesInViewport() {
    if (!layer) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    pieces.forEach(piece => {
      piece.vx = clamp(piece.vx, -MAX_THROW_SPEED, MAX_THROW_SPEED);
      piece.vy = clamp(piece.vy, -MAX_THROW_SPEED, MAX_THROW_SPEED);
      clampPieceToViewport(piece, viewportWidth, viewportHeight);
    });
  }

  function startEasterEgg() {
    if (layer) return;

    showAllPublicationsForPieces();
    injectStyles();
    layer = document.createElement("div");
    layer.className = "easter-egg-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    pieces = getSources().map((source, index) => makePiece(source, index));
    if (!pieces.length) {
      stopEasterEgg();
      return;
    }

    syncFloatingThemeButtons();
    keepPiecesInViewport();
    document.documentElement.classList.add("easter-egg-active");
    document.addEventListener("pointermove", dragPiece);
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", keepPiecesInViewport);
    window.addEventListener("orientationchange", keepPiecesInViewport);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", keepPiecesInViewport);
    }
    viewportClampTimer = window.setInterval(keepPiecesInViewport, 250);
    lastFrameTime = 0;
    animationId = window.requestAnimationFrame(animateFrame);
  }

  function stopEasterEgg() {
    if (animationId) window.cancelAnimationFrame(animationId);
    if (viewportClampTimer) window.clearInterval(viewportClampTimer);
    animationId = null;
    viewportClampTimer = null;
    activePointer = null;

    pieces.forEach(piece => {
      piece.source.classList.remove("easter-egg-hidden");
      piece.clone.remove();
    });
    pieces = [];

    if (layer) layer.remove();
    layer = null;

    document.documentElement.classList.remove("easter-egg-active");
    document.removeEventListener("pointermove", dragPiece);
    document.removeEventListener("pointerup", endDrag);
    document.removeEventListener("pointercancel", endDrag);
    window.removeEventListener("resize", keepPiecesInViewport);
    window.removeEventListener("orientationchange", keepPiecesInViewport);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", keepPiecesInViewport);
    }
    restorePublicationFilter();
  }

  function handleThemeBurst() {
    if (suppressNextThemeBurst) {
      suppressNextThemeBurst = false;
      return;
    }

    const now = performance.now();
    clickTimes = clickTimes.filter(time => now - time <= BURST_WINDOW_MS);
    clickTimes.push(now);

    if (clickTimes.length >= BURST_CLICK_COUNT) {
      clickTimes = [];
      if (!layer) {
        window.setTimeout(startEasterEgg, 0);
      }
    }
  }

  function init() {
    const button = document.getElementById("themeToggle");
    if (!button) return;
    button.addEventListener("click", handleThemeBurst);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

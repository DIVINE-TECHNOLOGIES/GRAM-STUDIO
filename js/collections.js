(function() {
	const overlay = document.getElementById("overlay");
	const select = document.getElementById("file-model-select");
	const resEl = document.getElementById("sheet-resolution");
	const priceEl = document.getElementById("sheet-price");
	const platformsEl = document.getElementById("platforms");
	const titleEl = document.getElementById("sheet-title");
	const DEFAULT_MODELS = [{
		key: 'png',
		label: 'PNG — high-res',
		resolution: 'Up to 6000×4000',
		mult: 1.00,
		ext: 'png'
	}, {
		key: 'jpg',
		label: 'JPG — web',
		resolution: '1920×1080',
		mult: 0.75,
		ext: 'jpg'
	}, {
		key: 'svg',
		label: 'SVG — vector',
		resolution: 'Scalable vector',
		mult: 1.10,
		ext: 'svg'
	}, {
		key: 'webp',
		label: 'WEBP — compressed',
		resolution: '2048×1536',
		mult: 0.85,
		ext: 'webp'
	}, {
		key: 'psd',
		label: 'PSD — layered source',
		resolution: 'Full layered source',
		mult: 1.50,
		ext: 'psd'
	}];

	function parsePriceString(s) {
		if (!s) return 0;
		const n = s.toString().replace(/[^\d.]/g, '');
		return Number(n) || 0;
	}

	function formatINR(n) {
		try {
			return new Intl.NumberFormat('en-IN', {
				style: 'currency',
				currency: 'INR',
				maximumFractionDigits: 0
			}).format(Math.round(n));
		} catch {
			return '₹' + Math.round(n).toLocaleString('en-IN');
		}
	}

	function parsePlatformsString(s) {
		return (s || '').split(';').map(p => {
			const parts = p.split('|').map(x => x && x.trim());
			return {
				name: parts[0] || parts[1] || 'Buy',
				url: parts[1] || parts[0] || '#'
			};
		}).filter(Boolean);
	}

	function updatePlatformLinks(cardPlatformsStr, modelKey) {
		const platforms = parsePlatformsString(cardPlatformsStr);
		platformsEl.innerHTML = '';
		platforms.forEach(p => {
			try {
				const url = new URL(p.url, location.href);
				if (modelKey) url.searchParams.set('format', modelKey);
				const a = document.createElement('a');
				a.href = url.toString();
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.textContent = p.name;
				a.style.display = 'inline-block';
				a.style.padding = '10px 12px';
				a.style.borderRadius = '999px';
				a.style.border = '1px solid var(--gold)';
				a.style.background = 'var(--gold)';
				a.style.color = 'var(--gold-ink)';
				a.style.fontWeight = '800';
				a.style.textDecoration = 'none';
				platformsEl.appendChild(a);
			} catch (err) {
				const a = document.createElement('a');
				a.href = p.url;
				a.textContent = p.name;
				platformsEl.appendChild(a);
			}
		});
		if (!platforms.length) {
			platformsEl.textContent = 'No purchase links available for this item.';
		}
	}

	function findCardForOpenSheet() {
		const title = (titleEl && titleEl.textContent || '').trim();
		if (!title) return null;
		const all = Array.from(document.querySelectorAll('.auricartisan__card'));
		return all.find(c => {
			const t = (c.dataset.title || c.querySelector('.auricartisan__card__title')?.textContent || '').trim();
			return t === title;
		}) || null;
	}

	function populateSelectForCard(card) {
		const available = [];
		const raw = card?.dataset?.formats || '';
		if (raw) {
			raw.split(';').forEach(seg => {
				const [key, mult, res, label] = seg.split('|').map(x => x && x.trim());
				if (!key) return;
				available.push({
					key,
					label: label || key.toUpperCase(),
					resolution: res || '',
					mult: mult ? Number(mult) : 1.0,
					ext: key
				});
			});
		}
		if (!available.length) {
			available.push(...DEFAULT_MODELS);
		}
		select.innerHTML = '';
		available.forEach(m => {
			const opt = document.createElement('option');
			opt.value = m.key;
			opt.textContent = `${m.label} — ${m.resolution || 'varies'} — ${m.mult < 1 ? 'discount' : (m.mult>1 ? 'premium' : 'standard')}`;
			opt.dataset.mult = String(m.mult);
			opt.dataset.res = m.resolution || '';
			opt.dataset.ext = m.ext || m.key;
			select.appendChild(opt);
		});
	}

	function applyModelSelectionToSheet(card) {
		if (!card) return;
		const basePriceStr = card.dataset.price || (card.querySelector('.auricartisan__price')?.textContent) || '';
		const baseNumeric = parsePriceString(basePriceStr);
		const selected = select.options[select.selectedIndex];
		const mult = Number(selected?.dataset?.mult) || 1;
		const res = selected?.dataset?.res || '';
		const key = selected?.value || '';
		const newPrice = Math.max(0, baseNumeric * mult);
		priceEl.textContent = formatINR(newPrice);
		resEl.textContent = res ? `Resolution: ${res}` : 'Resolution: varies';
		updatePlatformLinks(card.dataset.platforms || '', key);
	}

	// Guard: if overlay/select don’t exist yet, skip wiring to avoid null derefs
	if (!overlay || !select || !resEl || !priceEl || !platformsEl || !titleEl) return;

	const mo = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.attributeName === 'data-open' || m.attributeName === 'aria-hidden') {
				const isOpen = overlay.dataset.open === 'true' || overlay.getAttribute('aria-hidden') === 'false';
				if (isOpen) {
					setTimeout(() => {
						const card = findCardForOpenSheet();
						if (!card) return;
						populateSelectForCard(card);
						const prefer = ['png', 'svg', 'webp', 'jpg', 'psd'];
						const opts = Array.from(select.options);
						let idx = opts.findIndex(o => prefer.includes(o.value));
						if (idx === -1) idx = 0;
						select.selectedIndex = Math.max(0, idx);
						applyModelSelectionToSheet(card);
					}, 30);
				}
			}
		}
	});
	mo.observe(overlay, {
		attributes: true,
		attributeFilter: ['data-open', 'aria-hidden']
	});
	select.addEventListener('change', () => {
		const card = findCardForOpenSheet();
		if (!card) return;
		applyModelSelectionToSheet(card);
	});
})();

"use strict";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const NORM = (s) => (s || "").toString().trim().toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
const readHash = () => {
	const raw = (location.hash || "").replace(/^#/, "");
	return NORM(decodeURIComponent(raw)) || "all";
};
const parseHashPair = () => {
	const h = readHash();
	const [cat, sub] = h.split("/");
	return [cat || "all", sub || "all"];
};
const setHash = (cat, sub = "all") => {
	const catN = NORM(cat);
	const subN = NORM(sub);
	if (catN === "all" && subN === "all") {
		history.replaceState(null, "", location.pathname + location.search);
		applyFromHash();
	} else {
		const slug = subN === "all" ? catN : `${catN}/${subN}`;
		if (readHash() !== slug) location.hash = slug;
	}
};

function applyFromHash() {
	const [cat, sub] = parseHashPair();
	$$(".auricartisan__chip[data-category]").forEach(c => {
		c.dataset.active = (NORM(c.dataset.category) === cat) ? "true" : "false";
	});
	filterBy(cat, sub);
	updateSubcategoriesVisibility(cat);
}
(() => {
	const y = $("#year");
	if (y) y.textContent = new Date().getFullYear();
})();
/* Menus */
(() => {
	const menus = $$("[data-menu]");
	let open;

	function setOpen(item, state) {
		if (open && open !== item) {
			open.setAttribute("aria-expanded", "false");
			open.querySelector(".auricartisan__nav__btn").setAttribute("aria-expanded", "false");
		}
		item.setAttribute("aria-expanded", state ? "true" : "false");
		item.querySelector(".auricartisan__nav__btn").setAttribute("aria-expanded", state ? "true" : "false");
		open = state ? item : null;
	}
	menus.forEach(item => {
		const btn = item.querySelector(".auricartisan__nav__btn");
		const panel = item.querySelector(".auricartisan__nav__menu");
		btn.addEventListener("click", () => {
			const next = item.getAttribute("aria-expanded") !== "true";
			setOpen(item, next);
		});
		let hoverTimer;
		item.addEventListener("mouseenter", () => {
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => setOpen(item, true), 80);
		});
		item.addEventListener("mouseleave", () => {
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => setOpen(item, false), 120);
		});
		panel.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				setOpen(item, false);
				btn.focus();
			}
		});
	});
	document.addEventListener("click", e => {
		if (!open) return;
		if (!open.contains(e.target)) {
			// use setOpen so button aria stays in sync
			setOpen(open, false);
		}
	});
	$$(".auricartisan__nav__menu [data-filter-category]").forEach(link => {
		link.addEventListener("click", e => {
			e.preventDefault();
			const c = link.getAttribute("data-filter-category");
			const sub = getSubFilter(c);
			setHash(c, sub);
			const item = link.closest("[data-menu]");
			if (item) item.setAttribute("aria-expanded", "false");
		});
	});
})();
/* Catalog */
const grid = $("#grid");
const cards = grid ? Array.from(grid.children) : [];

function applyVisibility(card, show) {
	card.style.display = show ? "" : "none";
}

// Hardened getSubFilter: exact normalized match, safe fallback
function getSubFilter(category) {
	// try exact attribute match first (handles raw values)
	let sel = document.querySelector(`select[data-subcategory="${category}"]`);
	if (!sel) {
		const normCat = NORM(category);
		sel = Array.from(document.querySelectorAll("select[data-subcategory]"))
			.find(s => NORM(s.getAttribute("data-subcategory") || s.dataset.subcategory) === normCat);
	}
	return sel ? (sel.value || "all") : "all";
}

/* SEARCH */
const SEARCH = (() => {
	const qInput = $("#collection-search");
	const qClear = $("#collection-clear");
	const qCount = $("#search-count");
	const stripDiacritics = (s) => s.normalize?.("NFKD").replace(/[\u0300-\u036f]/g, "") || s;
	const TEXT_NORM = (s) => stripDiacritics((s || "").toLowerCase());
	const index = [];
	const original = new WeakMap();

	function tokenize(s) {
		return TEXT_NORM(s).split(/[^a-z0-9]+/).filter(Boolean);
	}

	function ensureOriginal(card) {
		if (!original.has(card)) {
			const t = card.querySelector(".auricartisan__card__title");
			const d = card.querySelector(".auricartisan__card__desc");
			original.set(card, {
				title: t ? t.innerHTML : "",
				desc: d ? d.innerHTML : ""
			});
		}
	}

	function buildIndex() {
		index.length = 0;
		cards.forEach(card => {
			ensureOriginal(card);
			const title = card.dataset.title || card.querySelector(".auricartisan__card__title")?.textContent || "";
			const desc = card.dataset.desc || card.querySelector(".auricartisan__card__desc")?.textContent || "";
			const tags = card.dataset.tags || "";
			index.push({
				card,
				textTokens: new Set([...tokenize(title), ...tokenize(desc), ...tokenize(tags)])
			});
		});
	}
	buildIndex();

	function highlight(card, terms) {
		const { title, desc } = original.get(card) || {};
		const tEl = card.querySelector(".auricartisan__card__title");
		const dEl = card.querySelector(".auricartisan__card__desc");
		if (tEl && title != null) tEl.innerHTML = title;
		if (dEl && desc != null) dEl.innerHTML = desc;
		if (!terms.length) return;
		const markText = (el) => {
			if (!el) return;
			let html = el.innerHTML;
			terms.forEach(term => {
				const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
				const re = new RegExp(`(${safe})`, "ig");
				html = html.replace(re, `<mark class="search-hit">$1</mark>`);
			});
			el.innerHTML = html;
		};
		markText(tEl);
		markText(dEl);
	}

	function parseQueryFromURL() {
		const p = new URLSearchParams(location.search);
		return (p.get("q") || "").trim();
	}

	function writeQueryToURL(q) {
		const url = new URL(location.href);
		if (q) url.searchParams.set("q", q);
		else url.searchParams.delete("q");
		history.replaceState(null, "", url.toString());
	}
	let currentQuery = "";

	function setQuery(q, { fromUrl = false } = {}) {
		const qTrim = (q || "").trim();
		currentQuery = qTrim;
		if (!fromUrl) writeQueryToURL(qTrim);
		if (qInput && qInput.value !== qTrim) qInput.value = qTrim;
		applyFromHash();
	}

	function makeQueryPredicate() {
		const q = TEXT_NORM(currentQuery);
		if (!q) return () => true;
		const terms = q.split(/\s+/).filter(Boolean);
		if (!terms.length) return () => true;
		const termArr = terms;
		return (card) => {
			const entry = index.find(it => it.card === card);
			if (!entry) return true;
			return termArr.every(t => entry.textTokens.has(t));
		};
	}

	function postFilterUpdate() {
		const visible = cards.filter(c => c.style.display !== "none");
		if (qCount) qCount.textContent = String(visible.length);
		const terms = TEXT_NORM(currentQuery).split(/\s+/).filter(Boolean);
		cards.forEach(c => highlight(c, []));
		if (terms.length) visible.forEach(c => highlight(c, terms));
	}

	function debounce(fn, ms) {
		let t;
		return function(...args) {
			clearTimeout(t);
			t = setTimeout(() => fn.apply(this, args), ms);
		};
	}
	const onType = debounce((e) => setQuery(e.target.value), 120);
	if (qInput) {
		qInput.addEventListener("input", onType);
		qInput.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				e.preventDefault();
				setQuery("");
				qInput.blur();
			}
			if (e.key === "Enter") {
				e.preventDefault();
				setQuery(qInput.value);
			}
		});
	}
	qClear?.addEventListener("click", () => setQuery(""));
	const bootQ = parseQueryFromURL();
	if (bootQ) setQuery(bootQ, { fromUrl: true });
	return {
		makeQueryPredicate,
		postFilterUpdate,
		setQueryFromURL: () => setQuery(parseQueryFromURL(), { fromUrl: true }),
		rebuild: buildIndex
	};
})();

function filterBy(category, sub) {
	const catN = NORM(category);
	const subN = NORM(sub);
	const matchesQuery = SEARCH.makeQueryPredicate();
	cards.forEach(card => {
		const c = NORM(card.getAttribute("data-category"));
		const s = NORM(card.getAttribute("data-subcategory"));
		const passC = (catN === "all" || c === catN);
		const passS = (subN === "all" || s === subN);
		const passQ = matchesQuery(card);
		applyVisibility(card, passC && passS && passQ);
	});
	SEARCH.postFilterUpdate();
}

// Hardened: show only matching subcategory select for active category.
// Show all selects only when category === "all".
function updateSubcategoriesVisibility(category) {
	const subBar = document.querySelector(".auricartisan__bar__subcategories");
	if (!subBar) return;
	subBar.style.display = "";
	const labels = subBar.querySelectorAll("label.auricartisan__chip");
	const catNorm = NORM(category || "all");

	if (catNorm === "all") {
		labels.forEach(lbl => { lbl.style.display = ""; });
		return;
	}

	let foundMatch = false;
	labels.forEach(lbl => {
		const sel = lbl.querySelector("select[data-subcategory]");
		if (!sel) {
			lbl.style.display = "none";
			return;
		}
		const selNorm = NORM(sel.getAttribute("data-subcategory") || sel.dataset.subcategory || "");
		const match = selNorm === catNorm;
		lbl.style.display = match ? "" : "none";
		if (match) foundMatch = true;
	});

	if (!foundMatch) {
		// Hide instead of showing everything. No gaslighting.
		labels.forEach(lbl => lbl.style.display = "none");
	}
}

$$(".auricartisan__chip[data-category]").forEach(chip => {
	chip.addEventListener("click", () => {
		const cat = chip.getAttribute("data-category");
		$$(".auricartisan__chip[data-category]").forEach(c => c.dataset.active = "false");
		chip.dataset.active = "true";
		const sub = cat === "all" ? "all" : getSubFilter(cat);
		setHash(cat, sub);
	});
});

// Modified subcategory change handler: ensure selecting a subcategory activates its parent category chip and applies filtering immediately
$$("select[data-subcategory]").forEach(sel => {
	sel.addEventListener("change", () => {
		const catAttr = sel.getAttribute("data-subcategory") || sel.dataset.subcategory || "";
		const catNorm = NORM(catAttr);
		let activated = false;
		$$(".auricartisan__chip[data-category]").forEach(c => {
			if (NORM(c.dataset.category) === catNorm) {
				c.dataset.active = "true";
				activated = true;
			} else {
				c.dataset.active = "false";
			}
		});
		if (!activated) {
			$$(".auricartisan__chip[data-category]").forEach(c => c.dataset.active = "false");
		}
		const subValue = sel.value || "all";
		setHash(catAttr, subValue);
		filterBy(catAttr, subValue);
		updateSubcategoriesVisibility(catAttr);
	});
});

applyFromHash();

(function initFromHash() {
	const [cat, sub] = parseHashPair();
	$$(".auricartisan__chip[data-category]").forEach(c => {
		c.dataset.active = (NORM(c.dataset.category) === cat) ? "true" : "false";
	});
	filterBy(cat, sub);
	updateSubcategoriesVisibility(cat);
})();

window.addEventListener("hashchange", () => {
	const [cat, sub] = parseHashPair();
	$$(".auricartisan__chip[data-category]").forEach(c => {
		c.dataset.active = (NORM(c.dataset.category) === cat) ? "true" : "false";
	});
	filterBy(cat, sub);
	updateSubcategoriesVisibility(cat);
});

/* optional boot from query */
(function bootFromQueryWhenNoHash() {
	if (location.hash) return;
	const norm = (s) => NORM(s);

	function parseCatsParam() {
		const p = new URLSearchParams(location.search);
		const raw = p.get("categories") || p.get("category") || p.get("cat");
		if (!raw) return null;
		return raw.split(/[,|;]/).map(norm).filter(Boolean);
	}

	function parseSubParam() {
		const p = new URLSearchParams(location.search);
		return norm(p.get("subcategory") || p.get("sub") || p.get("subcategories") || "");
	}

	function catFromHost() {
		const host = location.hostname || "";
		const parts = host.split(".");
		if (parts.length > 2) return norm(parts[0]);
		return null;
	}

	function availableChipCats() {
		return $$(".auricartisan__chip[data-category]").map(ch => norm(ch.dataset.category));
	}

	function availableCardCats() {
		return cards.map(card => norm(card.getAttribute("data-category") || ""));
	}

	function chooseValid(cats) {
		if (!cats || !cats.length) return [];
		const chips = availableChipCats();
		const cardsCats = availableCardCats();
		return cats.filter(c => chips.includes(c) || cardsCats.includes(c));
	}

	function applyMultiCategoryFilter(cats, sub) {
		if (!cats || !cats.length) return;
		if (cats.length === 1) {
			const cat = cats[0];
			$$(".auricartisan__chip[data-category]").forEach(c => c.dataset.active = (norm(c.dataset.category) === cat) ? "true" : "false");
			const subFilter = sub || getSubFilter(cat) || "all";
			setHash(cat, subFilter);
			return;
		}
		cards.forEach(card => {
			const c = norm(card.getAttribute("data-category") || "");
			const s = norm(card.getAttribute("data-subcategory") || "");
			const passC = cats.includes(c);
			const passS = (!sub || sub === "all" || s === sub);
			applyVisibility(card, passC && passS);
		});
		$$(".auricartisan__chip[data-category]").forEach(c => c.dataset.active = "false");
		updateSubcategoriesVisibility(cats[0] || "all");
	}
	const urlCats = parseCatsParam();
	const hostCat = catFromHost();
	const requested = (urlCats && urlCats.length) ? urlCats : (hostCat ? [hostCat] : null);
	const valid = chooseValid(requested);
	if (valid && valid.length) {
		const sub = parseSubParam() || null;
		applyMultiCategoryFilter(valid, sub);
	}
})();

/* Product sheet + slider */
(() => {
	const overlay = $("#overlay");
	const sheetClose = $("#sheet-close");
	const sliderTrack = $("#slider-track");
	const sliderThumbs = $("#slider-thumbs");
	const sliderEl = $("#slider");
	const titleEl = $("#sheet-title");
	const descEl = $("#sheet-desc");
	const priceEl = $("#sheet-price");
	const platformsEl = $("#platforms");
	const sentinelStart = $("#sentinel-start");
	const sentinelEnd = $("#sentinel-end");
	if (!overlay) return;
	let currentIndex = 0;
	let images = [];
	let lastTrigger = null;
	let isPlaying = false;
	let playInterval = null;
	const PLAY_DELAY = 3500;
	let userInteracted = false;
	const playBtn = sliderEl?.querySelector('[data-action="play-pause"]');
	const zoomBtn = sliderEl?.querySelector('[data-action="zoom"]');
	const downloadLink = $("#slider-download");

	function parsePlatforms(s) {
		return (s || "").split(";").map(p => p.trim()).filter(Boolean).map(pair => {
			const [name, url] = pair.split("|").map(x => x && x.trim());
			return { name, url };
		});
	}

	function safeFilenameFromUrl(url) {
		try {
			const u = new URL(url);
			return (u.pathname.split("/").pop() || "image").replace(/[^a-zA-Z0-9._-]/g, '_');
		} catch {
			return url.split("/").pop() || "image";
		}
	}

	function mountImages(imgs) {
		images = imgs.filter(Boolean);
		sliderTrack.innerHTML = "";
		sliderThumbs.innerHTML = "";
		images.forEach((src, i) => {
			const item = document.createElement("div");
			item.className = "auricartisan__slider__item";
			item.setAttribute("role", "group");
			item.setAttribute("aria-roledescription", "slide");
			item.setAttribute("aria-label", `${i+1} of ${images.length}`);
			const img = document.createElement("img");
			img.loading = "lazy";
			img.alt = `${titleEl.textContent} image ${i+1}`;
			img.src = src;
			item.appendChild(img);
			sliderTrack.appendChild(item);
			const th = document.createElement("button");
			th.className = "auricartisan__slider__thumb";
			th.type = "button";
			th.setAttribute("aria-label", `Go to image ${i+1}`);
			th.setAttribute("role", "tab");
			th.innerHTML = `<img src="${src}" alt="">`;
			th.addEventListener("click", () => {
				userInteracted = true;
				pause();
				setSlide(i);
			});
			th.addEventListener("keydown", (e) => {
				if (e.key === "ArrowRight") {
					e.preventDefault();
					setSlide((i + 1) % images.length);
					sliderThumbs.children[(i + 1) % images.length].focus();
				}
				if (e.key === "ArrowLeft") {
					e.preventDefault();
					setSlide((i - 1 + images.length) % images.length);
					sliderThumbs.children[(i - 1 + images.length) % images.length].focus();
				}
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					userInteracted = true;
					pause();
					setSlide(i);
				}
			});
			sliderThumbs.appendChild(th);
		});
		sliderTrack.style.transition = "transform .28s ease";
		setSlide(0, false);
		updateDownloadLink();
		preloadNeighbors();
	}

	function setSlide(i, smooth = true) {
		if (!images.length) return;
		const idx = (i + images.length) % images.length;
		currentIndex = Math.max(0, Math.min(images.length - 1, idx));
		if (!smooth) sliderTrack.style.transition = "none";
		sliderTrack.style.transform = `translateX(${-100 * currentIndex}%)`;
		if (!smooth) requestAnimationFrame(() => {
			sliderTrack.style.transition = "";
		});
		Array.from(sliderThumbs.children).forEach((th, idxTh) => {
			th.dataset.current = (idxTh === currentIndex) ? "true" : "false";
			th.setAttribute("aria-selected", idxTh === currentIndex ? "true" : "false");
			th.tabIndex = idxTh === currentIndex ? 0 : -1;
		});
		const currentThumb = sliderThumbs.children[currentIndex];
		if (currentThumb && currentThumb.scrollIntoView) {
			currentThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
		}
		updateDownloadLink();
		preloadNeighbors();
	}

	function nextSlide() { setSlide(currentIndex + 1); }
	function prevSlide() { setSlide(currentIndex - 1); }

	function preloadImage(url) {
		if (!url) return;
		const im = new Image();
		im.src = url;
	}

	function preloadNeighbors() {
		if (!images.length) return;
		preloadImage(images[(currentIndex + 1) % images.length]);
		preloadImage(images[(currentIndex - 1 + images.length) % images.length]);
	}

	function play() {
		if (isPlaying || !images.length) return;
		isPlaying = true;
		playBtn && (playBtn.textContent = "⏸");
		playInterval = setInterval(() => {
			if (!document.hasFocus() || overlay.getAttribute("aria-hidden") === "true") return;
			setSlide(currentIndex + 1);
		}, PLAY_DELAY);
	}

	function pause() {
		if (!isPlaying) return;
		isPlaying = false;
		playBtn && (playBtn.textContent = "▶");
		clearInterval(playInterval);
		playInterval = null;
	}

	function togglePlay() { if (isPlaying) pause(); else play(); }

	async function toggleFullscreen() {
		const host = sliderEl.closest(".auricartisan__sheet__media") || sliderEl;
		if (!document.fullscreenElement) {
			try {
				await host.requestFullscreen();
				zoomBtn && (zoomBtn.textContent = "⤡");
			} catch (err) {
				window.open(images[currentIndex], "_blank", "noopener");
			}
		} else {
			try {
				await document.exitFullscreen();
				zoomBtn && (zoomBtn.textContent = "⤢");
			} catch (err) {}
		}
	}

	function updateDownloadLink() {
		if (!downloadLink) return;
		const url = images[currentIndex] || "";
		downloadLink.href = url || "#";
		downloadLink.setAttribute("download", safeFilenameFromUrl(url));
		downloadLink.setAttribute("aria-label", url ? `Download image ${currentIndex+1}` : `Download`);
	}

	(() => {
		if (!sliderTrack) return;
		let startX = 0, dx = 0, isDown = false, startTime = 0;
		sliderTrack.addEventListener("pointerdown", e => {
			isDown = true;
			startX = e.clientX;
			dx = 0;
			startTime = Date.now();
			sliderTrack.setPointerCapture(e.pointerId);
			sliderTrack.style.transition = "none";
		});
		sliderTrack.addEventListener("pointermove", e => {
			if (!isDown) return;
			dx = e.clientX - startX;
			sliderTrack.style.transform = `translateX(${(-100 * currentIndex) + (dx/sliderTrack.clientWidth*100)}%)`;
		});
		sliderTrack.addEventListener("pointerup", e => {
			if (!isDown) return;
			isDown = false;
			sliderTrack.releasePointerCapture(e.pointerId);
			const elapsed = Date.now() - startTime;
			const velocity = dx / Math.max(elapsed, 1);
			const threshold = sliderTrack.clientWidth * 0.12;
			sliderTrack.style.transition = "";
			if (dx > threshold || velocity > 0.5) {
				prevSlide();
			} else if (dx < -threshold || velocity < -0.5) {
				nextSlide();
			} else setSlide(currentIndex);
			dx = 0;
		});
		sliderTrack.addEventListener("pointercancel", () => {
			isDown = false;
			setSlide(currentIndex);
		});
	})();

	$(`[data-nav="next"]`)?.addEventListener("click", () => {
		userInteracted = true;
		pause();
		nextSlide();
	});
	$(`[data-nav="prev"]`)?.addEventListener("click", () => {
		userInteracted = true;
		pause();
		prevSlide();
	});
	// Respect reduced motion: don’t auto-play unless user interacts
	const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
	const onSliderKeyDown = (e) => {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			userInteracted = true;
			pause();
			nextSlide();
		}
		if (e.key === "ArrowLeft") {
			e.preventDefault();
			userInteracted = true;
			pause();
			prevSlide();
		}
		if (e.key === " " || e.key === "Spacebar") {
			e.preventDefault();
			userInteracted = true;
			togglePlay();
		}
		if (e.key === "Home") {
			e.preventDefault();
			setSlide(0);
		}
		if (e.key === "End") {
			e.preventDefault();
			setSlide(images.length - 1);
		}
	};
	const onPointerEnter = () => { if (isPlaying) pause(); };
	const onPointerLeave = () => {
		if (!isPlaying && !userInteracted && !prefersReduced) play();
	};

	playBtn?.addEventListener("click", (e) => {
		e.preventDefault();
		userInteracted = true;
		togglePlay();
	});
	zoomBtn?.addEventListener("click", (e) => {
		e.preventDefault();
		toggleFullscreen();
	});

	function openSheetFromCard(card, trigger) {
		lastTrigger = trigger || card;
		const title = card.dataset.title || card.querySelector(".auricartisan__card__title")?.textContent?.trim() || "Item";
		const desc = card.dataset.desc || card.querySelector(".auricartisan__card__desc")?.textContent?.trim() || "";
		const price = card.dataset.price || card.querySelector(".auricartisan__price")?.textContent?.trim() || "";
		const imgs = (card.dataset.images || "").split(",").map(s => s.trim()).filter(Boolean);
		const platforms = parsePlatforms(card.dataset.platforms || "");
		titleEl.textContent = title;
		descEl.textContent = desc;
		priceEl.textContent = price;
		platformsEl.innerHTML = "";
		platforms.forEach(p => {
			const a = document.createElement("a");
			a.href = p.url || "#";
			a.target = "_blank";
			a.rel = "noopener noreferrer";
			a.textContent = p.name || p.url;
			platformsEl.appendChild(a);
		});
		const fallback = card.querySelector("img")?.src;
		mountImages(imgs.length ? imgs : (fallback ? [fallback] : []));
		overlay.dataset.open = "true";
		overlay.setAttribute("aria-hidden", "false");
		sheetClose.focus();
		document.addEventListener("keydown", onKey);
		overlay.addEventListener("click", onOverlayClick);
		sentinelStart.addEventListener("focus", trapToEnd);
		sentinelEnd.addEventListener("focus", trapToStart);
		sliderEl?.addEventListener("keydown", onSliderKeyDown);
		sliderEl?.addEventListener("pointerenter", onPointerEnter);
		sliderEl?.addEventListener("pointerleave", onPointerLeave);
		userInteracted = false;
		pause();
	}

	function closeSheet() {
		overlay.dataset.open = "false";
		overlay.setAttribute("aria-hidden", "true");
		pause();
		if (document.fullscreenElement) {
			document.exitFullscreen().catch(() => {});
		}
		document.removeEventListener("keydown", onKey);
		overlay.removeEventListener("click", onOverlayClick);
		sentinelStart.removeEventListener("focus", trapToEnd);
		sentinelEnd.removeEventListener("focus", trapToStart);
		sliderEl?.removeEventListener("keydown", onSliderKeyDown);
		sliderEl?.removeEventListener("pointerenter", onPointerEnter);
		sliderEl?.removeEventListener("pointerleave", onPointerLeave);
		if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
	}

	function onKey(e) {
		if (e.key === "Escape") closeSheet();
		if (e.key === "ArrowRight") {
			userInteracted = true;
			pause();
			nextSlide();
		}
		if (e.key === "ArrowLeft") {
			userInteracted = true;
			pause();
			prevSlide();
		}
	}

	function onOverlayClick(e) {
		const sheet = e.currentTarget.querySelector(".auricartisan__sheet");
		if (!sheet.contains(e.target) || e.target.id === "sheet-close") closeSheet();
	}

	function trapToEnd() { $("#sheet-close").focus(); }
	function trapToStart() { $("#sheet-close").focus(); }

	$("#sheet-close")?.addEventListener("click", closeSheet);
	cards.forEach(card => {
		card.addEventListener("click", e => {
			const isButton = e.target.closest('[data-action="open-sheet"]');
			if (isButton) return;
			openSheetFromCard(card, card);
		});
		const buy = card.querySelector('[data-action="open-sheet"]');
		if (buy) {
			buy.addEventListener("click", e => {
				e.preventDefault();
				e.stopPropagation();
				openSheetFromCard(card, buy);
			});
		}
	});
})();

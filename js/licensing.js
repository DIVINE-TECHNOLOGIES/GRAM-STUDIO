// ===== A11y dropdowns (updated selectors) =====
(function() {
	const menus = document.querySelectorAll('[data-menu]');
	let open;

	function setOpen(item, state) {
		if (open && open !== item) {
			open.setAttribute('aria-expanded', 'false');
			open.querySelector('.auricartisan__nav__btn').setAttribute('aria-expanded', 'false');
		}
		item.setAttribute('aria-expanded', state ? 'true' : 'false');
		item.querySelector('.auricartisan__nav__btn').setAttribute('aria-expanded', state ? 'true' : 'false');
		open = state ? item : null;
	}
	menus.forEach(item => {
		const btn = item.querySelector('.auricartisan__nav__btn');
		const panel = item.querySelector('.auricartisan__nav__menu');
		btn.addEventListener('click', () => {
			const next = item.getAttribute('aria-expanded') !== 'true';
			setOpen(item, next);
		});
		let hoverTimer;
		item.addEventListener('mouseenter', () => {
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => setOpen(item, true), 80);
		});
		item.addEventListener('mouseleave', () => {
			clearTimeout(hoverTimer);
			hoverTimer = setTimeout(() => setOpen(item, false), 120);
		});
		panel.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				setOpen(item, false);
				btn.focus();
			}
		});
	});
	document.addEventListener('click', e => {
		if (!open) return;
		if (!open.contains(e.target)) {
			open.setAttribute('aria-expanded', 'false');
			open = null;
		}
	});
	document.querySelectorAll('.auricartisan__nav__menu [data-filter-category]').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			const c = link.getAttribute('data-filter-category');
			filterBy(c, getSubFilter(c));
			document.querySelectorAll('.chip[data-category]').forEach(ch => ch.dataset.active = (ch.dataset.category === c) ? "true" : "false");
		});
	});
})();
// Catalog stubs (safe if grid absent)
const grid = document.getElementById('grid');
const cards = Array.from((grid && grid.children) || []);

function applyVisibility(card, show) {
	if (card) card.style.display = show ? "" : "none";
}

function getSubFilter(category) {
	const sel = document.querySelector('select[data-subcategory="' + category + '"]');
	return sel ? sel.value : "all";
}

function filterBy(category, sub) {
	cards.forEach(card => {
		const c = card.getAttribute('data-category');
		const s = card.getAttribute('data-subcategory');
		const passC = (category === 'all' || c === category);
		const passS = (sub === 'all' || s === sub);
		applyVisibility(card, passC && passS);
	});
}
// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
// Overlay logic
const overlay = document.getElementById('overlay');
const sheetClose = document.getElementById('sheet-close');
const sliderTrack = document.getElementById('slider-track');
const sliderThumbs = document.getElementById('slider-thumbs');
const titleEl = document.getElementById('sheet-title');
const descEl = document.getElementById('sheet-desc');
const priceEl = document.getElementById('sheet-price');
const platformsEl = document.getElementById('platforms');
const sentinelStart = document.getElementById('sentinel-start');
const sentinelEnd = document.getElementById('sentinel-end');
let currentIndex = 0,
	images = [],
	lastTrigger = null;

function parsePlatforms(s) {
	return s.split(';').map(p => p.trim()).filter(Boolean).map(pair => {
		const [n, u] = pair.split('|').map(x => x.trim());
		return {
			name: n,
			url: u
		};
	});
}

function mountImages(imgs) {
	images = imgs;
	sliderTrack.innerHTML = '';
	sliderThumbs.innerHTML = '';
	imgs.forEach((src, i) => {
		const item = document.createElement('div');
		item.className = 'auricartisan__slider__item';
		const img = document.createElement('img');
		img.loading = 'lazy';
		img.alt = titleEl.textContent + ' image ' + (i + 1);
		img.src = src;
		item.appendChild(img);
		sliderTrack.appendChild(item);
		const th = document.createElement('button');
		th.className = 'auricartisan__slider__thumb';
		th.type = 'button';
		th.setAttribute('aria-label', 'Go to image ' + (i + 1));
		th.innerHTML = `
																								<img src="${src}" alt="">`;
		th.addEventListener('click', () => setSlide(i));
		sliderThumbs.appendChild(th);
	});
	setSlide(0, false);
}

function setSlide(i, smooth = true) {
	currentIndex = Math.max(0, Math.min(images.length - 1, i));
	if (!smooth) sliderTrack.style.transition = 'none';
	sliderTrack.style.transform = `translateX(${-100*currentIndex}%)`;
	if (!smooth) requestAnimationFrame(() => {
		sliderTrack.style.transition = '';
	});
	Array.from(sliderThumbs.children).forEach((th, idx) => th.dataset.current = (idx === currentIndex) ? 'true' : 'false');
}

function nextSlide() {
	setSlide(currentIndex + 1);
}

function prevSlide() {
	setSlide(currentIndex - 1);
}
(function attachSwipe() {
	let startX = 0,
		dx = 0,
		isDown = false;
	if (!sliderTrack) return;
	sliderTrack.addEventListener('pointerdown', e => {
		isDown = true;
		startX = e.clientX;
		sliderTrack.setPointerCapture(e.pointerId);
	});
	sliderTrack.addEventListener('pointermove', e => {
		if (!isDown) return;
		dx = e.clientX - startX;
		sliderTrack.style.transition = 'none';
		sliderTrack.style.transform = `translateX(${(-100*currentIndex)+(dx/sliderTrack.clientWidth*100)}%)`;
	});
	sliderTrack.addEventListener('pointerup', e => {
		if (!isDown) return;
		isDown = false;
		sliderTrack.releasePointerCapture(e.pointerId);
		const threshold = sliderTrack.clientWidth * 0.12;
		if (dx > threshold) prevSlide();
		else if (dx < -threshold) nextSlide();
		else setSlide(currentIndex);
		dx = 0;
	});
	sliderTrack.addEventListener('pointercancel', () => {
		isDown = false;
		setSlide(currentIndex);
	});
})();
const nextBtn = document.querySelector('[data-nav="next"]');
const prevBtn = document.querySelector('[data-nav="prev"]');
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

function onKey(e) {
	if (e.key === 'Escape') closeSheet();
	if (e.key === 'ArrowRight') nextSlide();
	if (e.key === 'ArrowLeft') prevSlide();
}

function onOverlayClick(e) {
	const sheet = e.currentTarget.querySelector('.auricartisan__sheet');
	if (!sheet.contains(e.target) || e.target.id === 'sheet-close') closeSheet();
}

function trapToEnd() {
	document.getElementById('sheet-close').focus();
}

function trapToStart() {
	document.getElementById('sheet-close').focus();
}

function openSheetFromCard(card, trigger) {
	lastTrigger = trigger || card;
	const title = card.dataset.title || card.querySelector('.card__title')?.textContent?.trim() || 'Item';
	const desc = card.dataset.desc || card.querySelector('.card__desc')?.textContent?.trim() || '';
	const price = card.dataset.price || card.querySelector('.price')?.textContent?.trim() || '';
	const imgs = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
	const platforms = parsePlatforms(card.dataset.platforms || '');
	titleEl.textContent = title;
	descEl.textContent = desc;
	priceEl.textContent = price;
	platformsEl.innerHTML = '';
	platforms.forEach(p => {
		const a = document.createElement('a');
		a.href = p.url;
		a.target = '_blank';
		a.rel = 'noopener noreferrer';
		a.textContent = p.name;
		platformsEl.appendChild(a);
	});
	mountImages(imgs.length ? imgs : [card.querySelector('img')?.src]);
	overlay.dataset.open = 'true';
	overlay.setAttribute('aria-hidden', 'false');
	sheetClose.focus();
	document.addEventListener('keydown', onKey);
	overlay.addEventListener('click', onOverlayClick);
	sentinelStart.addEventListener('focus', trapToEnd);
	sentinelEnd.addEventListener('focus', trapToStart);
}

function closeSheet() {
	overlay.dataset.open = 'false';
	overlay.setAttribute('aria-hidden', 'true');
	document.removeEventListener('keydown', onKey);
	overlay.removeEventListener('click', onOverlayClick);
	sentinelStart.removeEventListener('focus', trapToEnd);
	sentinelEnd.removeEventListener('focus', trapToStart);
	if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
}
if (sheetClose) sheetClose.addEventListener('click', closeSheet);
Array.from(document.querySelectorAll('.card')).forEach(card => {
	card.addEventListener('click', e => {
		const isButton = e.target.closest('[data-action="open-sheet"]');
		if (isButton) return;
		openSheetFromCard(card, card);
	});
	const buy = card.querySelector('[data-action="open-sheet"]');
	if (buy) {
		buy.addEventListener('click', e => {
			e.preventDefault();
			e.stopPropagation();
			openSheetFromCard(card, buy);
		});
	}
});
// ===== License estimator (unchanged logic) =====
(function() {
	const cfg = {
		baseInr: {
			personal: 1200,
			commercial: 10000,
			extended: 30000
		},
		floorsInr: {
			personal: 999,
			commercial: 7500,
			extended: 25000
		},
		territory: {
			single_region: 1.0,
			multi_region: 1.6,
			global: 2.4
		},
		term: {
			'1y': 1.0,
			'2y': 1.6,
			'3y': 2.1,
			'buyout': 3.0
		},
		media: {
			web_social: 1.0,
			paid_ads: 1.6,
			print_packaging: 2.0,
			app_software: 1.8,
			merch: 2.4
		},
		impressions: {
			'1m': 1.0,
			'10m': 1.5,
			'50m': 2.2,
			'unlimited': 3.0
		},
		exclusivity: {
			none: 1.0,
			category: 1.6,
			territory: 1.9,
			full: 3.0
		}
	};
	const fx = {
		base: 'INR',
		rates: {
			INR: 1,
			USD: 1 / 84,
			EUR: 1 / 90
		},
		symbols: {
			INR: '₹',
			USD: '$',
			EUR: '€'
		},
		locales: {
			INR: 'en-IN',
			USD: 'en-US',
			EUR: 'en-IE'
		},
		roundTo: {
			INR: 100,
			USD: 1,
			EUR: 1
		}
	};
	const el = id => document.getElementById(id);
	const tier = el('tier'),
		territory = el('territory'),
		term = el('term'),
		media = el('media'),
		impressions = el('impressions'),
		exclusivity = el('exclusivity'),
		total = el('q-total'),
		breakEl = el('q-break'),
		email = el('q-email'),
		workref = el('workref'),
		currency = el('currency'),
		qLabel = el('q-label');

	function clampMin(v, m) {
		return Math.max(v, m);
	}

	function round(v, unit) {
		return Math.round(v / unit) * unit;
	}

	function fmt(amount, cur) {
		return fx.symbols[cur] + amount.toLocaleString(fx.locales[cur], {
			maximumFractionDigits: 0
		});
	}

	function estimate() {
		const t = tier.value;
		const cur = currency.value;
		const parts = [
			['base', cfg.baseInr[t]],
			['territory', cfg.territory[territory.value]],
			['term', cfg.term[term.value]],
			['media', cfg.media[media.value]],
			['impressions', cfg.impressions[impressions.value]],
			['exclusivity', cfg.exclusivity[exclusivity.value]]
		];
		let priceInr = parts.reduce((acc, p, idx) => idx === 0 ? p[1] : acc * p[1], 0);
		priceInr = clampMin(priceInr, cfg.floorsInr[t]);
		const priceCurRaw = priceInr * fx.rates[cur];
		const priceCur = round(priceCurRaw, fx.roundTo[cur]);
		const mapName = {
			base: 'Base',
			territory: 'Territory',
			term: 'Term',
			media: 'Media',
			impressions: 'Impressions',
			exclusivity: 'Exclusivity'
		};
		const breakdown = parts.map(([k, v]) => {
			if (k === 'base') {
				const baseCur = round(v * fx.rates[cur], fx.roundTo[cur]);
				return `${mapName[k]}×${fmt(baseCur, cur)}`;
			}
			return `${mapName[k]}×${v.toFixed(2)}`;
		}).join(' · ');
		qLabel.textContent = `Estimate (${cur})`;
		total.textContent = fmt(priceCur, cur);
		breakEl.textContent = breakdown;
		const subject = encodeURIComponent(`[Licensing] ${t} — ${workref.value || 'Artwork ref pending'}`);
		const body = encodeURIComponent(`Tier: ${t}
Territory: ${territory.value}
Term: ${term.value}
Media: ${media.value}
Impressions: ${impressions.value}
Exclusivity: ${exclusivity.value}
Currency: ${cur}
Artwork: ${workref.value || '(add link or ID)'}
Estimate: ${fmt(priceCur, cur)}

Notes: Please confirm conflicts, timelines, and exact placements.`);
		email.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
	}
	['change', 'input'].forEach(evt => {
		tier.addEventListener(evt, estimate);
		territory.addEventListener(evt, estimate);
		term.addEventListener(evt, estimate);
		media.addEventListener(evt, estimate);
		impressions.addEventListener(evt, estimate);
		exclusivity.addEventListener(evt, estimate);
		workref.addEventListener(evt, estimate);
		currency.addEventListener(evt, estimate);
	});
	estimate();
})();
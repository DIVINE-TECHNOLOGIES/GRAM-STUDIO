// ===== A11y dropdowns (unchanged logic, class names updated) =====
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
	// category shortcuts (if any)
	document.querySelectorAll('.auricartisan__nav__menu [data-filter-category]').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			const c = link.getAttribute('data-filter-category');
			filterBy(c, getSubFilter(c));
			document.querySelectorAll('.chip[data-category]').forEach(ch => ch.dataset.active = (ch.dataset.category === c) ? "true" : "false");
			document.getElementById('collections')?.scrollIntoView({
				behavior: 'smooth'
			});
		});
	});
})();
// ===== Catalog filtering stubs (safe if grid absent) =====
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
// ===== Product Sheet logic (improved for lazy placeholders). Updated selectors only =====
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
		const [name, url] = pair.split('|').map(x => x.trim());
		return {
			name,
			url
		};
	});
}

function resolveSrc(srcOrEl) {
	if (!srcOrEl) return '';
	if (typeof srcOrEl === 'string') return srcOrEl.trim();
	const el = srcOrEl;
	return el.dataset?.src || el.getAttribute('data-src') || el.dataset?.lazy || el.getAttribute('data-lazy') || el.src || '';
}

function assignSrcNonBlocking(imgEl, src) {
	if (!src) return;
	imgEl.decoding = 'async';
	imgEl.loading = imgEl.loading || 'lazy';
	if ('requestIdleCallback' in window) {
		requestIdleCallback(() => {
			imgEl.src = src;
		});
	} else {
		setTimeout(() => {
			imgEl.src = src;
		}, 50);
	}
}

function mountImages(imgs) {
	images = imgs.map(i => (typeof i === 'string' ? i.trim() : i)).filter(Boolean);
	sliderTrack.innerHTML = '';
	sliderThumbs.innerHTML = '';
	images.forEach((src, i) => {
		const item = document.createElement('div');
		item.className = 'auricartisan__slider__item';
		const img = document.createElement('img');
		img.alt = (titleEl.textContent || 'Image') + ' image ' + (i + 1);
		img.loading = 'lazy';
		img.decoding = 'async';
		assignSrcNonBlocking(img, src);
		item.appendChild(img);
		sliderTrack.appendChild(item);
		const th = document.createElement('button');
		th.className = 'auricartisan__slider__thumb';
		th.type = 'button';
		th.setAttribute('aria-label', 'Go to image ' + (i + 1));
		const thImg = document.createElement('img');
		thImg.alt = titleEl.textContent + ' thumb ' + (i + 1);
		thImg.loading = 'lazy';
		assignSrcNonBlocking(thImg, src);
		th.appendChild(thImg);
		th.addEventListener('click', () => setSlide(i));
		sliderThumbs.appendChild(th);
		img.addEventListener('load', () => img.classList.add('loaded'));
		img.addEventListener('error', () => img.classList.add('error'));
	});
	if (images.length === 0) {
		sliderTrack.innerHTML = ' < div class = "auricartisan__slider__item" > < div style = "display:grid;place-items:center;height:100%;color:var(--muted);padding:24px" > No preview available < /div> < /div>';
		sliderThumbs.innerHTML = '';
	}
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
		try {
			sliderTrack.setPointerCapture(e.pointerId);
		} catch (e) {}
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
		try {
			sliderTrack.releasePointerCapture(e.pointerId);
		} catch (e) {}
		const threshold = (sliderTrack.clientWidth || 1) * 0.12;
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

function openSheetFromCard(card, trigger) {
	lastTrigger = trigger || card;
	const title = card.dataset.title || card.querySelector('.auricartisan__card__title')?.textContent?.trim() || 'Item';
	const desc = card.dataset.desc || card.querySelector('.auricartisan__card__desc')?.textContent?.trim() || '';
	const price = card.dataset.price || card.querySelector('.price')?.textContent?.trim() || '';
	const imgsFromData = (card.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
	let imgs = imgsFromData;
	if (imgs.length === 0) {
		const firstImg = card.querySelector('img');
		const resolved = resolveSrc(firstImg);
		if (resolved) imgs = [resolved];
	}
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
	mountImages(imgs);
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
if (sheetClose) sheetClose.addEventListener('click', closeSheet);
// Attach sheet open to cards (optional)
Array.from(document.querySelectorAll('.auricartisan__card')).forEach(card => {
	card.addEventListener('click', e => {
		const isButton = e.target.closest('a.auricartisan__btn'); // allow primary link navigation
		if (isButton) return;
		openSheetFromCard(card, card);
	});
});
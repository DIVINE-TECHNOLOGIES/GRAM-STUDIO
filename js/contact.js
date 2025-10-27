// ===== A11y dropdowns (updated selectors) =====
(function() {
	const menus = document.querySelectorAll('[data-menu]');
	let open;

	function setOpen(item, state) {
		if (open && open !== item) {
			open.setAttribute('aria-expanded', 'false');
			open.querySelector('.gram__nav__btn').setAttribute('aria-expanded', 'false');
		}
		item.setAttribute('aria-expanded', state ? 'true' : 'false');
		item.querySelector('.gram__nav__btn').setAttribute('aria-expanded', state ? 'true' : 'false');
		open = state ? item : null;
	}
	menus.forEach(item => {
		const btn = item.querySelector('.gram__nav__btn');
		const panel = item.querySelector('.gram__nav__menu');
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
	document.querySelectorAll('.gram__nav__menu [data-filter-category]').forEach(link => {
		link.addEventListener('click', e => {
			e.preventDefault();
			const c = link.getAttribute('data-filter-category');
			filterBy(c, getSubFilter(c));
			document.querySelectorAll('.gram__chip[data-category]').forEach(ch => ch.dataset.active = (ch.dataset.category === c) ? "true" : "false");
		});
	});
})();
// ===== Catalog filtering stubs (unchanged; grid may be absent) =====
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
document.querySelectorAll('.gram__chip[data-category]').forEach(chip => {
	chip.addEventListener('click', () => {
		const cat = chip.getAttribute('data-category');
		document.querySelectorAll('.gram__chip[data-category]').forEach(c => c.dataset.active = "false");
		chip.dataset.active = "true";
		const sub = cat === 'all' ? 'all' : getSubFilter(cat);
		filterBy(cat, sub);
	});
});
document.querySelectorAll('select[data-subcategory]').forEach(sel => {
	sel.addEventListener('change', () => {
		const cat = sel.getAttribute('data-subcategory');
		document.querySelectorAll('.gram__chip[data-category]').forEach(c => c.dataset.active = (c.dataset.category === cat) ? "true" : "false");
		filterBy(cat, sel.value);
	});
});
// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
// ===== Product Sheet logic (updated selectors where classes renamed) =====
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
let currentIndex = 0;
let images = [];
let lastTrigger = null;

function parsePlatforms(s) {
	return s.split(';').map(p => p.trim()).filter(Boolean).map(pair => {
		const [name, url] = pair.split('|').map(x => x.trim());
		return {
			name,
			url
		};
	});
}

function mountImages(imgs) {
	images = imgs;
	sliderTrack.innerHTML = '';
	sliderThumbs.innerHTML = '';
	imgs.forEach((src, i) => {
		const item = document.createElement('div');
		item.className = 'gram__slider__item';
		const img = document.createElement('img');
		img.loading = 'lazy';
		img.alt = titleEl.textContent + ' image ' + (i + 1);
		img.src = src;
		item.appendChild(img);
		sliderTrack.appendChild(item);
		const th = document.createElement('button');
		th.className = 'gram__slider__thumb';
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

function openSheetFromCard(card, trigger) {
	lastTrigger = trigger || card;
	const title = card.dataset.title || card.querySelector('.gram__card__title')?.textContent?.trim() || 'Item';
	const desc = card.dataset.desc || card.querySelector('.gram__card__desc')?.textContent?.trim() || '';
	const price = card.dataset.price || card.querySelector('.gram__price')?.textContent?.trim() || '';
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

function onKey(e) {
	if (e.key === 'Escape') closeSheet();
	if (e.key === 'ArrowRight') nextSlide();
	if (e.key === 'ArrowLeft') prevSlide();
}

function onOverlayClick(e) {
	const sheet = e.currentTarget.querySelector('.gram__sheet');
	if (!sheet.contains(e.target) || e.target.id === 'sheet-close') closeSheet();
}

function trapToEnd() {
	document.getElementById('sheet-close').focus();
}

function trapToStart() {
	document.getElementById('sheet-close').focus();
}
if (sheetClose) sheetClose.addEventListener('click', closeSheet);
Array.from(document.querySelectorAll('.gram__card')).forEach(card => {
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
// ===== Contact form logic (minimal, robust) =====
(function() {
	const form = document.getElementById('contact-form');
	if (!form) return;
	const success = document.getElementById('form-success');
	const notice = document.getElementById('form-notice');
	const sendBtn = document.getElementById('send-btn');
	const nameEl = document.getElementById('name');
	const emailEl = document.getElementById('email');
	const topicEl = document.getElementById('topic');
	const msgEl = document.getElementById('message');
	const hp = document.getElementById('contact_website');
	const chars = document.getElementById('chars');
	const errName = document.getElementById('err-name');
	const errEmail = document.getElementById('err-email');
	const errTopic = document.getElementById('err-topic');
	const errMsg = document.getElementById('err-message');

	function emailValid(v) {
		// simple but strict enough
		return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
	}

	function setError(el, msg, errEl) {
		if (msg) {
			errEl.textContent = msg;
			el.setAttribute('aria-invalid', 'true');
		} else {
			errEl.textContent = '';
			el.removeAttribute('aria-invalid');
		}
	}

	function validate() {
		let ok = true;
		setError(nameEl, nameEl.value.trim() ? '' : 'Please enter your name.', errName);
		ok = ok && !!nameEl.value.trim();
		const e = emailEl.value.trim();
		setError(emailEl, e ? (emailValid(e) ? '' : 'Enter a valid email.') : 'Email is required.', errEmail);
		ok = ok && e && emailValid(e);
		setError(topicEl, topicEl.value ? '' : 'Pick a topic.', errTopic);
		ok = ok && !!topicEl.value;
		setError(msgEl, msgEl.value.trim() ? '' : 'Tell me what this is about.', errMsg);
		ok = ok && !!msgEl.value.trim();
		return ok;
	}
	msgEl.addEventListener('input', () => {
		chars.textContent = msgEl.value.length.toString();
	});
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		notice.textContent = '';
		success.style.display = 'none';
		if (hp.value) {
			notice.textContent = 'Something went wrong.';
			return;
		} // bot
		if (!validate()) return;
		sendBtn.disabled = true;
		sendBtn.style.opacity = '.7';
		const payload = {
			name: nameEl.value.trim(),
			email: emailEl.value.trim(),
			topic: topicEl.value,
			reference: document.getElementById('order').value.trim(),
			message: msgEl.value.trim(),
			tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
			ua: navigator.userAgent
		};
		try {
			// Try JSON POST to your backend
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			if (res.ok) {
				form.reset();
				chars.textContent = '0';
				success.style.display = 'block';
				notice.textContent = '';
			} else {
				throw new Error('Server rejected');
			}
		} catch (_) {
			// Fallback to mailto with encoded body
			const subject = encodeURIComponent('[Contact] ' + payload.topic + (payload.reference ? ' — ' + payload.reference : ''));
			const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\nTopic: ${payload.topic}\nReference: ${payload.reference}\n\n${payload.message}\n\n— Sent ${new Date().toISOString()} (${payload.tz})`);
			window.location.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
			notice.textContent = 'Opening your email app…';
		} finally {
			sendBtn.disabled = false;
			sendBtn.style.opacity = '';
		}
	});
})();
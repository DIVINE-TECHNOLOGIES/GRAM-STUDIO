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
		if (panel) {
			panel.addEventListener('keydown', e => {
				if (e.key === 'Escape') {
					setOpen(item, false);
					btn.focus();
				}
			});
		}
	});
	document.addEventListener('click', e => {
		if (!open) return;
		if (!open.contains(e.target)) {
			open.setAttribute('aria-expanded', 'false');
			open = null;
		}
	});
})();
// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
// ===== Copy-to-clipboard for palette =====
(function() {
	function copy(txt) {
		navigator.clipboard?.writeText(txt).then(() => {}).catch(() => {});
	}
	document.querySelectorAll('[data-copy]').forEach(btn => {
		btn.addEventListener('click', () => {
			const hex = btn.getAttribute('data-copy');
			copy(hex);
			const prev = btn.textContent;
			btn.textContent = 'Copied';
			setTimeout(() => btn.textContent = prev, 900);
		});
	});
})();
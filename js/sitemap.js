// ===== Dropdown menus (updated selectors)
(function() {
	const menus = document.querySelectorAll('[data-menu]');
	let open;

	function setOpen(item, state) {
		if (open && open !== item) {
			open.setAttribute('aria-expanded', 'false');
			const btn = open.querySelector('.auricartisan__nav__btn');
			if (btn) btn.setAttribute('aria-expanded', 'false');
		}
		item.setAttribute('aria-expanded', state ? 'true' : 'false');
		const btn = item.querySelector('.auricartisan__nav__btn');
		if (btn) btn.setAttribute('aria-expanded', state ? 'true' : 'false');
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
					if (btn) btn.focus();
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
// ===== Filter + Last-Modified labels (updated selectors)
(function() {
	const filter = document.getElementById('filter');
	const grid = document.getElementById('sitemap-grid');
	// Simple client-side "last modified" map
	const updated = {
		"/": "2025-10-05",
		"/faq": "2025-10-12",
		"/licensing": "2025-10-12",
		"/contact": "2025-10-10",
		"/commissions": "2025-10-14",
		"/newsletter": "2025-10-15",
		"/media-kit": "2025-10-16",
		"/sitemap": "2025-10-19",
		"/gallery/prints": "2025-10-08",
		"/gallery/wallpapers": "2025-10-08",
		"/gallery/accessories": "2025-10-08",
		"/terms": "2025-10-09",
		"/shipping": "2025-10-09",
		"/privacy": "2025-10-09",
		"/about": "2025-10-01",
		"/press": "2025-10-02"
	};
	// decorate date labels
	document.querySelectorAll('[data-date]').forEach(span => {
		const key = span.getAttribute('data-date');
		const d = updated[key];
		if (d) {
			const dt = new Date(d + "T00:00:00");
			const nice = dt.toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'short',
				day: '2-digit'
			});
			span.textContent = "• updated " + nice;
		}
	});
	// basic filter
	function applyFilter(q) {
		const term = q.trim().toLowerCase();
		grid.querySelectorAll('.auricartisan__col').forEach(col => {
			let any = false;
			col.querySelectorAll('a').forEach(a => {
				const hit = a.textContent.toLowerCase().includes(term) || a.getAttribute('href').toLowerCase().includes(term);
				a.parentElement.style.display = hit ? "" : "none";
				any = any || hit;
			});
			col.style.display = any || term === "" ? "" : "none";
		});
	}
	filter?.addEventListener('input', e => applyFilter(e.target.value));
})();
// ===== A11y dropdowns (updated class selectors) =====
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
})();
// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
// ===== Commission form logic =====
(function() {
	const form = document.getElementById('commission-form');
	if (!form) return;
	const success = document.getElementById('form-success');
	const notice = document.getElementById('form-notice');
	const sendBtn = document.getElementById('submit-btn');
	const mailBtn = document.getElementById('mailto-btn');
	const hp = document.getElementById('website');
	const nameEl = document.getElementById('name');
	const emailEl = document.getElementById('email');
	const projEl = document.getElementById('project');
	const useEl = document.getElementById('usage');
	const sizeEl = document.getElementById('size');
	const dateEl = document.getElementById('deadline');
	const budEl = document.getElementById('budget');
	const exEl = document.getElementById('exclusivity');
	const refsEl = document.getElementById('refs');
	const briefEl = document.getElementById('brief');
	const chars = document.getElementById('chars');
	const err = {
		name: document.getElementById('err-name'),
		email: document.getElementById('err-email'),
		project: document.getElementById('err-project'),
		usage: document.getElementById('err-usage'),
		budget: document.getElementById('err-budget'),
		brief: document.getElementById('err-brief'),
	};
	// Estimator elements
	const qTotal = document.getElementById('q-total');
	const qBreak = document.getElementById('q-break');
	// Simple validators
	function emailValid(v) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
	}

	function setError(el, msg, slot) {
		if (msg) {
			slot.textContent = msg;
			el.setAttribute('aria-invalid', 'true');
		} else {
			slot.textContent = '';
			el.removeAttribute('aria-invalid');
		}
	}
	// Estimator config (digital-only usage) — prices dropped by 3x; show INR + USD + EUR
	const cfg = {
		baseByProject: {
			'Editorial Illustration (Digital)': 11667,
			'Key Art / Poster (Digital)': 20000,
			'Brand Artwork (Digital)': 30000,
			'Marketing Graphics (Web/Social)': 15000,
			'App/Website Illustrations': 25000,
			'Icon Set / UI Assets': 21667,
			'Digital Wallpaper Set': 10000,
			'Other': 13333
		},
		usage: {
			web_social: 1.0,
			paid_ads: 1.5,
			website: 1.2,
			app: 1.6,
			internal: 0.9
		},
		exclusivity: {
			none: 1.0,
			category: 1.6,
			territory: 1.9,
			full: 3.0
		},
		rushDays: 7,
		rushFactor: 1.35,
		floor: 8333,
		roundTo: 100,
		rates: {
			USD: 0.012,
			EUR: 0.011
		}
	};

	function round(v, u) {
		return Math.round(v / u) * u;
	}

	function parseDeadlineFactor() {
		const d = dateEl.value ? new Date(dateEl.value) : null;
		if (!d) return 1;
		const now = new Date();
		const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
		return diffDays > 0 && diffDays <= cfg.rushDays ? cfg.rushFactor : 1;
	}

	function formatCurrINR(v) {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: 'INR',
			maximumFractionDigits: 0
		}).format(v);
	}

	function formatCurr(v, code) {
		return new Intl.NumberFormat(code === 'USD' ? 'en-US' : 'de-DE', {
			style: 'currency',
			currency: code,
			maximumFractionDigits: 0
		}).format(v);
	}

	function estimate() {
		const p = projEl.value || 'Other';
		const base = cfg.baseByProject[p] || cfg.baseByProject['Other'];
		const uKey = useEl.value || 'web_social';
		const eKey = (exEl.value || 'none');
		const uF = cfg.usage[uKey] || 1;
		const eF = cfg.exclusivity[eKey] || 1;
		const rF = parseDeadlineFactor();
		const bud = Number(budEl.value || 0);
		const budgetInfluence = bud ? Math.max(0.9, Math.min(1.15, (bud / Math.max(base, cfg.floor)))) : 1;
		let price = base * uF * eF * rF * budgetInfluence;
		price = Math.max(price, cfg.floor);
		price = round(price, cfg.roundTo);
		const inrVal = price;
		const usdVal = Math.round(inrVal * cfg.rates.USD);
		const eurVal = Math.round(inrVal * cfg.rates.EUR);
		const inrFmt = formatCurrINR(inrVal);
		const usdFmt = formatCurr(usdVal, 'USD');
		const eurFmt = formatCurr(eurVal, 'EUR');
		qTotal.textContent = `${inrFmt} (${usdFmt} · ${eurFmt})`;
		const map = {
			'Editorial Illustration (Digital)': 'Editorial (Digital)',
			'Key Art / Poster (Digital)': 'Key Art (Digital)',
			'Brand Artwork (Digital)': 'Brand Artwork',
			'Marketing Graphics (Web/Social)': 'Marketing Graphics',
			'App/Website Illustrations': 'App/Website Illo',
			'Icon Set / UI Assets': 'Icon/UI Assets',
			'Digital Wallpaper Set': 'Wallpaper Set',
			'Other': 'Other'
		};
		qBreak.textContent = [`Base(${map[p]}) ₹${(base).toLocaleString('en-IN')}`, `Usage×${uF.toFixed(2)}`, `Excl×${eF.toFixed(2)}`,
			rF > 1 ? `Rush×${rF.toFixed(2)}` : null,
			bud ? `Budget factor×${budgetInfluence.toFixed(2)}` : null
		].filter(Boolean).join(' · ');
		const subject = encodeURIComponent(`[Commission] ${p} — ${sizeEl.value||'size TBD'}`);
		const usageText = useEl.options[useEl.selectedIndex]?.text || uKey;
		const budgetText = budEl.options[budEl.selectedIndex]?.text || '(not set)';
		const body = encodeURIComponent(`Name: ${nameEl.value}
Email: ${emailEl.value}
Project: ${p}
Usage: ${usageText}
Size/Format: ${sizeEl.value}
Deadline: ${dateEl.value||'(flexible)'}
Budget: ${budgetText}
Exclusivity: ${exEl.value}
References: ${refsEl.value}

Brief:
${briefEl.value}

Estimate:
INR ${inrFmt}
USD ${usdFmt}
EUR ${eurFmt}

— Sent ${new Date().toISOString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC'})`);
		mailBtn.href = `mailto:hello@example.com?subject=${subject}&body=${body}`;
	}
	// Live char count + estimate refresh
	briefEl.addEventListener('input', () => {
		chars.textContent = String(briefEl.value.length);
	});
	['change', 'input'].forEach(evt => {
		projEl.addEventListener(evt, estimate);
		useEl.addEventListener(evt, estimate);
		dateEl.addEventListener(evt, estimate);
		budEl.addEventListener(evt, estimate);
		exEl.addEventListener(evt, estimate);
		sizeEl.addEventListener(evt, estimate);
		refsEl.addEventListener(evt, estimate);
		nameEl.addEventListener(evt, estimate);
		emailEl.addEventListener(evt, estimate);
		briefEl.addEventListener(evt, estimate);
	});
	estimate();
	// Persist draft locally
	const fields = [nameEl, emailEl, projEl, useEl, sizeEl, dateEl, budEl, exEl, refsEl, briefEl];
	const KEY = 'commission.draft.v1';
	try {
		const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
		fields.forEach(f => {
			if (saved[f.id]) f.value = saved[f.id];
		});
		estimate();
	} catch (_) {}

	function persist() {
		try {
			const obj = {};
			fields.forEach(f => obj[f.id] = f.value);
			localStorage.setItem(KEY, JSON.stringify(obj));
		} catch (_) {}
	}
	fields.forEach(f => f.addEventListener('input', persist));
	// Validation
	function validate() {
		let ok = true;
		setError(nameEl, nameEl.value.trim() ? '' : 'Please enter your name.', err.name);
		ok = ok && !!nameEl.value.trim();
		const e = emailEl.value.trim();
		setError(emailEl, e ? (emailValid(e) ? '' : 'Enter a valid email.') : 'Email is required.', err.email);
		ok = ok && e && emailValid(e);
		setError(projEl, projEl.value ? '' : 'Pick a project type.', err.project);
		ok = ok && !!projEl.value;
		setError(useEl, useEl.value ? '' : 'Select intended usage.', err.usage);
		ok = ok && !!useEl.value;
		setError(budEl, budEl.value ? '' : 'Select a budget range.', err.budget);
		ok = ok && !!budEl.value;
		setError(briefEl, briefEl.value.trim() ? '' : 'Describe the idea and required deliverables.', err.brief);
		ok = ok && !!briefEl.value.trim();
		return ok;
	}
	// Submit
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
			project: projEl.value,
			usage: useEl.value,
			size: sizeEl.value.trim(),
			deadline: dateEl.value,
			budget: budEl.value,
			exclusivity: exEl.value,
			refs: refsEl.value.trim(),
			brief: briefEl.value.trim(),
			tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
			ua: navigator.userAgent
		};
		try {
			const res = await fetch('/api/commission', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			if (res.ok) {
				success.style.display = 'block';
				form.reset();
				chars.textContent = '0';
				localStorage.removeItem(KEY);
				estimate();
			} else {
				throw new Error('Server rejected');
			}
		} catch (_) {
			// Fallback to email
			notice.textContent = 'Opening your email app…';
			document.getElementById('mailto-btn').click();
		} finally {
			sendBtn.disabled = false;
			sendBtn.style.opacity = '';
		}
	});
})();
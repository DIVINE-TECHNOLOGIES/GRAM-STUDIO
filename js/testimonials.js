// ===== Dropdown menus (unchanged logic; updated selectors)
(function() {
	const menus = document.querySelectorAll('[data-menu]');
	let open;

	function setOpen(item, state) {
		if (open && open !== item) {
			open.setAttribute('aria-expanded', 'false');
			const prevBtn = open.querySelector('.auricartisan__nav__btn');
			if (prevBtn) prevBtn.setAttribute('aria-expanded', 'false');
		}
		item.setAttribute('aria-expanded', state ? 'true' : 'false');
		const btn = item.querySelector('.auricartisan__nav__btn');
		if (btn) btn.setAttribute('aria-expanded', state ? 'true' : 'false');
		open = state ? item : null;
	}
	menus.forEach(item => {
		const btn = item.querySelector('.auricartisan__nav__btn');
		const panel = item.querySelector('.auricartisan__nav__menu');
		if (btn) btn.addEventListener('click', () => {
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
		if (panel) panel.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				setOpen(item, false);
				if (btn) btn.focus();
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
// ===== Reviews data (unchanged) =====
const REVIEWS = [{
	id: 1,
	product: 'prints',
	rating: 5,
	title: 'Gilded and gorgeous',
	text: 'The gold accents catch light like real foil. Framed print looks premium without being loud.',
	name: 'Rhea M.',
	date: '2025-09-02',
	verified: true
}, {
	id: 2,
	product: 'wallpapers',
	rating: 5,
	title: 'Phone feels new',
	text: 'Subtle texture, crisp edges, no banding. The dark variant saves battery on OLED.',
	name: 'Dev K.',
	date: '2025-08-18',
	verified: true
}, {
	id: 3,
	product: 'accessories',
	rating: 4,
	title: 'Tote with personality',
	text: 'Heavy canvas and the print holds up. Wish the inner pocket was bigger.',
	name: 'Sana I.',
	date: '2025-07-11',
	verified: true
}, {
	id: 4,
	product: 'prints',
	rating: 5,
	title: 'Statement piece',
	text: 'Guests ask about it every time. Color accuracy matched the listing previews.',
	name: 'Arjun S.',
	date: '2025-06-28',
	verified: true
}, {
	id: 5,
	product: 'wallpapers',
	rating: 4,
	title: 'Clean gradients',
	text: 'Looks sharp on iPhone and Pixel. Would love a 4K desktop set too.',
	name: 'Meera P.',
	date: '2025-06-02',
	verified: true
}, {
	id: 6,
	product: 'accessories',
	rating: 5,
	title: 'Case that doesn’t yellow',
	text: 'Six weeks in, still clear. The gold motif is subtle and elegant.',
	name: 'Joel T.',
	date: '2025-05-14',
	verified: true
}, {
	id: 7,
	product: 'prints',
	rating: 5,
	title: 'Museum vibes',
	text: 'Paper stock is thick. Packaging survived a monsoon delivery. Respect.',
	name: 'Nikhil V.',
	date: '2025-04-09',
	verified: true,
	studio: true
}, {
	id: 8,
	product: 'wallpapers',
	rating: 5,
	title: 'Daily driver',
	text: 'Balanced composition and icons remain readable. Chef’s kiss.',
	name: 'Ananya C.',
	date: '2025-03-19',
	verified: true
}, {
	id: 9,
	product: 'accessories',
	rating: 4,
	title: 'Giftable',
	text: 'Came with a neat thank-you card. Fast shipping.',
	name: 'Priya L.',
	date: '2025-02-22',
	verified: true
}, {
	id: 10,
	product: 'prints',
	rating: 3,
	title: 'Nice, but frame needed',
	text: 'The print is lovely but I had to buy a separate frame — still happy with the buy.',
	name: 'Rahul D.',
	date: '2024-12-05',
	verified: true
}, {
	id: 11,
	product: 'wallpapers',
	rating: 5,
	title: 'Refreshing palette',
	text: 'Colors are vibrant without being harsh; has become my daily lock-screen.',
	name: 'Kavya R.',
	date: '2024-10-21',
	verified: true
}, {
	id: 12,
	product: 'accessories',
	rating: 5,
	title: 'Sturdy and stylish',
	text: 'The strap stitching feels robust and the print hasn’t faded after multiple washes.',
	name: 'Amit S.',
	date: '2024-08-15',
	verified: true
}, {
	id: 13,
	product: 'prints',
	rating: 4,
	title: 'Almost perfect',
	text: 'Minor alignment issue on one corner, but overall beautiful and worth it.',
	name: 'Leena M.',
	date: '2024-06-01',
	verified: true
}, {
	id: 14,
	product: 'wallpapers',
	rating: 2,
	title: 'Not my taste',
	text: 'Composition felt too busy on smaller screens. Works better on tablets.',
	name: 'Samir P.',
	date: '2024-03-09',
	verified: true
}, {
	id: 15,
	product: 'accessories',
	rating: 3,
	title: 'Okay for the price',
	text: 'Good for casual use but hardware could be higher quality.',
	name: 'Isha K.',
	date: '2023-11-30',
	verified: true
}, {
	id: 16,
	product: 'prints',
	rating: 5,
	title: 'Exquisite detail',
	text: 'Close-up reveals incredible texture; looks like an original at first glance.',
	name: 'Vikram H.',
	date: '2023-09-12',
	verified: true,
	studio: true
}, {
	id: 17,
	product: 'wallpapers',
	rating: 4,
	title: 'Great selection',
	text: 'Loved the seasonal packs. Hoping for more pastel options next release.',
	name: 'Tara N.',
	date: '2023-06-20',
	verified: true
}, {
	id: 18,
	product: 'accessories',
	rating: 5,
	title: 'Perfect gifting option',
	text: 'Bought three as presents — recipients were thrilled. Nicely packaged.',
	name: 'Prateek G.',
	date: '2023-02-14',
	verified: true
}, {
	id: 19,
	product: 'prints',
	rating: 5,
	title: 'Beyond the mockup',
	text: 'I received the archival print and the texture matches the seller photos exactly. Signed on the back and the certificate of authenticity was included. Hung it in my study — it anchors the room.',
	name: 'Maya J.',
	date: '2025-10-12',
	verified: true,
	studio: true
}, {
	id: 20,
	product: 'wallpapers',
	rating: 5,
	title: 'Perfect contrast for readability',
	text: 'Installed both light and dark variants, and my widgets remain legible. The file sizes were optimized and downloaded instantly.',
	name: 'Rohit B.',
	date: '2025-10-05',
	verified: true
}, {
	id: 21,
	product: 'accessories',
	rating: 4,
	title: 'Nice quality but metal ring squeaks',
	text: 'Overall sturdy; zipper glide is smooth. One minor nit: the D-ring has a faint squeak when it rubs against the strap.',
	name: 'Leah S.',
	date: '2025-09-29',
	verified: true
}, {
	id: 22,
	product: 'prints',
	rating: 5,
	title: 'Color fidelity on point',
	text: 'Matched my calibrated screen perfectly. Frame recommendations from customer support were helpful.',
	name: 'Ojas P.',
	date: '2025-09-21',
	verified: true,
	studio: true
}, {
	id: 23,
	product: 'wallpapers',
	rating: 5,
	title: 'Made my phone feel premium',
	text: 'The subtle linen texture hides fingerprint smudges and the compositional balance keeps status bar icons unobstructed.',
	name: 'Nora C.',
	date: '2025-09-17',
	verified: true
}, {
	id: 24,
	product: 'accessories',
	rating: 5,
	title: 'Daily pouch winner',
	text: 'Small pockets are thoughtfully placed. The print edges are sealed so there’s no fraying after weeks of use.',
	name: 'Karan M.',
	date: '2025-09-10',
	verified: true
}, {
	id: 25,
	product: 'prints',
	rating: 5,
	title: 'Exceeded expectations',
	text: 'I bought a large A1 for the living room and it arrived rolled in a heavy-duty tube with reinforced caps. No curling, no dents.',
	name: 'Sana R.',
	date: '2025-08-30',
	verified: true,
	studio: true
}, {
	id: 26,
	product: 'wallpapers',
	rating: 4,
	title: 'Solid, minor compression',
	text: 'JPEG artifacts visible only if you zoom in. On-device it looks flawless and performs well.',
	name: 'Eshan L.',
	date: '2025-08-22',
	verified: true
}, {
	id: 27,
	product: 'accessories',
	rating: 5,
	title: 'My go-to phone sleeve',
	text: 'Fits my phone plus a slim wallet. Pull tab is soft but strong — I like the tactile feel.',
	name: 'Priyanka D.',
	date: '2025-08-14',
	verified: true
}, {
	id: 28,
	product: 'prints',
	rating: 4,
	title: 'Lovely, slight color shift',
	text: 'Under warm light the reds pull a touch deeper than online images — still very pleasing but worth noting.',
	name: 'Manav S.',
	date: '2025-07-30',
	verified: true
}, {
	id: 29,
	product: 'wallpapers',
	rating: 5,
	title: 'Crisp even on OLED',
	text: 'No banding and the black levels are excellent. I rotate through the set depending on mood.',
	name: 'Ila N.',
	date: '2025-07-19',
	verified: true
}, {
	id: 30,
	product: 'accessories',
	rating: 5,
	title: 'Zero complaints',
	text: 'Bought the phone strap for hikes — sweat tested it and it didn’t retain odor. Stitching still tight.',
	name: 'Yusuf A.',
	date: '2025-07-08',
	verified: true
}, {
	id: 31,
	product: 'prints',
	rating: 5,
	title: 'Frame-ready finish',
	text: 'Edges are clean and margin sizing makes framing painless. Included care instructions are thoughtful.',
	name: 'Megha T.',
	date: '2025-06-21',
	verified: true,
	studio: true
}, {
	id: 32,
	product: 'wallpapers',
	rating: 3,
	title: 'Good but not versatile',
	text: 'Great for phones but the crop doesn’t adapt well to ultra-wide desktop monitors.',
	name: 'Sahil R.',
	date: '2025-06-11',
	verified: true
}, {
	id: 33,
	product: 'accessories',
	rating: 4,
	title: 'Functional and chic',
	text: 'The hardware has a matte finish that matches the print. Minor wobble on the clasp but nothing major.',
	name: 'Jaya V.',
	date: '2025-05-29',
	verified: true
}, {
	id: 34,
	product: 'prints',
	rating: 5,
	title: 'Gift that stunned',
	text: 'Ordered as a present and the recipient cried happy tears. The tonal range is breathtaking.',
	name: 'Aria P.',
	date: '2025-05-17',
	verified: true,
	studio: true
}, {
	id: 35,
	product: 'wallpapers',
	rating: 5,
	title: 'A delight to use',
	text: 'Careful spacing around the notch and quick access areas — the designer clearly thought through UI overlays.',
	name: 'Kevin H.',
	date: '2025-05-05',
	verified: true
}, {
	id: 36,
	product: 'accessories',
	rating: 5,
	title: 'Built like a tank',
	text: 'Used daily for three months; hardware shows only micro-scratches. Fabric hasn’t faded.',
	name: 'Naina K.',
	date: '2025-04-23',
	verified: true
}, {
	id: 37,
	product: 'prints',
	rating: 4,
	title: 'Solid print, slight surface sheen',
	text: 'Matte finish has a faint sheen under studio lights. Still looks great on the wall.',
	name: 'Vivek J.',
	date: '2025-04-05',
	verified: true
}, {
	id: 38,
	product: 'wallpapers',
	rating: 5,
	title: 'Made my home screen pop',
	text: 'Coordinates with my app icons and the seasonal pack is very cohesive.',
	name: 'Lina S.',
	date: '2025-03-30',
	verified: true
}, {
	id: 39,
	product: 'accessories',
	rating: 5,
	title: 'Practical luxury',
	text: 'Thoughtful interior layout — pen slot, card holder, and a hidden pocket. Zipper feels premium.',
	name: 'Ramesh K.',
	date: '2025-03-12',
	verified: true
}, {
	id: 40,
	product: 'prints',
	rating: 5,
	title: 'Collector quality',
	text: 'Edition number stamped, paper weight 300gsm, deckle edge. This feels archival.',
	name: 'Tanvi G.',
	date: '2025-02-27',
	verified: true,
	studio: true
}, {
	id: 41,
	product: 'wallpapers',
	rating: 4,
	title: 'Solid wallpapers, need more aspect ratios',
	text: 'Great look on my phone, but there’s a small crop issue on older Android models.',
	name: 'Arvind N.',
	date: '2025-02-10',
	verified: true
}, {
	id: 42,
	product: 'accessories',
	rating: 5,
	title: 'Excellent customer service',
	text: 'I asked for a rush shipment and support arranged it within 24 hours. Product arrived ahead of schedule.',
	name: 'Sophie L.',
	date: '2025-01-31',
	verified: true
}, {
	id: 43,
	product: 'prints',
	rating: 5,
	title: 'Texture you can feel',
	text: 'Up close, the printed grain gives depth to the highlights. Mounted beautifully.',
	name: 'Devika S.',
	date: '2025-01-19',
	verified: true
}, {
	id: 44,
	product: 'wallpapers',
	rating: 5,
	title: 'Balanced and calming',
	text: 'The muted greens are perfect for long work sessions — no eye fatigue after hours.',
	name: 'Aarav P.',
	date: '2025-01-05',
	verified: true
}, {
	id: 45,
	product: 'accessories',
	rating: 3,
	title: 'Decent, packaging could be better',
	text: 'Product fine but strap arrived slightly misfolded. Reached out and they offered a partial refund.',
	name: 'Zara M.',
	date: '2024-12-18',
	verified: true
}, {
	id: 46,
	product: 'prints',
	rating: 4,
	title: 'Lovely but pricey',
	text: 'Impeccable print, yet international shipping pushed this into a higher price bracket. Still recommend.',
	name: 'Himanshu R.',
	date: '2024-11-28',
	verified: true
}, {
	id: 47,
	product: 'wallpapers',
	rating: 5,
	title: 'Favorites folder full',
	text: 'Downloaded the entire pack. The contrast is tuned so notifications remain readable at a glance.',
	name: 'Mira C.',
	date: '2024-11-09',
	verified: true
}, {
	id: 48,
	product: 'accessories',
	rating: 5,
	title: 'Travel-ready',
	text: 'Compact, light, and the stitching survived a week-long trip without loosening.',
	name: 'Kishore D.',
	date: '2024-10-02',
	verified: true
}, {
	id: 49,
	product: 'prints',
	rating: 5,
	title: 'Perfect anniversary gift',
	text: 'Ordered two prints in matte and satin — both arrived flawless and in matching frames.',
	name: 'Ayesha Q.',
	date: '2024-09-14',
	verified: true
}, {
	id: 50,
	product: 'wallpapers',
	rating: 2,
	title: 'Too busy for me',
	text: 'Strong pattern that overwhelms small widgets. Works as a lock screen but not home screen for me.',
	name: 'Ritu S.',
	date: '2024-08-01',
	verified: true
}, {
	id: 51,
	product: 'accessories',
	rating: 4,
	title: 'Functional, looks great',
	text: 'I used it daily; small areas show wear but nothing structural. Would buy another design.',
	name: 'Omar F.',
	date: '2024-07-06',
	verified: true
}, {
	id: 52,
	product: 'prints',
	rating: 5,
	title: 'Incredible depth',
	text: 'The midtones and shadows are rendered beautifully — looks like oil on canvas from a distance.',
	name: 'Sonal B.',
	date: '2024-06-18',
	verified: true
}, {
	id: 53,
	product: 'wallpapers',
	rating: 4,
	title: 'Great for portrait mode',
	text: 'Portrait-oriented screens get the best composition. Landscape crops lose focal points.',
	name: 'Kiran T.',
	date: '2024-05-09',
	verified: true
}, {
	id: 54,
	product: 'accessories',
	rating: 5,
	title: 'Very durable',
	text: 'Dropped it a few times and the print shows tiny scuffs but the structure holds. Excellent finish.',
	name: 'Priyam N.',
	date: '2024-04-21',
	verified: true
}, {
	id: 55,
	product: 'prints',
	rating: 5,
	title: 'Studio-grade print',
	text: 'I display prints in a shared office and several coworkers asked where it came from. Packaging included hanging hardware.',
	name: 'Neha R.',
	date: '2024-03-07',
	verified: true
}, {
	id: 56,
	product: 'wallpapers',
	rating: 5,
	title: 'Perfectly cropped',
	text: 'No vital UI elements overlapped. The artist clearly tested common handset sizes.',
	name: 'Gautam S.',
	date: '2024-02-19',
	verified: true
}, {
	id: 57,
	product: 'accessories',
	rating: 4,
	title: 'Lovely tactile print',
	text: 'Printed texture is pleasant to touch. Would prefer a thicker strap option as an add-on.',
	name: 'Hina P.',
	date: '2024-01-10',
	verified: true
}, {
	id: 58,
	product: 'prints',
	rating: 5,
	title: 'A keeper',
	text: 'This print has settled into my daily rotation of inspiration. Quality and attention to detail shine through.',
	name: 'Rajat M.',
	date: '2023-12-02',
	verified: true
}, {
	id: 59,
	product: 'wallpapers',
	rating: 1,
	title: 'Did not meet expectations',
	text: 'Colors looked washed out on my AMOLED screen. Contacted support but did not receive a response.',
	name: 'Anjali K.',
	date: '2023-10-15',
	verified: true
}, {
	id: 60,
	product: 'accessories',
	rating: 5,
	title: 'Exceeded durability claims',
	text: 'Used it for outdoor activities; held up against sweat and rough handling. Print still vibrant.',
	name: 'Siddharth L.',
	date: '2023-09-03',
	verified: true
}];
// ===== Utilities =====
function starSVG(filled) {
	return `
																							<svg class="auricartisan__star" viewBox="0 0 24 24" aria-hidden="true">
																								<path d="M12 3l3.1 6.3 7 .9-5 4.9 1.2 7L12 18l-6.3 4.1 1.2-7-5-4.9 7-.9L12 3z"
              ${filled?'fill="currentColor"':'fill="none" stroke="currentColor"'} stroke-width="1.5"></path>
																							</svg>`;
}

function renderStars(n) {
	let html = '';
	for (let i = 1; i <= 5; i++) {
		html += starSVG(i <= n);
	}
	return html;
}

function formatDate(iso) {
	const d = new Date(iso + 'T00:00:00');
	return d.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	});
}

function cryptoRand() {
	const buf = new Uint32Array(1);
	window.crypto.getRandomValues(buf);
	return buf[0] / 0xFFFFFFFF;
}
// ===== Aggregate rating =====
function updateAggregate(list) {
	const count = list.length;
	const sum = list.reduce((a, b) => a + b.rating, 0);
	const val = count ? (sum / count) : 0;
	document.getElementById('agg-score').textContent = val.toFixed(1);
	document.getElementById('agg-count').textContent = `${count} review${count===1?'':'s'}`;
	document.getElementById('agg-stars').innerHTML = renderStars(Math.round(val));
	const avgBadge = document.getElementById('avg-badge');
	if (avgBadge) {
		avgBadge.textContent = `${val.toFixed(1)} average`;
	}
	try {
		const el = document.getElementById('schema-aggregate');
		const obj = JSON.parse(el.textContent);
		obj.aggregateRating.ratingValue = val.toFixed(1);
		obj.aggregateRating.reviewCount = String(count);
		el.textContent = JSON.stringify(obj);
	} catch (_) {}
}
// ===== Rating distribution (5→1) =====
function updateDistribution(list) {
	const total = list.length || 1;
	const counts = [0, 0, 0, 0, 0, 0];
	for (const r of list) {
		counts[r.rating] = (counts[r.rating] || 0) + 1;
	}
	for (let s = 5; s >= 1; s--) {
		const c = counts[s] || 0;
		const pct = Math.round((c / total) * 100);
		const fill = document.getElementById(`dist-fill-${s}`);
		const cnt = document.getElementById(`dist-count-${s}`);
		if (fill) fill.style.width = `${pct}%`;
		if (cnt) cnt.textContent = String(c);
	}
}
// ===== Random-rank map =====
const randomRank = new Map();

function reseedRanks() {
	randomRank.clear();
	for (const r of REVIEWS) {
		randomRank.set(r.id, cryptoRand());
	}
}

function rankOf(id) {
	return randomRank.get(id) ?? 0;
}
// ===== Render reviews with filters, sorts, pagination + studio badges =====
(function() {
	const grid = document.getElementById('reviews');
	const chips = Array.from(document.querySelectorAll('.auricartisan__chip[data-filter]'));
	const minStars = document.getElementById('min-stars');
	const sortRecent = document.getElementById('sort-recent');
	const sortHigh = document.getElementById('sort-high');
	const loadMore = document.getElementById('load-more');
	let currentCategory = 'all';
	let currentMin = 0;
	let mode = 'recent';
	let page = 1;
	const perPage = 6;
	reseedRanks();

	function getFiltered() {
		let arr = REVIEWS.slice();
		if (currentCategory !== 'all') arr = arr.filter(r => r.product === currentCategory);
		if (currentMin > 0) arr = arr.filter(r => r.rating >= currentMin);
		if (mode === 'recent') {
			arr.sort((a, b) => b.date.localeCompare(a.date) || (rankOf(a.id) - rankOf(b.id)));
		} else {
			arr.sort((a, b) => (b.rating - a.rating) || b.date.localeCompare(a.date) || (rankOf(a.id) - rankOf(b.id)));
		}
		return arr;
	}

	function draw() {
		const list = getFiltered();
		updateAggregate(list);
		updateDistribution(list);
		const slice = list.slice(0, page * perPage);
		grid.innerHTML = '';
		slice.forEach(r => {
			const card = document.createElement('article');
			card.className = 'auricartisan__card';
			card.innerHTML = `
            
                                                                                            <div class="auricartisan__card__body" itemprop="review" itemscope itemtype="https://schema.org/Review">
                                                                                                <div class="auricartisan__meta-row">
                                                                                                    <div class="auricartisan__stars" aria-label="${r.rating} out of 5 stars">${renderStars(r.rating)}</div>
                                                                                                    <span class="auricartisan__rev__by">
                  for 
                                                                                                        <strong>${labelFor(r.product)}</strong> •
                  
                                                                                                        <time datetime="${r.date}">${formatDate(r.date)}</time>
                  ${r.verified ? '<span class="auricartisan__badge" title="Verified customer">Verified</span>' : ''}
                  ${r.studio ? '<span class="auricartisan__badge" title="Verified by Auric Artisan Studio">Studio&nbsp;Verified</span>' : ''}
                
                                                                                                    </span>
                                                                                                </div>
                                                                                                <h3 class="auricartisan__card__title" itemprop="name">${escapeHTML(r.title)}</h3>
                                                                                                <p class="auricartisan__rev__text" itemprop="reviewBody">${escapeHTML(r.text)}</p>
                                                                                                <meta itemprop="author" content="${escapeHTML(r.name)}" />
                                                                                                <meta itemprop="reviewRating" content="${r.rating}" />
                                                                                            </div>
          `;
			grid.appendChild(card);
		});
		loadMore.style.display = slice.length < list.length ? '' : 'none';
	}

	function labelFor(key) {
		return key === 'prints' ? 'Art Prints' : key === 'wallpapers' ? 'Mobile Wallpapers' : 'Accessories';
	}

	function escapeHTML(s) {
		return String(s).replace(/[&<>"']/g, m => ({
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		} [m]));
	}
	// events
	chips.forEach(ch => {
		ch.addEventListener('click', () => {
			chips.forEach(x => x.dataset.active = 'false');
			ch.dataset.active = 'true';
			currentCategory = ch.getAttribute('data-filter');
			page = 1;
			draw();
			resetShuffleTimer();
		});
	});
	minStars.addEventListener('change', () => {
		currentMin = Number(minStars.value) || 0;
		page = 1;
		draw();
		resetShuffleTimer();
	});
	sortRecent.addEventListener('click', () => {
		mode = 'recent';
		page = 1;
		draw();
		resetShuffleTimer();
	});
	sortHigh.addEventListener('click', () => {
		mode = 'high';
		page = 1;
		draw();
		resetShuffleTimer();
	});
	loadMore.addEventListener('click', () => {
		page++;
		draw();
	});
	// ===== Periodic shuffle every 30 seconds (only affects tiebreak via random ranks) =====
	const SHUFFLE_MS = 30000;
	let shuffleTimer = null;

	function tickShuffle() {
		if (document.hidden) return;
		reseedRanks();
		draw();
	}

	function startShuffle() {
		stopShuffle();
		shuffleTimer = setInterval(tickShuffle, SHUFFLE_MS);
	}

	function stopShuffle() {
		if (shuffleTimer) {
			clearInterval(shuffleTimer);
			shuffleTimer = null;
		}
	}

	function resetShuffleTimer() {
		startShuffle();
	}
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) stopShuffle();
		else startShuffle();
	});
	['click', 'keydown', 'touchstart', 'wheel'].forEach(evt => {
		document.addEventListener(evt, resetShuffleTimer, {
			passive: true
		});
	});
	// initial
	draw();
	startShuffle();
})();
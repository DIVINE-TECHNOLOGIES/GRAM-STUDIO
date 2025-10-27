(function() {
	"use strict";

	const FILE_URL = "../img/brand/ascii.txt"; // relative to this page

	// Mini logger
	const logNS = "AA:ascii";
	const info = (...a) => console.info("[%s]", logNS, ...a);
	const warn = (...a) => console.warn("[%s]", logNS, ...a);
	const error = (...a) => console.error("[%s]", logNS, ...a);

	// Some consoles truncate very long strings; chunk to be safe
	function logChunked(text, chunkSize = 8000) {
		if (text.length <= chunkSize) {
			console.log(text);
			return;
		}
		for (let i = 0; i < text.length; i += chunkSize) {
			console.log(text.slice(i, i + chunkSize));
		}
	}

	async function fetchAndLogAscii(url) {
		const t0 = performance.now();
		let resp;
		try {
			resp = await fetch(url, {
				method: "GET",
				cache: "no-cache", // always get latest
				headers: {
					"Accept": "text/plain,*/*;q=0.1"
				},
			});
		} catch (e) {
			error("Network error fetching", url, e);
			return;
		}
		if (!resp.ok) {
			error("HTTP", resp.status, resp.statusText, "for", url);
			return;
		}

		const ct = resp.headers.get("content-type") || "";
		if (!/text\/plain|charset|octet-stream/i.test(ct)) {
			warn("Content-Type looks odd for an ASCII file:", ct);
		}
		const size = resp.headers.get("content-length");
		const enc = (ct.match(/charset=([^;]+)/i) || [, "utf-8"])[1].toLowerCase();

		let body = "";
		try {
			// Prefer streaming decode to avoid massive blobs
			if (resp.body && window.TextDecoder && resp.body.getReader) {
				const reader = resp.body.getReader();
				const decoder = new TextDecoder(enc, {
					fatal: false
				});
				let total = 0;
				for (;;) {
					const {
						value,
						done
					} = await reader.read();
					if (done) break;
					total += value.byteLength;
					body += decoder.decode(value, {
						stream: true
					});
				}
				body += new TextDecoder(enc).decode(); // flush
				info("Fetched %s (%s bytes%s) in %d ms", url, total, size ? `, server reported ${size}` : "", Math.round(performance.now() - t0));
			} else {
				// Fallback: simple .text()
				body = await resp.text();
				info("Fetched %s (len=%d) in %d ms", url, body.length, Math.round(performance.now() - t0));
			}
		} catch (e) {
			error("Failed decoding body:", e);
			return;
		}

		// Print a tidy header, then the art
		console.groupCollapsed(`ASCII: ${url}`);
		if (size) info("Content-Length:", size);
		info("Detected charset:", enc || "(unknown)");
		console.groupEnd();

		// Dump the art exactly as-is
		logChunked(body);
	}

	// Kick it off
	fetchAndLogAscii(FILE_URL);
})();
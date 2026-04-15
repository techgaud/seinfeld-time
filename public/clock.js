const PILOT_EPOCH_MS = Date.UTC(1989, 6, 6, 1, 0, 0);

const countEl = document.getElementById('count');
const eraEl = document.getElementById('era');
const utcEl = document.getElementById('utc');
const fmt = new Intl.NumberFormat('en-US');

function pad(n) {
	return String(n).padStart(2, '0');
}

function tick() {
	const now = Date.now();
	const deltaSec = Math.floor((now - PILOT_EPOCH_MS) / 1000);
	const era = deltaSec >= 0 ? 'ASS' : 'BS';
	eraEl.textContent = era;
	countEl.textContent = fmt.format(Math.abs(deltaSec));

	const d = new Date(now);
	utcEl.textContent =
		d.getUTCFullYear() +
		'-' +
		pad(d.getUTCMonth() + 1) +
		'-' +
		pad(d.getUTCDate()) +
		' ' +
		pad(d.getUTCHours()) +
		',' +
		pad(d.getUTCMinutes()) +
		',' +
		pad(d.getUTCSeconds()) +
		' UTC';
}

tick();
setInterval(tick, 1000);

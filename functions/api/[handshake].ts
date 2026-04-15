const PILOT_EPOCH_MS = Date.UTC(1989, 6, 6, 1, 0, 0);
const PILOT_EPOCH_SEC = PILOT_EPOCH_MS / 1000;
const PILOT_ISO = '1989-07-06T01:00:00.000Z';

interface SeinfeldTime {
	gregorian_iso: string;
	epoch_seconds: number;
	era: 'BS' | 'ASS';
	seinfeld_seconds: number;
}

function toSeinfeldTime(epochMs: number): SeinfeldTime {
	const deltaSec = Math.floor((epochMs - PILOT_EPOCH_MS) / 1000);
	return {
		gregorian_iso: new Date(epochMs).toISOString(),
		epoch_seconds: Math.floor(epochMs / 1000),
		era: deltaSec >= 0 ? 'ASS' : 'BS',
		seinfeld_seconds: Math.abs(deltaSec)
	};
}

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body, null, 2) + '\n', {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'access-control-allow-origin': '*',
			'cache-control': 'no-store'
		}
	});
}

export const onRequestGet: PagesFunction = async (ctx) => {
	const handshake = String(ctx.params.handshake).toLowerCase();
	const url = new URL(ctx.request.url);

	if (handshake === 'hello,newman') {
		const t = toSeinfeldTime(Date.now());
		return json({
			handshake: 'hello,newman',
			pilot_iso: PILOT_ISO,
			pilot_epoch_seconds: PILOT_EPOCH_SEC,
			...t
		});
	}

	if (handshake === 'hello,jerry') {
		const iso = url.searchParams.get('iso');
		const epoch = url.searchParams.get('epoch');

		let ms: number | null = null;
		if (iso !== null) {
			const parsed = Date.parse(iso);
			if (Number.isNaN(parsed)) {
				return json({ error: 'invalid iso', input: iso }, 400);
			}
			ms = parsed;
		} else if (epoch !== null) {
			const n = Number(epoch);
			if (!Number.isFinite(n)) {
				return json({ error: 'invalid epoch', input: epoch }, 400);
			}
			ms = n * 1000;
		} else {
			return json(
				{ error: 'missing query parameter', expected: ['iso', 'epoch'] },
				400
			);
		}

		return json({
			handshake: 'hello,jerry',
			pilot_iso: PILOT_ISO,
			pilot_epoch_seconds: PILOT_EPOCH_SEC,
			...toSeinfeldTime(ms)
		});
	}

	return json(
		{
			error: 'unknown handshake',
			expected: ['hello,newman', 'hello,jerry']
		},
		404
	);
};

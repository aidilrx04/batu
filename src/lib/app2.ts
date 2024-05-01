function round(value: number, precision: number) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

export const keys = [37.5, 20, 14, 10, 6.3, 4.75, 0] as const;

export type Sizes = Record<(typeof keys)[number], number>;

export const calculateResult = (sieve_weight: Sizes, sieve_weight_retained: Sizes) => {
	let total_retained = 0;

	const retains: Sizes = {
		'37.5': 0,
		'20': 0,
		'14': 0,
		'10': 0,
		'6.3': 0,
		'4.75': 0,
		'0': 0
	};

	const passing: Sizes = {
		'37.5': 0,
		'20': 0,
		'14': 0,
		'10': 0,
		'6.3': 0,
		'4.75': 0,
		'0': 0
	};

	const cum: Sizes = {
		'37.5': 0,
		'20': 0,
		'14': 0,
		'10': 0,
		'6.3': 0,
		'4.75': 0,
		'0': 0
	};

	for (const key in keys) {
		const entry_weight = sieve_weight[keys[key]];
		const entry_sieve = sieve_weight_retained[keys[key]];

		try {
			const res = entry_sieve - entry_weight;
			retains[keys[key]] = round(res, 1);
			total_retained += res;
		} catch (e) {
			console.error(e);
		}
	}

	// calculate passing weight
	let zigzag_passing_weight = total_retained;
	for (const key of keys) {
		const retained_value = retains[key];
		zigzag_passing_weight -= retained_value;
		passing[key] = round(zigzag_passing_weight, 1);
	}

	// calculate cum passing
	for (const key of keys) {
		const passing_weight = passing[key];
		const cum_percentage = round((passing_weight / total_retained) * 100, 1);
		cum[key] = cum_percentage;
	}

	return {
		total_retained,
		cumulative_passing: cum,
		passing,
		retains
	};
};

export const createSizes = (): Sizes => {
	return {
		'0': 0,
		'4.75': 0,
		'6.3': 0,
		'10': 0,
		'14': 0,
		'20': 0,
		'37.5': 0
	};
};

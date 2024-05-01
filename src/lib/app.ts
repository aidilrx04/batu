export type Sieve = {
	_375mm: number;
	_20mm: number;
	_14mm: number;
	_10mm: number;
	_63mm: number;
	_475mm: number;
	pan: number;
};

function round(value: number, precision: number) {
	var multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}
export const keys = ['_375mm', '_20mm', '_14mm', '_10mm', '_63mm', '_475mm', 'pan'] as const;

export const calculateResult = (sieveWeight: Sieve, sieveWeightRetained: Sieve) => {
	let total_retained = 0;

	const retains: Sieve = {
		_375mm: 0,
		_20mm: 0,
		_14mm: 0,
		_10mm: 0,
		_63mm: 0,
		_475mm: 0,
		pan: 0
	};

	const passing: Sieve = {
		_375mm: 0,
		_20mm: 0,
		_14mm: 0,
		_10mm: 0,
		_63mm: 0,
		_475mm: 0,
		pan: 0
	};

	const cum: Sieve = {
		_375mm: 0,
		_20mm: 0,
		_14mm: 0,
		_10mm: 0,
		_63mm: 0,
		_475mm: 0,
		pan: 0
	};

	for (const key in keys) {
		const entry_weight = sieveWeight[keys[key]];
		const entry_sieve = sieveWeightRetained[keys[key]];

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
	for (const key in keys) {
		const retained_value = retains[keys[key]];
		zigzag_passing_weight -= retained_value;
		passing[keys[key]] = round(zigzag_passing_weight, 1);
	}

	// calculate cum passing
	for (const key in keys) {
		const passing_weight = passing[keys[key]];
		const cum_percentage = round((passing_weight / total_retained) * 100, 1);

		cum[keys[key]] = cum_percentage;
	}

	return {
		total_retained,
		cumulative_passing: cum,
		passing,
		retains
	};
};

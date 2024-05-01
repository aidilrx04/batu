<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { Sizes } from '$lib/app2';
	import { createSizes, calculateResult, keys } from '$lib/app2';

	const sieve_weight = createSizes();
	const sieve_weight_retained = createSizes();
	// const sieve_weight: Sizes = {
	// 	37.5: 1446.9,
	// 	20: 1374.4,
	// 	14: 1126.4,
	// 	10: 1029.6,
	// 	6.3: 1105.3,
	// 	4.75: 1115.9,
	// 	0: 747.1
	// };

	// const sieve_weight_retained: Sizes = {
	// 	37.5: 1446.9,
	// 	20: 1399.0,
	// 	14: 1469.1,
	// 	10: 1183.4,
	// 	6.3: 1419.9,
	// 	4.75: 1258,
	// 	0: 1759.8
	// };

	let chart: HTMLCanvasElement;

	const generateGraph = () => {
		const limit_sizes = [
			0, // pan
			5.0,
			10.0,
			14.0,
			20.0,
			37.5
		];

		const upper_limit = [0, 10, 30, 40, 90, 100];

		const lower_limit = [0, 0, 60, 80, 100, 100];

		const result = calculateResult(sieve_weight, sieve_weight_retained);

		const combined_keys = Array.from(
			new Set(
				Array.from(keys)
					.map((i) => Number(i))
					.concat(limit_sizes)
			)
		).sort((a, b) => a - b);
		console.log(combined_keys);

		const res_arr: (number | null)[] = [];
		const upper_limit_arr: (number | null)[] = [];
		const lower_limit_arr: (number | null)[] = [];

		for (const key of combined_keys) {
			if (Object.hasOwn(result.cumulative_passing, key)) {
				res_arr.push(result.cumulative_passing[key as keyof Sizes]);
			} else {
				res_arr.push(null);
			}

			if (limit_sizes.includes(key)) {
				upper_limit_arr.push(upper_limit[limit_sizes.indexOf(key)]);
				lower_limit_arr.push(lower_limit[limit_sizes.indexOf(key)]);
			} else {
				upper_limit_arr.push(null);
				lower_limit_arr.push(null);
			}
		}

		console.log(res_arr);
		console.log(upper_limit_arr);
		console.log(lower_limit_arr);

		const chartjs = new Chart(chart, {
			type: 'line',
			data: {
				labels: combined_keys.map((key) => `${key}mm`),
				datasets: [
					{
						label: 'Result',
						data: res_arr
					},
					{
						label: 'Upper Limit',
						data: upper_limit_arr
					},
					{
						label: 'Lower Limit',
						data: lower_limit_arr
					}
				]
			},
			options: {
				spanGaps: true
			}
		});
	};

	let showResult = false;

	let result: ReturnType<typeof calculateResult>;

	const handleCalculate = () => {
		result = calculateResult(sieve_weight, sieve_weight_retained);
		console.log(result);
		showResult = true;
	};
</script>

<main class="px-4 py-6">
	<h1 class="text-3xl mb-6">Batu</h1>

	<table class="border">
		<thead>
			<tr>
				<th>Sieve Size / No Sieve</th>
				<th>Sieve Weight</th>
				<th>Sieve Weight + Weight Retained (g)</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>37.5mm</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['37.5']} /></td>
				<td>
					<input
						type="number"
						name=""
						id=""
						step="0.01"
						bind:value={sieve_weight_retained['37.5']}
					/>
				</td>
			</tr>
			<tr>
				<td>20mm</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['20']} /></td>
				<td>
					<input type="number" name="" id="" step="0.01" bind:value={sieve_weight_retained['20']} />
				</td>
			</tr>
			<tr>
				<td>14mm</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['14']} /></td>
				<td>
					<input type="number" name="" id="" step="0.01" bind:value={sieve_weight_retained['14']} />
				</td>
			</tr>
			<tr>
				<td>10mm</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['10']} /></td>
				<td>
					<input type="number" name="" id="" step="0.01" bind:value={sieve_weight_retained['10']} />
				</td>
			</tr>
			<tr>
				<td>6.3mm</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['6.3']} /></td>
				<td>
					<input
						type="number"
						name=""
						id=""
						step="0.01"
						bind:value={sieve_weight_retained['6.3']}
					/>
				</td>
			</tr>
			<tr>
				<td>4.75/5mm</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['4.75']} /></td>
				<td>
					<input
						type="number"
						name=""
						id=""
						step="0.01"
						bind:value={sieve_weight_retained['4.75']}
					/>
				</td>
			</tr>
			<tr>
				<td>Pan</td>
				<td><input type="number" id="mm375" step="0.01" bind:value={sieve_weight['0']} /></td>
				<td>
					<input type="number" name="" id="" step="0.01" bind:value={sieve_weight_retained[0]} />
				</td>
			</tr>
			<tr>
				<td colspan="2" />
				<td><button on:click={handleCalculate}>Calculate</button></td>
			</tr>
		</tbody>
	</table>

	{#if showResult}
		<table border="1" style="border-collapse: collapse">
			<thead>
				<tr>
					<th>Weight Retained</th>
					<th>Passing Weight(g)</th>
					<th>Cumulative % <br /> Passing (g)</th>
				</tr>
			</thead>
			<tbody>
				{#each keys as key, i}
					<tr>
						<td>{result.retains[key]}</td>
						<td>{result.passing[key]}</td>
						<td>{result.cumulative_passing[key]}</td>
					</tr>
				{/each}
				<tr>
					<td colspan="3">
						<button on:click={generateGraph}> Generate graph </button>
					</td>
				</tr>
			</tbody>
		</table>
	{/if}

	<div style="width:600px; height: 600px;">
		<canvas id="chart" bind:this={chart} />
	</div>
</main>

<style>
	table {
		@apply mb-2;
	}
	table,
	th,
	td {
		@apply border border-collapse border-slate-700;
	}

	td {
		padding: 8px;
	}

	input {
	}

	button {
		@apply text-slate-50 bg-blue-600 rounded px-4 py-2;
	}
</style>

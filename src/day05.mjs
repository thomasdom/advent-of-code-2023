import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sortBy from "lodash/sortBy.js";

function get(map, key) {
	if (
		key < map[0][1] ||
		key >= map[map.length - 1][1] + map[map.length - 1][2]
	) {
		return key;
	}

	for (const [dst, src, inc] of map) {
		if (src > key) {
			return key;
		}

		if (key >= src && key < src + inc) {
			return key + (dst - src);
		}
	}

	return key;
}

function mapSeedToLocation(
	seed,
	{
		seedToSoilMap,
		soilToFertilizerMap,
		fertilizerToWaterMap,
		waterToLightMap,
		lightToTemperatureMap,
		temperatureToHumidityMap,
		humidityToLocationMap,
	},
) {
	return get(
		humidityToLocationMap,
		get(
			temperatureToHumidityMap,
			get(
				lightToTemperatureMap,
				get(
					waterToLightMap,
					get(
						fertilizerToWaterMap,
						get(soilToFertilizerMap, get(seedToSoilMap, seed)),
					),
				),
			),
		),
	);
}

function parseMap(input) {
	const [, ...rawMaps] = input.split("\n");
	const parsedMaps = rawMaps.map((rawMap) =>
		[...rawMap.matchAll(/\d+/g)].map((n) => parseInt(n, 10)),
	);

	return sortBy(parsedMaps, 1);
}

function parseData(input) {
	const [rawSeeds, ...maps] = input.split("\n\n");

	const [...seeds] = rawSeeds.matchAll(/(\d+)/g);

	return {
		seeds: seeds.map((n) => parseInt(n, 10)),
		seedToSoilMap: parseMap(maps[0]),
		soilToFertilizerMap: parseMap(maps[1]),
		fertilizerToWaterMap: parseMap(maps[2]),
		waterToLightMap: parseMap(maps[3]),
		lightToTemperatureMap: parseMap(maps[4]),
		temperatureToHumidityMap: parseMap(maps[5]),
		humidityToLocationMap: parseMap(maps[6]),
	};
}

async function main() {
	const input = await readFile(resolve("input/day05.txt"), {
		encoding: "utf8",
	});

	const { seeds, ...maps } = parseData(input);
	console.log(maps);
	const locations = seeds.map((seed) => mapSeedToLocation(seed, maps));

	console.log("Main:", Math.min(...locations));
}

main().catch(console.error);

async function bonus() {
	const input = await readFile(resolve("input/day05.txt"), {
		encoding: "utf8",
	});

	const [seedsLine, ...mappingLines] = input.split("\n\n");
	const seeds = seedsLine.split(":")[1].trim().split(" ").map(Number);
	const mapMatrix = mappingLines.map((line) =>
		line
			.split("\n")
			.slice(1)
			.map((s) => s.split(" ").map(Number))
			.map(([dStart, sStart, length]) => ({
				dStart,
				dEnd: dStart + length - 1,
				sStart,
				sEnd: sStart + length - 1,
			})),
	);

	const candidateSeeds = mapMatrix
		.flatMap((mappings, i) =>
			mappings.map((m) =>
				mapMatrix.slice(0, i + 1).reduceRight((curr, mm) => {
					const n = mm.find((n) => curr >= n.dStart && curr <= n.dEnd);
					return n ? n.sStart + (curr - n.dStart) : curr;
				}, m.dStart),
			),
		)
		.filter((seed) =>
			seeds.some((s, i) => i % 2 === 0 && seed >= s && seed < s + seeds[i + 1]),
		);

	console.log(
		"Bonus:",
		Math.min(
			...candidateSeeds.map((val) =>
				mapMatrix.reduce((curr, mappings) => {
					const m = mappings.find((m) => curr >= m.sStart && curr <= m.sEnd);
					return m ? m.dStart + (curr - m.sStart) : curr;
				}, val),
			),
		),
	);
}

bonus().catch(console.error);

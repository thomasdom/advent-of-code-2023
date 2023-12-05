import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

function get(map, key) {
	for (const [dst, src, inc] of map) {
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

	return parsedMaps;
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
	const locations = seeds.map((seed) => mapSeedToLocation(seed, maps));

	console.log("Main:", Math.min(...locations));
}

main().catch(console.error);

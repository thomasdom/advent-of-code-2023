import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sum from "lodash/sum.js";

async function main() {
	const input = await readFile(resolve("input/day02.txt"), {
		encoding: "utf8",
	});

	const games = input.split("\n").map((line) => {
		const [, gameNumber, rawResults] = line.trim().match(/Game (\d+): (.*)/);

		const results = rawResults
			.trim()
			.split(";")
			.map((rawGame) => {
				return rawGame
					.trim()
					.split(",")
					.map((rawResult) => {
						const [, nbDices, color] = rawResult.trim().match(/(\d+) (.*)/);
						return { [color]: Number(nbDices) };
					})
					.reduce((results, result) => {
						return {
							...results,
							...result,
						};
					}, {});
			});

		return {
			gameNumber: parseInt(gameNumber, 10),
			results,
		};
	});

	const possibleGames = games
		.map((game) => {
			console.log(game.results);
			const maxes = game.results.reduce(
				(prev, result) => {
					return {
						red: (result.red || 0) >= (prev.red || 0) ? (result.red || 0) : (prev.red || 0),
						green: (result.green || 0) >= (prev.green || 0) ? (result.green || 0) : (prev.green || 0),
						blue: (result.blue || 0) >= (prev.blue || 0) ? (result.blue || 0) : (prev.blue || 0),
					};
				},
				{ red: 0, green: 0, blue: 0 },
			);
			console.log(maxes);

			return {
				gameNumber: game.gameNumber,
				isPossible: maxes.red <= 12 && maxes.green <= 13 && maxes.blue <= 14,
			};
		})
		.filter((game) => game.isPossible);

	console.log("Main:", sum(possibleGames.map((game) => game.gameNumber)));
}

main().catch(console.error);

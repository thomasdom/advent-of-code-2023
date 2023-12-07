import countBy from "lodash/countBy.js";
import sortBy from "lodash/sortBy.js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { inspect } from "node:util";

const CARDS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const CARD_POINTS = {
	A: 14,
	K: 13,
	Q: 12,
	J: 11,
	T: 10,
	9: 9,
	8: 8,
	7: 7,
	6: 6,
	5: 5,
	4: 4,
	3: 3,
	2: 2,
};

const HAND_POINTS = {
	5: 7,
	4: 6,
	32: 5,
	3: 4,
	22: 3,
	2: 2,
	1: 1,
};

function parseGames(input) {
	return input
		.split("\n")
		.map((line) => [line.split(" ")[0], parseInt(line.split(" ")[1], 10)])
		.map(([hand, bid]) => [
			hand
				.split("")
				.sort((cardA, cardB) => CARD_POINTS[cardB] - CARD_POINTS[cardA])
				.join(""),
			bid,
		]);
}

function rankGames(games) {
	return sortBy(
		games
			.map(([hand, bid]) => [countBy(hand), bid])
			.map(([hand, bid]) => [
				sortBy(
					Object.entries(hand).filter(
						([, value]) =>
							value ===
							Math.max(...Object.entries(hand).map(([, value]) => value)),
					),
					[([, nbCards]) => -nbCards, ([card]) => -CARD_POINTS[card]],
				),
				bid,
			])
			.map(([hand, bid]) => [
				hand.reduce(
					(prev, curr, i) => ({
						hand: `${prev.hand}${curr[1]}`,
						firstCardPoints:
							i === 0 ? CARD_POINTS[curr[0]] : prev.firstCardPoints,
						secondCardPoints: i === 1 ? CARD_POINTS[curr[0]] : 0,
					}),
					{
						hand: "",
						firstCardPoints: 0,
						secondCardPoints: 0,
					},
				),
				bid,
			]),
		[
			([{ hand }]) => HAND_POINTS[hand],
			([{ firstCardPoints }]) => firstCardPoints,
			([{ secondCardPoints }]) => secondCardPoints,
		],
	).map(([, bid], i) => [i + 1, bid]);
}

async function main() {
	const input = await readFile(resolve("input/day07.txt"), {
		encoding: "utf8",
	});

	const games = parseGames(input);

	const rankedGames = rankGames(games);

	console.log(inspect(rankedGames, undefined, Number.POSITIVE_INFINITY, true));

	console.log(
		"Main:",
		rankedGames.reduce((count, hand) => count + hand[0] * hand[1], 0),
	);
}

main().catch(console.error);

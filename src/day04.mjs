import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import intersection from "lodash/intersection.js";
import sum from "lodash/sum.js";

async function main() {
	const input = await readFile(resolve("input/day04.txt"), {
		encoding: "utf8",
	});

	const scores = input
		.split("\n")
		.map((line) => {
			const [, rawCardNumber, rawWinningNumbers, rawNumbers] = line.match(
				/^Card\s+(\d+): (.*) \| (.*)$/,
			);

			const [...parsedWinningNumbers] = rawWinningNumbers.matchAll(/(\d+)/g);
			const [...parsedNumbers] = rawNumbers.matchAll(/(\d+)/g);

			return {
				cardNumber: parseInt(rawCardNumber, 10),
				winningNumbers: parsedWinningNumbers.map((n) => parseInt(n, 10)),
				numbers: parsedNumbers.map((n) => parseInt(n, 10)),
			};
		})
		.map(({ cardNumber, winningNumbers, numbers }) => ({
			cardNumber,
			nbWinningNumbers: intersection(winningNumbers, numbers).length,
		}))
		.map(({ nbWinningNumbers }) =>
			nbWinningNumbers > 0 ? 2 ** (nbWinningNumbers - 1) : 0,
		);

	console.log("Main:", sum(scores));
}

main().catch(console.error);

async function bonus() {
	const input = await readFile(resolve("input/day04.txt"), {
		encoding: "utf8",
	});

	const scratchCards = input
		.split("\n")
		.map((line) => {
			const [, rawCardNumber, rawWinningNumbers, rawNumbers] = line.match(
				/^Card\s+(\d+): (.*) \| (.*)$/,
			);

			const [...parsedWinningNumbers] = rawWinningNumbers.matchAll(/(\d+)/g);
			const [...parsedNumbers] = rawNumbers.matchAll(/(\d+)/g);

			return {
				cardNumber: parseInt(rawCardNumber, 10),
				winningNumbers: parsedWinningNumbers.map((n) => parseInt(n, 10)),
				numbers: parsedNumbers.map((n) => parseInt(n, 10)),
			};
		})
		.map(({ cardNumber, winningNumbers, numbers }) => ({
			cardNumber,
			nbWinningNumbers: intersection(winningNumbers, numbers).length,
		}));

	const copies = [...scratchCards];
	let i = 0;
	while (i < copies.length) {
		const cardNumber = copies[i].cardNumber;
		const nbWinningNumbers = copies[i].nbWinningNumbers;

		copies.push(
			...scratchCards.slice(cardNumber, cardNumber + nbWinningNumbers),
		);
		++i;
	}

	console.log("Bonus:", copies.length);
}

bonus().catch(console.error);

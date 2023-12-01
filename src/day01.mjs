import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sum from "lodash/sum.js";

async function main() {
	const input = await readFile(resolve("input/day01.txt"), {
		encoding: "utf8",
	});

	const calibrationValue = input.split("\n").map((line) => {
		const parsedNumbers = line
			.split("")
			.filter((char) => /[0-9]/.test(char))
			.join("");

		return parseInt(
			`${parsedNumbers[0]}${parsedNumbers[parsedNumbers.length - 1]}`,
			10,
		);
	});

	console.log("Main:", sum(calibrationValue));
}

main().catch(console.error);

function transformLiteralNumbers(input) {
	if (!input) {
		return '';
	}

	if (input.startsWith('one')) {
		return `1${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('two')) {
		return `2${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('three')) {
		return `3${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('four')) {
		return `4${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('five')) {
		return `5${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('six')) {
		return `6${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('seven')) {
		return `7${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('eight')) {
		return `8${transformLiteralNumbers(input.substring(1))}`
	}
	if (input.startsWith('nine')) {
		return `9${transformLiteralNumbers(input.substring(1))}`
	}
	return `${input[0]}${transformLiteralNumbers(input.substring(1))}`
}

async function bonus() {
	const input = await readFile(resolve("input/day01.txt"), {
		encoding: "utf8",
	});

	const calibrationValue = input.split("\n").map((line) => {
		const numbers = transformLiteralNumbers(line);

		const parsedNumbers = numbers
			.split("")
			.filter((char) => /[0-9]/.test(char))
			.join("");

		const finalNumber = parseInt(
			`${parsedNumbers[0]}${parsedNumbers[parsedNumbers.length - 1]}`,
			10,
		);

		return finalNumber;
	});

	console.log("Bonus:", sum(calibrationValue));
}

bonus().catch(console.error);

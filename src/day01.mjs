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

		return parseInt(`${parsedNumbers[0]}${parsedNumbers[parsedNumbers.length - 1]}`, 10);
	});

	console.log('Main:', sum(calibrationValue));
}

main().catch(console.error);

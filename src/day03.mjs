import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sum from "lodash/sum.js";

const adjacent = (number, symbol) => {
	const x0 = number.x - 1;
	const x1 = number.x + number.token.length;
	const y0 = number.y - 1;
	const y1 = number.y + 1;
	return symbol.x >= x0 && symbol.x <= x1 && symbol.y >= y0 && symbol.y <= y1;
};

const parseNumbersAndSymbols = (input) => {
	const entities = [];
	for (const [y, line] of input.split("\n").entries()) {
		for (const m of line.matchAll(/\d+/g))
			entities.push({
				type: "number",
				x: m.index,
				y,
				token: m[0],
				value: parseInt(m[0]),
			});

		for (const m of line.matchAll(/[^0-9\.]/g))
			entities.push({ type: "symbol", x: m.index, y, token: m[0] });
	}
	return entities;
};

async function main() {
	const input = await readFile(resolve("input/day03.txt"), {
		encoding: "utf8",
	});

	const entities = parseNumbersAndSymbols(input);
	const numbers = entities.filter((e) => e.type === "number");
	const symbols = entities.filter((e) => e.type === "symbol");

	const partNumbers = numbers
		.filter((n) => symbols.some((s) => adjacent(n, s)))
		.map((n) => n.value);

	console.log("Main:", sum(partNumbers));
}

main().catch(console.error);

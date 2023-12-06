import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

async function main() {
	const input = await readFile(resolve("input/day06.txt"), {
		encoding: "utf8",
	});

	const [[...times], [...distances]] = input
		.split("\n")
		.map((line) => line.match(/\d+/g).map(Number));

	const nbRecordWinMethods = times.map((time, i) => {
		return Array(time)
			.fill()
			.map((_, speed) => [speed, (time - speed) * speed])
			.filter(([_, distance]) => distance > distances[i]).length;
	});

	console.log(
		"Main:",
		nbRecordWinMethods.reduce((a, b) => a * b),
	);
}

main().catch(console.error);

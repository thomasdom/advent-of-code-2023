import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const CARD_POINTS = {
	A: 12,
	K: 11,
	Q: 10,
	J: 9,
	T: 8,
	9: 7,
	8: 6,
	7: 5,
	6: 4,
	5: 3,
	4: 2,
	3: 1,
	2: 0,
};

const HAND_POINTS = {
	fiveOfAKind: 7,
	fourOfAKind: 6,
	fullHouse: 5,
	threeOfAKind: 4,
	twoPair: 3,
	onePair: 2,
	highCard: 1,
};

function parseGames(input) {
	return input.split("\n").map((line) => {
		const [rawCards, rawBid] = line.split(" ");
		const cards = rawCards.split("");
		const bid = parseInt(rawBid);

		return { cards, bid };
	});
}

async function main() {
	const input = await readFile(resolve("input/day07.txt"), {
		encoding: "utf8",
	});

	const rawHands = parseGames(input);
	const hands = rawHands.map((hand) => {
		const cardPoints = new Array(13).fill(0);
		for (const card of hand.cards) {
			cardPoints[CARD_POINTS[card]] += 1;
		}
		const orderedStrengths = cardPoints.sort((a, b) => b - a);
		let type = HAND_POINTS.highCard;
		if (orderedStrengths[0] === 5) {
			type = HAND_POINTS.fiveOfAKind;
		} else if (orderedStrengths[0] === 4) {
			type = HAND_POINTS.fourOfAKind;
		} else if (orderedStrengths[0] === 3 && orderedStrengths[1] === 2) {
			type = HAND_POINTS.fullHouse;
		} else if (orderedStrengths[0] === 3) {
			type = HAND_POINTS.threeOfAKind;
		} else if (orderedStrengths[0] === 2 && orderedStrengths[1] === 2) {
			type = HAND_POINTS.twoPair;
		} else if (orderedStrengths[0] === 2) {
			type = HAND_POINTS.onePair;
		}
		return { ...hand, cardPoints, type };
	});

	const orderedHands = hands.sort((a, b) => {
		if (a.type !== b.type) {
			return b.type - a.type;
		}
		for (let i = 0; i < a.cards.length; i++) {
			if (a.cards[i] !== b.cards[i]) {
				return CARD_POINTS[b.cards[i]] - CARD_POINTS[a.cards[i]];
			}
		}
		return 0;
	});

	const solution = orderedHands.reduce((acc, hand, index) => {
		return acc + hand.bid * (orderedHands.length - index);
	}, 0);

	console.log("Main:", solution);
}

main().catch(console.error);

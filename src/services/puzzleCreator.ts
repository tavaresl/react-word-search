import { promises as fs } from "fs";
import path from 'path';
import { randomInt } from 'crypto';
import Puzzle, { Answer, Tile } from "@/models/Puzzle";

enum Direction {
  Horizontal,
  Vertical,
  Descending,
  Ascending,
}

enum Sense {
  Forward,
  Backward,
}

const getWords = (() => {
  let words: string[] = [];

  return async () => {
    if (words.length === 0) {
      const filePath = path.join(process.cwd(), "./src/data");
      const fileContent = await fs.readFile(`${filePath}/words.txt`, "utf-8");

      words = fileContent
        .split("\n")
        .filter((w) => w.length >= 5 && w.length <= 8)
        .map((w) => w.replaceAll('"', ''));
    }

    return words.shuffle();
  };
})();

export async function createPuzzle(): Promise<Puzzle> {
  const words = await getWords();
  const spots = getRandomSpots(randomInt(4, 7));
  const answers = fillSpots(spots, words);

  const looseLetters: Tile[] = [];
  const usedTiles = answers.flatMap(a => a.tiles);
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  for (let x = 0; x < 6; x++) {
    for (let y = 0; y < 6; y++) {
      if (!usedTiles.some(t => t.x === x && t.y === y)) {
        looseLetters.push({ letter: letters[randomInt(letters.length)], x, y});
      }
    }
  }
  
  return { theme: '', answers, looseLetters, width: 6, height: 6 };
}

function fillSpots(spotsAvailable: Array<Tile[]>, words: string[], filledSpots: Answer[] = [], wordsToAvoid: string[] = []): Answer[] {
  const [spot, ...otherSpots] = spotsAvailable;
  const otherTiles = filledSpots.flatMap(a => a.tiles);
  const interceptions = spot
    .filter(tile => otherTiles.some(t => t.x === tile.x && t.y === tile.y))
    .map(tile => otherTiles.find(t => t.x === tile.x && t.y === tile.y) as Tile);

  let attempt = 1;

  while (attempt <= 10) {
    const word = words
      .filter(w => !wordsToAvoid.includes(w) && w.length === spot.length)
      .find(w => interceptions.every(i => w[spot.findIndex(t => t.x == i.x && t.y === i.y)] === i.letter));
  
    if (!word) {
      break;
    }

    wordsToAvoid.push(word);
    const answer = { word, tiles: spot.map((t, i) => ({ ...t, letter: word[i] })) };

    if (otherSpots.length === 0) {
      return [answer];
    } 

    const nextAnswers = fillSpots(otherSpots, words, [...filledSpots, answer], wordsToAvoid);
    
    if (nextAnswers.length > 0) {
      return [answer, ...nextAnswers];
    }

    attempt++;
  }

  return [];
}

function getRandomSpots(amount: number) {
  const spots: Array<Tile[]> = [];

  const directionLimits = {
    [Direction.Horizontal]: 2,
    [Direction.Vertical]: 2,
    [Direction.Ascending]: 1,
    [Direction.Descending]: 1,
  };
  const senseLimits = {
    [Sense.Backward]: 2,
    [Sense.Forward]: 4,
  };

  while (spots.length < amount) {
    const size = randomInt(3, 7);
    const directions = [Direction.Descending, Direction.Ascending, Direction.Vertical, Direction.Horizontal].filter(d => directionLimits[d] > 0);
    const senses = [Sense.Forward, Sense.Backward].filter(s => senseLimits[s] > 0);
    const direction = directions[randomInt(directions.length)];
    const sense = senses[randomInt(senses.length)];

    const xMultiplier = getXMultiplier(sense, direction);
    const yMultiplier = getYMultiplier(sense, direction);

    const firstTileX = getFirstTileX(size, sense, direction);
    const firstTileY = getFirstTileY(size, sense, direction);

    const tiles = new Array<Tile>(size)
      .fill({ letter: "", x: -1, y: -1 })
      .map((_, i) => ({
          letter: '',
          x: firstTileX + i * xMultiplier,
          y: firstTileY + i * yMultiplier,
        })
      );

    if (!spots.some(spot => spotsOverlap(spot, tiles))) {
      directionLimits[direction] -= 1;
      senseLimits[sense] -= 1;
      spots.push(tiles);
    }
  }

  return spots;
}

function spotsOverlap(spot1: Tile[], spot2: Tile[]): boolean {
  const numOfOverlaps = spot2.reduce((sum, t2) => spot1.some(t1 => t1.x === t2.x && t1.y === t2.y) ? sum + 1 : sum, 0);

  return numOfOverlaps > 1;
}

function getXMultiplier(sense: Sense, direction: Direction): -1 | 0 | 1 {
  switch (direction) {
    case Direction.Horizontal:
      return sense === Sense.Forward ? 1 : -1;
    case Direction.Vertical:
      return 0;
    case Direction.Ascending:
      return sense === Sense.Forward ? 1 : -1;
    case Direction.Descending:
      return sense === Sense.Forward ? 1 : -1;
  }
}

function getYMultiplier(sense: Sense, direction: Direction): -1 | 0 | 1 {
  switch (direction) {
    case Direction.Horizontal:
      return 0;
    case Direction.Vertical:
      return sense === Sense.Forward ? 1 : -1;
    case Direction.Ascending:
      return sense === Sense.Forward ? -1 : 1;
    case Direction.Descending:
      return sense === Sense.Forward ? 1 : -1;
  }
}

function getFirstTileX(size: number, sense: Sense, direction: Direction): number {
  if (direction === Direction.Vertical) {
    return randomInt(6);
  }

  if (sense === Sense.Forward) {
    return size < 6 ? randomInt(6 - size) : 0; 
  } else {
    return size < 6 ? randomInt(size - 1, 6) : 5;
  }
}

function getFirstTileY(size: number, sense: Sense, direction: Direction): number {
  const backward = () => size < 6 ? randomInt(size - 1, 6) : 5;
  const forward = () => size < 6 ? randomInt(6 - size) : 0;
  
  if (direction === Direction.Horizontal) {
    return randomInt(6);
  }

  if (direction === Direction.Ascending) {
    switch (sense) {
      case Sense.Forward:
        return backward();
      
      case Sense.Backward:
        return forward();
    }
  }

  if (sense === Sense.Forward) {
    return forward();
  } else {
    return backward();
  }
}

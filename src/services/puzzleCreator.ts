import { promises as fs } from "fs";
import path from 'path';
import { randomInt } from 'crypto';
import Puzzle, { Answer, Tile } from "@/models/Puzzle";

enum Direction {
  Horizontal,
  Vertical,
  Diagonal,
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
  const spots = getRandomSpots(5);
  const answers = fillSpots(spots, words);

  const looseLetters: Tile[] = [];
  const usedTiles = answers.flatMap(a => a.tiles);
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 6; y++) {
      if (!usedTiles.some(t => t.x === x && t.y === y)) {
        looseLetters.push({ letter: letters[randomInt(letters.length)], x, y});
      }
    }
  }
  
  return { theme: '', answers, looseLetters, width: 5, height: 6 };
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

  while (spots.length < amount) {
    const size = randomInt(3, 6);
    const directions = [ Direction.Diagonal, Direction.Vertical, Direction.Horizontal];
    const direction = directions[randomInt(size < 6 ? 2 : 1)];

    const firstTileX = direction === Direction.Vertical ? randomInt(5)
      : size < 5 ? randomInt(5 - size)
        : 0;

    const firstTileY = direction === Direction.Horizontal ? randomInt(6)
      : size < 6 ? randomInt(6 - size)
        : 0;
    const tiles = new Array<Tile>(size)
      .fill({ letter: "", x: -1, y: -1 })
      .map((_, i) => i === 0
        ? {
          letter: '',
          x: firstTileX,
          y: firstTileY,
        }
        : {
          letter: '',
          x: direction === Direction.Vertical ? firstTileX : firstTileX + i,
          y: direction === Direction.Horizontal ? firstTileY : firstTileY + i,
        }
      );

    if (!spots.some(spot => spotsOverlap(spot, tiles))) {
      spots.push(tiles);
    }
  }

  return spots;
}

function spotsOverlap(spot1: Tile[], spot2: Tile[]): boolean {
  const numOfOverlaps = spot2.reduce((sum, t2) => spot1.some(t1 => t1.x === t2.x && t1.y === t2.y) ? sum + 1 : sum, 0);

  return numOfOverlaps > 1;
}

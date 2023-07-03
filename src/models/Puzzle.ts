export default interface Puzzle {
  theme: string;
  width: number;
  height: number;
  answers: PuzzleAnswer[];
  looseLetters: PuzzleTile[];
}

export interface PuzzleAnswer {
  word: string;
  tiles: PuzzleTile[];
}

export interface PuzzleTile {
  x: number;
  y: number;
  letter: string;
}

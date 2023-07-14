import {HexadecimalColor} from "@/components/BoardTileSelector";

export default interface Puzzle {
  theme: string;
  width: number;
  height: number;
  answers: Answer[];
  looseLetters: Tile[];
}

export interface Answer {
  word: string;
  tiles: Tile[];
}

export interface Tile {
  x: number;
  y: number;
  letter: string;
}

export interface AnswerFound {
  answer: Answer,
  color: HexadecimalColor,
}
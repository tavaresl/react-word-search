import style from './Answer.module.scss';
import {PuzzleAnswer} from "@/models/Puzzle";
import {HexadecimalColor} from "@/components/BoardTileSelector";

export default function Answer({ answer, color, ...props }: { answer: PuzzleAnswer, color: HexadecimalColor }) {
  return (
    <p
      className={style.Answer}
      style={{ backgroundColor: color }}>{answer.word}</p>
  );
}
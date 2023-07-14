import style from './Answer.module.scss';
import {Answer} from "@/models/Puzzle";
import {HexadecimalColor} from "@/components/BoardTileSelector";

export default function AnswerItem({ answer, color, ...props }: { answer: Answer, color: HexadecimalColor }) {
  return (
    <p
      className={style.Answer}
      style={{ backgroundColor: color }}>{answer.word}</p>
  );
}
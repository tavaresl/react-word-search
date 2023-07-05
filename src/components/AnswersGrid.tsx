import {DetailedHTMLProps, HTMLAttributes} from "react";
import style from './AnswerGrid.module.scss';

type BoardAnswersGridProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children: React.ReactNode[],
};

export default function AnswersGrid({...props}: BoardAnswersGridProps) {
  return (
    <aside className={`${style.AnswerGrid} ${props.className || ''}`}>
      {props.children && props.children.map((child, i) => (
        <li key={i} className={style.AnswerGrid__Answer}>
          { child }
        </li>
      ))}
    </aside>
  );
}
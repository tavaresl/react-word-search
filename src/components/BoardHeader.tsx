import Puzzle, {AnswerFound} from "@/models/Puzzle";
import styles from './BoardHeader.module.scss'
import {DetailedHTMLProps, HTMLAttributes} from "react";
import {ProgressBar} from "@/components/ProgressBar";

type BoardHeaderProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  puzzle: Puzzle, answersFound: AnswerFound[],
};

export default function BoardHeader({ puzzle, answersFound, ...props }: BoardHeaderProps) {
  const classNames = [styles.BoardHeader, props.className].filter(c => Boolean(c)).join(' ');

  return (
    <header className={classNames}>
      {puzzle.theme &&
        <h2>{puzzle.theme}</h2>
      }

      <aside className={styles.BoardHeader__Counter}>
        <p className={styles.Counter}>{answersFound.length}/{puzzle.answers.length}</p>
        <ProgressBar value={answersFound.length} maxValue={puzzle.answers.length} />
      </aside>
    </header>
  )
}
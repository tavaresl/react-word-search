import Puzzle, {Answer, AnswerFound} from "@/models/Puzzle";
import styles from './BoardHeader.module.scss'
import {DetailedHTMLProps, HTMLAttributes} from "react";

type BoardHeaderProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  puzzle: Puzzle, answersFound: AnswerFound[],
};

type ProgressBarProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  value: number, maxValue: number,
};

function ProgressBar({ value, maxValue, ...props }: ProgressBarProps) {
  const width = `${(100 * value) / maxValue}%`;
  const classNames = [styles.ProgressBar, props.className].filter(c => Boolean(c)).join(' ');

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuenow={value}
      className={classNames}>

      <div
        role="presentation"
        className={styles.ProgressBar__Bar}
        style={{width}} />
    </div>
  );
}

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
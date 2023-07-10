import Puzzle, {PuzzleAnswer} from "@/models/Puzzle";
import styles from './BoardHeader.module.scss'
import {DetailedHTMLProps, HTMLAttributes} from "react";

type BoardHeaderProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  puzzle: Puzzle, answersFound: PuzzleAnswer[],
}

function ProgressBar({ value, maxValue }: { value: number, maxValue: number }) {
  const width = `${(100 * value) / maxValue}%`;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuenow={value}
      className={styles.ProgressBar}>

      <div
        role="presentation"
        className={styles.ProgressBar__Bar}
        style={{width}} />
    </div>
  );
}

export default function BoardHeader({ puzzle, answersFound, ...props }: BoardHeaderProps) {
  return (
    <>
      <header className={`${styles.Board__Header} ${props.className || ''}`}>
        <h2>{puzzle.theme}</h2>

        <aside>
          <p className={styles.Counter}>{answersFound.length}/{puzzle.answers.length}</p>
          <ProgressBar value={answersFound.length} maxValue={puzzle.answers.length} />
        </aside>
      </header>
    </>
  )
}
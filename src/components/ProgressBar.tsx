import {DetailedHTMLProps, HTMLAttributes} from "react";
import styles from "@/components/ProgressBar.module.scss";

export type ProgressBarProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  value: number, maxValue: number,
};

export function ProgressBar({value, maxValue, ...props}: ProgressBarProps) {
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
        style={{width}}/>
    </div>
  );
}
import styles from './AnswerItem.module.scss';
import {Answer} from "@/models/Puzzle";
import {HexadecimalColor} from "@/components/BoardTileSelector";
import { DetailedHTMLProps, HTMLAttributes, AnimationEvent, useState } from 'react';

type AnswerItemProps = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {
  found: boolean;
  answer: Answer;
  color?: HexadecimalColor | string;
};

enum AnimationState {
  Ready,
  Running,
  Finished,
}

export default function AnswerItem({ answer, found, color = 'var(--default-bg-color)', ...props }: AnswerItemProps) {
  const [animationState, setAnimationState] = useState(AnimationState.Ready);
  const [classNames, setClassNames] = useState([styles.AnswerItem]);

  if (found && animationState === AnimationState.Ready) {
    setAnimationState(AnimationState.Running);
    setClassNames([styles.AnswerItem, styles['AnswerItem--Found']]);
  } else if (!found && animationState === AnimationState.Finished) {
    setAnimationState(AnimationState.Ready);
    setClassNames([styles.AnswerItem]);
  }

  const handleAnimationEnd = (a: AnimationEvent) => {
    setAnimationState(AnimationState.Finished);
  };

  return (
    <p
      onAnimationEnd={handleAnimationEnd}
      className={classNames.join(' ')}
      style={{ backgroundColor: color }}>{answer.word}</p>
  );
}

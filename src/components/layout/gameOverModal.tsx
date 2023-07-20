import {
  DetailedHTMLProps,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  SyntheticEvent,
  TransitionEvent,
  useRef,
  useState
} from "react";
import styles from './modal.module.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import gameStateSlice from "@/store/gameSlice";
import {useDispatch} from "react-redux";
import puzzleSlice, {getRandom} from "@/store/puzzleState";

type GameOverModalProps = DetailedHTMLProps<HTMLAttributes<HTMLDialogElement>, HTMLDialogElement> & {
  visible: boolean;
};

export default function GameOverModal({ visible, ...props }: GameOverModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const dispatch = useDispatch<any>();
  const [classList, setClassList] = useState([styles.Modal]);

  if (visible && !modalRef.current?.open) {
    modalRef.current?.showModal();
    setClassList([...classList, styles.ModalVisible]);
  }

  const handleTransitionEnd = (evt: TransitionEvent<HTMLDialogElement>) => {
    if (!classList.includes(styles.ModalVisible)) {
      modalRef.current?.close();
    }
  };

  const handleEscapeKeyPressed = (evt: KeyboardEvent<HTMLDialogElement>) => {
    if (evt.key !== 'Escape') {
      return;
    }

    evt.preventDefault();

    if (modalRef.current?.open) {
      setClassList(classList.filter(c => c !== styles.ModalVisible));
    }
  };

  const handleNextButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    dispatch(gameStateSlice.actions.reset());
    dispatch(puzzleSlice.actions.clear());
    dispatch(gameStateSlice.actions.reload());
    setClassList(classList.filter(c => c !== styles.ModalVisible));
  };

  return (
    <dialog
      ref={modalRef}
      className={classList.join(' ')}
      onKeyDown={handleEscapeKeyPressed}
      onTransitionEnd={handleTransitionEnd}>
      <h3>Congratulations!</h3>

      <p>You completed the puzzle!</p>

      <button className={styles.NextButton} onClick={handleNextButtonClick}>
        <FontAwesomeIcon icon={faArrowRight} /> Next
      </button>
    </dialog>
  );
}
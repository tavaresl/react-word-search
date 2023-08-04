import {
  DetailedHTMLProps,
  HTMLAttributes,
  SyntheticEvent,
  useRef,
  TransitionEvent,
  KeyboardEvent,
  MouseEvent,
  useState
} from "react";
import {useDispatch, useSelector} from "react-redux";
import styles from './modal.module.scss';
import gameStateSlice from "@/store/gameSlice";
import {AppState} from "@/store/store";
import configSlice from "@/store/configSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faClose, faRotateLeft} from "@fortawesome/free-solid-svg-icons";
import puzzleSlice from "@/store/puzzleState";
import ReactGA from 'react-ga4';

type PauseModalProps = DetailedHTMLProps<HTMLAttributes<HTMLDialogElement>, HTMLDialogElement> & {
  visible: boolean;
};

export default function PauseModal({ visible, ...props }: PauseModalProps) {
  const dispatch = useDispatch();
  const config = useSelector((state: AppState) => state.config);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [classList, setClassList] = useState<(string|undefined)[]>([props.className, styles.Modal]);

  if (visible && !dialogRef.current?.open) {
    setClassList([...classList, styles.ModalVisible]);
    dialogRef.current?.showModal();
  }

  const handleModalClose = (evt: SyntheticEvent<HTMLDialogElement, Event>) => {
    ReactGA.event({ category: 'game', action: 'change-state', label: 'play', nonInteraction: false });
    dispatch(gameStateSlice.actions.resume());
  };

  const handleTransitionEnd = (evt: TransitionEvent<HTMLDialogElement>) => {
    if (!classList.includes(styles.ModalVisible)) {
      dialogRef.current?.close();
    }
  };

  const handleEscapeKeyPressed = (evt: KeyboardEvent<HTMLDialogElement>) => {
    if (evt.key !== 'Escape') {
      return;
    }

    evt.preventDefault();

    if (dialogRef.current?.open) {
      setClassList(classList.filter(c => c !== styles.ModalVisible));
    }
  };

  const handleCloseButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    ReactGA.event({ category: 'pause-modal', action: 'button-click', label: 'close-modal', nonInteraction: false });
    setClassList(classList.filter(c => c !== styles.ModalVisible));
  };

  const handleRestartButton = (evt: MouseEvent<HTMLButtonElement>) => {
    ReactGA.event({ category: 'pause-modal', action: 'button-click', label: 'restart-puzzle', nonInteraction: false });
    dispatch(gameStateSlice.actions.reset());
    setClassList(classList.filter(c => c !== styles.ModalVisible));
  };

  const handleSkipButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    ReactGA.event({ category: 'pause-modal', action: 'button-click', label: 'skip-puzzle', nonInteraction: false });
    dispatch(puzzleSlice.actions.clear());
    dispatch(gameStateSlice.actions.reload());
    setClassList(classList.filter(c => c !== styles.ModalVisible));
  };

  return (
    <dialog
      ref={dialogRef}
      className={classList.join(' ')}
      onClose={handleModalClose}
      onTransitionEnd={handleTransitionEnd}
      onKeyDown={handleEscapeKeyPressed}>

      <h3>Options</h3>

      <form>
        <input
          id="use-dark-mode-checkbox"
          type="checkbox"
          checked={config.useDarkMode}
          onChange={(evt) => dispatch(configSlice.actions.setDarkMode(evt.target.checked))} />

        <label htmlFor="use-dark-mode-checkbox">Use dark mode</label>
      </form>

      <div className={styles.Actions}>
        <button className={styles.ActionButton} onClick={handleRestartButton}>
          <FontAwesomeIcon icon={faRotateLeft} /> Restart
        </button>

        <button className={styles.ActionButton} onClick={handleSkipButtonClick}>
          <FontAwesomeIcon icon={faArrowRight} /> Skip
        </button>
      </div>

      <button className={styles.CloseButton} onClick={handleCloseButtonClick}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </dialog>
  );
}
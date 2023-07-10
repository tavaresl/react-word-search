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
import styles from './pauseModal.module.scss';
import gameStateSlice from "@/store/gameSlice";
import {AppState} from "@/store/store";
import configSlice from "@/store/configSlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faRotateLeft} from "@fortawesome/free-solid-svg-icons";

type PauseModalProps = DetailedHTMLProps<HTMLAttributes<HTMLDialogElement>, HTMLDialogElement> & {
  visible: boolean;
};

export default function PauseModal({ visible, ...props }: PauseModalProps) {
  const dispatch = useDispatch();
  const config = useSelector((state: AppState) => state.config);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [classList, setClassList] = useState<(string|undefined)[]>([props.className, styles.PauseModal]);

  if (visible && !dialogRef.current?.open) {
    setClassList([...classList, styles.PauseModalVisible]);
    dialogRef.current?.showModal();
  }

  const handleModalClose = (evt: SyntheticEvent<HTMLDialogElement, Event>) => {
    dispatch(gameStateSlice.actions.resume());
  };

  const handleTransitionEnd = (evt: TransitionEvent<HTMLDialogElement>) => {
    if (!classList.includes(styles.PauseModalVisible)) {
      dialogRef.current?.close();
    }
  };

  const handleEscapeKeyPressed = (evt: KeyboardEvent<HTMLDialogElement>) => {
    if (evt.key !== 'Escape') {
      return;
    }

    evt.preventDefault();

    if (dialogRef.current?.open) {
      setClassList(classList.filter(c => c !== styles.PauseModalVisible));
    }
  };

  const handleCloseButtonClick = (evt: MouseEvent<HTMLButtonElement>) => {
    setClassList(classList.filter(c => c !== styles.PauseModalVisible));
  };

  const handleRestartButton = (evt: MouseEvent<HTMLButtonElement>) => {
    dispatch(gameStateSlice.actions.reset());
    setClassList(classList.filter(c => c !== styles.PauseModalVisible));
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

      <button className={styles.RestartButton} onClick={handleRestartButton}>
        <FontAwesomeIcon icon={faRotateLeft} /> Restart
      </button>

      <button className={styles.CloseButton} onClick={handleCloseButtonClick}>
        <FontAwesomeIcon icon={faClose} />
      </button>
    </dialog>
  );
}
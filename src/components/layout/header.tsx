import styles from "./header.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "@/store/store";
import {DetailedHTMLProps, HTMLAttributes} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause} from "@fortawesome/free-solid-svg-icons";
import gameStateSlice from "@/store/gameSlice";
import ReactGA from 'react-ga4';

type HeaderProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  contentHref: string,
};

export default function Header({...props}: HeaderProps) {
  const usingDarkMode = useSelector((state: AppState) => state.config.useDarkMode);
  const dispatch = useDispatch();
  const onPauseButtonClicked = () => {
    ReactGA.event({ category: 'game', action: 'change-state', label: 'pause', nonInteraction: false });
    dispatch(gameStateSlice.actions.pause());
  };

  return (
    <header className={[props.className, styles.Header].join(' ')}>
      <h1 className={styles.Header__AppTitle}>Word Search</h1>

      <button className={styles.Header__PauseButton} onClick={onPauseButtonClicked}>
        <FontAwesomeIcon icon={faPause} />
      </button>
    </header>
  );
}